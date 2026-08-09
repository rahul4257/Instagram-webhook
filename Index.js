const express = require("express");

const app = express();
app.use(express.json());

/* =========================================================
   ENVIRONMENT VARIABLES
========================================================= */

const VERIFY_TOKEN =
  process.env.VERIFY_TOKEN || "instagram_verify_2026";

const OPEN_AI =
  process.env.OPEN_AI;

const PAGE_ACCESS_TOKEN =
  process.env.PAGE_ACCESS_TOKEN;

const INSTAGRAM_USER_ID =
  "17841404831696204";

const INSTAGRAM_API_VERSION =
  "v26.0";

const OPENAI_MODEL =
  process.env.OPENAI_MODEL || "gpt-5-mini";

const PORT =
  process.env.PORT || 3000;

const ADMIN_SECRET =
  process.env.ADMIN_SECRET || "";


/* =========================================================
   FIXED SALES MESSAGES
   AI IS NOT ALLOWED TO MODIFY THESE
========================================================= */

const MESSAGE_ONE =
`Hey dear ♥️
I see your profile, its a great content ♥️
Would you like to get featured on our page?`;


const MESSAGE_TWO =
`We are here to spotlight your profile 💫
@expl.europe
@expl.canada
@expl.atlanta
@expl.miami

I will upload your post on these pages and from that you will gain 1k to 15k guaranteed followers according to your package. Can I show you our packages ?`;


const PACKAGES_MESSAGE =
`Select your package ❤️

🥉 BRONZE — €35
2 stories
1.5K followers guaranteed

🥈 SILVER — €60
1 post
3 stories
2 highlights
4K followers guaranteed

🥇 GOLD — €90
3 posts
4 stories
3 highlights
7K followers guaranteed
⭐ Most chosen package

💎 DIAMOND — €120
5 posts
8 stories
7 highlights
10K followers guaranteed`;


/* =========================================================
   PACKAGES
========================================================= */

const PACKAGES = {
  bronze: {
    name: "Bronze",
    price: 35,
    details:
      "2 stories",
    followers:
      "1.5K followers guaranteed"
  },

  silver: {
    name: "Silver",
    price: 60,
    details:
      "1 post\n3 stories\n2 highlights",
    followers:
      "4K followers guaranteed"
  },

  gold: {
    name: "Gold",
    price: 90,
    details:
      "3 posts\n4 stories\n3 highlights",
    followers:
      "7K followers guaranteed"
  },

  diamond: {
    name: "Diamond",
    price: 120,
    details:
      "5 posts\n8 stories\n7 highlights",
    followers:
      "10K followers guaranteed"
  }
};


/* =========================================================
   PAYMENT DETAILS
========================================================= */

const PAYMENT_METHODS = [
  "paypal",
  "iban",
  "revolut",
  "mbway",
  "card"
];


/*
  Exact details recovered from your previous setup.
*/

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


/*
  I will NOT invent these values.
  Put your real details in Render environment variables:

  MBWAY_DETAILS
  REVOLUT_DETAILS
*/

const MBWAY_DETAILS =
  process.env.MBWAY_DETAILS ||
  "MB WAY payment details are not configured yet.";


const REVOLUT_DETAILS =
  process.env.REVOLUT_DETAILS ||
  "Revolut payment details are not configured yet.";


/* =========================================================
   PAYMENT FEE
========================================================= */

const PAYMENT_FEE_PERCENT =
  12;


function calculatePayment(packageKey) {

  const selected =
    PACKAGES[packageKey];

  if (!selected) {
    return null;
  }

  const price =
    selected.price;

  const fee =
    Math.round(
      price *
      PAYMENT_FEE_PERCENT
    * 100
    ) / 100;

  const total =
    Math.round(
      (price + fee) * 100
    ) / 100;

  return {
    price,
    fee,
    total
  };
}


/* =========================================================
   PAYMENT MESSAGE
========================================================= */

