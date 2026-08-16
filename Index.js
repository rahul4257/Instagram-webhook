const express = require("express");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(express.json());

/* =========================================================
   ENVIRONMENT
========================================================= */

const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "instagram_verify_2026";
const OPEN_AI = process.env.OPEN_AI || "";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-5-mini";
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN || "";
const INSTAGRAM_USER_ID = process.env.INSTAGRAM_USER_ID || "17841404831696204";
const INSTAGRAM_API_VERSION = process.env.INSTAGRAM_API_VERSION || "v26.0";
const ADMIN_SECRET = process.env.ADMIN_SECRET || "";

/* Supabase is the persistent conversation memory. */
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const SUPABASE_TABLE = process.env.SUPABASE_TABLE || "instagram_conversations";

const supabase =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { autoRefreshToken: false, persistSession: false }
      })
    : null;

/* =========================================================
   BUSINESS
========================================================= */

const BUSINESS_NAME = "Global Promote";

const INSTAGRAM_PAGES = [
  "@expl.europe",
  "@expl.canada",
  "@expl.atlanta",
  "@expl.miami"
];

const PACKAGES_MESSAGE = `🎊 Instagram packages🎊

1️⃣ BRONZE PACKAGE 📦
👉 only 35€ = 2 story
🎉(1.5k followers guaranteed)

2️⃣ SILVER PACKAGE 📦
👉 only 60€ = 1 post and 3 story + 2 highlights 🎊
🎉(4k followers guaranteed)

3️⃣ GOLD PACKAGE 📦
👉 only 90€ = 3 post and 4 story + 3 highlights 🎊
🎉(7k followers guaranteed)
Mostly client choose this package!!

4️⃣ DIAMOND PACKAGE 📦
👉 only 120€ = 5 post and 8 story + 7 highlights 🎊
🎉(10k followers guaranteed)

💥 CHOOSE YOUR PACKAGE 💥`;

const PACKAGES = {
  bronze: {
    name: "Bronze",
    price: 35,
    details: "2 stories",
    followers: "1.5K followers guaranteed"
  },
  silver: {
    name: "Silver",
    price: 60,
    details: "1 post\n3 stories\n2 highlights",
    followers: "4K followers guaranteed"
  },
  gold: {
    name: "Gold",
    price: 90,
    details: "3 posts\n4 stories\n3 highlights",
    followers: "7K followers guaranteed"
  },
  diamond: {
    name: "Diamond",
    price: 120,
    details: "5 posts\n8 stories\n7 highlights",
    followers: "10K followers guaranteed"
  }
};

const PAYMENT_FEE_PERCENT = 12;

const PAYMENT_METHODS = [
  "paypal",
  "iban",
  "revolut",
  "mbway",
  "card"
];

const PAYPAL_DETAILS = `PayPal:
pay@globalpromote.in
https://paypal.me/RamanKumar4257`;

const IBAN_DETAILS = `Bank / Wise:

Account name: Rahul Kumar
IBAN: BE36967747881581
SWIFT/BIC: TRWIBEB1XXX
Bank: Wise

Bank address:
Rue du Trône 100, 3rd floor
Brussels, 1050
Belgium`;

const MBWAY_DETAILS = `MB WAY:
Number: +351 968 188 499
Name: Andre Santana`;

const REVOLUT_DETAILS = `Revolut:
Tag: @clavis02pk
Payment link: https://revolut.me/clavis02pk`;

const GUARANTEE_MESSAGE = `Yes ❤️ The followers are guaranteed because we upload your content on our pages and continue the promotion until you receive the followers included in your package.

If you don't gain the guaranteed followers, the amount will be refunded according to our guarantee policy. ❤️`;

/* =========================================================
   IN-MEMORY CACHE + QUEUE

   Supabase is the real memory. These Maps only make the live
   process fast and prevent duplicate/concurrent processing.
========================================================= */

