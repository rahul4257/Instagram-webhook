const express = require("express");
const app = express();

app.use(express.json());

/* =========================================================
   ENVIRONMENT VARIABLES
========================================================= */

const VERIFY_TOKEN =
  process.env.VERIFY_TOKEN || "instagram_verify_2026";

const OPEN_AI =
  process.env.OPEN_AI || "";

const OPENAI_MODEL =
  process.env.OPENAI_MODEL || "gpt-5-mini";

const PAGE_ACCESS_TOKEN =
  process.env.PAGE_ACCESS_TOKEN || "";

const INSTAGRAM_USER_ID =
  "17841404831696204";

const INSTAGRAM_API_VERSION =
  "v26.0";

const PORT =
  process.env.PORT || 3000;

const ADMIN_SECRET =
  process.env.ADMIN_SECRET || "";

/*
 * KEEPING YOUR EXISTING MEMORY CONNECTIONS
 */
const SUPABASE_URL =
  process.env.SUPABASE_URL || "";

const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const MEMORY_URL =
  process.env.MEMORY_URL || "";

const MEMORY_TOKEN =
  process.env.MEMORY_TOKEN || "";


/* =========================================================
   BUSINESS
========================================================= */

const BUSINESS_NAME =
  "Global Promote";

const INSTAGRAM_PAGES = [
  "@expl.europe",
  "@expl.canada",
  "@expl.atlanta",
  "@expl.miami"
];


/* =========================================================
   FIXED MESSAGE 1
========================================================= */

const MESSAGE_ONE =
`Hey dear ♥️
I see your profile, its a great content ♥️
Would you like to get featured on our page?`;


/* =========================================================
   FIXED MESSAGE 2
========================================================= */

const MESSAGE_TWO =
`We are here to spotlight your profile 💫
@expl.europe
@expl.canada
@expl.atlanta
@expl.miami

I will upload your post on these pages and from that you will gain 1k to 15k guaranteed followers according to your package. Can I show you our packages ?`;


/* =========================================================
   EXACT PACKAGE LIST
========================================================= */

const PACKAGES_MESSAGE =
`🎊 Instagram packages🎊

1️⃣ BRONZE PACKAGE 📦
👉 only 35€ =  2story
🎉(1.5k followers guaranteed)

2️⃣ SILVER PACKAGE 📦
👉 only 60€ = 1 post and 3stroy + 2 highlights 🎊
🎉( 4k followers guaranteed)

3️⃣ GOLD PACKAGE 📦
👉 only 90€ = 3 post and 4 stroy +3 highlights 🎊
🎉( 7k followers guaranteed)
Mostly client choose this package!!

4️⃣ DIAMOND PACKAGE 📦
👉 only 120€ = 5 post and 8 story + 7 highlights 🎊
🎉( 10k followers guaranteed)

💥 CHOOSE YOUR PACKAGE 💥`;


/* =========================================================
   GUARANTEE
========================================================= */

const GUARANTEE_MESSAGE =
`Yes ❤️ The followers are guaranteed because we upload your content on our pages and continue the promotion until you receive the followers included in your package.

If you don't gain the guaranteed followers, the amount will be refunded according to our guarantee policy. ❤️`;


/* =========================================================
   PACKAGE DATA
========================================================= */

const PACKAGES = {

  bronze: {
    name: "Bronze",
    price: 35,
    details:
      "2 story",
    followers:
      "1.5k followers guaranteed"
  },

  silver: {
    name: "Silver",
    price: 60,
    details:
      "1 post and 3 story + 2 highlights",
    followers:
      "4k followers guaranteed"
  },

  gold: {
    name: "Gold",
    price: 90,
    details:
      "3 post and 4 story + 3 highlights",
    followers:
      "7k followers guaranteed"
  },

  diamond: {
    name: "Diamond",
    price: 120,
    details:
      "5 post and 8 story + 7 highlights",
    followers:
      "10k followers guaranteed"
  }

};


/* =========================================================
   PAYMENT DETAILS
========================================================= */

const PAYPAL_DETAILS =
`PayPal:
pay@globalpromote.in
https://paypal.me/RamanKumar4257`;

const IBAN_DETAILS =
`Bank / Wise:

Account name: Rahul Kumar
IBAN: BE36967747881581
SWIFT/BIC: TRWIBEB1XXX
Bank: Wise

Bank address:
Rue du Trône 100, 3rd floor
Brussels, 1050
Belgium`;

