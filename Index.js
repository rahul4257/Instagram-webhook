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
   AI NEVER CHANGES THESE
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
   GUARANTEE MESSAGE
========================================================= */

const FOLLOWER_GUARANTEE_MESSAGE =
`Yes ❤️ The followers are guaranteed because we upload your content on our pages and continue the promotion until you receive the followers included in your package.

If you don't gain the guaranteed followers, the amount will be refunded according to our guarantee policy. ❤️`;


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
   PAYMENT METHODS
========================================================= */

const PAYMENT_METHODS = [
  "paypal",
  "iban",
  "revolut",
  "mbway",
  "card"
];


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
   PAYMENT FEE
========================================================= */

const PAYMENT_FEE_PERCENT =
  12;


function calculatePayment(
  packageKey
) {

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
    ) / 100;

  const total =
    Math.round(
      (price + fee) *
      100
    ) / 100;

  return {
    price,
    fee,
    total
  };
}


/* =========================================================
   BUILD PAYMENT MESSAGE
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
    calculatePayment(
      packageKey
    );

  let details = "";


  if (
    paymentMethod ===
    "paypal"
  ) {

    details =
      PAYPAL_DETAILS;

  }


  else if (
    paymentMethod ===
    "iban"
  ) {

    details =
      IBAN_DETAILS;

  }


  else if (
    paymentMethod ===
    "mbway"
  ) {

    details =
      MBWAY_DETAILS;

  }


  else if (
    paymentMethod ===
    "revolut"
  ) {

    details =
      REVOLUT_DETAILS;

  }


  else if (
    paymentMethod ===
    "card"
  ) {

    details =
`Our team will assist you with the Credit/Debit Card payment ❤️`;

  }


  return (
`Perfect ❤️

Package: ${selected.name}

Package price: €${payment.price.toFixed(2)}

12% payment fee: €${payment.fee.toFixed(2)}

Total: €${payment.total.toFixed(2)}

Payment method: ${paymentMethod.toUpperCase()}

${details}

After successful payment, please send us your payment screenshot ❤️`
  );
}


/* =========================================================
   CONVERSATIONS
========================================================= */

/*
   IMPORTANT:

   Each Instagram sender ID gets its own conversation.

   The stage is the MAIN protection against sending
   MESSAGE_ONE again.

   NEW
      ↓
   OPENING_SENT
      ↓
   PROMOTION_SENT
      ↓
   PACKAGES_SHOWN
      ↓
   PACKAGE_SELECTED
      ↓
   PAYMENT_PENDING
*/

const conversations =
  new Map();


function createNewConversation() {

  return {

    stage:
      "NEW",

    history:
      [],

    selectedPackage:
      null,

    paymentMethod:
      null,

    lastOutgoingMessageId:
      null,

    lastOutgoingStage:
      null,

    reminderTimer:
      null,

    humanMode:
      false,

    /*
      This means the client has replied
      at least once during the current
      conversation.
    */
    clientReplied:
      false

  };
}


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
      createNewConversation()
    );

    console.log(
      "Created NEW conversation for:",
      senderId
    );
  }


  return conversations.get(
    senderId
  );
}


/* =========================================================
   SAVE MESSAGE
========================================================= */

function saveMessage(
  conversation,
  role,
  text
) {

  conversation.history.push({

    role,

    text,

    timestamp:
      new Date().toISOString()

  });


  if (
    conversation.history.length >
    40
  ) {

    conversation.history =
      conversation.history.slice(
        -40
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
   CLIENT QUEUE
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

  });
}


/* =========================================================
   DUPLICATE MESSAGE PROTECTION
========================================================= */

const processedMessageIds =
  new Set();


/* =========================================================
   OUTGOING MESSAGE STORAGE
========================================================= */

const outgoingMessages =
  new Map();


/* =========================================================
   NORMALIZE TEXT
========================================================= */

