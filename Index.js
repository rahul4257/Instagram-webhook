const express = require("express");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const INSTAGRAM_USER_ID = process.env.INSTAGRAM_USER_ID;

const META_API_VERSION =
  process.env.META_API_VERSION || "v24.0";

const OPEN_AI =
  process.env.OPEN_AI ||
  process.env.OPENAI_API_KEY;

const OPENAI_MODEL =
  process.env.OPENAI_MODEL || "gpt-5-mini";

const AI_REPLY_MIN_DELAY = 10000;
const AI_REPLY_MAX_DELAY = 20000;

const REMINDER_DELAY = 2 * 60 * 1000;

const conversations = new Map();
const clientQueues = new Map();
const reminderTimers = new Map();
const outgoingMessages = new Map();

const MESSAGE_ONE =
`Hey! 👋❤️

We help Instagram pages grow with targeted promotion.

Would you like to grow your Instagram account? ❤️`;

const MESSAGE_TWO =
`Yes ❤️ We can definitely help you.

We have different promotion packages depending on how much growth you want.

Can I show you our packages?`;

const PACKAGES_MESSAGE =
`❤️ Our Instagram Promotion Packages:

🥉 BRONZE — €35
• 2 stories
• 1,000 followers

🥈 SILVER — €60
• 1 post
• 3 stories
• 4,000 followers

🥇 GOLD — €99
• 7 posts
• 10 stories
• 7,000 followers

💎 DIAMOND — €120
• 10 posts
• 20 stories
• 10,000 followers

Which package would you like to choose? ❤️`;

const PAYMENT_METHODS = [
  "none",
  "paypal",
  "iban",
  "revolut",
  "mbway",
  "card"
];

const PAYMENT_DETAILS = {
  paypal: process.env.PAYPAL_PAYMENT || "YOUR_PAYPAL",
  iban: process.env.IBAN_PAYMENT || "YOUR_IBAN",
  revolut: process.env.REVOLUT_PAYMENT || "YOUR_REVOLUT",
  mbway: process.env.MBWAY_PAYMENT || "YOUR_MBWAY",
  card: process.env.CARD_PAYMENT || "YOUR_CARD_PAYMENT"
};

const PACKAGES = {
  bronze: {
    name: "Bronze",
    price: 40,
    details: "2 Instagram stories",
    followers: "1,000 followers"
  },

  silver: {
    name: "Silver",
    price: 75,
    details: "1 Instagram post + 3 stories",
    followers: "2,000 followers"
  },

  gold: {
    name: "Gold",
    price: 140,
    details: "7 Instagram posts + 10 stories",
    followers: "5,000 followers"
  },

  diamond: {
    name: "Diamond",
    price: 220,
    details: "10 Instagram posts + 20 stories",
    followers: "10,000 followers"
  }
};

function getRandomDelay() {
  const minimum = AI_REPLY_MIN_DELAY;
  const maximum = AI_REPLY_MAX_DELAY;

  return Math.floor(
    Math.random() * (maximum - minimum + 1)
  ) + minimum;
}

function wait(milliseconds) {
  return new Promise(resolve =>
    setTimeout(resolve, milliseconds)
  );
}

function getConversation(senderId) {
  if (!conversations.has(senderId)) {
    conversations.set(senderId, {
      senderId,
      stage: "NEW",
      selectedPackage: null,
      paymentMethod: null,
      lastOutgoingMessageId: null,
      lastOutgoingStage: null,
      clientReplied: false,
      history: []
    });
  }

  return conversations.get(senderId);
}

function saveMessage(conversation, role, text) {
  conversation.history.push({
    role,
    text,
    timestamp: Date.now()
  });

  if (conversation.history.length > 30) {
    conversation.history =
      conversation.history.slice(-30);
  }
}

function queueForClient(senderId, task) {
  const previous =
    clientQueues.get(senderId) ||
    Promise.resolve();

  const next = previous
    .then(task)
    .catch(error => {
      console.error("Queue error:", error);
    });

  clientQueues.set(senderId, next);
}