function buildPaymentMessage(
  packageKey,
  paymentMethod
) {

  const selected =
    PACKAGES[packageKey];

  if (!selected) {
    return "Please select your package first ❤️";
  }

  const payment =
    calculatePayment(packageKey);

  let details = "";

  if (
    paymentMethod ===
    "paypal"
  ) {

    details =
      PAYPAL_DETAILS;

  } else if (
    paymentMethod ===
    "iban"
  ) {

    details =
      IBAN_DETAILS;

  } else if (
    paymentMethod ===
    "mbway"
  ) {

    details =
      MBWAY_DETAILS;

  } else if (
    paymentMethod ===
    "revolut"
  ) {

    details =
      REVOLUT_DETAILS;

  } else if (
    paymentMethod ===
    "card"
  ) {

    details =
`Our team will assist you with the Credit/Debit Card payment shortly ❤️`;
  }

  return (
`Perfect ❤️

Package: ${selected.name}
Package price: €${payment.price}

12% payment fee: €${payment.fee.toFixed(2)}

Total: €${payment.total.toFixed(2)}

Payment method: ${paymentMethod.toUpperCase()}

${details}

After successful payment, please send us your payment screenshot ❤️`
  );
}


/* =========================================================
   CONVERSATION STORAGE
========================================================= */

const conversations =
  new Map();


function getConversation(
  senderId
) {

  if (
    !conversations.has(
      senderId
    )
  ) {

    conversations.set(
      senderId,
      {
        stage: "NEW",

        history: [],

        selectedPackage: null,

        paymentMethod: null,

        clientReplied: false,

        humanMode: false,

        lastOutgoingMessageId: null,

        lastOutgoingStage: null,

        reminderTimer: null
      }
    );
  }

  return conversations.get(
    senderId
  );
}


/* =========================================================
   MESSAGE HISTORY
========================================================= */

function saveMessage(
  conversation,
  role,
  text
) {

  conversation.history.push({
    role,
    text
  });

  if (
    conversation.history.length >
    30
  ) {
    conversation.history =
      conversation.history.slice(
        -30
      );
  }
}


/* =========================================================
   WAIT
========================================================= */

function wait(ms) {
  return new Promise(
    resolve =>
      setTimeout(
        resolve,
        ms
      )
  );
}


/* =========================================================
   RANDOM 10–12 SECOND DELAY
========================================================= */

function getRandomDelay() {

  const minimum =
    10000;

  const maximum =
    12000;

  return Math.floor(
    Math.random() *
      (
        maximum -
        minimum +
        1
      )
  ) + minimum;
}


/* =========================================================
   CLIENT MESSAGE QUEUES
   Prevents multiple chats being processed together
========================================================= */

const clientQueues =
  new Map();


function queueForClient(
  senderId,
  task
) {

  const previous =
    clientQueues.get(
      senderId
    ) || Promise.resolve();

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

  });
}


/* =========================================================
   OPENAI TEXT EXTRACTION
========================================================= */

function extractOpenAIText(
  data
) {

  if (
    typeof data?.output_text ===
    "string"
  ) {
    return data.output_text;
  }

  let result = "";

  if (
    Array.isArray(
      data?.output
    )
  ) {

    for (
      const item of
      data.output
    ) {

      if (
        !Array.isArray(
          item.content
        )
      ) {
        continue;
      }

      for (
        const content of
        item.content
      ) {

        if (
          content.type ===
            "output_text" &&
          typeof content.text ===
            "string"
        ) {

          result +=
            content.text;
        }
      }
    }
  }

  return result.trim();
}


/* =========================================================
   ATTACHMENT INFORMATION
========================================================= */

function getAttachmentInfo(
  message
) {

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

  if (
    message.share
  ) {

    parts.push(
      `shared media=${JSON.stringify(
        message.share
      )}`
    );
  }

  return parts.join(
    "\n"
  );
}


/* =========================================================
   OPENAI CLASSIFICATION
   AI CLASSIFIES ONLY.
   IT DOES NOT WRITE FIXED SALES MESSAGES.
========================================================= */