const conversations = new Map();
const clientQueues = new Map();
const processedMessageIds = new Map();
const outgoingMessageIds = new Set();

/* A manual Instagram reply increments this number and cancels
   any AI reply that is still waiting to be sent. */
const manualReplyVersion = new Map();

/* =========================================================
   HELPERS
========================================================= */

function nowISO() {
  return new Date().toISOString();
}

function normalizeText(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[.,!?]/g, " ")
    .replace(/\s+/g, " ");
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getReplyDelay() {
  /* Short human-like delay, not 10–12 seconds. */
  return 2000 + Math.floor(Math.random() * 1500);
}

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isAdmin(req) {
  if (!ADMIN_SECRET) return false;
  return req.headers["x-admin-secret"] === ADMIN_SECRET;
}

/* =========================================================
   CONVERSATION MEMORY
========================================================= */

function createConversation(senderId) {
  return {
    senderId,
    history: [],
    summary: "",
    selectedPackage: null,
    paymentMethod: null,
    stage: "NEW",
    totalMessages: 0,
    firstSeenAt: nowISO(),
    lastSeenAt: nowISO(),
    processedMessageIds: [],
    lastAIMessageId: null
  };
}

function sanitizeConversation(saved, senderId) {
  const conversation = saved || createConversation(senderId);

  conversation.senderId = senderId;
  conversation.history = Array.isArray(conversation.history)
    ? conversation.history
    : [];
  conversation.summary = conversation.summary || "";
  conversation.selectedPackage = conversation.selectedPackage || null;
  conversation.paymentMethod = conversation.paymentMethod || null;
  conversation.stage = conversation.stage || "NEW";
  conversation.totalMessages = Number(conversation.totalMessages || conversation.history.length || 0);
  conversation.firstSeenAt = conversation.firstSeenAt || nowISO();
  conversation.lastSeenAt = nowISO();
  conversation.processedMessageIds = Array.isArray(conversation.processedMessageIds)
    ? conversation.processedMessageIds.slice(-100)
    : [];
  conversation.lastAIMessageId = conversation.lastAIMessageId || null;

  return conversation;
}