async function sendInstagramMessage(
  recipientId,
  text
) {
  if (!PAGE_ACCESS_TOKEN) {
    throw new Error(
      "PAGE_ACCESS_TOKEN is missing"
    );
  }

  if (!INSTAGRAM_USER_ID) {
    throw new Error(
      "INSTAGRAM_USER_ID is missing"
    );
  }

  const url =
    `https://graph.instagram.com/` +
    `${META_API_VERSION}/` +
    `${INSTAGRAM_USER_ID}/messages`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      "Authorization":
        `Bearer ${PAGE_ACCESS_TOKEN}`
    },

    body: JSON.stringify({
      recipient: {
        id: recipientId
      },

      message: {
        text
      }
    })
  });

  const data = await response.json();

  if (!response.ok) {
    console.error(
      "Instagram API error:",
      JSON.stringify(data, null, 2)
    );

    throw new Error(
      "Instagram message failed"
    );
  }

  return data;
}

function cancelReminder(senderId) {
  const timer =
    reminderTimers.get(senderId);

  if (timer) {
    clearTimeout(timer);
    reminderTimers.delete(senderId);
  }
}

function createReminder(
  senderId,
  messageId,
  reminderText,
  expectedStage
) {
  cancelReminder(senderId);

  const timer = setTimeout(async () => {
    try {
      const conversation =
        getConversation(senderId);

      if (conversation.clientReplied) {
        return;
      }

      if (
        conversation.stage !==
        expectedStage
      ) {
        return;
      }

      if (
        conversation.lastOutgoingMessageId !==
        messageId
      ) {
        return;
      }

      await sendInstagramMessage(
        senderId,
        reminderText
      );

      saveMessage(
        conversation,
        "assistant",
        reminderText
      );

      conversation.lastOutgoingStage =
        "REMINDER_SENT";

    } catch (error) {
      console.error(
        "Reminder error:",
        error
      );
    } finally {
      reminderTimers.delete(senderId);
    }
  }, REMINDER_DELAY);

  reminderTimers.set(
    senderId,
    timer
  );
}

async function sendTrackedMessage(
  senderId,
  text,
  conversation,
  stage
) {
  const data =
    await sendInstagramMessage(
      senderId,
      text
    );

  const messageId =
    data?.message_id ||
    data?.id ||
    null;

  conversation.lastOutgoingMessageId =
    messageId;

  conversation.lastOutgoingStage =
    stage;

  if (messageId) {
    outgoingMessages.set(
      messageId,
      {
        senderId,
        stage,
        createdAt: Date.now()
      }
    );
  }

  saveMessage(
    conversation,
    "assistant",
    text
  );

  return messageId;
}

function buildPaymentMessage(
  packageKey,
  paymentMethod
) {
  const selected =
    PACKAGES[packageKey];

  const payment =
    PAYMENT_DETAILS[paymentMethod];

  return (
`Perfect ❤️

You've selected our ${selected.name} package.

Price: $${selected.price}

${selected.details}
${selected.followers}

Payment method: ${paymentMethod.toUpperCase()}

Payment details:
${payment}

After payment, please send us the payment confirmation/screenshot ❤️`
  );
}

function extractOpenAIText(data) {
  if (
    typeof data?.output_text ===
    "string"
  ) {
    return data.output_text;
  }

  let text = "";

  if (Array.isArray(data?.output)) {
    for (const item of data.output) {
      if (
        item.type !== "message" ||
        !Array.isArray(item.content)
      ) {
        continue;
      }

      for (const content of item.content) {
        if (
          content.type === "output_text" &&
          typeof content.text === "string"
        ) {
          text += content.text;
        }
      }
    }
  }

  return text;
}

