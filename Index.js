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
    Math.random() *
      (maximum - minimum + 1)
  ) + minimum;

}


function wait(ms) {

  return new Promise(
    (resolve) => setTimeout(resolve, ms)
  );

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
   FIXED LATER RESPONSE
===================================================== */

const LATER_MESSAGE =
`Of course ❤️ Take your time. Whenever you're ready, just text me and I'll be happy to help you.`;


/* =====================================================
   FIXED THINK RESPONSE
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
   PACKAGE DATA
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
   EXTRACT MEDIA ATTACHMENTS
===================================================== */

function extractAttachments(
  message
) {

  if (
    !Array.isArray(
      message?.attachments
    )
  ) {

    return [];

  }


  return message.attachments
    .map(
      (attachment) => {

        const payload =
          attachment?.payload || {};

        return {

          type:
            attachment?.type ||
            "unknown",

          url:
            payload?.url ||
            "",

          id:
            payload?.id ||
            ""

        };

      }
    )
    .filter(
      (attachment) =>
        attachment.type ||
        attachment.url ||
        attachment.id
    );

}


/* =====================================================
   BUILD MEDIA DESCRIPTION
===================================================== */

function buildClientMessage(
  text,
  attachments
) {

  const cleanText =
    typeof text === "string"
      ? text.trim()
      : "";


  const mediaLines =
    attachments.map(
      (attachment) => {

        const type =
          attachment.type;

        if (
          type === "image"
        ) {

          return (
            `[Client sent an image` +
            `${attachment.url
              ? `: ${attachment.url}`
              : ""}]`
          );

        }


        if (
          type === "video"
        ) {

          return (
            `[Client sent a video` +
            `${attachment.url
              ? `: ${attachment.url}`
              : ""}]`
          );

        }


        if (
          type === "ig_reel" ||
          type === "reel"
        ) {

          return (
            `[Client shared an Instagram Reel` +
            `${attachment.url
              ? `: ${attachment.url}`
              : ""}]`
          );

        }


        if (
          type === "share"
        ) {

          return (
            `[Client shared an Instagram post/media` +
            `${attachment.url
              ? `: ${attachment.url}`
              : ""}]`
          );

        }


        if (
          type === "story_mention"
        ) {

          return (
            `[Client shared or mentioned a story` +
            `${attachment.url
              ? `: ${attachment.url}`
              : ""}]`
          );

        }


        return (
          `[Client sent an attachment of type ${type}` +
          `${attachment.url
            ? `: ${attachment.url}`
            : ""}]`
        );

      }
    );


  if (
    cleanText &&
    mediaLines.length
  ) {

    return (
      cleanText +
      "\n\n" +
      mediaLines.join("\n")
    );

  }


  if (
    mediaLines.length
  ) {

    return mediaLines.join("\n");

  }


  return cleanText;

}


/* =====================================================
   BUILD OPENAI INPUT
   IMAGE ATTACHMENTS ARE PASSED AS IMAGES
===================================================== */

function buildResponsesInput(
  clientMessage,
  attachments
) {

  const content = [

    {
      type:
        "input_text",

      text:
        clientMessage

    }

  ];


  for (
    const attachment of attachments
  ) {

    if (
      attachment.type === "image" &&
      attachment.url
    ) {

      content.push({

        type:
          "input_image",

        image_url:
          attachment.url

      });

    }

  }


  return [

    {

      role:
        "user",

      content

    }

  ];

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
MEDIA
==================================================

The client may send:

- Photos
- Images
- Videos
- Shared Instagram posts
- Shared Reels
- Other attachments
- Text + media

If the client sends only media and no clear question,
use AI_REPLY.

Do not invent what is inside a post or Reel.

If an image is actually provided to the AI,
you may analyze what is visible in that image.

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

Do not invent payment information.

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
      content.type === "output_text" &&
      typeof content.text === "string"
    ) {

      reply +=
        content.text;

    }

  }

   }
if (!rawText) {

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
