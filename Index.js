const express = require("express");

const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "instagram_verify_2026";

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post("/webhook", (req, res) => {
  console.log("Instagram webhook received:");

  const body = req.body;

  console.log(JSON.stringify(body, null, 2));

  if (body.entry) {
    body.entry.forEach((entry) => {
      if (entry.messaging) {
        entry.messaging.forEach((event) => {
          const senderId = event.sender?.id;
          const messageText = event.message?.text;

          if (senderId && messageText) {
            console.log("Sender ID:", senderId);
            console.log("Message:", messageText);
          }
        });
      }
    });
  }

  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.send("Instagram webhook is running!");
});
app.get("/auth/callback", (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("Missing authorization code");
  }

  res.send("Instagram authorization successful!");
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