function simpleClassification(message) {
  const text =
    String(message || "")
      .toLowerCase()
      .trim();

  if (text.includes("bronze")) {
    return {
      action: "PACKAGE_SELECTED",
      package: "bronze",
      payment: null
    };
  }

  if (text.includes("silver")) {
    return {
      action: "PACKAGE_SELECTED",
      package: "silver",
      payment: null
    };
  }

  if (text.includes("gold")) {
    return {
      action: "PACKAGE_SELECTED",
      package: "gold",
      payment: null
    };
  }

  if (text.includes("diamond")) {
    return {
      action: "PACKAGE_SELECTED",
      package: "diamond",
      payment: null
    };
  }

  if (text.includes("paypal")) {
    return {
      action: "PAYMENT",
      package: null,
      payment: "paypal"
    };
  }

  if (text.includes("iban")) {
    return {
      action: "PAYMENT",
      package: null,
      payment: "iban"
    };
  }

  if (text.includes("revolut")) {
    return {
      action: "PAYMENT",
      package: null,
      payment: "revolut"
    };
  }

  if (
    text.includes("mb way") ||
    text.includes("mbway")
  ) {
    return {
      action: "PAYMENT",
      package: null,
      payment: "mbway"
    };
  }

  if (
    text.includes("card") ||
    text.includes("credit") ||
    text.includes("debit")
  ) {
    return {
      action: "PAYMENT",
      package: null,
      payment: "card"
    };
  }

  if (
    text.includes("package") ||
    text.includes("packages") ||
    text.includes("price") ||
    text.includes("prices")
  ) {
    return {
      action: "PACKAGES",
      package: null,
      payment: null
    };
  }

  if (
    text.includes("guarantee") ||
    text.includes("guaranteed")
  ) {
    return {
      action: "FOLLOWER_GUARANTEE",
      package: null,
      payment: null
    };
  }

  if (
    text.includes("later") ||
    text.includes("tomorrow")
  ) {
    return {
      action: "LATER",
      package: null,
      payment: null
    };
  }

  if (text.includes("think")) {
    return {
      action: "THINK",
      package: null,
      payment: null
    };
  }

  return {
    action: "AI_REPLY",
    package: null,
    payment: null
  };
     }
async function classifyMessage(
  conversation,
  clientMessage,
  attachmentInfo
) {
  if (!OPEN_AI) {
    return simpleClassification(
      clientMessage
    );
  }

  const history =
    conversation.history
      .slice(-12)
      .map(
        item =>
          `${item.role}: ${item.text}`
      )
      .join("\n");

  const prompt =
`You classify Instagram customer messages.

Return ONLY valid JSON.

Possible actions:
PROMOTION
PACKAGES
FOLLOWER_GUARANTEE
ACTIVE_AUDIENCE
LATER
THINK
PACKAGE_SELECTED
PAYMENT_METHOD_QUESTION
PAYMENT
OPENING
AI_REPLY

Package values:
bronze
silver
gold
diamond

Payment values:
paypal
iban
revolut
mbway
card

Conversation:
${history}

Latest customer message:
${clientMessage}

Attachment:
${attachmentInfo || "none"}

Return:
{
  "action": "...",
  "package": null,
  "payment": null
}`;

  try {
    const response =
      await fetch(
        "https://api.openai.com/v1/responses",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            "Authorization":
              `Bearer ${OPEN_AI}`
          },

          body: JSON.stringify({
            model: OPENAI_MODEL,
            input: prompt,
            max_output_tokens: 200
          })
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      return simpleClassification(
        clientMessage
      );
    }

    const text =
      extractOpenAIText(data)
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

    const result =
      JSON.parse(text);

    return {
      action:
        result.action ||
        "AI_REPLY",

      package:
        result.package ||
        null,

      payment:
        result.payment ||
        null
    };

  } catch (error) {
    console.error(
      "Classification error:",
      error
    );

    return simpleClassification(
      clientMessage
    );
  }
}


async function getAIReply(
  conversation,
  clientMessage,
  attachmentInfo
) {
  if (!OPEN_AI) {
    return "Of course ❤️ How can I help you?";
  }

  const history =
    conversation.history
      .slice(-15)
      .map(
        item =>
          `${item.role}: ${item.text}`
      )
      .join("\n");

  const prompt =
`You are an Instagram sales assistant.

Business:
Instagram promotion service.

Packages:

Bronze: $40 — 2 stories — 1,000 followers
Silver: $75 — 1 post + 3 stories — 2,000 followers
Gold: $140 — 7 posts + 10 stories — 5,000 followers
Diamond: $220 — 10 posts + 20 stories — 10,000 followers

Payment methods:
PayPal
IBAN
Revolut
MB WAY
Credit/Debit Card

Do not invent prices.
Do not invent payment methods.
Keep replies short and natural.

Conversation:
${history}

Customer:
${clientMessage}

Attachment:
${attachmentInfo || "none"}`;

  try {
    const response =
      await fetch(
        "https://api.openai.com/v1/responses",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            "Authorization":
              `Bearer ${OPEN_AI}`
          },

          body: JSON.stringify({
            model: OPENAI_MODEL,
            input: prompt,
            max_output_tokens: 350
          })
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      return "Of course ❤️ How can I help you?";
    }

    const reply =
      extractOpenAIText(data).trim();

    return reply ||
      "Of course ❤️ How can I help you?";

  } catch (error) {
    console.error(
      "OpenAI error:",
      error
    );

    return "Of course ❤️ How can I help you?";
  }
}