const MBWAY_DETAILS =
`MB WAY:
Number: +351 968 188 499
Name: Andre Santana`;

const REVOLUT_DETAILS =
`Revolut:
Tag: @clavis02pk
Payment link: https://revolut.me/clavis02pk`;


/* =========================================================
   STORAGE
========================================================= */

const conversations =
  new Map();

const clientQueues =
  new Map();

const processedMessageIds =
  new Map();

const outgoingMessages =
  new Set();

const manualReplyVersion =
  new Map();


/* =========================================================
   HELPERS
========================================================= */

function nowISO() {
  return new Date().toISOString();
}

function wait(ms) {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}

function replyDelay() {
  return (
    7000 +
    Math.floor(Math.random() * 3000)
  );
}

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[.,!?]/g, " ")
    .replace(/\s+/g, " ");
}


/* =========================================================
   CONVERSATION
========================================================= */

function createConversation(senderId) {

  return {

    senderId,

    stage: "NEW",

    history: [],

    selectedPackage: null,

    paymentMethod: null,

    lastSeenAt: nowISO()

  };
}


function saveMessage(
  conversation,
  role,
  text
) {

  if (!text) return;

  conversation.history.push({

    role,

    text: String(text),

    timestamp: nowISO()

  });

  if (
    conversation.history.length >
    60
  ) {
    conversation.history =
      conversation.history.slice(-60);
  }

  conversation.lastSeenAt =
    nowISO();
}


/* =========================================================
   EXISTING PERSISTENT MEMORY
========================================================= */

async function memoryGet(senderId) {

  if (
    !MEMORY_URL ||
    !MEMORY_TOKEN
  ) {
    return null;
  }

  try {

    const key =
      encodeURIComponent(
        `instagram:${senderId}`
      );

    const response =
      await fetch(
        `${MEMORY_URL}/get/${key}`,
        {
          headers: {
            Authorization:
              `Bearer ${MEMORY_TOKEN}`
          }
        }
      );

    if (!response.ok) {
      return null;
    }

    const data =
      await response.json();

    if (!data?.result) {
      return null;
    }

    return JSON.parse(
      data.result
    );

  } catch (error) {

    console.error(
      "MEMORY GET ERROR:",
      error.message
    );

    return null;
  }
}


