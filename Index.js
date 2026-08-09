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
   RANDOM DELAY
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

function queueForClient(senderId, task) {

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
   FOLLOWER GUARANTEE
===================================================== */

const FOLLOWER_GUARANTEE_MESSAGE =
`Yes ❤️ Our followers are real and organic. We promote your content on our pages and continue promoting according to your selected package until you reach the guaranteed follower result. That is how we provide the guarantee. Would you like me to show you our packages?`;


/* =====================================================
   ACTIVE AUDIENCE
===================================================== */

const ACTIVE_AUDIENCE_MESSAGE =
`This is one of the best pickup times because around 85% of our audience is active at this time, so your content has a better opportunity to get noticed.`;


/* =====================================================
   LATER
===================================================== */

const LATER_MESSAGE =
`Of course ❤️ Take your time. Whenever you're ready, just text me and I'll be happy to help you.`;


/* =====================================================
   THINK
===================================================== */

const THINK_MESSAGE =
`Of course ❤️ Take your time and think about it. Whenever you're ready, just let me know and I'll be happy to help.`;


/* =====================================================
   PACKAGES
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


function calculatePayment(packageKey) {

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
   PAYMENT SCREENSHOT
===================================================== */

const PAYMENT_SCREENSHOT_MESSAGE =
`Please complete the payment and send me a screenshot after successful payment ❤️`;


/* =====================================================
   GET / CREATE CONVERSATION
===================================================== */

function getConversation(senderId) {

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
   EXTRACT INSTAGRAM MESSAGE CONTENT
   MEDIA FIX
===================================================== */

function extractClientMessage(event) {

  const message =
    event.message || {};


  const text =
    typeof message.text === "string"
      ? message.text.trim()
      : "";


  const attachments =
    Array.isArray(message.attachments)
      ? message.attachments
      : [];


  const detectedMedia = [];


  for (
    const attachment of attachments
  ) {

    const type =
      attachment?.type ||
      "unknown";


    const payload =
      attachment?.payload ||
      {};


    const url =
      payload?.url ||
      "";


    detectedMedia.push({

      type,
      url

    });

  }


  const parts = [];


  if (text) {

    parts.push(
      `TEXT: ${text}`
    );

  }


  if (detectedMedia.length > 0) {

    for (
      const media of detectedMedia
    ) {

      if (
        media.type === "image"
      ) {

        parts.push(
          "CLIENT SENT AN IMAGE/PHOTO."
        );

      }

      else if (
        media.type === "video"
      ) {

        parts.push(
          "CLIENT SENT A VIDEO."
        );

      }

      else if (
        media.type === "audio"
      ) {

        parts.push(
          "CLIENT SENT AN AUDIO MESSAGE."
        );

      }

      else if (
        media.type === "file"
      ) {

        parts.push(
          "CLIENT SENT A FILE."
        );

      }

      else if (
        media.type === "share"
      ) {

        parts.push(
          "CLIENT SHARED AN INSTAGRAM POST OR REEL."
        );

      }

      else {

        parts.push(
          `CLIENT SENT MEDIA TYPE: ${media.type}`
        );

      }

    }

  }


  if (
    parts.length === 0
  ) {

    parts.push(
      "CLIENT SENT A MESSAGE WITHOUT TEXT."
    );

  }


  return {

    text:
      parts.join("\n"),

    attachments:
      detectedMedia

  };

}


/* =====================================================
   OPENAI RESPONSE TEXT EXTRACTOR
===================================================== */

function extractOpenAIText(data) {

  if (
    data &&
    typeof data.output_text === "string" &&
    data.output_text.trim()
  ) {

    return data.output_text.trim();

  }


  let result = "";


  if (
    data &&
    Array.isArray(data.output)
  ) {

    for (
      const item of data.output
    ) {

      if (
        !item ||
        !Array.isArray(item.content)
      ) {

        continue;

      }


      for (
        const content of item.content
      ) {

        if (
          content &&
          typeof content.text === "string"
        ) {

          result +=
            content.text;

        }

      }

    }

  }


  return result.trim();

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

You ONLY choose the correct action.

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
ACTIONS
==================================================

OPENING
Brand-new conversation.

PROMOTION
Client responds positively and wants to know more.

PACKAGES
Client asks for packages, prices, plans or options.

FOLLOWER_GUARANTEE
Client asks whether followers are real, organic,
guaranteed, or how the guarantee works.

ACTIVE_AUDIENCE
Client asks about audience activity or best time.

LATER
Client says they will text later, get back later,
or let you know later.

THINK
Client says they need time to think.

PACKAGE_SELECTED
Client clearly selects Bronze, Silver, Gold or Diamond.

PAYMENT_METHOD_QUESTION
Client asks how to pay after selecting a package.

PAYMENT
Client chooses PayPal, IBAN, Revolut, MB WAY or Card.

AI_REPLY
Client asks another genuine question.

==================================================
MEDIA
==================================================

If the client sends only a photo, post, reel, video,
or other media, do NOT ignore it.

Choose AI_REPLY unless another action clearly matches.

The server will tell the AI that media was received.

==================================================
IMPORTANT
==================================================

Never invent prices.

Never invent payment details.

Never change the 12% payment fee.

One incoming client event = one action.

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
    "OpenAI classifier status:",
    response.status
  );


  if (
    !response.ok
  ) {

    console.error(
      "OpenAI classifier error:"
    );

    console.error(
      JSON.stringify(
        data,
        null,
        2
      )
    );

    throw new Error(
      "OpenAI classifier request failed"
    );

  }


  const rawText =
    extractOpenAIText(
      data
    );


  if (!rawText) {

    console.error(
      "OpenAI returned no classifier text:"
    );

    console.error(
      JSON.stringify(
        data,
        null,
        2
      )
    );

    throw new Error(
      "OpenAI returned no classifier text"
    );

  }


  try {

    return JSON.parse(
      rawText
    );

  }

  catch (error) {

    console.error(
      "Invalid classifier JSON:"
    );

    console.error(
      rawText
    );

    throw new Error(
      "Invalid classifier JSON"
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

You are the natural sales assistant for Global Promote.

Answer the client's actual question.

IMPORTANT BUSINESS INFORMATION:

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

The payment fee is 12%.

Do not invent prices.

Do not invent payment details.

Do not invent discounts.

Do not invent guarantees beyond the business information.

Be friendly and concise.

Reply in the same language as the client when possible.

If the client sends a photo, post, reel or video without
text, acknowledge that you received the media and ask
what they would like help with.

If the client shares an Instagram post or reel, do not
pretend you watched it if you cannot actually access it.

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
      "OpenAI AI reply error:"
    );

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


  const reply =
    extractOpenAIText(
      data
    );


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

  if (
    !PAGE_ACCESS_TOKEN
  ) {

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

              id:
                recipientId

            },

            message: {

              text:
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
      "Instagram send error:"
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
    "Instagram message sent successfully."
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


    return res.sendStatus(
      403
    );

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


    /*
      Tell Meta immediately that the webhook
      was received.
    */

    res.sendStatus(
      200
    );


    if (
      body.object !== "instagram"
    ) {

      console.log(
        "Ignoring non-Instagram webhook."
      );

      return;

    }


    if (
      !Array.isArray(body.entry)
    ) {

      console.log(
        "No webhook entries."
      );

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

        /*
          Ignore events without a message.
        */

        if (
          !event.message
        ) {

          continue;

        }


        /*
          Ignore our own echo messages.
        */

        if (
          event.message.is_echo === true
        ) {

          console.log(
            "Ignoring echo message."
          );

          continue;

        }


        const senderId =
          event.sender?.id;


        if (!senderId) {

          console.log(
            "No sender ID."
          );

          continue;

        }


        /*
          =========================================
          EXTRACT TEXT + PHOTO + POST + REEL
          =========================================
        */

        const extracted =
          extractClientMessage(
            event
          );


        const clientMessage =
          extracted.text;


        console.log(
          "========================================"
        );

        console.log(
          "INSTAGRAM MESSAGE RECEIVED"
        );

        console.log(
          "Sender:",
          senderId
        );

        console.log(
          clientMessage
        );


        if (
          extracted.attachments.length > 0
        ) {

          console.log(
            "MEDIA DETECTED:"
          );


          for (
            const media of
            extracted.attachments
          ) {

            console.log(
              "Type:",
              media.type
            );


            if (
              media.url
            ) {

              console.log(
                "URL:",
                media.url
              );

            }

          }

        }


        console.log(
          "========================================"
        );


        const conversation =
          getConversation(
            senderId
          );


        /*
          =========================================
          CLIENT QUEUE
          =========================================
        */

        queueForClient(
          senderId,
          async () => {

            try {

              /*
                =====================================
                BRAND NEW CLIENT
                =====================================
              */

              if (
                conversation.stage === "NEW"
              ) {

                saveMessage(
                  conversation,
                  "client",
                  clientMessage
                );


                const delay =
                  getRandomDelay();


                console.log(
                  `Waiting ${Math.round(delay / 1000)} seconds before Message #1`
                );


                await wait(
                  delay
                );


                await sendInstagramMessage(
                  senderId,
                  MESSAGE_ONE
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


              /*
                =====================================
                SAVE CLIENT MESSAGE
                =====================================
              */

              saveMessage(
                conversation,
                "client",
                clientMessage
              );


              /*
                =====================================
                CLASSIFY
                =====================================
              */

              const result =
                await classifyMessage(
                  conversation,
                  clientMessage
                );


              console.log(
                "AI ACTION:",
                result.action
              );


              console.log(
                "AI PACKAGE:",
                result.package
              );


              console.log(
                "AI PAYMENT:",
                result.payment
              );


              let reply =
                null;


              /*
                =====================================
                PROMOTION
                =====================================
              */

              if (
                result.action ===
                "PROMOTION"
              ) {

                conversation.stage =
                  "PROMOTION_SENT";

                reply =
                  MESSAGE_TWO;

              }


              /*
                =====================================
                PACKAGES
                =====================================
              */

              else if (
                result.action ===
                "PACKAGES"
              ) {

                conversation.stage =
                  "PACKAGES_SHOWN";

                reply =
                  PACKAGES_MESSAGE;

              }


              /*
                =====================================
                FOLLOWER GUARANTEE
                =====================================
              */

              else if (
                result.action ===
                "FOLLOWER_GUARANTEE"
              ) {

                reply =
                  FOLLOWER_GUARANTEE_MESSAGE;

              }


              /*
                =====================================
                ACTIVE AUDIENCE
                =====================================
              */

              else if (
                result.action ===
                "ACTIVE_AUDIENCE"
              ) {

                reply =
                  ACTIVE_AUDIENCE_MESSAGE;

              }


              /*
                =====================================
                LATER
                =====================================
              */

              else if (
                result.action ===
                "LATER"
              ) {

                reply =
                  LATER_MESSAGE;

              }


              /*
                =====================================
                THINK
                =====================================
              */

              else if (
                result.action ===
                "THINK"
              ) {

                reply =
                  THINK_MESSAGE;

              }


              /*
                =====================================
                PACKAGE SELECTED
                =====================================
              */

              else if (
                result.action ===
                "PACKAGE_SELECTED"
              ) {

                const validPackages = [

                  "bronze",
                  "silver",
                  "gold",
                  "diamond"

                ];


                if (
                  validPackages.includes(
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


              /*
                =====================================
                PAYMENT METHOD QUESTION
                =====================================
              */

              else if (
                result.action ===
                "PAYMENT_METHOD_QUESTION"
              ) {

                if (
                  conversation.selectedPackage
                ) {

                  reply =
                    PAYMENT_METHOD_QUESTION;

                }

                else {

                  reply =
                    PACKAGES_MESSAGE;

                }

              }


              /*
                =====================================
                PAYMENT
                =====================================
              */

              else if (
                result.action ===
                "PAYMENT"
              ) {

                const validPayments = [

                  "paypal",
                  "iban",
                  "revolut",
                  "mbway",
                  "card"

                ];


                if (
                  validPayments.includes(
                    result.payment
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
                      result.payment;


                    conversation.stage =
                      "PAYMENT_PENDING";


                    reply =
                      buildPaymentMessage(
                        conversation.selectedPackage,
                        result.payment
                      );

                  }

                }

              }


              /*
                =====================================
                OPENING
                =====================================
              */

              else if (
                result.action ===
                "OPENING"
              ) {

                reply =
                  MESSAGE_ONE;


                conversation.stage =
                  "OPENING_SENT";

              }


              /*
                =====================================
                AI REPLY
                =====================================
              */

              else if (
                result.action ===
                "AI_REPLY"
              ) {

                reply =
                  await getAIReply(
                    conversation,
                    clientMessage
                  );

              }


              /*
                =====================================
                FALLBACK
                =====================================
              */

              if (
                !reply
              ) {

                reply =
                  "Of course ❤️ How can I help you?";

              }


              /*
                =====================================
                RANDOM DELAY
                =====================================
              */

              const delay =
                getRandomDelay();


              console.log(
                `Waiting ${Math.round(delay / 1000)} seconds before reply`
              );


              await wait(
                delay
              );


              /*
                =====================================
                SEND ONE MESSAGE
                =====================================
              */

              await sendInstagramMessage(
                senderId,
                reply
              );


              /*
                =====================================
                SAVE AI MESSAGE
                =====================================
              */

              saveMessage(
                conversation,
                "assistant",
                reply
              );


              console.log(
                "Reply sent successfully."
              );


              console.log(
                "Current stage:",
                conversation.stage
              );


              console.log(
                "Selected package:",
                conversation.selectedPackage
              );


              console.log(
                "Payment method:",
                conversation.paymentMethod
              );

            }


            catch (error) {

              console.error(
                "========================================"
              );

              console.error(
                "MESSAGE PROCESSING ERROR"
              );

              console.error(
                error
              );

              console.error(
                "========================================"
              );

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

    res.status(200).send(
      "Global Promote Instagram AI is running!"
    );

  }
);


/* =====================================================
   HEALTH CHECK
===================================================== */

app.get(
  "/health",
  (req, res) => {

    res.status(200).json({

      status:
        "ok",

      instagram:
        Boolean(PAGE_ACCESS_TOKEN),

      openai:
        Boolean(OPEN_AI),

      instagramUserId:
        INSTAGRAM_USER_ID

    });

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
      "========================================"
    );

    console.log(
      `Server running on port ${PORT}`
    );

    console.log(
      "Instagram AI: ENABLED"
    );

    console.log(
      "Media detection: ENABLED"
    );

    console.log(
      "Photos: ENABLED"
    );

    console.log(
      "Posts/Reels: ENABLED"
    );

    console.log(
      "AI delay: 10–20 seconds"
    );

    console.log(
      "Payment fee: 12%"
    );

    console.log(
      "========================================"
    );

  }
);
