const express = require("express");

const app = express();

app.use(express.json());


/* =====================================================
   ENVIRONMENT VARIABLES
===================================================== */

const VERIFY_TOKEN =
  process.env.VERIFY_TOKEN || "instagram_verify_2026";

const OPEN_AI =
  process.env.OPEN_AI;

const PAGE_ACCESS_TOKEN =
  process.env.PAGE_ACCESS_TOKEN;

const INSTAGRAM_USER_ID =
  process.env.INSTAGRAM_USER_ID ||
  "17841404831696204";

const META_API_VERSION =
  process.env.META_API_VERSION || "v25.0";


/* =====================================================
   CONVERSATION MEMORY
===================================================== */

const conversations = new Map();


/* =====================================================
   PER-CLIENT MESSAGE QUEUES
===================================================== */

const queues = new Map();


/* =====================================================
   RANDOM 10–20 SECOND DELAY
===================================================== */

function getRandomDelay() {

  const minimum = 10000;
  const maximum = 20000;

  return Math.floor(
    Math.random() * (maximum - minimum + 1)
  ) + minimum;

}


function wait(ms) {

  return new Promise((resolve) => {

    setTimeout(resolve, ms);

  });

}


/* =====================================================
   CLIENT QUEUE
===================================================== */

function queueForClient(
  senderId,
  task
) {

  const previous =
    queues.get(senderId) ||
    Promise.resolve();

  const next =
    previous
      .catch(() => {})
      .then(task);

  queues.set(
    senderId,
    next
  );

  next.finally(() => {

    if (
      queues.get(senderId) === next
    ) {

      queues.delete(senderId);

    }

  });

  return next;

}


/* =====================================================
   FIXED MESSAGE #1
===================================================== */

const MESSAGE_ONE =
`Hey dear ♥️
I see your profile, its a great content ♥️
Would you like to get featured on our page?`;


/* =====================================================
   FIXED MESSAGE #2
===================================================== */

const MESSAGE_TWO =
`We are here to spotlight your profile 💫
@expl.europe
@expl.canada
@expl.atlanta
@expl.miami

I will upload your post on these pages and from that you will gain 1k to 15k guaranteed followers according to your package. Can I show you our packages ?`;


/* =====================================================
   FIXED FOLLOWER / GUARANTEE ANSWER
===================================================== */

const FOLLOWER_GUARANTEE_MESSAGE =
`Yes ❤️ Our followers are real and organic. We promote your content on our pages and continue promoting according to your selected package until you reach the guaranteed follower result. That is how we provide the guarantee. Would you like me to show you our packages?`;


/* =====================================================
   FIXED 85% AUDIENCE ANSWER
===================================================== */

const ACTIVE_AUDIENCE_MESSAGE =
`This is one of the best pickup times because around 85% of our audience is active at this time, so your content has a better opportunity to get noticed.`;


/* =====================================================
   FIXED "LATER" RESPONSE
===================================================== */

const LATER_MESSAGE =
`Of course ❤️ Take your time. Whenever you're ready, just text me and I'll be happy to help you.`;


/* =====================================================
   FIXED "LET ME THINK" RESPONSE
===================================================== */

const THINK_MESSAGE =
`Of course ❤️ Take your time and think about it. Whenever you're ready, just let me know and I'll be happy to help.`;


/* =====================================================
   FIXED PACKAGE MESSAGE
===================================================== */

const PACKAGES_MESSAGE =
`🎊 Instagram Packages 🎊

1️⃣ BRONZE PACKAGE 📦
👉 €35 = 2 stories
🎉 1.5K followers guaranteed

2️⃣ SILVER PACKAGE 📦
👉 €60 = 1 post + 3 stories + 2 highlights
🎉 4K followers guaranteed

3️⃣ GOLD PACKAGE 📦
👉 €90 = 3 posts + 4 stories + 3 highlights
🎉 7K followers guaranteed
⭐ Mostly clients choose this package!

4️⃣ DIAMOND PACKAGE 📦
👉 €120 = 5 posts + 8 stories + 7 highlights
🎉 10K followers guaranteed

We also provide packages for:
TikTok
Facebook
YouTube

💥 Select your package ❤️`;


/* =====================================================
   FIXED PACKAGE DATA
===================================================== */