async function classifyMessage(
  conversation,
  clientMessage,
  attachmentInfo
) {

  if (!OPEN_AI) {

    return {
      action: "AI_REPLY",
      package: null,
      payment: null
    };
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
`You are ONLY a classifier for an Instagram sales assistant.

Do NOT write a customer reply.

Return ONLY the classification JSON.

Possible actions:

PROMOTION
PACKAGES
PACKAGE_SELECTED
PAYMENT_METHOD_QUESTION
PAYMENT
QUESTION
NEGATIVE
LATER
THINK
PAYMENT_PROOF

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

Rules:

If customer shows interest in promotion:
PROMOTION

If customer asks to see packages:
PACKAGES

If customer clearly chooses a package:
PACKAGE_SELECTED

If customer asks how to pay:
PAYMENT_METHOD_QUESTION

If customer chooses a payment method:
PAYMENT

If customer says they paid or sends payment proof:
PAYMENT_PROOF

If customer asks a normal question:
QUESTION

If customer says no/not interested:
NEGATIVE

If customer says later:
LATER

If customer says they need to think:
THINK

IMPORTANT:
Do not invent a package.
Do not invent a payment method.

Conversation:
${history}

Latest customer message:
${clientMessage || "[media]"}

Attachment:
${attachmentInfo || "none"}

Return exactly:

{
  "action": "AI_REPLY",
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

          body:
            JSON.stringify({

              model:
                OPENAI_MODEL,

              input:
                prompt,

              text: {
                format: {
                  type:
                    "json_schema",

                  name:
                    "instagram_classification",

                  strict:
                    true,

                  schema: {
                    type:
                      "object",

                    properties: {

                      action: {
                        type:
                          "string",

                        enum: [
                          "PROMOTION",
                          "PACKAGES",
                          "PACKAGE_SELECTED",
                          "PAYMENT_METHOD_QUESTION",
                          "PAYMENT",
                          "QUESTION",
                          "NEGATIVE",
                          "LATER",
                          "THINK",
                          "PAYMENT_PROOF",
                          "AI_REPLY"
                        ]
                      },

                      package: {
                        type:
                          [
                            "string",
                            "null"
                          ],

                        enum: [
                          "bronze",
                          "silver",
                          "gold",
                          "diamond",
                          null
                        ]
                      },

                      payment: {
                        type:
                          [
                            "string",
                            "null"
                          ],

                        enum: [
                          "paypal",
                          "iban",
                          "revolut",
                          "mbway",
                          "card",
                          null
                        ]
                      }
                    },

                    required: [
                      "action",
                      "package",
                      "payment"
                    ],

                    additionalProperties:
                      false
                  }
                }
              },

              max_output_tokens:
                200
            })
        }
      );


    const data =
      await response.json();

    if (!response.ok) {

      console.error(
        "OpenAI classification error:",
        data
      );

      return {
        action: "AI_REPLY",
        package: null,
        payment: null
      };
    }


    const text =
      extractOpenAIText(
        data
      ).trim();


    if (!text) {

      return {
        action: "AI_REPLY",
        package: null,
        payment: null
      };
    }


    try {

      return JSON.parse(
        text
      );

    } catch (error) {

      console.error(
        "Classification JSON parse failed:",
        text
      );

      return {
        action: "AI_REPLY",
        package: null,
        payment: null
      };
    }

  } catch (error) {

    console.error(
      "Classification error:",
      error
    );

    return {
      action: "AI_REPLY",
      package: null,
      payment: null
    };
  }
}


/* =========================================================
   FREE-FORM AI ANSWER
   USED ONLY FOR QUESTIONS / NON-FIXED CONVERSATION
========================================================= */

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
`You are the customer support assistant for Global Promote.

IMPORTANT:
The following fixed sales messages already belong to the system.
NEVER rewrite them.
NEVER replace them.
NEVER create alternative versions of them.

The system itself controls:
1. Opening message
2. Second promotion message
3. Packages
4. Package confirmation
5. Payment method message
6. Payment details
7. Two-minute reminders

You only answer questions that are not covered by those fixed messages.

Packages:

Bronze: €35
2 stories
1.5K followers guaranteed

Silver: €60
1 post
3 stories
2 highlights
4K followers guaranteed

Gold: €90
3 posts
4 stories
3 highlights
7K followers guaranteed

Diamond: €120
5 posts
8 stories
7 highlights
10K followers guaranteed

Payment methods:
PayPal
IBAN
Revolut
MB WAY
Credit/Debit Card

There is a 12% payment fee.

Be short, natural and friendly.
Reply in the client's language.
Never invent prices.
Never invent payment details.
Never change the fixed messages.

Conversation:
${history}

Customer:
${clientMessage || "[media]"}

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

          body:
            JSON.stringify({

              model:
                OPENAI_MODEL,

              instructions:
                "Answer only the customer's question. Do not replace any fixed sales message.",

              input:
                prompt,

              max_output_tokens:
                300
            })
        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      console.error(
        "OpenAI reply error:",
        data
      );

      return "Of course ❤️ How can I help you?";
    }


    const reply =
      extractOpenAIText(
        data
      ).trim();


    return (
      reply ||
      "Of course ❤️ How can I help you?"
    );

  } catch (error) {

    console.error(
      "OpenAI error:",
      error
    );

    return "Of course ❤️ How can I help you?";
  }
}