function getAttachmentInfo(message) {
  const parts = [];

  if (
    Array.isArray(
      message.attachments
    )
  ) {
    for (
      const attachment of
      message.attachments
    ) {
      const type =
        attachment.type ||
        "unknown";

      const url =
        attachment.payload?.url ||
        attachment.payload?.src ||
        "";

      parts.push(
        `type=${type}, url=${url}`
      );
    }
  }

  if (message.share) {
    parts.push(
      `shared media=${JSON.stringify(
        message.share
      )}`
    );
  }

  return parts.join("\n");
}


async function processClientMessage(
  senderId,
  clientMessage,
  attachmentInfo
) {
  const conversation =
    getConversation(senderId);

  conversation.clientReplied = true;

  cancelReminder(senderId);

  saveMessage(
    conversation,
    "client",
    clientMessage || "[media]"
  );

  const result =
    await classifyMessage(
      conversation,
      clientMessage,
      attachmentInfo
    );

  let reply = null;


  if (
    conversation.stage ===
    "NEW"
  ) {
    conversation.stage =
      "OPENING_SENT";

    reply = MESSAGE_ONE;
  }

  else if (
    result.action ===
    "PROMOTION"
  ) {
    conversation.stage =
      "PROMOTION_SENT";

    reply = MESSAGE_TWO;
  }

  else if (
    result.action ===
    "PACKAGES"
  ) {
    conversation.stage =
      "PACKAGES_SHOWN";

    reply = PACKAGES_MESSAGE;
  }

  else if (
    result.action ===
    "FOLLOWER_GUARANTEE"
  ) {
    reply =
`Yes ❤️ Our packages include a follower guarantee depending on the package you choose.

I can show you all the available packages.`;
  }

  else if (
    result.action ===
    "ACTIVE_AUDIENCE"
  ) {
    reply =
`Yes ❤️ Our promotion is focused on helping you reach an active and relevant audience.

I can show you the available packages.`;
  }

  else if (
    result.action ===
    "LATER"
  ) {
    reply =
`Of course ❤️ No problem.

Whenever you're ready, just message us and we'll be happy to help.`;
  }

  else if (
    result.action ===
    "THINK"
  ) {
    reply =
`Of course ❤️ Take your time.

If you have any questions about the packages, just ask me.`;
  }

  else if (
    result.action ===
    "PACKAGE_SELECTED"
  ) {
    const packageKey =
      result.package;

    if (
      PACKAGES[packageKey]
    ) {
      conversation.selectedPackage =
        packageKey;

      conversation.stage =
        "PACKAGE_SELECTED";

      const selected =
        PACKAGES[packageKey];

      reply =
`Perfect ❤️ You've selected our ${selected.name} package.

Package price: $${selected.price}

${selected.details}
${selected.followers}

How would you like to pay? ❤️

PayPal
IBAN
Revolut
MB WAY
Credit/Debit Card`;
    }
  }

  else if (
    result.action ===
    "PAYMENT_METHOD_QUESTION"
  ) {
    reply =
`Sure ❤️ How would you like to pay?

PayPal
IBAN
Revolut
MB WAY
Credit/Debit Card`;
  }

  else if (
    result.action ===
    "PAYMENT"
  ) {
    const payment =
      result.payment;

    if (
      PAYMENT_METHODS.includes(
        payment
      ) &&
      payment !== "none"
    ) {
      if (
        !conversation.selectedPackage
      ) {
        reply =
`Please select your package first ❤️

${PACKAGES_MESSAGE}`;
      } else {
        conversation.paymentMethod =
          payment;

        conversation.stage =
          "PAYMENT_PENDING";

        reply =
          buildPaymentMessage(
            conversation.selectedPackage,
            payment
          );
      }
    }
  }

  else {
    reply =
      await getAIReply(
        conversation,
        clientMessage,
        attachmentInfo
      );
  }

  if (!reply) {
    reply =
      await getAIReply(
        conversation,
        clientMessage,
        attachmentInfo
      );
  }

  conversation.clientReplied = false;

  await wait(
    getRandomDelay()
  );

  return sendTrackedMessage(
    senderId,
    reply,
    conversation,
    conversation.stage
  );
}