const PACKAGES = {

  bronze: {
    name: "Bronze",
    price: 35.00,
    details: "2 stories",
    followers: "1.5K followers guaranteed"
  },

  silver: {
    name: "Silver",
    price: 60.00,
    details: "1 post + 3 stories + 2 highlights",
    followers: "4K followers guaranteed"
  },

  gold: {
    name: "Gold",
    price: 90.00,
    details: "3 posts + 4 stories + 3 highlights",
    followers: "7K followers guaranteed"
  },

  diamond: {
    name: "Diamond",
    price: 120.00,
    details: "5 posts + 8 stories + 7 highlights",
    followers: "10K followers guaranteed"
  }

};


/* =====================================================
   PAYMENT FEE
===================================================== */

const PAYMENT_FEE_PERCENT = 0.12;


function calculatePayment(
  packageKey
) {

  const packageInfo =
    PACKAGES[packageKey];

  if (!packageInfo) {

    throw new Error(
      "Invalid package"
    );

  }

  const price =
    packageInfo.price;

  const fee =
    Number(
      (price * PAYMENT_FEE_PERCENT)
        .toFixed(2)
    );

  const total =
    Number(
      (price + fee)
        .toFixed(2)
    );

  return {
    price,
    fee,
    total
  };

}


/* =====================================================
   PAYMENT DETAILS
===================================================== */

const PAYPAL_DETAILS = {

  email:
    "pay@globalpromote.in",

  link:
    "https://paypal.me/RamanKumar4257"

};


const IBAN_DETAILS = {

  name:
    "Rahul Kumar",

  iban:
    "BE36967747881581",

  swift:
    "TRWIBEB1XXX",

  bank:
    "Wise",

  address:
    "Rue du Trône 100, 3rd floor, Brussels, 1050, Belgium"

};


const REVOLUT_DETAILS = {

  tag:
    "@clavis02pk",

  link:
    "https://revolut.me/clavis02pk"

};


const MBWAY_DETAILS = {

  number:
    "+351 968 188 499",

  name:
    "Andre Santana"

};


const CARD_MESSAGE =
`For Credit/Debit Card payment, our team will assist you shortly ❤️`;


/* =====================================================
   PAYMENT METHOD QUESTION
===================================================== */

const PAYMENT_METHOD_QUESTION =
`How would you like to pay? ❤️

PayPal
IBAN
Revolut
MB WAY
Credit/Debit Card`;


/* =====================================================
   PAYMENT SCREENSHOT MESSAGE
===================================================== */

const PAYMENT_SCREENSHOT_MESSAGE =
`Please complete the payment and send me a screenshot after successful payment ❤️`;


/* =====================================================
   GET / CREATE CONVERSATION
===================================================== */

function getConversation(
  senderId
) {

  if (
    !conversations.has(senderId)
  ) {

    conversations.set(
      senderId,
      {

        stage:
          "NEW",

        selectedPackage:
          null,

        paymentMethod:
          null,

        history: []

      }
    );

  }

  return conversations.get(
    senderId
  );

}


/* =====================================================
   SAVE MESSAGE
===================================================== */

function saveMessage(
  conversation,
  role,
  text
) {

  conversation.history.push({

    role,
    text,
    time:
      new Date().toISOString()

  });

  if (
    conversation.history.length > 30
  ) {

    conversation.history =
      conversation.history.slice(-30);

  }

}


/* =====================================================
   PAYMENT MESSAGE BUILDER
===================================================== */

function buildPaymentMessage(
  packageKey,
  paymentMethod
) {

  const packageInfo =
    PACKAGES[packageKey];

  if (!packageInfo) {

    throw new Error(
      "No package selected"
    );

  }

  const payment =
    calculatePayment(
      packageKey
    );

  const amountText =
`Your ${packageInfo.name} package:

Package price: €${payment.price.toFixed(2)}
12% payment fee: €${payment.fee.toFixed(2)}
Total amount: €${payment.total.toFixed(2)}`;


  if (
    paymentMethod === "paypal"
  ) {

    return `${amountText}

PayPal email:
${PAYPAL_DETAILS.email}

PayPal:
${PAYPAL_DETAILS.link}

${PAYMENT_SCREENSHOT_MESSAGE}`;

  }


  if (
    paymentMethod === "iban"
  ) {

    return `${amountText}

Bank details:

Name:
${IBAN_DETAILS.name}

IBAN:
${IBAN_DETAILS.iban}

SWIFT/BIC:
${IBAN_DETAILS.swift}

Bank:
${IBAN_DETAILS.bank}

Bank address:
${IBAN_DETAILS.address}

${PAYMENT_SCREENSHOT_MESSAGE}`;

  }


  if (
    paymentMethod === "revolut"
  ) {

    return `${amountText}

Revolut:

Tag:
${REVOLUT_DETAILS.tag}

Link:
${REVOLUT_DETAILS.link}

${PAYMENT_SCREENSHOT_MESSAGE}`;

  }


  if (
    paymentMethod === "mbway"
  ) {

    return `${amountText}

MB WAY:

Number:
${MBWAY_DETAILS.number}

Name:
${MBWAY_DETAILS.name}

${PAYMENT_SCREENSHOT_MESSAGE}`;

  }


  if (
    paymentMethod === "card"
  ) {

    return `${amountText}

${CARD_MESSAGE}

${PAYMENT_SCREENSHOT_MESSAGE}`;

  }


  return null;

}