async function memorySave(
  senderId,
  conversation
) {

  if (
    !MEMORY_URL ||
    !MEMORY_TOKEN
  ) {
    return;
  }

  try {

    const key =
      encodeURIComponent(
        `instagram:${senderId}`
      );

    const value =
      encodeURIComponent(
        JSON.stringify(
          conversation
        )
      );

    await fetch(
      `${MEMORY_URL}/set/${key}/${value}`,
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${MEMORY_TOKEN}`
        }
      }
    );

  } catch (error) {

    console.error(
      "MEMORY SAVE ERROR:",
      error.message
    );
  }
}


async function getConversation(
  senderId
) {

  if (
    conversations.has(senderId)
  ) {

    return conversations.get(
      senderId
    );
  }

  const saved =
    await memoryGet(senderId);

  const conversation =
    saved &&
    typeof saved === "object"
      ? saved
      : createConversation(
          senderId
        );

  conversation.senderId =
    senderId;

  conversation.history =
    Array.isArray(
      conversation.history
    )
      ? conversation.history
      : [];

  conversation.stage =
    conversation.stage ||
    "NEW";

  conversation.selectedPackage =
    conversation.selectedPackage ||
    null;

  conversation.paymentMethod =
    conversation.paymentMethod ||
    null;

  conversations.set(
    senderId,
    conversation
  );

  console.log(
    "Conversation loaded:",
    senderId,
    conversation.stage
  );

  return conversation;
}


async function saveConversation(
  senderId,
  conversation
) {

  conversations.set(
    senderId,
    conversation
  );

  await memorySave(
    senderId,
    conversation
  );
}


/* =========================================================
   PER-CLIENT QUEUE
========================================================= */

function queueForClient(
  senderId,
  task
) {

  const previous =
    clientQueues.get(
      senderId
    ) ||
    Promise.resolve();

  const next =
    previous
      .catch(() => {})
      .then(task);

  clientQueues.set(
    senderId,
    next
  );

  next.finally(() => {

    if (
      clientQueues.get(
        senderId
      ) === next
    ) {

      clientQueues.delete(
        senderId
      );
    }

  }).catch(() => {});

  return next;
  }
/* =========================================================
   PACKAGE DETECTION
========================================================= */

function detectPackage(text) {

  const t =
    normalize(text);

  if (
    /\bbronze\b/.test(t)
  ) {
    return "bronze";
  }

  if (
    /\bsilver\b/.test(t)
  ) {
    return "silver";
  }

  if (
    /\bgold\b/.test(t)
  ) {
    return "gold";
  }

  if (
    /\bdiamond\b/.test(t)
  ) {
    return "diamond";
  }

  if (
    /\bpackage\s*1\b/.test(t) ||
    /^1$/.test(t)
  ) {
    return "bronze";
  }

  if (
    /\bpackage\s*2\b/.test(t) ||
    /^2$/.test(t)
  ) {
    return "silver";
  }

  if (
    /\bpackage\s*3\b/.test(t) ||
    /^3$/.test(t)
  ) {
    return "gold";
  }

  if (
    /\bpackage\s*4\b/.test(t) ||
    /^4$/.test(t)
  ) {
    return "diamond";
  }

  return null;
}


/* =========================================================
   PAYMENT METHOD
========================================================= */

function detectPaymentMethod(
  text
) {

  const t =
    normalize(text);

  if (
    /\bpaypal\b/.test(t)
  ) {
    return "paypal";
  }

  if (
    /\bwise\b/.test(t) ||
    /\biban\b/.test(t) ||
    /\bbank\b/.test(t)
  ) {
    return "iban";
  }

  if (
    /\brevolut\b/.test(t)
  ) {
    return "revolut";
  }

  if (
    /\bmbway\b/.test(t) ||
    /\bmb way\b/.test(t)
  ) {
    return "mbway";
  }

  if (
    /\bcard\b/.test(t) ||
    /\bcredit card\b/.test(t) ||
    /\bdebit card\b/.test(t)
  ) {
    return "card";
  }

  return null;
}


/* =========================================================
   PACKAGE CONFIRMATION
========================================================= */

function buildPackageConfirmation(
  packageKey
) {

  const p =
    PACKAGES[packageKey];

  return `Perfect ❤️

You've selected the ${p.name} package.

€${p.price} = ${p.details}
${p.followers}

How would you like to pay?

PayPal
IBAN / Wise
Revolut
MB WAY
Credit/Debit Card`;
}


/* =========================================================
   PAYMENT MESSAGE
========================================================= */

function buildPaymentMessage(
  packageKey,
  method
) {

  const p =
    PACKAGES[packageKey];

  const fee =
    Math.round(
      p.price * 0.12 * 100
    ) / 100;

  const total =
    Math.round(
      (p.price + fee) * 100
    ) / 100;

  let details = "";

  if (
    method === "paypal"
  ) {
    details =
      PAYPAL_DETAILS;
  }

  else if (
    method === "iban"
  ) {
    details =
      IBAN_DETAILS;
  }

  else if (
    method === "revolut"
  ) {
    details =
      REVOLUT_DETAILS;
  }

  else if (
    method === "mbway"
  ) {
    details =
      MBWAY_DETAILS;
  }

  else {

    details =
      "Our team will assist you with the Credit/Debit Card payment ❤️";
  }

  return `Perfect ❤️

Package: ${p.name}

Package price: €${p.price.toFixed(2)}

12% payment fee: €${fee.toFixed(2)}

Total: €${total.toFixed(2)}

Payment method: ${method.toUpperCase()}

${details}

After successful payment, please send us your payment screenshot ❤️`;
}


/* =========================================================
   MEDIA / LINK
========================================================= */

function getAttachmentInfo(
  message
) {

  const parts = [];

  for (
    const attachment
    of message?.attachments || []
  ) {

    parts.push(
      `type=${attachment.type || "unknown"}`
    );
  }

  if (
    message?.share
  ) {

    parts.push(
      `shared=${JSON.stringify(
        message.share
      )}`
    );
  }

  return parts.join("\n");
}


function hasMedia(
  attachmentInfo
) {

  return Boolean(
    attachmentInfo &&
    attachmentInfo.trim()
  );
}


function isLink(
  text
) {

  const t =
    String(text || "").trim();

  return (
    /^(https?:\/\/|www\.)\S+$/i.test(t) ||
    /\b(instagram\.com|instagr\.am|tiktok\.com|youtube\.com|youtu\.be|facebook\.com)\//i.test(t)
  );
}


/* =========================================================
   SAFE AI FOR LATER QUESTIONS ONLY
========================================================= */

function extractAIText(
  data
) {

  if (
    typeof data?.output_text ===
    "string"
  ) {

    return data.output_text.trim();
  }

  let text = "";

  for (
    const item of
    data?.output || []
  ) {

    for (
      const part of
      item.content || []
    ) {

      if (
        part.type ===
          "output_text" &&
        part.text
      ) {

        text += part.text;
      }
    }
  }

  return text.trim();
}


async function getAIReply(
  conversation,
  clientMessage,
  attachmentInfo
) {

  if (!OPEN_AI) {
    return null;
  }

  const history =
    conversation.history
      .slice(-30)
      .map(
        m =>
          `${m.role}: ${m.text}`
      )
      .join("\n");

  const prompt =
`You are Global Promote's Instagram customer-support AI.

IMPORTANT:
The first three customer interactions are handled by fixed server messages. You are NOT allowed to replace or repeat them.

Remember this existing conversation:

${history}

Latest customer message:
${clientMessage || "[media]"}

Attachment:
${attachmentInfo || "none"}

Rules:
- Never restart the conversation.
- Never send the opening message.
- Never repeat the package list unless the server asks for it.
- Never invent prices.
- Never invent payment information.
- Answer only the latest genuine question.
- Keep the answer short and natural.
- If the customer asks about guarantees, use the approved guarantee information.
- If you don't know something, don't invent it.
- Do not create a new sales opening.

Return only the customer-facing reply.`;

  try {

    const response =
      await fetch(
        "https://api.openai.com/v1/responses",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${OPEN_AI}`
          },

          body:
            JSON.stringify({
              model:
                OPENAI_MODEL,

              input:
                prompt,

              max_output_tokens:
                250
            })
        }
      );

    const data =
      await response.json();

    if (
      !response.ok
    ) {

      console.error(
        "OPENAI ERROR:",
        data
      );

      return null;
    }

    return extractAIText(
      data
    );

  } catch (error) {

    console.error(
      "AI ERROR:",
      error.message
    );

    return null;
  }
}


