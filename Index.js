const express = require("express");

const app = express();
app.use(express.json());

/* =====================================================
   ENVIRONMENT VARIABLES
===================================================== */

const VERIFY_TOKEN =
  process.env.VERIFY_TOKEN || "instagram_verify_2026";

const OPEN_AI = process.env.OPEN_AI;

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
   MESSAGE QUEUE
   Prevents multiple replies from being sent together
===================================================== */

const messageQueues = new Map();


/* =====================================================
   DELAY: RANDOM 30–40 SECONDS
===================================================== */

function getRandomDelay() {
  const minimum = 30000; // 30 seconds
  const maximum = 40000; // 40 seconds

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
   QUEUE MESSAGE FOR A CLIENT
===================================================== */

function queueClientReply(senderId, task) {

  const previous =
    messageQueues.get(senderId) ||
    Promise.resolve();

  const next =
    previous
      .catch(() => {})
      .then(task);

  messageQueues.set(
    senderId,
    next.finally(() => {

      if (
        messageQueues.get(senderId) === next
      ) {
        messageQueues.delete(senderId);
      }

    })
  );

  return next;
}


/* =====================================================
   FIXED BUSINESS MESSAGES
===================================================== */

const OPENING_MESSAGE =
`Hey dear ♥️
I see your profile, its a great content ♥️
Would you like to get featured on our page?`;


const PROMOTION_MESSAGE =
`We are here to spotlight your profile 💫
@expl.europe
@expl.canada
@expl.atlanta
@expl.miami

I will upload your post on these pages and from that you will gain 1k to 15k guaranteed followers according to your package. Can I show you our packages ?`;


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
   GET / CREATE CONVERSATION
===================================================== */

function getConversation(senderId) {

  if (!conversations.has(senderId)) {

    conversations.set(senderId, {

      stage: "NEW",

      selectedPackage: null,

      paymentMethod: null,

      history: []

    });

  }

  return conversations.get(senderId);
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
    time: new Date().toISOString()
  });


  if (
    conversation.history.length > 20
  ) {

    conversation.history =
      conversation.history.slice(-20);

  }
}


/* =====================================================
   OPENAI
===================================================== */