/* =========================================================
   SEND INSTAGRAM MESSAGE
========================================================= */

async function sendInstagramMessage(
  recipientId,
  text
) {

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

          "Authorization":
            `Bearer ${PAGE_ACCESS_TOKEN}`
        },

        body:
          JSON.stringify({

            recipient: {
              id: recipientId
            },

            message: {
              text: text
            }
          })
      }
    );


  const data =
    await response.json();


  if (!response.ok) {

    console.error(
      "Instagram API error:",
      data
    );

    throw new Error(
      "Instagram message could not be sent"
    );
  }


  console.log(
    "Instagram reply sent successfully"
  );

  console.log(
    JSON.stringify(
      data,
      null,
      2
    )
  );


  return data;
    }
/* =========================================================
   REMINDER SYSTEM
========================================================= */

const outgoingMessages =
  new Map();


function cancelReminder(
  senderId
) {

  const conversation =
    getConversation(
      senderId
    );

  if (
    conversation.reminderTimer
  ) {

    clearTimeout(
      conversation.reminderTimer
    );

    conversation.reminderTimer =
      null;
  }
}


function createReminder(
  senderId,
  messageId,
  reminderText,
  stage
) {

  const conversation =
    getConversation(
      senderId
    );


  cancelReminder(
    senderId
  );


  conversation.reminderTimer =
    setTimeout(
      async () => {

        conversation.reminderTimer =
          null;


        /*
          Do not send reminder if:
          - human has taken over
          - client has replied
          - conversation moved to another stage
          - another outgoing message replaced this one
        */

        if (
          conversation.humanMode
        ) {
          return;
        }


        if (
          conversation.clientReplied
        ) {
          return;
        }


        if (
          conversation.lastOutgoingMessageId !==
          messageId
        ) {
          return;
        }


        if (
          conversation.stage !==
          stage
        ) {
          return;
        }


        try {

          console.log(
            "Sending 2-minute reminder:",
            senderId
          );


          await wait(
            getRandomDelay()
          );


          await sendInstagramMessage(
            senderId,
            reminderText
          );


          saveMessage(
            conversation,
            "assistant",
            reminderText
          );


          console.log(
            "Reminder sent successfully"
          );

        } catch (error) {

          console.error(
            "Reminder error:",
            error
          );
        }

      },

      2 * 60 * 1000
    );
}