/* =========================================================
   INSTAGRAM SEND
========================================================= */

async function sendInstagramMessage(
  recipientId,
  text
) {

  if (
    !PAGE_ACCESS_TOKEN
  ) {

    throw new Error(
      "PAGE_ACCESS_TOKEN is missing"
    );
  }

  const url =
    `https://graph.instagram.com/${INSTAGRAM_API_VERSION}` +
    `/${INSTAGRAM_USER_ID}/messages`;

  const response =
    await fetch(
      url,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${PAGE_ACCESS_TOKEN}`
        },

        body:
          JSON.stringify({

            recipient: {
              id: recipientId
            },

            message: {
              text
            }

          })
      }
    );

  const data =
    await response.json();

  if (
    !response.ok
  ) {

    console.error(
      "INSTAGRAM API ERROR:",
      data
    );

    throw new Error(
      "Instagram message failed"
    );
  }

  const id =
    data?.message_id ||
    data?.id;

  if (id) {
    outgoingMessages.add(
      String(id)
    );
  }

  return data;
}


/* =========================================================
   SAFE DELAY + MANUAL CANCEL
========================================================= */

async function sendReplySafely(
  senderId,
  conversation,
  reply,
  version
) {

  if (!reply) {
    return;
  }

  console.log(
    "Waiting before reply..."
  );

  await wait(
    replyDelay()
  );

  /*
   * If owner replied manually
   * during the delay, cancel AI.
   */
  if (
    (
      manualReplyVersion.get(
        senderId
      ) || 0
    ) !== version
  ) {

    console.log(
      "AI reply cancelled because manual reply was detected."
    );

    return;
  }

  const data =
    await sendInstagramMessage(
      senderId,
      reply
    );

  saveMessage(
    conversation,
    "assistant",
    reply
  );

  await saveConversation(
    senderId,
    conversation
  );

  console.log(
    "REPLY SENT:",
    reply
  );

  return data;
}


/* =========================================================
   MAIN CUSTOMER PROCESSOR
========================================================= */

async function processClientMessage(
  senderId,
  clientMessage,
  attachmentInfo
) {

  const conversation =
    await getConversation(
      senderId
    );

  const version =
    manualReplyVersion.get(
      senderId
    ) || 0;

  const text =
    String(
      clientMessage || ""
    ).trim();

  const media =
    hasMedia(
      attachmentInfo
    );

  /*
   * Number of previous CUSTOMER
   * messages only.
   */
  const customerMessages =
    conversation.history.filter(
      x =>
        x.role === "client"
    ).length;

  console.log(
    "CUSTOMER MESSAGE:",
    senderId
  );

  console.log(
    "Customer message number:",
    customerMessages + 1
  );

  console.log(
    "Text:",
    text
  );

  console.log(
    "Attachment:",
    attachmentInfo || "none"
  );


  saveMessage(
    conversation,
    "client",
    text ||
      (
        media
          ? "[photo/video/media]"
          : "[media]"
      )
  );

  await saveConversation(
    senderId,
    conversation
  );


  /* =======================================================
     FIRST CUSTOMER MESSAGE
  ======================================================= */

  if (
    customerMessages === 0
  ) {

    /*
     * Normal first message.
     */
    conversation.stage =
      "MESSAGE_ONE_SENT";

    await sendReplySafely(
      senderId,
      conversation,
      MESSAGE_ONE,
      version
    );

    return;
  }


  /* =======================================================
     SECOND CUSTOMER MESSAGE
     
     Whatever they say:
     YES / OK / SURE / HELLO / ANYTHING
     
     -> FIXED MESSAGE TWO
  ======================================================= */

  if (
    customerMessages === 1
  ) {

    conversation.stage =
      "MESSAGE_TWO_SENT";

    await sendReplySafely(
      senderId,
      conversation,
      MESSAGE_TWO,
      version
    );

    return;
  }


  /* =======================================================
     THIRD CUSTOMER MESSAGE
     
     Fixed package list.
     
     BUT if they directly select a package,
     handle the package immediately.
  ======================================================= */

  if (
    customerMessages === 2
  ) {

    const directPackage =
      detectPackage(
        text
      );

    if (
      directPackage
    ) {

      conversation.selectedPackage =
        directPackage;

      conversation.stage =
        "PACKAGE_SELECTED";

      await sendReplySafely(
        senderId,
        conversation,
        buildPackageConfirmation(
          directPackage
        ),
        version
      );

      return;
    }

    conversation.stage =
      "PACKAGES_SHOWN";

    await sendReplySafely(
      senderId,
      conversation,
      PACKAGES_MESSAGE,
      version
    );

    return;
  }


  /* =======================================================
     PACKAGE SELECTION
  ======================================================= */

  const selectedPackage =
    detectPackage(
      text
    );

  if (
    selectedPackage
  ) {

    conversation.selectedPackage =
      selectedPackage;

    conversation.stage =
      "PACKAGE_SELECTED";

    await sendReplySafely(
      senderId,
      conversation,
      buildPackageConfirmation(
        selectedPackage
      ),
      version
    );

    return;
  }


  /* =======================================================
     PAYMENT METHOD
  ======================================================= */

  const payment =
    detectPaymentMethod(
      text
    );

  if (
    payment &&
    conversation.selectedPackage
  ) {

    conversation.paymentMethod =
      payment;

    conversation.stage =
      "PAYMENT_PENDING";

    await sendReplySafely(
      senderId,
      conversation,
      buildPaymentMessage(
        conversation.selectedPackage,
        payment
      ),
      version
    );

    return;
  }


  /* =======================================================
     GUARANTEE QUESTION
  ======================================================= */

  if (
    /\bguarantee\b|\bguaranteed\b|\brefund\b|\brefill\b/i
      .test(text)
  ) {

    await sendReplySafely(
      senderId,
      conversation,
      GUARANTEE_MESSAGE,
      version
    );

    return;
  }


  /* =======================================================
     ONLY NOW USE AI
     
     This prevents AI from creating random
     sales/opening/package messages.
  ======================================================= */

  const reply =
    await getAIReply(
      conversation,
      text,
      attachmentInfo
    );

  if (
    reply
  ) {

    await sendReplySafely(
      senderId,
      conversation,
      reply,
      version
    );

  } else {

    await saveConversation(
      senderId,
      conversation
    );
  }
               }
/* =========================================================
   WEBHOOK VERIFICATION
========================================================= */

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

      console.log(
        "WEBHOOK VERIFIED"
      );

      return res
        .status(200)
        .send(challenge);
    }

    return res.sendStatus(
      403
    );
  }
);


/* =========================================================
   INSTAGRAM WEBHOOK
========================================================= */

app.post(
  "/webhook",
  async (req, res) => {

    /*
     * ALWAYS LOG THE COMPLETE WEBHOOK.
     */
    console.log(
      "========================================"
    );

    console.log(
      "INSTAGRAM WEBHOOK RECEIVED"
    );

    console.log(
      JSON.stringify(
        req.body,
        null,
        2
      )
    );

    console.log(
      "========================================"
    );

    /*
     * Respond to Meta immediately.
     */
    res.sendStatus(200);

    const body =
      req.body;

    if (
      body?.object !==
      "instagram"
    ) {
      return;
    }

    if (
      !Array.isArray(
        body?.entry
      )
    ) {
      return;
    }


    for (
      const entry of
      body.entry
    ) {

      for (
        const event of
        entry.messaging || []
      ) {

        /*
         * READ EVENT
         */
        if (
          event.read?.mid
        ) {
          continue;
        }


        /*
         * Ignore events without messages.
         */
        if (
          !event.message
        ) {
          continue;
        }


        const senderId =
          event.sender?.id;

        const messageId =
          event.message?.mid;

        const recipientId =
          event.recipient?.id;

        const isEcho =
          event.message?.is_echo === true;


        console.log(
          "---------- MESSAGE EVENT ----------"
        );

        console.log(
          "Sender:",
          senderId
        );

        console.log(
          "Recipient:",
          recipientId
        );

        console.log(
          "Message ID:",
          messageId
        );

        console.log(
          "Text:",
          event.message?.text ||
          "[NO TEXT]"
        );

        console.log(
          "is_echo:",
          isEcho
        );

        console.log(
          "Attachments:",
          JSON.stringify(
            event.message?.attachments ||
            []
          )
        );

        console.log(
          "Share:",
          JSON.stringify(
            event.message?.share ||
            null
          )
        );

        console.log(
          "-----------------------------------"
        );


        if (
          !senderId ||
          !messageId
        ) {
          continue;
        }


        /* =================================================
           OUR OWN MESSAGE / ECHO
        ================================================= */

        if (
          isEcho ||
          String(senderId) ===
            String(INSTAGRAM_USER_ID)
        ) {

          /*
           * If this is an AI message that we
           * already sent, simply ignore it.
           */
          if (
            outgoingMessages.has(
              String(messageId)
            )
          ) {

            outgoingMessages.delete(
              String(messageId)
            );

            console.log(
              "Our AI message echo ignored."
            );

            continue;
          }


          /*
           * Otherwise it is likely a
           * manual message sent by the owner.
           */
          if (
            recipientId
          ) {

            manualReplyVersion.set(
              recipientId,
              (
                manualReplyVersion.get(
                  recipientId
                ) || 0
              ) + 1
            );

            const conversation =
              await getConversation(
                recipientId
              );

            const ownText =
              event.message?.text ||
              "";

            if (
              ownText
            ) {

              saveMessage(
                conversation,
                "assistant",
                ownText
              );

              await saveConversation(
                recipientId,
                conversation
              );
            }

            console.log(
              "MANUAL REPLY DETECTED. Waiting AI cancelled."
            );
          }

          continue;
        }


        /* =================================================
           DUPLICATE PROTECTION
        ================================================= */

        if (
          processedMessageIds.has(
            String(messageId)
          )
        ) {

          console.log(
            "DUPLICATE MESSAGE IGNORED:",
            messageId
          );

          continue;
        }

        processedMessageIds.set(
          String(messageId),
          Date.now()
        );

        setTimeout(
          () =>
            processedMessageIds.delete(
              String(messageId)
            ),
          60 * 60 * 1000
        );


        /* =================================================
           MESSAGE CONTENT
        ================================================= */

        const clientMessage =
          event.message?.text ||
          "";

        const attachmentInfo =
          getAttachmentInfo(
            event.message
          );


        if (
          !clientMessage &&
          !attachmentInfo
        ) {

          console.log(
            "Empty message ignored."
          );

          continue;
        }


        /*
         * IMPORTANT:
         * Every customer message gets queued.
         *
         * Same customer:
         * 1 -> 2 -> 3 -> 4
         *
         * Different customers can
         * process independently.
         */
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
                "CUSTOMER PROCESSING ERROR:",
                error
              );
            }

          }
        );
      }
    }
  }
);


/* =========================================================
   HEALTH
========================================================= */

app.get(
  "/health",
  (req, res) => {

    res.json({

      status: "ok",

      ai: Boolean(
        OPEN_AI
      ),

      instagram: Boolean(
        PAGE_ACCESS_TOKEN
      ),

      memory: Boolean(
        MEMORY_URL &&
        MEMORY_TOKEN
      ),

      supabaseEnvironmentPresent:
        Boolean(
          SUPABASE_URL &&
          SUPABASE_SERVICE_ROLE_KEY
        ),

      conversations:
        conversations.size,

      system:
        "simple-fixed-flow"

    });
  }
);


/* =========================================================
   ADMIN STATUS
========================================================= */

function isAdmin(
  req
) {

  return Boolean(
    ADMIN_SECRET &&
    req.headers[
      "x-admin-secret"
    ] === ADMIN_SECRET
  );
}


app.get(
  "/admin/status",
  async (req, res) => {

    if (
      !isAdmin(req)
    ) {

      return res.sendStatus(
        403
      );
    }

    const clients =
      [];

    for (
      const [
        senderId,
        conversation
      ]
      of conversations
        .entries()
    ) {

      clients.push({

        senderId,

        stage:
          conversation.stage,

        selectedPackage:
          conversation.selectedPackage,

        paymentMethod:
          conversation.paymentMethod,

        messages:
          conversation.history.length,

        lastSeenAt:
          conversation.lastSeenAt

      });
    }

    res.json({

      success: true,

      aiAlwaysOn: true,

      simpleFixedFlow: true,

      memory:
        Boolean(
          MEMORY_URL &&
          MEMORY_TOKEN
        ),

      clients

    });
  }
);


/* =========================================================
   ADMIN PAGE
========================================================= */

app.get(
  "/admin",
  (req, res) => {

    res.send(`
<!doctype html>

<html>

<head>

<meta name="viewport"
content="width=device-width,initial-scale=1">

<title>Global Promote AI</title>

<style>

body{
font-family:Arial;
background:#f5f5f5;
padding:20px
}

.card{
max-width:700px;
margin:auto;
background:white;
padding:20px;
border-radius:15px
}

input,button{
width:100%;
box-sizing:border-box;
padding:12px;
margin-top:10px
}

</style>

</head>

<body>

<div class="card">

<h2>🤖 Global Promote AI</h2>

<p>🟢 AI ALWAYS ON</p>

<p>Fixed conversation flow enabled.</p>

<input
id="secret"
type="password"
placeholder="ADMIN_SECRET"
>

<button onclick="loadStatus()">
Load Clients
</button>

<pre id="out"></pre>

</div>

<script>

async function loadStatus(){

const secret =
document.getElementById(
"secret"
).value;

const response =
await fetch(
"/admin/status",
{
headers:{
"x-admin-secret":
secret
}
}
);

document.getElementById(
"out"
).textContent =
await response.text();

}

</script>

</body>

</html>
`);
  }
);


/* =========================================================
   ROOT
========================================================= */

app.get(
  "/",
  (req, res) => {

    res.send(
      "Global Promote Instagram AI is running!"
    );
  }
);


/* =========================================================
   START SERVER
========================================================= */

app.listen(
  PORT,
  () => {

    console.log(
      "========================================"
    );

    console.log(
      "Global Promote Instagram AI started"
    );

    console.log(
      "Port:",
      PORT
    );

    console.log(
      "AI: ALWAYS ON"
    );

    console.log(
      "Fixed 1st/2nd/3rd flow: ENABLED"
    );

    console.log(
      "Per-client queue: ENABLED"
    );

    console.log(
      "Manual-reply cancellation: ENABLED"
    );

    console.log(
      "Persistent memory:",
      MEMORY_URL
        ? "ENABLED"
        : "NOT CONFIGURED"
    );

    console.log(
      "Instagram API:",
      PAGE_ACCESS_TOKEN
        ? "CONNECTED"
        : "NOT CONFIGURED"
    );

    console.log(
      "OpenAI:",
      OPEN_AI
        ? "CONNECTED"
        : "NOT CONFIGURED"
    );

    console.log(
      "========================================"
    );

  }
);