async function getSalesDecision(
  conversation,
  clientMessage
) {

  if (!OPEN_AI) {
    throw new Error(
      "OPEN_AI environment variable is missing"
    );
  }


  const historyText =
    conversation.history
      .map((item) =>
        `${item.role}: ${item.text}`
      )
      .join("\n");


  const instructions = `

You are the sales assistant for Global Promote.

Your job is to have a natural, friendly sales
conversation with Instagram clients.

IMPORTANT:
Never send the entire sales script in one reply.

One client message = one assistant reply.

Answer the client's actual question first.

If the client asks something unexpected,
answer naturally using the business information
you know.

Do not invent prices, payment details,
discounts, fees or guarantees.

Reply in the same language as the client.

Keep replies short and natural.

==================================================
CURRENT STAGE
==================================================

${conversation.stage}

Selected package:
${conversation.selectedPackage || "none"}

Payment method:
${conversation.paymentMethod || "none"}

Previous conversation:
${historyText || "No previous conversation."}

==================================================
GLOBAL PROMOTE
==================================================

Pages:

@expl.europe
@expl.canada
@expl.atlanta
@expl.miami

==================================================
PACKAGES
==================================================

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

Gold is the package most clients choose.

Diamond:
€120
5 posts + 8 stories + 7 highlights
10K followers guaranteed

Other services:
TikTok
Facebook
YouTube

==================================================
FOLLOWER QUESTIONS
==================================================

If the client asks whether followers are real:

Answer positively that the business provides
real and organic followers according to the
business claim.

Explain that the client's content is promoted
through the Global Promote pages and that the
package has a follower guarantee.

Do not invent additional statistics.

==================================================
PAYMENT
==================================================

Payment methods:

PayPal
IBAN
Credit/Debit Card
MB WAY
Revolut

If client chooses Credit/Debit Card:

Tell them a team member will assist with
card payment.

Never invent card details.

Never say payment has been received unless
the system confirms it.

==================================================
CONVERSATION
==================================================

NEW:
Send only the opening message.

After opening:
Understand the client's response.

If interested:
Explain the promotion naturally.

If client asks for packages:
Send the package information.

If client chooses a package:
Confirm that package and move toward payment.

If client asks an unrelated question:
Answer that question naturally.

Do NOT automatically send packages,
payment information and promotional text
all at once.

==================================================
OUTPUT
==================================================

Return ONLY valid JSON:

{
  "reply": "one single customer-facing message",
  "next_stage": "OPENING_SENT | PROMOTION_SENT | PACKAGES_SHOWN | PACKAGE_SELECTED | PAYMENT_METHOD_SELECTED | PAYMENT_PENDING | COMPLETED",
  "selected_package": "none | bronze | silver | gold | diamond",
  "payment_method": "none | paypal | iban | card | mbway | revolut"
}
`;


  const response =
    await fetch(
      "https://api.openai.com/v1/responses",
      {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPEN_AI}`
        },

        body: JSON.stringify({

          model: "gpt-5-mini",

          instructions,

          input: clientMessage,

          text: {
            format: {
              type: "json_schema",
              name: "sales_decision",
              strict: true,

              schema: {
                type: "object",

                additionalProperties: false,

                properties: {

                  reply: {
                    type: "string"
                  },

                  next_stage: {
                    type: "string",

                    enum: [
                      "OPENING_SENT",
                      "PROMOTION_SENT",
                      "PACKAGES_SHOWN",
                      "PACKAGE_SELECTED",
                      "PAYMENT_METHOD_SELECTED",
                      "PAYMENT_PENDING",
                      "COMPLETED"
                    ]
                  },

                  selected_package: {
                    type: "string",

                    enum: [
                      "none",
                      "bronze",
                      "silver",
                      "gold",
                      "diamond"
                    ]
                  },

                  payment_method: {
                    type: "string",

                    enum: [
                      "none",
                      "paypal",
                      "iban",
                      "card",
                      "mbway",
                      "revolut"
                    ]
                  }

                },

                required: [
                  "reply",
                  "next_stage",
                  "selected_package",
                  "payment_method"
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
    "OpenAI HTTP status:",
    response.status
  );


  if (!response.ok) {

    console.error(
      "OpenAI API error:",
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


  let rawText = "";


  if (
    typeof data.output_text === "string"
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

            rawText += content.text;

          }

        }
      }
    }
  }


  if (!rawText) {

    throw new Error(
      "OpenAI returned no text"
    );

  }


  let decision;


  try {

    decision =
      JSON.parse(rawText);

  } catch (error) {

    console.error(
      "Invalid OpenAI JSON:",
      rawText
    );

    throw new Error(
      "Could not parse OpenAI response"
    );

  }


  if (!decision.reply) {

    throw new Error(
      "AI returned an empty reply"
    );

  }


  return decision;
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

        body: JSON.stringify({

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


  if (!response.ok) {

    console.error(
      "Instagram API error:",
      JSON.stringify(
        data,
        null,
        2
      )
    );

    throw new Error(
      "Instagram message could not be sent"
    );
  }


  console.log(
    "Instagram reply sent successfully"
  );

  return data;
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

    console.log(
      "INSTAGRAM WEBHOOK RECEIVED"
    );


    const body =
      req.body;


    /*
      Tell Meta immediately that we received
      the webhook.
    */

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

        const messageText =
          event.message?.text;


        if (
          !senderId ||
          !messageText
        ) {

          continue;

        }


        console.log(
          "REAL TEXT MESSAGE RECEIVED:"
        );

        console.log(
          messageText
        );


        const conversation =
          getConversation(senderId);


        /*
          Queue this client's reply.
          This prevents two replies from
          being sent simultaneously.
        */

        queueClientReply(
          senderId,
          async () => {

            try {

              /*
                FIRST MESSAGE
              */

              if (
                conversation.stage === "NEW"
              ) {

                console.log(
                  "Waiting 30–40 seconds before first reply..."
                );


                const delay =
                  getRandomDelay();


                console.log(
                  `Delay: ${Math.round(delay / 1000)} seconds`
                );


                await wait(delay);


                await sendInstagramMessage(
                  senderId,
                  OPENING_MESSAGE
                );


                saveMessage(
                  conversation,
                  "client",
                  messageText
                );


                saveMessage(
                  conversation,
                  "assistant",
                  OPENING_MESSAGE
                );


                conversation.stage =
                  "OPENING_SENT";


                console.log(
                  "Opening message sent."
                );


                return;
              }


              /*
                NORMAL AI REPLY
              */

              saveMessage(
                conversation,
                "client",
                messageText
              );


              const decision =
                await getSalesDecision(
                  conversation,
                  messageText
                );


              if (
                decision.selected_package !==
                "none"
              ) {

                conversation.selectedPackage =
                  decision.selected_package;

              }


              if (
                decision.payment_method !==
                "none"
              ) {

                conversation.paymentMethod =
                  decision.payment_method;

              }


              conversation.stage =
                decision.next_stage;


              /*
                AI has prepared the reply.
                Now wait 30–40 seconds.
              */

              const delay =
                getRandomDelay();


              console.log(
                `Waiting ${Math.round(delay / 1000)} seconds before sending AI reply...`
              );


              await wait(delay);


              /*
                Send exactly ONE message.
              */

              await sendInstagramMessage(
                senderId,
                decision.reply.trim()
              );


              saveMessage(
                conversation,
                "assistant",
                decision.reply.trim()
              );


              console.log(
                "AI reply sent after delay."
              );


            } catch (error) {

              console.error(
                "MESSAGE PROCESSING ERROR:"
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


/* =====================================================
   HOME
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
      `Server running on port ${PORT}`
    );

  }
);