/* =====================================================
   OPENAI CONVERSATION CONTROLLER
===================================================== */

async function classifyMessage(
  conversation,
  clientMessage
) {

  if (!OPEN_AI) {

    throw new Error(
      "OPEN_AI environment variable is missing"
    );

  }

  const history =
    conversation.history
      .map(
        (item) =>
          `${item.role}: ${item.text}`
      )
      .join("\n");


  const instructions = `

You are the conversation controller for Global Promote.

You DO NOT write fixed messages.

You ONLY choose what action the server should perform.

==================================================
CURRENT STAGE
==================================================

${conversation.stage}

Selected package:
${conversation.selectedPackage || "none"}

Selected payment method:
${conversation.paymentMethod || "none"}

==================================================
BUSINESS
==================================================

Global Promote pages:

@expl.europe
@expl.canada
@expl.atlanta
@expl.miami

Packages:

Bronze:
€35
2 stories
1.5K followers guaranteed

Silver:
€60
1 post + 3 stories + 2 highlights
4K followers guaranteed

Gold:
€90
3 posts + 4 stories + 3 highlights
7K followers guaranteed

Diamond:
€120
5 posts + 8 stories + 7 highlights
10K followers guaranteed

Gold is the package most clients choose.

Payment methods:

PayPal
IBAN
Revolut
MB WAY
Credit/Debit Card

==================================================
FIXED ACTIONS
==================================================

OPENING
Use only for a brand-new conversation.

PROMOTION
Use when the client responds positively to the
opening and wants to know more.

PACKAGES
Use when the client asks for packages, prices,
plans, options or package details.

FOLLOWER_GUARANTEE
Use when the client asks whether followers are real,
organic, guaranteed, or how the guarantee works.

ACTIVE_AUDIENCE
Use when the client asks about the best pickup time,
posting time, audience activity or when most people
are active.

LATER
Use when client says things like:

"I'll text you later"
"I will text you later"
"I'll let you know"
"I will let you know"
"I'll get back to you"
"Maybe later"

THINK
Use when client says:

"Let me think"
"I need to think"
"I need some time"
"I'll think about it"
"Let me consider"

PACKAGE_SELECTED
Use when client clearly chooses:

Bronze
Silver
Gold
Diamond

PAYMENT_METHOD_QUESTION
Use when a package has been selected and the client
has not yet selected a payment method.

PAYMENT
Use when client chooses:

PayPal
IBAN
Revolut
MB WAY
Credit/Debit Card

AI_REPLY
Use only when the client's question genuinely does
not match one of the fixed actions.

==================================================
MEDIA MESSAGES
==================================================

The client may send:

- An image/photo
- A shared Instagram post
- A shared Reel
- A video
- An attachment
- Text together with media

Treat media descriptions as part of the client's
message.

If the client sends only media and there is no question,
use AI_REPLY and respond naturally.

Do not invent what is inside an image, post or Reel.

==================================================
VERY IMPORTANT
==================================================

The server owns all fixed text.

Never rewrite:

Message #1
Message #2
Follower guarantee answer
85% audience answer
Later response
Think response
Package prices
Package details
Payment details
Payment fee calculation

Do not invent any price.

Do not invent any payment information.

Do not change the 12% fee.

One incoming client message = one action.

==================================================
CLIENT MESSAGE
==================================================

${clientMessage}

==================================================
HISTORY
==================================================

${history}
`;


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
              "gpt-5-mini",

            instructions,

            input:
              clientMessage,

            text: {

              format: {

                type:
                  "json_schema",

                name:
                  "conversation_action",

                strict:
                  true,

                schema: {

                  type:
                    "object",

                  additionalProperties:
                    false,

                  properties: {

                    action: {

                      type:
                        "string",

                      enum: [

                        "OPENING",
                        "PROMOTION",
                        "PACKAGES",
                        "FOLLOWER_GUARANTEE",
                        "ACTIVE_AUDIENCE",
                        "LATER",
                        "THINK",
                        "PACKAGE_SELECTED",
                        "PAYMENT_METHOD_QUESTION",
                        "PAYMENT",
                        "AI_REPLY"

                      ]

                    },

                    package: {

                      type:
                        "string",

                      enum: [

                        "none",
                        "bronze",
                        "silver",
                        "gold",
                        "diamond"

                      ]

                    },

                    payment: {

                      type:
                        "string",

                      enum: [

                        "none",
                        "paypal",
                        "iban",
                        "revolut",
                        "mbway",
                        "card"

                      ]

                    }

                  },

                  required: [

                    "action",
                    "package",
                    "payment"

                  ]

                }

              }

            }

          })

      }
    );


  const data =
    await response.json();


  console.log(
    "OpenAI status:",
    response.status
  );


  if (
    !response.ok
  ) {

    console.error(
      "OpenAI error:"
    );

    console.error(
      JSON.stringify(
        data,
        null,
        2
      )
    );

    throw new Error(
      "OpenAI request failed"
    );

  }


  let rawText =
    "";


  if (
    typeof data.output_text ===
    "string"
  ) {

    rawText =
      data.output_text.trim();

  }


  if (
    !rawText &&
    Array.isArray(data.output)
  ) {

    for (
      const item of data.output
    ) {

      if (
        item.type === "message" &&
        Array.isArray(item.content)
      ) {

        for (
          const content of item.content
        ) {

          if (
            content.type ===
              "output_text" &&
            typeof content.text ===
              "string"
          ) {

            rawText +=
              content.text;

          }

        }

      }

    }

  }


  if (
    !rawText
  ) {

    throw new Error(
      "OpenAI returned no text"
    );

  }


  try {

    return JSON.parse(
      rawText
    );

  } catch (error) {

    console.error(
      "OpenAI invalid JSON:"
    );

    console.error(
      rawText
    );

    throw new Error(
      "Invalid OpenAI response"
    );

  }

}


