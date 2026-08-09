const express = require("express");

const app = express();
app.use(express.json());

/* =========================
   ENVIRONMENT VARIABLES
========================= */

const VERIFY_TOKEN =
  process.env.VERIFY_TOKEN || "instagram_verify_2026";

const OPEN_AI = process.env.OPEN_AI;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

/*
  Your Instagram Business Account ID
*/
const INSTAGRAM_USER_ID = "17841404831696204";

/*
  Keep this the same Graph API version
  you are currently using in Meta.
*/
const INSTAGRAM_API_VERSION = "v26.0";

/* =========================
   WEBHOOK VERIFICATION
========================= */

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  console.log("Webhook verification request received");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verification successful");
    return res.status(200).send(challenge);
  }

  console.log("Webhook verification failed");
  return res.sendStatus(403);
});

/* =========================
   OPENAI
========================= */

async function getAIReply(messageText) {
  if (!OPEN_AI) {
    throw new Error("OPEN_AI environment variable is missing");
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPEN_AI}`
    },

    body: JSON.stringify({
      model: "gpt-5-mini",

      instructions: `
You are the sales assistant for Global Promote.

Your job is to communicate naturally with Instagram clients.

GENERAL STYLE:
- Be friendly, warm and conversational.
- Keep messages relatively short.
- Do not sound robotic.
- Reply in the same language the client uses.
- If the client writes Portuguese, reply in Portuguese.
- If the client writes English, reply in English.
- Do not unnecessarily repeat information.
- Do not invent prices, payment details, packages or guarantees.
- Do not falsely claim to be a human.
- If directly asked whether you are AI, answer honestly.
- Be positive and helpful.
- Guide interested clients naturally toward choosing a package.
- Do not pressure a client aggressively.

GLOBAL PROMOTE PAGES:
@expl.europe
@expl.canada
@expl.atlanta
@expl.miami

OPENING MESSAGE:
"Hey dear ♥️
I see your profile, its a great content ♥️
Would you like to get featured on our page?"

SECOND MESSAGE:
"We are here to spotlight your profile 💫
@expl.europe
@expl.canada
@expl.atlanta
@expl.miami

I will upload your post on these pages and from that you will gain 1k to 15k guaranteed followers according to your package. Can I show you our packages ?"

INSTAGRAM PACKAGES:

BRONZE PACKAGE:
€35
2 stories
1.5K followers guaranteed

SILVER PACKAGE:
€60
1 post
3 stories
2 highlights
4K followers guaranteed

GOLD PACKAGE:
€90
3 posts
4 stories
3 highlights
7K followers guaranteed
This is the package clients choose most often.

DIAMOND PACKAGE:
€120
5 posts
8 stories
7 highlights
10K followers guaranteed

OTHER SERVICES:
TikTok
Facebook
YouTube

PACKAGE SELECTION:
"Select your package ❤️"

PAYMENT METHODS:
PayPal
IBAN
Credit or Debit Card
MB WAY
Revolut

IMPORTANT:
- Do not provide credit/debit card payment details automatically.
- If a client chooses Credit/Debit Card, tell them that someone from the team will assist with the card payment.
- Payment automation and reminders will be added separately later.
- Do not invent a payment fee or tax.
- Do not invent a discount.
- Do not say payment has been received unless the system has actually confirmed it.
- Do not claim that a payment screenshot has been verified unless it actually has been verified.
`,

      input: messageText
    })
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("OpenAI API error:", data);
    throw new Error("OpenAI request failed");
  }

  const reply = data.output_text;

  if (!reply) {
    throw new Error("OpenAI returned no text");
  }

  return reply.trim();
}

/* =========================
   SEND INSTAGRAM MESSAGE
========================= */

async function sendInstagramMessage(recipientId, text) {
  const url =
    `https://graph.instagram.com/${INSTAGRAM_API_VERSION}` +
    `/${INSTAGRAM_USER_ID}/messages`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${PAGE_ACCESS_TOKEN}`
    },

    body: JSON.stringify({
      recipient: {
        id: recipientId
      },

      message: {
        text: text
      }
    })
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Instagram API error:", data);
    throw new Error("Instagram message could not be sent");
  }

  console.log("Instagram reply sent successfully");
  console.log(JSON.stringify(data, null, 2));

  return data;
}

/* =========================
   INSTAGRAM WEBHOOK
========================= */

app.post("/webhook", async (req, res) => {
  console.log("=================================");
  console.log("INSTAGRAM WEBHOOK RECEIVED");
  console.log("=================================");

  const body = req.body;

  console.log(JSON.stringify(body, null, 2));

  /*
    Tell Meta immediately that the webhook
    was received.
  */
  res.sendStatus(200);

  if (body.object !== "instagram") {
    return;
  }

  if (!body.entry) {
    return;
  }

  for (const entry of body.entry) {
    console.log("Instagram Account ID:", entry.id);

    if (!entry.messaging) {
      continue;
    }

    for (const event of entry.messaging) {

      /* =========================
         MESSAGE EVENT
      ========================= */

      if (event.message) {
        const senderId = event.sender?.id;
        const recipientId = event.recipient?.id;

        const messageText = event.message?.text;

        console.log("----- MESSAGE EVENT -----");
        console.log("Sender ID:", senderId);
        console.log("Recipient ID:", recipientId);
        console.log("Message:", messageText);

        /*
          Ignore messages without text for now.
          Later we will handle posts, images,
          attachments and other message types.
        */

        if (!messageText || !senderId) {
          console.log("Message has no text or sender ID.");
          continue;
        }

        console.log("✅ REAL TEXT MESSAGE RECEIVED");

        try {
          /* =========================
             SEND TO OPENAI
          ========================= */

          console.log("Sending message to OpenAI...");

          const aiReply = await getAIReply(messageText);

          console.log("OpenAI reply:");
          console.log(aiReply);

          /* =========================
             SEND AI REPLY TO INSTAGRAM
          ========================= */

          await sendInstagramMessage(
            senderId,
            aiReply
          );

        } catch (error) {
          console.error("AI RESPONSE ERROR:");
          console.error(error);
        }
      }

      /* =========================
         READ EVENT
      ========================= */

      if (event.read) {
        console.log("----- READ EVENT -----");
        console.log("Message ID:", event.read.mid);
      }

      /* =========================
         REACTION EVENT
      ========================= */

      if (event.reaction) {
        console.log("----- REACTION EVENT -----");
        console.log(
          JSON.stringify(event.reaction, null, 2)
        );
      }

      /* =========================
         POSTBACK EVENT
      ========================= */

      if (event.postback) {
        console.log("----- POSTBACK EVENT -----");
        console.log(
          JSON.stringify(event.postback, null, 2)
        );
      }
    }
  }
});

/* =========================
   HOME PAGE
========================= */

app.get("/", (req, res) => {
  res.send("Instagram webhook is running!");
});

/* =========================
   AUTH CALLBACK
========================= */

app.get("/auth/callback", (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("Missing authorization code");
  }

  res.send("Instagram authorization successful");
});

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