/* =========================================================
   TRACK OUTGOING MESSAGE
========================================================= */

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
    data.message_id ||
    data.id ||
    null;


  conversation.lastOutgoingMessageId =
    messageId;

  conversation.lastOutgoingStage =
    stage;


  saveMessage(
    conversation,
    "assistant",
    text
  );


  if (
    messageId
  ) {

    outgoingMessages.set(
      messageId,
      {
        senderId,
        stage,
        text,
        createdAt:
          Date.now()
      }
    );

  } else {

    console.log(
      "Warning: Instagram did not return a message ID. Read reminder may not be possible."
    );
  }


  return data;
}


/* =========================================================
   FIXED REMINDER TEXT
========================================================= */

function getReminderText(
  stage
) {

  if (
    stage ===
    "OPENING_SENT"
  ) {

    return "Are you interested? ❤️";
  }


  if (
    stage ===
    "PROMOTION_SENT"
  ) {

    return "Can I show you our packages? ❤️";
  }


  if (
    stage ===
    "PACKAGES_SHOWN"
  ) {

    return "So which package would you like to choose? ❤️";
  }


  if (
    stage ===
    "PAYMENT_PENDING"
  ) {

    return "Which mode of payment do you have? ❤️";
  }


  return null;
}


/* =========================================================
   PROCESS CLIENT MESSAGE
========================================================= */

async function processClientMessage(
  senderId,
  clientMessage,
  attachmentInfo
) {

  const conversation =
    getConversation(
      senderId
    );


  /*
    HUMAN HANDOVER
  */

  if (
    conversation.humanMode
  ) {

    console.log(
      "Human mode active. AI skipped:",
      senderId
    );

    return;
  }


  /*
    Client replied.
    Cancel any pending reminder.
  */

  conversation.clientReplied =
    true;

  cancelReminder(
    senderId
  );


  saveMessage(
    conversation,
    "client",
    clientMessage ||
      "[media]"
  );


  let reply = null;


  /* =======================================================
     NEW CLIENT
     FIRST MESSAGE IS ALWAYS FIXED MESSAGE ONE
  ======================================================= */

  if (
    conversation.stage ===
    "NEW"
  ) {

    conversation.stage =
      "OPENING_SENT";

    reply =
      MESSAGE_ONE;
  }


  /* =======================================================
     CLIENT REPLIED TO MESSAGE ONE
     ALWAYS SEND FIXED MESSAGE TWO
  ======================================================= */

  else if (
    conversation.stage ===
    "OPENING_SENT"
  ) {

    conversation.stage =
      "PROMOTION_SENT";

    reply =
      MESSAGE_TWO;
  }


  /* =======================================================
     CLIENT REPLIED TO MESSAGE TWO
     ALWAYS SEND PACKAGES
  ======================================================= */

  else if (
    conversation.stage ===
    "PROMOTION_SENT"
  ) {

    conversation.stage =
      "PACKAGES_SHOWN";

    reply =
      PACKAGES_MESSAGE;
  }


  /* =======================================================
     PACKAGE SCREEN
  ======================================================= */

  else if (
    conversation.stage ===
    "PACKAGES_SHOWN"
  ) {

    const result =
      await classifyMessage(
        conversation,
        clientMessage,
        attachmentInfo
      );


    if (
      result.action ===
      "PACKAGE_SELECTED" &&
      result.package &&
      PACKAGES[
        result.package
      ]
    ) {

      conversation.selectedPackage =
        result.package;


      conversation.stage =
        "PACKAGE_SELECTED";


      const selected =
        PACKAGES[
          result.package
        ];


      const payment =
        calculatePayment(
          result.package
        );


      reply =
`Perfect ❤️ You've selected our ${selected.name} package.

Package price: €${payment.price}

12% payment fee: €${payment.fee.toFixed(2)}

Total: €${payment.total.toFixed(2)}

${selected.details}
${selected.followers}

How would you like to pay? ❤️

PayPal
IBAN
Revolut
MB WAY
Credit/Debit Card`;

    } else {

      /*
        If the client asks a normal question
        about the package, AI may answer.
      */

      reply =
        await getAIReply(
          conversation,
          clientMessage,
          attachmentInfo
        );
    }
  }


  /* =======================================================
     PACKAGE SELECTED
     WAITING FOR PAYMENT METHOD
  ======================================================= */

  else if (
    conversation.stage ===
    "PACKAGE_SELECTED"
  ) {

    const result =
      await classifyMessage(
        conversation,
        clientMessage,
        attachmentInfo
      );


    if (
      result.action ===
        "PAYMENT" &&
      result.payment &&
      PAYMENT_METHODS.includes(
        result.payment
      )
    ) {

      conversation.paymentMethod =
        result.payment;


      conversation.stage =
        "PAYMENT_PENDING";


      reply =
        buildPaymentMessage(
          conversation.selectedPackage,
          result.payment
        );

    } else {

      reply =
        await getAIReply(
          conversation,
          clientMessage,
          attachmentInfo
        );
    }
  }


  /* =======================================================
     PAYMENT PENDING
  ======================================================= */

  else if (
    conversation.stage ===
    "PAYMENT_PENDING"
  ) {

    const result =
      await classifyMessage(
        conversation,
        clientMessage,
        attachmentInfo
      );


    if (
      result.action ===
      "PAYMENT_PROOF"
    ) {

      reply =
`Thank you ❤️

Please allow our team to verify your payment.

We will confirm it with you shortly.`;

    } else {

      reply =
        await getAIReply(
          conversation,
          clientMessage,
          attachmentInfo
        );
    }
  }


  /* =======================================================
     FALLBACK
  ======================================================= */

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
      "Of course ❤️ How can I help you?";
  }


  conversation.clientReplied =
    false;


  /*
    10–12 second human-like delay
  */

  await wait(
    getRandomDelay()
  );


  /*
    Human mode could have been activated
    while AI was waiting.
  */

  if (
    conversation.humanMode
  ) {

    console.log(
      "Human mode activated during delay. Message cancelled."
    );

    return;
  }


  return sendTrackedMessage(
    senderId,
    reply,
    conversation,
    conversation.stage
  );
}


