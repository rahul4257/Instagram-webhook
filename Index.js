const express = require("express");

const app = express();
app.use(express.json());

const VERIFY_TOKEN =
  process.env.VERIFY_TOKEN || "instagram_verify_2026";

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
   INSTAGRAM WEBHOOK
========================= */

app.post("/webhook", (req, res) => {
  console.log("=================================");
  console.log("INSTAGRAM WEBHOOK RECEIVED");
  console.log("=================================");

  const body = req.body;

  console.log(JSON.stringify(body, null, 2));

  if (body.object === "instagram" && body.entry) {
    body.entry.forEach((entry) => {
      console.log("Instagram Account ID:", entry.id);

      if (entry.messaging) {
        entry.messaging.forEach((event) => {

          /* ---------- MESSAGE ---------- */

          if (event.message) {
            const senderId = event.sender?.id;
            const recipientId = event.recipient?.id;

            const messageText = event.message?.text;

            console.log("----- MESSAGE EVENT -----");
            console.log("Sender ID:", senderId);
            console.log("Recipient ID:", recipientId);
            console.log("Message:", messageText);

            if (messageText) {
              console.log("✅ REAL TEXT MESSAGE RECEIVED");
            }
          }

          /* ---------- READ ---------- */

          if (event.read) {
            console.log("----- READ EVENT -----");
            console.log("Message ID:", event.read.mid);
          }

          /* ---------- REACTION ---------- */

          if (event.reaction) {
            console.log("----- REACTION EVENT -----");
            console.log(JSON.stringify(event.reaction, null, 2));
          }

          /* ---------- POSTBACK ---------- */

          if (event.postback) {
            console.log("----- POSTBACK EVENT -----");
            console.log(JSON.stringify(event.postback, null, 2));
          }

          /* ---------- OTHER EVENT ---------- */

          if (
            !event.message &&
            !event.read &&
            !event.reaction &&
            !event.postback
          ) {
            console.log("----- OTHER EVENT -----");
            console.log(JSON.stringify(event, null, 2));
          }
        });
      }
    });
  }

  // Tell Meta that we successfully received the webhook.
  return res.sendStatus(200);
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