/* =====================================================
   FREE-FORM AI ANSWER
===================================================== */

async function getAIReply(
  conversation,
  clientMessage
) {

  const history =
    conversation.history
      .map(
        (item) =>
          `${item.role}: ${item.text}`
      )
      .join("\n");


  const instructions = `

You are the natural sales assistant for Global Promote.

Answer ONLY the client's actual question.

The following information is fixed:

Bronze = €35
Silver = €60
Gold = €90
Diamond = €120

Gold is the most commonly selected package.

Payment methods:
PayPal
IBAN
Revolut
MB WAY
Credit/Debit Card

Do NOT change prices.

Do NOT invent payment information.

Do NOT invent discounts.

Do NOT invent fees.

Do NOT rewrite the fixed sales messages.

Do NOT repeat the entire package list unless the
client specifically asks for it.

Be friendly and concise.

Reply in the same language as the client.

If the client sends an image, post, Reel, video,
or other attachment without a question, acknowledge
it naturally and ask what they would like to know
about it.

Do not claim to have seen or understood visual content
that is not actually available to you.

If you don't know something, don't invent an answer.

If asked whether you are AI, answer honestly.

Previous conversation:

${history}

Client message:

${clientMessage}
`;


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
              "gpt-5-mini",

            instructions,

            input:
              clientMessage

          })

      }
    );


  const data =
    await response.json();


  if (
    !response.ok
  ) {

    console.error(
      JSON.stringify(
        data,
        null,
        2
      )
    );

    throw new Error(
      "OpenAI AI reply failed"
    );

  }


  let reply =
    "";


  if (
    typeof data.output_text ===
    "string"
  ) {

    reply =
      data.output_text.trim();

  }


  if (
    !reply &&
    Array.isArray(data.output)
  ) {

    for (
      const item of data.output
    ) {

      if (
        item.type === "message" &&
        Array.isArray(item.content)
      ) {

        for (
          const content of item.content
        ) {

          if (
            content.type ===
              "output_text" &&
            typeof content.text ===
              "string"
          ) {

            reply +=
              content.text;

          }

        }

         }
   
}
    }
  }

  if (!reply) {

    throw new Error(
      "AI returned no reply"
    );

  }

  return reply.trim();

}