/* =========================================================
   WEBHOOK VERIFICATION
========================================================= */

app.get(
  "/webhook",
  (req, res) => {

    const mode =
      req.query[
        "hub.mode"
      ];

    const token =
      req.query[
        "hub.verify_token"
      ];

    const challenge =
      req.query[
        "hub.challenge"
      ];


    if (
      mode ===
        "subscribe" &&
      token ===
        VERIFY_TOKEN
    ) {

      console.log(
        "Webhook verification successful"
      );

      return res
        .status(200)
        .send(challenge);
    }


    console.log(
      "Webhook verification failed"
    );


    return res.sendStatus(
      403
    );
  }
);


/* =========================================================
   INSTAGRAM WEBHOOK
========================================================= */

const processedMessageIds =
  new Set();


app.post(
  "/webhook",
  async (req, res) => {

    /*
      Respond to Meta immediately.
    */

    res.sendStatus(
      200
    );


    const body =
      req.body;


    console.log(
      "================================="
    );

    console.log(
      "INSTAGRAM WEBHOOK RECEIVED"
    );

    console.log(
      "================================="
    );


    console.log(
      JSON.stringify(
        body,
        null,
        2
      )
    );


    if (
      body.object !==
      "instagram"
    ) {
      return;
    }


    if (
      !Array.isArray(
        body.entry
      )
    ) {
      return;
    }


    for (
      const entry of
      body.entry
    ) {

      console.log(
        "Instagram Account ID:",
        entry.id
      );


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


        /* =================================================
           READ / SEEN EVENT
        ================================================= */

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


          if (
            !outgoing
          ) {
            continue;
          }


          const conversation =
            getConversation(
              outgoing.senderId
            );


          /*
            Only create reminder for
            the latest outgoing message.
          */

          if (
            conversation.lastOutgoingMessageId !==
            messageId
          ) {
            continue;
          }


          if (
            conversation.clientReplied
          ) {
            continue;
          }


          if (
            conversation.humanMode
          ) {
            continue;
          }


          const reminderText =
            getReminderText(
              outgoing.stage
            );


          if (
            reminderText
          ) {

            createReminder(
              outgoing.senderId,
              messageId,
              reminderText,
              outgoing.stage
            );

            console.log(
              "2-minute reminder scheduled:",
              outgoing.senderId,
              outgoing.stage
            );
          }


          continue;
        }


        /* =================================================
           IGNORE NON-MESSAGE EVENTS
        ================================================= */

        if (
          !event.message
        ) {
          continue;
        }


        const senderId =
          event.sender?.id;


        const recipientId =
          event.recipient?.id;


        const messageId =
          event.message?.mid;


        if (
          !senderId
        ) {
          continue;
        }


        /*
          Never process our own messages.
        */

        if (
          senderId ===
          INSTAGRAM_USER_ID
        ) {
          continue;
        }


        /* =================================================
           DUPLICATE MESSAGE PROTECTION
        ================================================= */

        if (
          messageId
        ) {

          if (
            processedMessageIds.has(
              messageId
            )
          ) {

            console.log(
              "Duplicate message ignored:",
              messageId
            );

            continue;
          }


          processedMessageIds.add(
            messageId
          );


          setTimeout(
            () => {

              processedMessageIds.delete(
                messageId
              );

            },
            10 * 60 * 1000
          );
        }


        const clientMessage =
          event.message?.text ||
          "";


        const attachmentInfo =
          getAttachmentInfo(
            event.message
          );


        console.log(
          "----- CLIENT MESSAGE -----"
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
          "Message:",
          clientMessage
        );

        console.log(
          "Attachment:",
          attachmentInfo
        );


        /*
          Ignore only if there is
          absolutely nothing to process.
        */

        if (
          !clientMessage &&
          !attachmentInfo
        ) {

          console.log(
            "Empty message ignored."
          );

          continue;
        }


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


/* =========================================================
   HUMAN HANDOVER
========================================================= */

/*
  POST /human/SENDER_ID

  Header:
  x-admin-secret: YOUR_ADMIN_SECRET

  This stops AI for that particular chat.
*/

app.post(
  "/human/:senderId",
  (req, res) => {

    if (
      !ADMIN_SECRET ||
      req.headers[
        "x-admin-secret"
      ] !== ADMIN_SECRET
    ) {

      return res.sendStatus(
        403
      );
    }


    const senderId =
      req.params.senderId;


    const conversation =
      getConversation(
        senderId
      );


    conversation.humanMode =
      true;


    conversation.clientReplied =
      true;


    cancelReminder(
      senderId
    );


    res.json({
      success: true,
      senderId,
      humanMode: true
    });
  }
);


/*
  POST /ai/SENDER_ID

  Turns AI back on.
*/

app.post(
  "/ai/:senderId",
  (req, res) => {

    if (
      !ADMIN_SECRET ||
      req.headers[
        "x-admin-secret"
      ] !== ADMIN_SECRET
    ) {

      return res.sendStatus(
        403
      );
    }


    const senderId =
      req.params.senderId;


    const conversation =
      getConversation(
        senderId
      );


    conversation.humanMode =
      false;


    conversation.clientReplied =
      false;


    res.json({
      success: true,
      senderId,
      humanMode: false
    });
  }
);


/* =========================================================
   HOME
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
   HEALTH
========================================================= */

app.get(
  "/health",
  (req, res) => {

    res.json({

      status:
        "ok",

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
        conversations.size,

      aiModel:
        OPENAI_MODEL

    });
  }
);


/* =========================================================
   AUTH CALLBACK
========================================================= */

app.get(
  "/auth/callback",
  (req, res) => {

    const code =
      req.query.code;


    if (!code) {

      return res
        .status(400)
        .send(
          "Missing authorization code"
        );
    }


    res.send(
      "Instagram authorization successful"
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
      `Server running on port ${PORT}`
    );

    console.log(
      "Instagram User ID:",
      INSTAGRAM_USER_ID
    );

    console.log(
      "OpenAI model:",
      OPENAI_MODEL
    );
  }
);