async function persistentMemoryGet(senderId) {
  if (!supabase) {
    console.error("Supabase memory is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
    return null;
  }

  try {
    const { data, error } = await supabase
      .from(SUPABASE_TABLE)
      .select("conversation")
      .eq("sender_id", String(senderId))
      .maybeSingle();

    if (error) {
      console.error("Supabase memory GET failed:", error.message);
      return null;
    }

    return data?.conversation || null;
  } catch (error) {
    console.error("Supabase memory GET error:", error);
    return null;
  }
}

async function persistentMemorySave(senderId, conversation) {
  if (!supabase) {
    console.error("Supabase memory is not configured.");
    return false;
  }

  try {
    const { error } = await supabase
      .from(SUPABASE_TABLE)
      .upsert(
        {
          sender_id: String(senderId),
          conversation,
          updated_at: nowISO()
        },
        { onConflict: "sender_id" }
      );

    if (error) {
      console.error("Supabase memory SAVE failed:", error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Supabase memory SAVE error:", error);
    return false;
  }
}

async function getConversation(senderId) {
  if (conversations.has(senderId)) {
    const existing = conversations.get(senderId);
    existing.lastSeenAt = nowISO();
    return existing;
  }

  const saved = await persistentMemoryGet(senderId);
  const conversation = sanitizeConversation(saved, senderId);

  conversations.set(senderId, conversation);

  if (!saved) {
    await persistentMemorySave(senderId, conversation);
  }

  console.log(
    saved
      ? `Loaded conversation from Supabase: ${senderId}`
      : `Created new conversation: ${senderId}`
  );

  return conversation;
}

async function saveConversation(senderId, conversation) {
  conversation.lastSeenAt = nowISO();
  conversations.set(senderId, conversation);
  return persistentMemorySave(senderId, conversation);
}

function saveMessage(conversation, role, text) {
  if (!text) return;

  conversation.history.push({
    role,
    text: String(text),
    timestamp: nowISO()
  });

  conversation.totalMessages += 1;
  conversation.lastSeenAt = nowISO();

  /* Keep the stored chat compact but useful. Supabase keeps this history. */
  if (conversation.history.length > 100) {
    conversation.history = conversation.history.slice(-100);
  }
}

function markProcessed(conversation, messageId) {
  if (!messageId) return;

  conversation.processedMessageIds.push(String(messageId));
  conversation.processedMessageIds = conversation.processedMessageIds.slice(-100);
}

function wasProcessed(conversation, messageId) {
  return Boolean(
    messageId &&
    conversation.processedMessageIds.includes(String(messageId))
  );
}

/* =========================================================
   PER-CLIENT QUEUE

   Messages from the SAME client are processed 1 -> 2 -> 3.
   Different clients can still be processed at the same time.
========================================================= */

function queueForClient(senderId, task) {
  const previous = clientQueues.get(senderId) || Promise.resolve();

  const next = previous
    .catch(() => {})
    .then(task);

clientQueues.set(senderId, next);

  next.finally(() => {
    if (clientQueues.get(senderId) === next) {
      clientQueues.delete(senderId);
    }
  }).catch(() => {});

  return next;
}

/* =========================================================
   PACKAGE / PAYMENT DETECTION
========================================================= */

function detectPackageSelection(text) {
  const t = normalizeText(text);

  if (/\bbronze\b/.test(t)) return "bronze";
  if (/\bsilver\b/.test(t)) return "silver";
  if (/\bgold\b/.test(t)) return "gold";
  if (/\bdiamond\b/.test(t)) return "diamond";

  if (/^(1|1st|first|package 1|package one|option 1|option one)$/.test(t)) return "bronze";
  if (/^(2|2nd|second|package 2|package two|option 2|option two)$/.test(t)) return "silver";
  if (/^(3|3rd|third|package 3|package three|option 3|option three)$/.test(t)) return "gold";
  if (/^(4|4th|fourth|package 4|package four|option 4|option four)$/.test(t)) return "diamond";

  return null;
}

function detectPaymentMethod(text) {
  const t = normalizeText(text);

  if (/\bpaypal\b/.test(t)) return "paypal";
  if (/\biban\b|\bwise\b|\bbank\b/.test(t)) return "iban";
  if (/\brevolut\b/.test(t)) return "revolut";
  if (/\bmb\s*way\b|\bmbway\b/.test(t)) return "mbway";
  if (/\bcredit\s*card\b|\bdebit\s*card\b|\bcard\b/.test(t)) return "card";

  return null;
}

function isGuaranteeQuestion(text) {
  const t = normalizeText(text);
  return (
    /\bguarantee\b/.test(t) ||
    /\bguaranteed\b/.test(t) ||
    /\brefund\b/.test(t) ||
    /\brefill\b/.test(t) ||
    /\bpermanent\b/.test(t) ||
    /\bhow.*followers.*guarantee\b/.test(t) ||
    /\bwhy.*guaranteed\b/.test(t)
  );
}

function isPaymentProof(text, attachmentInfo) {
  if (!attachmentInfo) return false;
  const t = normalizeText(text);
  return [
    "paid",
    "payment sent",
    "payment done",
    "i paid",
    "sent payment",
    "payment completed",
    "done payment",
    "transferred",
    "transfer done",
    "money sent"
  ].some(word => t.includes(word));
}

function calculatePayment(packageKey) {
  const selected = PACKAGES[packageKey];
  if (!selected) return null;

  const price = selected.price;
  const fee = Math.round(price * PAYMENT_FEE_PERCENT) / 100;
  const total = Math.round((price + fee) * 100) / 100;

  return { price, fee, total };
}

function buildPackageConfirmation(packageKey) {
  const selected = PACKAGES[packageKey];
  if (!selected) return null;

  return `Perfect ❤️ You've selected our ${selected.name} package.

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

function buildPaymentMessage(packageKey, paymentMethod) {
  const selected = PACKAGES[packageKey];
  if (!selected) return "Please select your package first ❤️";

  const payment = calculatePayment(packageKey);
  let details = "";

  if (paymentMethod === "paypal") details = PAYPAL_DETAILS;
  if (paymentMethod === "iban") details = IBAN_DETAILS;
  if (paymentMethod === "mbway") details = MBWAY_DETAILS;
  if (paymentMethod === "revolut") details = REVOLUT_DETAILS;
  if (paymentMethod === "card") {
    details = "Our team will assist you with the Credit/Debit Card payment ❤️";
  }

  return `Perfect ❤️

Package: ${selected.name}

Package price: €${payment.price.toFixed(2)}
12% payment fee: €${payment.fee.toFixed(2)}
Total: €${payment.total.toFixed(2)}

Payment method: ${paymentMethod.toUpperCase()}

${details}

After successful payment, please send us your payment screenshot ❤️`;
}

/* =========================================================
   AI CONTEXT
========================================================= */

function buildBusinessContext() {
  return `
BUSINESS: ${BUSINESS_NAME}

PROMOTION PAGES:
${INSTAGRAM_PAGES.join("\n")}

APPROVED PACKAGE LIST:
${PACKAGES_MESSAGE}

APPROVED GUARANTEE:
${GUARANTEE_MESSAGE}

APPROVED PAYMENT METHODS:
${PAYMENT_METHODS.join(", ")}

PAYMENT RULE:
Customer chooses a package first, then payment method. A 12% payment fee is added.

IMPORTANT SALES FLOW:
- Answer the customer's actual message.
- If they ask to see packages or show clear interest, send the approved package list.
- If they select a package, confirm that package and ask how they want to pay.
- If they select a payment method after a package is selected, send the approved payment instructions.
- Never restart the conversation.
- Never send the opening pitch to a returning customer.
- Never invent prices, services, payment details, guarantees or policies.
`;
}

function buildConversationContext(conversation) {
  const recent = conversation.history
    .slice(-40)
    .map(item => `${item.role.toUpperCase()}: ${item.text}`)
    .join("\n");

  return `
PERSISTENT CONVERSATION MEMORY:
Summary: ${conversation.summary || "No summary yet."}
Selected package: ${conversation.selectedPackage || "None"}
Payment method: ${conversation.paymentMethod || "None"}

RECENT CHAT:
${recent || "No previous messages."}
`;
}

/* =========================================================
   OPENAI

   One AI call per customer message. No classifier -> AI ->
   classifier chain. This is intentionally simple.
========================================================= */

function extractOpenAIText(data) {
  if (typeof data?.output_text === "string") {
    return data.output_text.trim();
  }

  let text = "";

  if (Array.isArray(data?.output)) {
    for (const item of data.output) {
      if (!Array.isArray(item.content)) continue;
      for (const content of item.content) {
        if (content.type === "output_text" && typeof content.text === "string") {
          text += content.text;
        }
      }
    }
  }

  return text.trim();
}

async function getAIReply(conversation, clientMessage, attachmentInfo) {
  if (!OPEN_AI) {
    console.error("OPEN_AI is not configured.");
    return null;
  }

  const prompt = `You are the sales/customer-support AI for ${BUSINESS_NAME}.

${buildBusinessContext()}

${buildConversationContext(conversation)}

LATEST CUSTOMER MESSAGE:
${clientMessage || "[media]"}

ATTACHMENT:
${attachmentInfo || "none"}

RULES:
1. You MUST use the persistent chat context above. This is a continuing Instagram DM, not a new conversation.
2. Never restart from the beginning just because there was a time gap.
3. Never send the opening pitch unless the customer explicitly asks what the service is.
4. Answer the latest customer message first.
5. If the customer asks for packages, send the exact approved package list.
6. If the customer clearly chooses Bronze/Silver/Gold/Diamond, do not send the full package list again. Confirm that package and ask how they want to pay.
7. If the customer already selected a package and now names PayPal, IBAN/Wise, Revolut, MB WAY or card, send the approved payment instructions for that selected package.
8. If the customer asks a normal question, answer naturally using only approved business information.
9. If they ask about the guarantee, use the approved guarantee information.
10. Do not repeat a previous answer unless it is needed for the latest question.
11. Keep the reply short and natural.
12. Do not invent information.
13. Never claim a payment was received.
14. Reply in the customer's language when practical.
15. If the customer says yes/okay/sure/show me after a promotion conversation, understand that as interest and show the approved package list.
16. If the message is unrelated but can be answered safely, answer it naturally.

Return ONLY the customer-facing reply. No analysis, no labels.`;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPEN_AI}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        input: prompt,
        max_output_tokens: 400
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI reply error:", data);
      return null;
    }

    const reply = extractOpenAIText(data).trim();
    if (!reply || reply === "NO_REPLY") return null;

    return reply;
  } catch (error) {
    console.error("AI reply error:", error);
    return null;
  }
}

/* =========================================================
   SAFE SEND
========================================================= */

async function sendInstagramMessage(recipientId, text) {
  if (!PAGE_ACCESS_TOKEN) {
    throw new Error("PAGE_ACCESS_TOKEN is missing");
  }

  const url =
    `https://graph.instagram.com/${INSTAGRAM_API_VERSION}` +
    `/${INSTAGRAM_USER_ID}/messages`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`
    },
    body: JSON.stringify({
      recipient: { id: recipientId },
      message: { text }
    })
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Instagram API error:", data);
    throw new Error("Instagram message failed");
  }

  const messageId = data?.message_id || data?.id || null;
  if (messageId) outgoingMessageIds.add(String(messageId));

  return data;
}

/* =========================================================
   MANUAL OUTGOING MESSAGE HANDLING

   If YOU manually send a DM while an AI reply is waiting,
   the Instagram echo event cancels that pending AI reply.
========================================================= */

async function handleManualOutgoingEcho(event) {
  const messageId = event?.message?.mid || null;

  if (messageId && outgoingMessageIds.has(String(messageId))) {
    outgoingMessageIds.delete(String(messageId));
    return;
  }

  const customerId = event?.recipient?.id;
  if (!customerId || String(customerId) === String(INSTAGRAM_USER_ID)) {
    return;
  }

  const version = (manualReplyVersion.get(customerId) || 0) + 1;
  manualReplyVersion.set(customerId, version);

  const conversation = await getConversation(customerId);
  const text = event?.message?.text || "";

  if (text) {
    saveMessage(conversation, "assistant", text);
  }

  await saveConversation(customerId, conversation);

  console.log("Manual Instagram reply detected. Pending AI reply cancelled:", customerId);
}

/* =========================================================
   CUSTOMER MESSAGE PROCESSING
========================================================= */
async function processCustomerMessage(senderId, messageId, clientMessage, attachmentInfo) {
  const conversation = await getConversation(senderId);

  if (wasProcessed(conversation, messageId)) {
    console.log("Duplicate message ignored:", messageId);
    return;
  }

  /* Mark it immediately so Meta retries cannot create a second reply. */
  markProcessed(conversation, messageId);
  saveMessage(conversation, "client", clientMessage || attachmentInfo || "[media]");
  await saveConversation(senderId, conversation);

  const myManualVersion = manualReplyVersion.get(senderId) || 0;

  console.log("----------------------------------------");
  console.log("CLIENT MESSAGE");
  console.log("Sender:", senderId);
  console.log("Message:", clientMessage);
  console.log("Previous messages:", conversation.history.length - 1);

  /* Deterministic package selection first. */
  const packageKey = detectPackageSelection(clientMessage);
  if (packageKey) {
    conversation.selectedPackage = packageKey;
    conversation.paymentMethod = null;
    conversation.stage = "PACKAGE_SELECTED";

    const reply = buildPackageConfirmation(packageKey);
    await sendReplyIfStillNeeded(senderId, conversation, reply, myManualVersion);
    return;
  }

  /* Deterministic payment selection when a package is already known. */
  const paymentMethod = detectPaymentMethod(clientMessage);
  if (paymentMethod && conversation.selectedPackage) {
    conversation.paymentMethod = paymentMethod;
    conversation.stage = "PAYMENT_PENDING";

    const reply = buildPaymentMessage(
      conversation.selectedPackage,
      paymentMethod
    );

    await sendReplyIfStillNeeded(senderId, conversation, reply, myManualVersion);
    return;
  }

  /* Payment proof gets a fixed confirmation. */
  if (isPaymentProof(clientMessage, attachmentInfo)) {
    const reply = `Thank you ❤️\n\nWe will verify the payment and our team will confirm it with you shortly.`;
    await sendReplyIfStillNeeded(senderId, conversation, reply, myManualVersion);
    return;
  }

  /* Guarantee questions are deterministic and do not need an AI call. */
  if (isGuaranteeQuestion(clientMessage)) {
    await sendReplyIfStillNeeded(senderId, conversation, GUARANTEE_MESSAGE, myManualVersion);
    return;
  }

  /* Everything else gets ONE AI call with the complete memory context. */
  const reply = await getAIReply(conversation, clientMessage, attachmentInfo);

  if (!reply) {
    await saveConversation(senderId, conversation);
    return;
  }

  await sendReplyIfStillNeeded(senderId, conversation, reply, myManualVersion);
}

async function sendReplyIfStillNeeded(senderId, conversation, reply, versionAtStart) {
  if (!reply) return;

  /* Wait briefly. This prevents rapid duplicate-looking replies and gives
     the owner a chance to manually answer the customer. */
  await sleep(getReplyDelay());

  const currentVersion = manualReplyVersion.get(senderId) || 0;
  if (currentVersion !== versionAtStart) {
    console.log("AI reply cancelled because owner replied manually:", senderId);
    await saveConversation(senderId, conversation);
    return;
  }

  const data = await sendInstagramMessage(senderId, reply);
  saveMessage(conversation, "assistant", reply);

  conversation.lastAIMessageId = data?.message_id || data?.id || null;
  conversation.lastSeenAt = nowISO();

  await saveConversation(senderId, conversation);

  console.log("Reply sent successfully:", senderId);
}

/* =========================================================
   WEBHOOK VERIFICATION
========================================================= */

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified successfully.");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

/* =========================================================
   INSTAGRAM WEBHOOK
========================================================= */

app.post("/webhook", async (req, res) => {
  /* Meta needs a fast 200. Processing continues below. */
  res.sendStatus(200);

  const body = req.body;

  if (body?.object !== "instagram" || !Array.isArray(body?.entry)) {
    return;
  }

  for (const entry of body.entry) {
    if (!Array.isArray(entry.messaging)) continue;

    for (const event of entry.messaging) {
      /* Read events are not customer messages. */
      if (event.read?.mid) continue;

      if (!event.message) continue;

      /* Handle Instagram echo events first. */
      if (event.message.is_echo === true) {
        queueForClient(
          event.recipient?.id || "unknown",
          () => handleManualOutgoingEcho(event)
        ).catch(error => console.error("Echo handling error:", error));
        continue;
      }

      const senderId = event.sender?.id;
      const messageId = event.message?.mid;

      if (!senderId || !messageId) continue;

      /* Never process messages generated by our own account. */
      if (String(senderId) === String(INSTAGRAM_USER_ID)) continue;

      /* Fast duplicate guard before entering the queue. */
      const duplicateKey = String(messageId);
      if (processedMessageIds.has(duplicateKey)) {
        console.log("Webhook duplicate ignored:", duplicateKey);
        continue;
      }
      processedMessageIds.set(duplicateKey, Date.now());

      setTimeout(() => processedMessageIds.delete(duplicateKey), 60 * 60 * 1000);

      const clientMessage = event.message.text || "";
      const attachmentInfo = getAttachmentInfo(event.message);

      if (!clientMessage && !attachmentInfo) continue;

      /* Every client has its own queue. Client A cannot block Client B. */
      queueForClient(senderId, () =>
        processCustomerMessage(
          senderId,
          messageId,
          clientMessage,
          attachmentInfo
        )
      ).catch(error => {
        console.error("Customer message processing error:", error);
      });
    }
  }
});

function getAttachmentInfo(message) {
  const parts = [];

  if (Array.isArray(message?.attachments)) {
    for (const attachment of message.attachments) {
      const type = attachment.type || "unknown";
      const url = attachment.payload?.url || attachment.payload?.src || "";
      parts.push(`type=${type}, url=${url}`);
    }
  }

  if (message?.share) {
    parts.push(`shared=${JSON.stringify(message.share)}`);
  }

  return parts.join("\n");
}

/* =========================================================
   ADMIN: READ-ONLY STATUS

   No AI START/STOP controls. AI is always active.
========================================================= */

app.get("/admin/status", async (req, res) => {
  if (!isAdmin(req)) return res.sendStatus(403);

  const clients = Array.from(conversations.entries()).map(([senderId, conversation]) => ({
    senderId,
    messages: conversation.history.length,
    selectedPackage: conversation.selectedPackage,
    paymentMethod: conversation.paymentMethod,
    lastSeenAt: conversation.lastSeenAt,
    stage: conversation.stage
  }));

  res.json({
    success: true,
    aiAlwaysOn: true,
    persistentMemory: Boolean(supabase),
    memoryProvider: "Supabase",
    clients
  });
});

app.get("/admin/client/:senderId", async (req, res) => {
  if (!isAdmin(req)) return res.sendStatus(403);

  const conversation = await getConversation(req.params.senderId);

  res.json({
    success: true,
    aiAlwaysOn: true,
    conversation
  });
});

app.post("/admin/client/reset/:senderId", async (req, res) => {
  if (!isAdmin(req)) return res.sendStatus(403);

  const senderId = req.params.senderId;
  const conversation = createConversation(senderId);

  conversations.set(senderId, conversation);
  manualReplyVersion.set(senderId, (manualReplyVersion.get(senderId) || 0) + 1);
  await persistentMemorySave(senderId, conversation);

  res.json({ success: true, senderId, message: "Conversation memory reset." });
});

/* =========================================================
   SIMPLE ADMIN PAGE
========================================================= */

app.get("/admin", (req, res) => {
  res.send(`<!doctype html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Global Promote AI</title>
<style>
body{font-family:Arial,sans-serif;background:#f6f7f9;margin:0;padding:20px;color:#111}
.container{max-width:850px;margin:auto}
.card{background:#fff;border-radius:16px;padding:18px;margin-bottom:15px;box-shadow:0 2px 12px rgba(0,0,0,.06)}
h1{margin:0 0 5px}.muted{color:#666}.ok{color:#15803d;font-weight:700}
input{width:100%;box-sizing:border-box;padding:12px;border:1px solid #ddd;border-radius:10px;font-size:16px}
button{padding:11px 15px;border:0;border-radius:10px;margin-top:10px;cursor:pointer}
.client{border-top:1px solid #eee;padding:15px 0}.chat{white-space:pre-wrap;background:#fafafa;border-radius:10px;padding:12px;margin-top:10px;max-height:420px;overflow:auto}
</style>
</head>
<body>
<div class="container">
<div class="card">
<h1>🤖 Global Promote AI</h1>
<div class="ok">🟢 AI IS ALWAYS ON</div>
<div class="muted">Simple mode • Supabase memory • No start/stop controls • No reminders</div>
</div>
<div class="card">
<input id="secret" type="password" placeholder="ADMIN_SECRET">
<button onclick="saveSecret()">Save Secret</button>
</div>
<div class="card"><h2>Clients</h2><div id="clients">Enter ADMIN_SECRET.</div></div>
</div>
<script>
let secret=localStorage.getItem('global_promote_admin_secret')||'';
document.getElementById('secret').value=secret;
function saveSecret(){secret=document.getElementById('secret').value.trim();localStorage.setItem('global_promote_admin_secret',secret);loadStatus();}
async function request(url){const r=await fetch('/'+url,{headers:{'x-admin-secret':secret}});if(!r.ok)throw new Error('Request failed: '+r.status);return r.json();}
async function loadStatus(){if(!secret)return;try{const data=await request('admin/status');const box=document.getElementById('clients');if(!data.clients.length){box.innerHTML='No clients loaded yet.';return;}box.innerHTML=data.clients.map(c=>'<div class="client"><b>Client:</b> '+escapeHtml(c.senderId)+'<br><b>Messages:</b> '+c.messages+'<br><b>Package:</b> '+escapeHtml(c.selectedPackage||'None')+'<br><b>Payment:</b> '+escapeHtml(c.paymentMethod||'None')+'<br><button onclick="view(\''+encodeURIComponent(c.senderId)+'\')">View chat</button></div>').join('');}catch(e){document.getElementById('clients').innerText=e.message;}}
async function view(id){try{const data=await request('admin/client/'+id);const c=data.conversation;let text='Selected package: '+(c.selectedPackage||'None')+'\\nPayment: '+(c.paymentMethod||'None')+'\\n\\n';text+=c.history.map(m=>m.role.toUpperCase()+': '+m.text).join('\\n\\n');alert(text);}catch(e){alert(e.message);}}
function escapeHtml(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
loadStatus();setInterval(loadStatus,15000);
</script>
</body>
</html>`);
});

/* =========================================================
   HEALTH
========================================================= */

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    instagram: Boolean(INSTAGRAM_USER_ID && PAGE_ACCESS_TOKEN),
    openai: Boolean(OPEN_AI),
    supabase: Boolean(supabase),
    memoryProvider: "Supabase",
    aiAlwaysOn: true,
    conversations: conversations.size,
    model: OPENAI_MODEL
  });
});

app.get("/", (req, res) => {
  res.send("Global Promote Instagram AI is running!");
});

app.get("/auth/callback", (req, res) => {
  if (!req.query.code) return res.status(400).send("Missing authorization code");
  res.send("Instagram authorization successful");
});

/* =========================================================
   START
========================================================= */

async function startServer() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("WARNING: Supabase memory is NOT configured.");
    console.warn("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  if (!OPEN_AI) console.warn("WARNING: OPEN_AI is not configured.");
  if (!PAGE_ACCESS_TOKEN) console.warn("WARNING: PAGE_ACCESS_TOKEN is not configured.");

  app.listen(PORT, () => {
    console.log("========================================");
    console.log(`Server running on port ${PORT}`);
    console.log("AI mode: ALWAYS ON");
    console.log("Start/Stop AI controls: REMOVED");
    console.log("Reminders: REMOVED");
    console.log("AI architecture: ONE AI CALL PER CUSTOMER MESSAGE");
    console.log("Per-client queue: ENABLED");
    console.log("Duplicate protection: ENABLED");
    console.log("Manual-reply cancellation: ENABLED");
    console.log("Supabase persistent memory:", Boolean(supabase) ? "ENABLED" : "NOT CONFIGURED");
    console.log("Package prices: €35 / €60 / €90 / €120");
    console.log("========================================");
  });
}

startServer();