/* =====================================================
   SEND INSTAGRAM MESSAGE
===================================================== */

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
    `https://graph.instagram.com/` +
    `${META_API_VERSION}/` +
    `${INSTAGRAM_USER_ID}/messages`;

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
      "Instagram error:"
    );

    console.error(
      JSON.stringify(
        data,
        null,
        2
      )
    );

    throw new Error(
      "Instagram message failed"
    );

  }

  console.log(
    "Instagram message sent."
  );

}


/* =====================================================
   WEBHOOK VERIFICATION
===================================================== */

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
        "Webhook verified."
      );

      return res
        .status(200)
        .send(challenge);

    }

    return res.sendStatus(403);

  }
);


/* =====================================================
   INSTAGRAM WEBHOOK
===================================================== */

app.post(
  "/webhook",
  async (req, res) => {

    const body =
      req.body;

    // Acknowledge Meta immediately
    res.sendStatus(200);

    if (
      body.object !== "instagram"
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
        !Array.isArray(entry.messaging)
      ) {
        continue;
      }

      for (
        const event of entry.messaging
      ) {

        if (!event.message) {
          continue;
        }

        const senderId =
          event.sender?.id;

        if (!senderId) {
          continue;
        }


        /* =============================================
           TEXT
        ============================================= */

        const text =
          typeof event.message.text === "string"
            ? event.message.text.trim()
            : "";


        /* =============================================
           ATTACHMENTS
        ============================================= */

        const attachments =
          Array.isArray(
            event.message.attachments
          )
            ? event.message.attachments
            : [];


        const attachmentInfo =
          attachments.map(
            (attachment) => {

              const type =
                attachment?.type ||
                "unknown";

              const payload =
                attachment?.payload ||
                {};

              return {

                type,

                url:
                  payload?.url || "",

                id:
                  payload?.id || ""

              };

            }
          );


        /* =============================================
           CREATE CLIENT MESSAGE
        ============================================= */

        let clientMessage =
          text;


        if (
          !clientMessage &&
          attachmentInfo.length > 0
        ) {

          clientMessage =
            attachmentInfo
              .map(
                (attachment) => {

                  if (
                    attachment.type === "image"
                  ) {

                    return (
                      `[Client sent an image${
                        attachment.url
                          ? `: ${attachment.url}`
                          : ""
                      }]`
                    );

                  }

                  if (
                    attachment.type === "video"
                  ) {

                    return (
                      `[Client sent a video${
                        attachment.url
                          ? `: ${attachment.url}`
                          : ""
                      }]`
                    );

                  }

                  if (
                    attachment.type === "ig_reel" ||
                    attachment.type === "reel"
                  ) {

                    return (
                      `[Client shared an Instagram Reel${
                        attachment.url
                          ? `: ${attachment.url}`
                          : ""
                      }]`
                    );

                  }

                  if (
                    attachment.type === "share"
                  ) {

                    return (
                      `[Client shared an Instagram post${
                        attachment.url
                          ? `: ${attachment.url}`
                          : ""
                      }]`
                    );

                  }

                  return (
                    `[Client sent an attachment: ${
                      attachment.type
                    }${
                      attachment.url
                        ? ` - ${attachment.url}`
                        : ""
                    }]`
                  );

                }
              )
              .join("\n");

        }


        /* =============================================
           TEXT + MEDIA
        ============================================= */

        if (
          text &&
          attachmentInfo.length > 0
        ) {

          const mediaText =
            attachmentInfo
              .map(
                (attachment) =>
                  `[Attachment: ${attachment.type}${
                    attachment.url
                      ? ` - ${attachment.url}`
                      : ""
                  }]`
              )
              .join("\n");

          clientMessage =
`${text}

${mediaText}`;

        }


        if (!clientMessage) {
          continue;
        }


        console.log(
          "================================="
        );

        console.log(
          "CLIENT MESSAGE:"
        );

        console.log(
          clientMessage
        );

        if (
          attachmentInfo.length > 0
        ) {

          console.log(
            "CLIENT ATTACHMENTS:"
          );

          console.log(
            JSON.stringify(
              attachmentInfo,
              null,
              2
            )
          );

        }

        console.log(
          "================================="
        );


        const conversation =
          getConversation(
            senderId
          );


        queueForClient(
          senderId,
          async () => {

            try {

              /* =====================================
                 NEW CLIENT
              ===================================== */

              if (
                conversation.stage === "NEW"
              ) {

                const delay =
                  getRandomDelay();

                console.log(
                  `Waiting ${Math.round(delay / 1000)} seconds before Message #1`
                );

                await wait(delay);

                await sendInstagramMessage(
                  senderId,
                  MESSAGE_ONE
                );

                saveMessage(
                  conversation,
                  "client",
                  clientMessage
                );

                saveMessage(
                  conversation,
                  "assistant",
                  MESSAGE_ONE
                );

                conversation.stage =
                  "OPENING_SENT";

                return;

              }


              /* =====================================
                 SAVE MESSAGE
              ===================================== */

              saveMessage(
                conversation,
                "client",
                clientMessage
              );


              /* =====================================
                 CLASSIFY
              ===================================== */

              const result =
                await classifyMessage(
                  conversation,
                  clientMessage
                );

              console.log(
                "AI ACTION:",
                result.action
              );

              let reply = null;


              /* =====================================
                 ACTIONS
              ===================================== */

              if (
                result.action === "PROMOTION"
              ) {

                conversation.stage =
                  "PROMOTION_SENT";

                reply =
                  MESSAGE_TWO;

              }

              else if (
                result.action === "PACKAGES"
              ) {

                conversation.stage =
                  "PACKAGES_SHOWN";

                reply =
                  PACKAGES_MESSAGE;

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
                "ACTIVE_AUDIENCE"
              ) {

                reply =
                  ACTIVE_AUDIENCE_MESSAGE;

              }

              else if (
                result.action === "LATER"
              ) {

                reply =
                  LATER_MESSAGE;

              }

              else if (
                result.action === "THINK"
              ) {

                reply =
                  THINK_MESSAGE;

              }

              else if (
                result.action ===
                "PACKAGE_SELECTED"
              ) {

                if (
                  [
                    "bronze",
                    "silver",
                    "gold",
                    "diamond"
                  ].includes(
                    result.package
                  )
                ) {

                  conversation.selectedPackage =
                    result.package;

                  conversation.stage =
                    "PACKAGE_SELECTED";

                  const selected =
                    PACKAGES[
                      result.package
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

              }

              else if (
                result.action ===
                "PAYMENT_METHOD_QUESTION"
              ) {

                reply =
                  conversation.selectedPackage
                    ? PAYMENT_METHOD_QUESTION
                    : PACKAGES_MESSAGE;

              }

              else if (
                result.action === "PAYMENT"
              ) {

                const selectedPayment =
                  result.payment;

                const validPayments = [
                  "paypal",
                  "iban",
                  "revolut",
                  "mbway",
                  "card"
                ];

                if (
                  validPayments.includes(
                    selectedPayment
                  )
                ) {

                  if (
                    !conversation.selectedPackage
                  ) {

                    reply =
`Please select your package first ❤️

${PACKAGES_MESSAGE}`;

                  }
                  else {

                    conversation.paymentMethod =
                      selectedPayment;

                    conversation.stage =
                      "PAYMENT_PENDING";

                    reply =
                      buildPaymentMessage(
                        conversation.selectedPackage,
                        selectedPayment
                      );

                  }

                }

              }

              else if (
                result.action === "OPENING"
              ) {

                reply =
                  MESSAGE_ONE;

                conversation.stage =
                  "OPENING_SENT";

              }

              else if (
                result.action === "AI_REPLY"
              ) {

                reply =
                  await getAIReply(
                    conversation,
                    clientMessage
                  );

              }


              if (!reply) {

                reply =
                  "Of course ❤️ How can I help you?";

              }


              /* =====================================
                 DELAY
              ===================================== */

              const delay =
                getRandomDelay();

              console.log(
                `Waiting ${Math.round(delay / 1000)} seconds before reply`
              );

              await wait(delay);


              /* =====================================
                 SEND
              ===================================== */

              await sendInstagramMessage(
                senderId,
                reply
              );


              saveMessage(
                conversation,
                "assistant",
                reply
              );


              console.log(
                "Reply sent successfully."
              );

            }
            catch (error) {

              console.error(
                "MESSAGE PROCESSING ERROR"
              );

              console.error(error);

            }

          }
        );

      }

    }

  }
);


/* =====================================================
   HOME PAGE
===================================================== */

app.get(
  "/",
  (req, res) => {

    res.send(
      "Global Promote Instagram AI is running!"
    );

  }
);


/* =====================================================
   AUTH CALLBACK
===================================================== */

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


/* =====================================================
   START SERVER
===================================================== */

const PORT =
  process.env.PORT || 3000;

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
      "AI delay: 10–20 seconds"
    );

    console.log(
      "Payment fee: 12%"
    );

    console.log(
      "Media detection: ENABLED"
    );

    console.log(
      "================================="
    );

  }
);