function normalizeText(
  text
) {

  return (
    text ||
    ""
  )
    .toLowerCase()
    .trim()
    .replace(
      /[.,!?]/g,
      " "
    )
    .replace(
      /\s+/g,
      " "
    );
     }
/* =========================================================
   PACKAGE DETECTION
========================================================= */

function detectPackageSelection(
  text,
  conversation
) {

  if (
    conversation.stage !==
    "PACKAGES_SHOWN"
  ) {

    return null;
  }


  const t =
    normalizeText(text);


  if (
    t === "1" ||
    t === "1st" ||
    t === "first" ||
    t === "first package" ||
    t === "package 1" ||
    t === "package one" ||
    t === "option 1" ||
    t === "option one" ||
    /\bbronze\b/.test(t)
  ) {

    return "bronze";
  }


  if (
    t === "2" ||
    t === "2nd" ||
    t === "second" ||
    t === "second package" ||
    t === "package 2" ||
    t === "package two" ||
    t === "option 2" ||
    t === "option two" ||
    /\bsilver\b/.test(t)
  ) {

    return "silver";
  }


  if (
    t === "3" ||
    t === "3rd" ||
    t === "third" ||
    t === "third package" ||
    t === "package 3" ||
    t === "package three" ||
    t === "option 3" ||
    t === "option three" ||
    /\bgold\b/.test(t)
  ) {

    return "gold";
  }


  if (
    t === "4" ||
    t === "4th" ||
    t === "fourth" ||
    t === "fourth package" ||
    t === "package 4" ||
    t === "package four" ||
    t === "option 4" ||
    t === "option four" ||
    /\bdiamond\b/.test(t)
  ) {

    return "diamond";
  }


  return null;
}


/* =========================================================
   PAYMENT DETECTION
========================================================= */

function detectPaymentMethod(
  text
) {

  const t =
    normalizeText(text);


  if (
    /\bpaypal\b/.test(t)
  ) {

    return "paypal";
  }


  if (
    /\biban\b/.test(t) ||
    /\bwise\b/.test(t) ||
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
    /\bmb\s*way\b/.test(t) ||
    /\bmbway\b/.test(t)
  ) {

    return "mbway";
  }


  if (
    /\bcredit\s*card\b/.test(t) ||
    /\bdebit\s*card\b/.test(t) ||
    /\bcard\b/.test(t)
  ) {

    return "card";
  }


  return null;
}


/* =========================================================
   GUARANTEE DETECTION
========================================================= */

function isGuaranteeQuestion(
  text
) {

  const t =
    normalizeText(text);


  return (

    /\bguarantee\b/.test(t) ||

    /\bguaranteed\b/.test(t) ||

    /\brefund\b/.test(t) ||

    /\brefunded\b/.test(t) ||

    /\bwhat if.*followers\b/.test(t) ||

    /\bhow.*followers.*guarantee\b/.test(t) ||

    /\bhow.*guarantee.*followers\b/.test(t) ||

    /\bwhy.*guaranteed\b/.test(t)

  );
}


/* =========================================================
   POSITIVE / INTEREST DETECTION
========================================================= */

function isPositiveInterest(
  text
) {

  const t =
    normalizeText(text);


  return (

    t === "yes" ||
    t === "yeah" ||
    t === "yep" ||
    t === "sure" ||
    t === "okay" ||
    t === "ok" ||
    t === "yes please" ||
    t === "sure show me" ||
    t === "show me" ||
    t === "interested" ||
    t === "i am interested" ||
    t === "im interested" ||
    t === "interested yes"

  );
}


/* =========================================================
   NEGATIVE DETECTION
========================================================= */

function isNegative(
  text
) {

  const t =
    normalizeText(text);


  return (

    t === "no" ||
    t === "no thanks" ||
    t === "not interested" ||
    t === "im not interested" ||
    t === "i am not interested" ||
    /\bnot interested\b/.test(t)

  );
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

    return data.output_text.trim();
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

  const parts =
    [];


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
      `shared=${JSON.stringify(
        message.share
      )}`
    );
  }


  return parts.join(
    "\n"
  );
}