app.get(
  "/webhook",
  (req, res) => {
    const mode =
      req.query["hub.mode"];

    const token =
      req.query["hub.verify_token"];

    const challenge =
      req.query["hub.challenge"];

    if (
      mode === "subscribe" &&
      token === VERIFY_TOKEN
    ) {
      return res
        .status(200)
        .send(challenge);
    }

    return res.sendStatus(403);
  }
);


app.post(
  "/webhook",
  async (req, res) => {
    res.sendStatus(200);

    const body = req.body;

    if (
      body.object !==
      "instagram"
    ) {
      return;
    }

    if (
      !Array.isArray(body.entry)
    ) {
      return;
    }

    for (
      const entry of body.entry
    ) {
      if (
        !Array.isArray(
          entry.messaging
        )
      ) {
        continue;
      }

      for (
        const event of
        entry.messaging
      ) {

        if (
          event.read &&
          event.read.mid
        ) {
          const messageId =
            event.read.mid;

          const outgoing =
            outgoingMessages.get(
              messageId
            );

          if (!outgoing) {
            continue;
          }

          const senderId =
            outgoing.senderId;

          const conversation =
            getConversation(
              senderId
            );

          if (
            conversation.lastOutgoingMessageId !==
            messageId
          ) {
            continue;
          }

          let reminderText = null;

          if (
            outgoing.stage ===
            "OPENING_SENT"
          ) {
            reminderText =
              "Hey ❤️ Are you interested in growing your Instagram?";
          }

          else if (
            outgoing.stage ===
            "PROMOTION_SENT"
          ) {
            reminderText =
              "Just checking in ❤️ Can I show you our packages?";
          }

          else if (
            outgoing.stage ===
            "PACKAGES_SHOWN"
          ) {
            reminderText =
              "So which package would you like to choose? ❤️";
          }

          else if (
            outgoing.stage ===
            "PAYMENT_PENDING"
          ) {
            reminderText =
              "Which payment mode do you have available? ❤️";
          }

          if (reminderText) {
            createReminder(
              senderId,
              messageId,
              reminderText,
              outgoing.stage
            );
          }

          continue;
        }


        if (
          !event.message
        ) {
          continue;
        }

        const senderId =
          event.sender?.id;

        if (
          !senderId ||
          senderId ===
          INSTAGRAM_USER_ID
        ) {
          continue;
        }

        const clientMessage =
          event.message?.text ||
          "";

        const attachmentInfo =
          getAttachmentInfo(
            event.message
          );

        queueForClient(
          senderId,
          async () => {
            try {
              await processClientMessage(
                senderId,
                clientMessage,
                attachmentInfo
              );
            } catch (error) {
              console.error(
                "Message processing error:",
                error
              );
            }
          }
        );
      }
    }
  }
);


app.get(
  "/",
  (req, res) => {
    res.send(
      "Global Promote Instagram AI is running!"
    );
  }
);


app.get(
  "/health",
  (req, res) => {
    res.json({
      status: "ok",

      instagram:
        Boolean(
          INSTAGRAM_USER_ID
        ),

      meta:
        Boolean(
          PAGE_ACCESS_TOKEN
        ),

      openai:
        Boolean(
          OPEN_AI
        ),

      conversations:
        conversations.size
    });
  }
);


app.listen(
  PORT,
  () => {
    console.log(
      `Server running on port ${PORT}`
    );
  }
);