/* =========================================================
   OPENAI CLASSIFIER
========================================================= */

async function classifyMessage(
  conversation,
  clientMessage,
  attachmentInfo
) {

  if (!OPEN_AI) {

    return {
      action: "NO_REPLY",
      package: null,
      payment: null
    };
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
`You are the classification brain for a sales assistant.

DO NOT write a customer reply.

Return ONLY JSON.

The system already controls the exact sales messages.

Possible actions:

PACKAGE_SELECTED
PAYMENT
FOLLOWER_GUARANTEE
AI_REPLY
NO_REPLY
PAYMENT_PROOF
NEGATIVE
LATER
THINK

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

PACKAGE_SELECTED:
Use when the customer clearly chooses a package.

PAYMENT:
Use when the customer chooses a payment method.

FOLLOWER_GUARANTEE:
Use when the customer asks how followers are guaranteed,
whether followers are guaranteed,
what happens if they do not receive the guaranteed followers,
or asks about refund/guarantee.

PAYMENT_PROOF:
Use when the customer says they paid or sends payment proof.

AI_REPLY:
Use only for a genuine customer question that requires an answer.

NO_REPLY:
Use when the meaning is unclear or you are not confident.

Do not invent package names.
Do not invent payment methods.

Conversation stage:
${conversation.stage}

Conversation:
${history}

Latest customer message:
${clientMessage || "[media]"}

Attachment:
${attachmentInfo || "none"}

Return exactly this structure:

{
  "action": "NO_REPLY",
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
                    "instagram_message_classification",

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
                          "PACKAGE_SELECTED",
                          "PAYMENT",
                          "FOLLOWER_GUARANTEE",
                          "AI_REPLY",
                          "NO_REPLY",
                          "PAYMENT_PROOF",
                          "NEGATIVE",
                          "LATER",
                          "THINK"
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
        "OpenAI classifier error:",
        data
      );

      return {
        action: "NO_REPLY",
        package: null,
        payment: null
      };
    }

    const text =
      extractOpenAIText(data);

    if (!text) {

      return {
        action: "NO_REPLY",
        package: null,
        payment: null
      };
    }

    try {

      const result =
        JSON.parse(text);

      return {

        action:
          result.action ||
          "NO_REPLY",

        package:
          result.package ||
          null,

        payment:
          result.payment ||
          null

      };

    } catch (error) {

      console.error(
        "Classifier JSON error:",
        text
      );

      return {
        action: "NO_REPLY",
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
      action: "NO_REPLY",
      package: null,
      payment: null
    };
  }
       }
/* =========================================================
   AI REPLY
   ONLY USED FOR GENUINE CUSTOMER QUESTIONS
========================================================= */

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
      .slice(-15)
      .map(
        item =>
          `${item.role}: ${item.text}`
      )
      .join("\n");

  const prompt =
`You are a customer support assistant for Global Promote.

IMPORTANT:
You are NOT responsible for the fixed sales messages.

The system already sends:
- Message 1
- Message 2
- Packages
- Package confirmation
- Payment question
- Payment details
- Reminder messages

Do not replace or rewrite those messages.

Only answer the customer's genuine question.

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

Rules:
- Be short and natural.
- Reply in the customer's language.
- Read the conversation history before answering.
- Continue the conversation instead of starting it again.
- Do not send the opening greeting again.
- Do not invent information.
- Do not change prices.
- Do not invent payment details.
- Do not make promises not provided by the business.
- If you are not confident, return exactly NO_REPLY.
- Do not send greetings when the customer asked a specific question.

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
          method:
            "POST",

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
        "OpenAI reply error:",
        data
      );

      return null;
    }


    const reply =
      extractOpenAIText(
        data
      ).trim();


    if (
      !reply ||
      reply === "NO_REPLY"
    ) {

      return null;
    }


    return reply;

  } catch (
    error
  ) {

    console.error(
      "AI reply error:",
      error
    );

    return null;
  }
}


/* =========================================================
   SEND INSTAGRAM MESSAGE
========================================================= */

async function sendInstagramMessage(
  recipientId,
  text
) {

  if (!PAGE_ACCESS_TOKEN) {

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
        method:
          "POST",

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


  if (
    !response.ok
  ) {

    console.error(
      "Instagram API error:",
      data
    );

    throw new Error(
      "Instagram message failed"
    );
  }


  console.log(
    "Instagram message sent successfully"
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


function getReminderText(
  stage
) {

  if (
    stage ===
    "OPENING_SENT"
  ) {

    return (
      "Are you interested? ❤️"
    );
  }


  if (
    stage ===
    "PROMOTION_SENT"
  ) {

    return (
      "Can I show you our packages? ❤️"
    );
  }


  if (
    stage ===
    "PACKAGES_SHOWN"
  ) {

    return (
      "So which package would you like to choose? ❤️"
    );
  }


  if (
    stage ===
    "PACKAGE_SELECTED"
  ) {

    return (
      "Which mode of payment do you have? ❤️"
    );
  }


  return null;
}


function scheduleReminder(
  senderId,
  messageId,
  stage
) {

  const conversation =
    getConversation(
      senderId
    );


  cancelReminder(
    senderId
  );


  const reminderText =
    getReminderText(
      stage
    );


  if (
    !reminderText
  ) {

    return;
  }


  conversation.reminderTimer =
    setTimeout(
      async () => {

        conversation.reminderTimer =
          null;


        /*
          If another outgoing message
          has already been sent, reminder
          is no longer valid.
        */

        if (
          conversation.lastOutgoingMessageId !==
          messageId
        ) {

          return;
        }


        /*
          If human mode is active,
          never send reminder.
        */

        if (
          conversation.humanMode
        ) {

          return;
        }


        /*
          If client has replied,
          NEVER send reminder.
        */

        if (
          conversation.clientReplied
        ) {

          return;
        }


        try {

          console.log(
            "Sending 2-minute reminder:"
          );


          console.log(
            reminderText
          );


          await wait(
            getRandomDelay()
          );


          /*
            Check again after delay.
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
            "Reminder sent."
          );


        } catch (
          error
        ) {

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
   SEND REPLY SAFELY
========================================================= */

async function sendReplySafely(
  senderId,
  conversation,
  reply
) {

  if (
    !reply
  ) {

    return null;
  }


  if (
    conversation.humanMode
  ) {

    console.log(
      "Human mode activated before sending."
    );

    return null;
  }


  /*
    Wait 10–12 seconds.
  */

  const delay =
    getRandomDelay();


  console.log(
    `Waiting ${Math.round(
      delay / 1000
    )} seconds before reply`
  );


  await wait(
    delay
  );


  /*
    Check human mode again.
  */

  if (
    conversation.humanMode
  ) {

    console.log(
      "Human mode activated during delay. Reply cancelled."
    );

    return null;
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


  const outgoingMessageId =
    data?.message_id ||
    data?.id ||
    null;


  if (
    outgoingMessageId
  ) {

    conversation.lastOutgoingMessageId =
      outgoingMessageId;

    conversation.lastOutgoingStage =
      conversation.stage;


    outgoingMessages.set(
      outgoingMessageId,
      {
        senderId,
        stage:
          conversation.stage
      }
    );
  }


  console.log(
    "Reply sent successfully."
  );


  console.log(
    "Stage:",
    conversation.stage
  );


  console.log(
    "Package:",
    conversation.selectedPackage
  );


  console.log(
    "Payment:",
    conversation.paymentMethod
  );


  return data;
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


  /* =======================================================
     HUMAN HANDOVER
  ======================================================= */

  if (
    conversation.humanMode
  ) {

    console.log(
      "Human mode active. AI will not reply."
    );

    return;
  }


  /* =======================================================
     CLIENT REPLIED
  ======================================================= */

  /*
    IMPORTANT:

    The moment the client sends a message,
    mark the conversation as replied.

    This also cancels any pending reminder.
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


  console.log(
    "Client replied."
  );


  console.log(
    "Current conversation stage:",
    conversation.stage
  );


  let reply = null;


  /* =======================================================
     NEW CLIENT
  ======================================================= */

  if (
    conversation.stage ===
    "NEW"
  ) {

    /*
      This is the ONLY place where MESSAGE_ONE
      can be selected.

      Once MESSAGE_ONE is sent,
      stage changes to OPENING_SENT.

      Therefore this client cannot receive
      MESSAGE_ONE again unless the conversation
      is actually NEW.
    */

    conversation.stage =
      "OPENING_SENT";


    reply =
      MESSAGE_ONE;


    console.log(
      "NEW conversation detected."
    );


    console.log(
      "Sending MESSAGE_ONE."
    );

  }


  /* =======================================================
     CLIENT REPLIED TO MESSAGE ONE
  ======================================================= */

  else if (
    conversation.stage ===
    "OPENING_SENT"
  ) {

    /*
      NEVER send MESSAGE_ONE here.

      The client already received it.
      Continue the conversation.
    */

    console.log(
      "Existing conversation: OPENING_SENT."
    );


    if (
      isGuaranteeQuestion(
        clientMessage
      )
    ) {

      reply =
        FOLLOWER_GUARANTEE_MESSAGE;

    }


    else if (
      isNegative(
        clientMessage
      )
    ) {

      reply =
`No problem ❤️ If you ever change your mind, just message us and we'll be happy to help.`;

    }


    else {

      conversation.stage =
        "PROMOTION_SENT";


      reply =
        MESSAGE_TWO;

    }

  }


  /* =======================================================
     PROMOTION SENT
  ======================================================= */

  else if (
    conversation.stage ===
    "PROMOTION_SENT"
  ) {

    /*
      Client has already received MESSAGE_TWO.

      If they now ask for packages,
      show PACKAGES_MESSAGE.

      Otherwise let the classifier decide.
    */

    const normalized =
      normalizeText(
        clientMessage
      );


    const asksForPackages =
      normalized.includes(
        "package"
      ) ||
      normalized.includes(
        "packages"
      ) ||
      normalized.includes(
        "price"
      ) ||
      normalized.includes(
        "prices"
      ) ||
      normalized.includes(
        "pricing"
      ) ||
      normalized.includes(
        "show me"
      ) ||
      normalized.includes(
        "send me"
      ) ||
      isPositiveInterest(
        clientMessage
      );


    if (
      asksForPackages
    ) {

      conversation.stage =
        "PACKAGES_SHOWN";


      reply =
        PACKAGES_MESSAGE;

    }


    else if (
      isGuaranteeQuestion(
        clientMessage
      )
    ) {

      reply =
        FOLLOWER_GUARANTEE_MESSAGE;

    }


    else if (
      isNegative(
        clientMessage
      )
    ) {

      reply =
`No problem ❤️ If you ever change your mind, just message us.`;

    }


    else {

      const result =
        await classifyMessage(
          conversation,
          clientMessage,
          attachmentInfo
        );


      if (
        result.action ===
        "AI_REPLY"
      ) {

        reply =
          await getAIReply(
            conversation,
            clientMessage,
            attachmentInfo
          );

      }


      else if (
        result.action ===
        "FOLLOWER_GUARANTEE"
      ) {

        reply =
          FOLLOWER_GUARANTEE_MESSAGE;

      }


      else if (
        result.action ===
        "NEGATIVE"
      ) {

        reply =
`No problem ❤️ If you ever change your mind, just message us.`;

      }


      else if (
        result.action ===
        "LATER"
      ) {

        reply =
`Of course ❤️ Take your time. Just message us whenever you're ready.`;

      }


      else if (
        result.action ===
        "THINK"
      ) {

        reply =
`Of course ❤️ Take your time. If you have any questions, just ask me.`;

      }

    }

  }


  /* =======================================================
     PACKAGES ARE SHOWN
  ======================================================= */

  else if (
    conversation.stage ===
    "PACKAGES_SHOWN"
  ) {

    const packageKey =
      detectPackageSelection(
        clientMessage,
        conversation
      );


    if (
      packageKey
    ) {

      conversation.selectedPackage =
        packageKey;


      conversation.stage =
        "PACKAGE_SELECTED";


      const selected =
        PACKAGES[
          packageKey
        ];


      reply =
`Perfect ❤️ You've selected our ${selected.name} package.

Package price: €${selected.price.toFixed(2)}

${selected.details}
${selected.followers}

How would you like to pay? ❤️

PayPal
IBAN
Revolut
MB WAY
Credit/Debit Card`;

    }


    else {

      const result =
        await classifyMessage(
          conversation,
          clientMessage,
          attachmentInfo
        );


      if (
        result.action ===
        "FOLLOWER_GUARANTEE"
      ) {

        reply =
          FOLLOWER_GUARANTEE_MESSAGE;

      }


      else if (
        result.action ===
          "PACKAGE_SELECTED" &&
        result.package &&
        PACKAGES[
          result.package
        ]
      ) {

        const key =
          result.package;


        conversation.selectedPackage =
          key;


        conversation.stage =
          "PACKAGE_SELECTED";


        const selected =
          PACKAGES[key];


        reply =
`Perfect ❤️ You've selected our ${selected.name} package.

Package price: €${selected.price.toFixed(2)}

${selected.details}
${selected.followers}

How would you like to pay? ❤️

PayPal
IBAN
Revolut
MB WAY
Credit/Debit Card`;

      }


      else if (
        result.action ===
        "AI_REPLY"
      ) {

        reply =
          await getAIReply(
            conversation,
            clientMessage,
            attachmentInfo
          );

      }


      else if (
        result.action ===
        "NEGATIVE"
      ) {

        reply =
`No problem ❤️ If you ever change your mind, just message us.`;

      }


      else if (
        result.action ===
        "LATER"
      ) {

        reply =
`Of course ❤️ Take your time. Just message us whenever you're ready.`;

      }


      else if (
        result.action ===
        "THINK"
      ) {

        reply =
`Of course ❤️ Take your time. If you have any questions, just ask me.`;

      }

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

    const paymentMethod =
      detectPaymentMethod(
        clientMessage
      );


    if (
      paymentMethod
    ) {

      conversation.paymentMethod =
        paymentMethod;


      conversation.stage =
        "PAYMENT_PENDING";


      reply =
        buildPaymentMessage(
          conversation.selectedPackage,
          paymentMethod
        );

    }


    else if (
      isGuaranteeQuestion(
        clientMessage
      )
    ) {

      reply =
        FOLLOWER_GUARANTEE_MESSAGE;

    }


    else {

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

      }


      else if (
        result.action ===
        "FOLLOWER_GUARANTEE"
      ) {

        reply =
          FOLLOWER_GUARANTEE_MESSAGE;

      }


      else if (
        result.action ===
        "AI_REPLY"
      ) {

        reply =
          await getAIReply(
            conversation,
            clientMessage,
            attachmentInfo
          );

      }

    }

  }


  /* =======================================================
     PAYMENT PENDING
  ======================================================= */

  else if (
    conversation.stage ===
    "PAYMENT_PENDING"
  ) {

    if (
      isGuaranteeQuestion(
        clientMessage
      )
    ) {

      reply =
        FOLLOWER_GUARANTEE_MESSAGE;

    }


    else {

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

We will verify the payment and our team will confirm it with you shortly.`;

      }


      else if (
        result.action ===
        "AI_REPLY"
      ) {

        reply =
          await getAIReply(
            conversation,
            clientMessage,
            attachmentInfo
          );

      }

    }

  }


  /* =======================================================
     NO REPLY
  ======================================================= */

  if (
    !reply
  ) {

    console.log(
      "No confident response. Nothing sent."
    );

    /*
      IMPORTANT:

      We do NOT reset the conversation stage.

      The client is still in the same conversation.
    */

    return;
  }


  /* =======================================================
     SEND REPLY
  ======================================================= */

  const data =
    await sendReplySafely(
      senderId,
      conversation,
      reply
    );


  if (
    !data
  ) {

    return;
  }


  /*
    IMPORTANT:

    DO NOT reset conversation.clientReplied
    to false here.

    It remains TRUE because the client has
    already replied.

    The conversation stage is what determines
    what happens next.
  */

  conversation.clientReplied =
    true;


  console.log(
    "Conversation remains active."
  );


  console.log(
    "Client replied flag:",
    conversation.clientReplied
  );


  console.log(
    "Final stage:",
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
        "Webhook verified."
      );


      return res
        .status(200)
        .send(
          challenge
        );
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
  async (
    req,
    res
  ) => {

    /*
      Acknowledge Meta immediately.
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


          if (
            conversation.lastOutgoingMessageId !==
            messageId
          ) {

            continue;
          }


          if (
            conversation.humanMode
          ) {

            continue;
          }


          /*
            NEVER schedule a reminder if
            the client has already replied.
          */

          if (
            conversation.clientReplied
          ) {

            console.log(
              "Client already replied. Reminder not scheduled."
            );

            continue;
          }


          const reminderText =
            getReminderText(
              outgoing.stage
            );


          if (
            reminderText
          ) {

            scheduleReminder(
              outgoing.senderId,
              messageId,
              outgoing.stage
            );


            console.log(
              "Reminder scheduled:",
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
          Ignore our own messages.
        */

        if (
          senderId ===
          INSTAGRAM_USER_ID
        ) {

          continue;
        }


        /* =================================================
           DUPLICATE PROTECTION
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


        console.log(
          "----- CLIENT MESSAGE -----"
        );


        console.log(
          "Sender ID:",
          senderId
        );


        console.log(
          "Recipient ID:",
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
          Ignore completely empty events.
        */

        if (
          !clientMessage &&
          !attachmentInfo
        ) {

          continue;
        }


        /* =================================================
           PROCESS IN ORDER FOR THIS CLIENT
        ================================================= */

        queueForClient(
          senderId,
          async () => {

            try {

              await processClientMessage(
                senderId,
                clientMessage,
                attachmentInfo
              );

            } catch (
              error
            ) {

              console.error(
                "Message processing error:"
              );


              console.error(
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
  POST:

  /human/CLIENT_SENDER_ID

  Header:

  x-admin-secret: YOUR_ADMIN_SECRET

  This completely stops AI and reminders
  for that client.
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

      success:
        true,

      senderId,

      humanMode:
        true

    });
  }
);


/* =========================================================
   TURN AI BACK ON
========================================================= */

/*
  POST:

  /ai/CLIENT_SENDER_ID

  Header:

  x-admin-secret: YOUR_ADMIN_SECRET
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


    /*
      IMPORTANT:

      DO NOT reset the conversation stage.

      If the conversation was:

      PAYMENT_PENDING

      it stays:

      PAYMENT_PENDING

      It does NOT restart from MESSAGE_ONE.
    */


    console.log(
      "AI turned back on for:",
      senderId
    );


    console.log(
      "Conversation stage:",
      conversation.stage
    );


    res.json({

      success:
        true,

      senderId,

      humanMode:
        false,

      stage:
        conversation.stage

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
   HEALTH CHECK
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

      model:
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
      "================================="
    );


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


    console.log(
      "Reply delay: 10–12 seconds"
    );


    console.log(
      "Reminder delay: 2 minutes"
    );


    console.log(
      "Payment fee: 12%"
    );


    console.log(
      "Conversation protection: ENABLED"
    );


    console.log(
      "================================="
    );
  }
);
