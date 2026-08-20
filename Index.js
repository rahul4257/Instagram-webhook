const express = require("express");
const app = express();

app.use(express.json());

/* =========================================================
   ENVIRONMENT VARIABLES
========================================================= */

const VERIFY_TOKEN =
  process.env.VERIFY_TOKEN || "instagram_verify_2026";

const OPEN_AI =
  process.env.OPEN_AI || "";

const OPENAI_MODEL =
  process.env.OPENAI_MODEL || "gpt-5-mini";

const PAGE_ACCESS_TOKEN =
  process.env.PAGE_ACCESS_TOKEN || "";

const INSTAGRAM_USER_ID =
  "17841404831696204";

const INSTAGRAM_API_VERSION =
  "v26.0";

const PORT =
  process.env.PORT || 3000;

const ADMIN_SECRET =
  process.env.ADMIN_SECRET || "";

/*
 * KEEPING YOUR EXISTING MEMORY CONNECTIONS
 */
const SUPABASE_URL =
  process.env.SUPABASE_URL || "";

const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const SUPABASE_TABLE =
  process.env.SUPABASE_TABLE || "Conversations";

/*
 * Legacy MEMORY_URL / MEMORY_TOKEN are kept only as a fallback.
 * The primary persistent memory is now Supabase.
 */
const MEMORY_URL =
  process.env.MEMORY_URL || "";

const MEMORY_TOKEN =
  process.env.MEMORY_TOKEN || "";


/* =========================================================
   BUSINESS
========================================================= */

const BUSINESS_NAME =
  "Global Promote";

const INSTAGRAM_PAGES = [
  "@expl.europe",
  "@expl.canada",
  "@expl.atlanta",
  "@expl.miami"
];


/* =========================================================
   FIXED MESSAGE 1
========================================================= */

const MESSAGE_ONE =
`Hey dear ♥️
I see your profile, its a great content ♥️
Would you like to get featured on our page?`;


/* =========================================================
   FIXED MESSAGE 2
========================================================= */

const MESSAGE_TWO =
`We are here to spotlight your profile 💫
@expl.europe
@expl.canada
@expl.atlanta
@expl.miami

I will upload your post on these pages and from that you will gain 1k to 15k guaranteed followers according to your package. Can I show you our packages ?`;


/* =========================================================
   EXACT PACKAGE LIST
========================================================= */

const PACKAGES_MESSAGE =
`🎊 Instagram packages🎊

1️⃣ BRONZE PACKAGE 📦
👉 only 39€ =  2story
🎉(1.5k followers guaranteed)

2️⃣ SILVER PACKAGE 📦
👉 only 66€ = 1 post and 3stroy + 2 highlights 🎊
🎉( 4k followers guaranteed)

3️⃣ GOLD PACKAGE 📦
👉 only 99€ = 3 post and 4 stroy +3 highlights 🎊
🎉( 7k followers guaranteed)
Mostly client choose this package!!

4️⃣ DIAMOND PACKAGE 📦
👉 only 129€ = 5 post and 8 story + 7 highlights 🎊
🎉( 10k followers guaranteed)

💥 CHOOSE YOUR PACKAGE 💥`;


/* =========================================================
   GUARANTEE
========================================================= */

const GUARANTEE_MESSAGE =
`Yes ❤️ The followers are guaranteed because we upload your content on our pages and continue the promotion until you receive the followers included in your package.

If you don't gain the guaranteed followers, the amount will be refunded according to our guarantee policy. ❤️`;


/* =========================================================
   PACKAGE DATA
========================================================= */

const PACKAGES = {

  bronze: {
    name: "Bronze",
    price: 39,
    details:
      "2 story",
    followers:
      "1.5k followers guaranteed"
  },

  silver: {
    name: "Silver",
    price: 66,
    details:
      "1 post and 3 story + 2 highlights",
    followers:
      "4k followers guaranteed"
  },

  gold: {
    name: "Gold",
    price: 99,
    details:
      "3 post and 4 story + 3 highlights",
    followers:
      "7k followers guaranteed"
  },

  diamond: {
    name: "Diamond",
    price: 129,
    details:
      "5 post and 8 story + 7 highlights",
    followers:
      "10k followers guaranteed"
  }

};


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
   STORAGE
========================================================= */

const conversations =
  new Map();

const clientQueues =
  new Map();

const processedMessageIds =
  new Map();

const outgoingMessages =
  new Set();

const manualReplyVersion =
  new Map();


/* =========================================================
   HELPERS
========================================================= */

function nowISO() {
  return new Date().toISOString();
}

function wait(ms) {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}

function replyDelay() {
  return (
    7000 +
    Math.floor(Math.random() * 3000)
  );
}

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[.,!?]/g, " ")
    .replace(/\s+/g, " ");
}


/* =========================================================
   CONVERSATION
========================================================= */

function createConversation(senderId) {

  return {

    senderId,

    stage: "NEW",

    history: [],

    selectedPackage: null,

    paymentMethod: null,

    lastSeenAt: nowISO(),

    /*
     * Persistent state used to understand what the
     * customer's next message is replying to.
     */
    lastOutgoingMessageId: null,

    lastOutgoingText: null,

    lastOutgoingStage: null,

    lastOutgoingAt: null

  };
}


function saveMessage(
  conversation,
  role,
  text
) {

  if (!text) return;

  conversation.history.push({

    role,

    text: String(text),

    timestamp: nowISO()

  });

  if (
    conversation.history.length >
    60
  ) {
    conversation.history =
      conversation.history.slice(-60);
  }

  conversation.lastSeenAt =
    nowISO();
}


/* =========================================================
   PERSISTENT SUPABASE MEMORY
========================================================= */

/*
 * Supabase table:
 *
 * public.Conversations
 *   id         text primary key
 *   messages   jsonb
 *   updated_at timestamptz default now()
 *
 * We store the COMPLETE conversation object in the jsonb
 * "messages" column. This means stage/history/package/payment
 * state survives Render restarts.
 */

function supabaseConfigured() {
  return Boolean(
    SUPABASE_URL &&
    SUPABASE_SERVICE_ROLE_KEY
  );
}

function supabaseHeaders() {
  return {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization:
      `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json"
  };
}

function supabaseRowUrl(senderId) {
  return (
    `${SUPABASE_URL.replace(/\/+$/, "")}` +
    `/rest/v1/${encodeURIComponent(SUPABASE_TABLE)}` +
    `?id=eq.${encodeURIComponent(senderId)}`
  );
}

async function supabaseGetConversation(senderId) {

  if (!supabaseConfigured()) {
    console.error(
      "SUPABASE MEMORY NOT CONFIGURED: " +
      "SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing."
    );
    return null;
  }

  try {

    const response =
      await fetch(
        `${SUPABASE_URL.replace(/\/+$/, "")}` +
        `/rest/v1/${encodeURIComponent(SUPABASE_TABLE)}` +
        `?select=id,messages,updated_at` +
        `&id=eq.${encodeURIComponent(senderId)}` +
        `&limit=1`,
        {
          method: "GET",
          headers: supabaseHeaders()
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      console.error(
        "SUPABASE GET ERROR:",
        data
      );
      return null;
    }

    if (!Array.isArray(data) || !data.length) {
      return null;
    }

    const stored = data[0]?.messages;

    /*
     * New format: complete conversation object.
     */
    if (
      stored &&
      typeof stored === "object" &&
      !Array.isArray(stored) &&
      (
        stored.stage ||
        stored.history ||
        stored.senderId
      )
    ) {
      return stored;
    }

    /*
     * Backward compatibility with the old memory-test format:
     * [{ role, content }, ...]
     */
    if (Array.isArray(stored)) {

      const conversation =
        createConversation(senderId);

      conversation.history =
        stored
          .map(item => ({
            role:
              item?.role === "assistant"
                ? "assistant"
                : "client",
            text:
              String(
                item?.text ??
                item?.content ??
                ""
              ),
            timestamp:
              item?.timestamp ||
              nowISO()
          }))
          .filter(item => item.text);

      return conversation;
    }

    return null;

  } catch (error) {

    console.error(
      "SUPABASE GET EXCEPTION:",
      error.message
    );

    return null;
  }
}

async function supabaseSaveConversation(
  senderId,
  conversation
) {

  if (!supabaseConfigured()) {
    console.error(
      "SUPABASE MEMORY NOT CONFIGURED: " +
      "conversation was NOT persisted."
    );
    return false;
  }

  try {

    const response =
      await fetch(
        `${SUPABASE_URL.replace(/\/+$/, "")}` +
        `/rest/v1/${encodeURIComponent(SUPABASE_TABLE)}`,
        {
          method: "POST",
          headers: {
            ...supabaseHeaders(),
            Prefer:
              "resolution=merge-duplicates,return=minimal"
          },
          body:
            JSON.stringify({
              id: String(senderId),
              messages: conversation,
              updated_at: nowISO()
            })
        }
      );

    const raw =
      await response.text();

    if (!response.ok) {

      console.error(
        "SUPABASE SAVE ERROR:",
        response.status,
        raw
      );

      return false;
    }

    return true;

  } catch (error) {

    console.error(
      "SUPABASE SAVE EXCEPTION:",
      error.message
    );

    return false;
  }
}

/*
 * Legacy memory service is retained only as a fallback if
 * Supabase is not configured. It is no longer the primary store.
 */
async function legacyMemoryGet(senderId) {

  if (
    !MEMORY_URL ||
    !MEMORY_TOKEN
  ) {
    return null;
  }

  try {

    const key =
      encodeURIComponent(
        `instagram:${senderId}`
      );

    const response =
      await fetch(
        `${MEMORY_URL}/get/${key}`,
        {
          headers: {
            Authorization:
              `Bearer ${MEMORY_TOKEN}`
          }
        }
      );

    if (!response.ok) {
      return null;
    }

    const data =
      await response.json();

    if (!data?.result) {
      return null;
    }

    return JSON.parse(
      data.result
    );

  } catch (error) {

    console.error(
      "LEGACY MEMORY GET ERROR:",
      error.message
    );

    return null;
  }
}

async function legacyMemorySave(
  senderId,
  conversation
) {

  if (
    !MEMORY_URL ||
    !MEMORY_TOKEN
  ) {
    return;
  }

  try {

    const key =
      encodeURIComponent(
        `instagram:${senderId}`
      );

    const value =
      encodeURIComponent(
        JSON.stringify(
          conversation
        )
      );

    await fetch(
      `${MEMORY_URL}/set/${key}/${value}`,
      {
        method: "POST",
        headers: {
          Authorization:
            `Bearer ${MEMORY_TOKEN}`
        }
      }
    );

  } catch (error) {

    console.error(
      "LEGACY MEMORY SAVE ERROR:",
      error.message
    );
  }
}

async function getConversation(
  senderId
) {

  if (
    conversations.has(senderId)
  ) {

    return conversations.get(
      senderId
    );
  }

  /*
   * ALWAYS try Supabase first. Do not create a NEW
   * conversation merely because the Node process restarted.
   */
  let saved =
    await supabaseGetConversation(
      senderId
    );

  /*
   * Optional legacy fallback for installations that
   * still have data in the old MEMORY_URL store.
   */
  if (!saved) {
    saved =
      await legacyMemoryGet(
        senderId
      );
  }

  const conversation =
    saved &&
    typeof saved === "object"
      ? saved
      : createConversation(
          senderId
        );

  conversation.senderId =
    senderId;

  conversation.history =
    Array.isArray(
      conversation.history
    )
      ? conversation.history
      : [];

  conversation.stage =
    conversation.stage ||
    "NEW";

  conversation.selectedPackage =
    conversation.selectedPackage ||
    null;

  conversation.paymentMethod =
    conversation.paymentMethod ||
    null;

  conversation.lastOutgoingMessageId =
    conversation.lastOutgoingMessageId ||
    null;

  conversation.lastOutgoingText =
    conversation.lastOutgoingText ||
    null;

  conversation.lastOutgoingStage =
    conversation.lastOutgoingStage ||
    null;

  conversation.lastOutgoingAt =
    conversation.lastOutgoingAt ||
    null;

  conversations.set(
    senderId,
    conversation
  );

  console.log(
    "Conversation loaded:",
    senderId,
    conversation.stage,
    "history:",
    conversation.history.length
  );

  return conversation;
}

async function saveConversation(
  senderId,
  conversation
) {

  conversations.set(
    senderId,
    conversation
  );

  /*
   * Supabase is the source of truth.
   */
  const saved =
    await supabaseSaveConversation(
      senderId,
      conversation
    );

  /*
   * Only use the old memory service as an additional
   * backup, not as the main database.
   */
  if (MEMORY_URL && MEMORY_TOKEN) {
    await legacyMemorySave(
      senderId,
      conversation
    );
  }

  return saved;
}

/* =========================================================
   PER-CLIENT QUEUE
========================================================= */

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

  }).catch(() => {});

  return next;
  }
/* =========================================================
   PACKAGE DETECTION
========================================================= */

function detectPackage(text) {

  const t =
    normalize(text);

  if (
    /\bbronze\b/.test(t)
  ) {
    return "bronze";
  }

  if (
    /\bsilver\b/.test(t)
  ) {
    return "silver";
  }

  if (
    /\bgold\b/.test(t)
  ) {
    return "gold";
  }

  if (
    /\bdiamond\b/.test(t)
  ) {
    return "diamond";
}
   if (
    /\bpackage\s*1\b/.test(t) ||
    /^1$/.test(t)
  ) {
    return "bronze";
  }

  if (
    /\bpackage\s*2\b/.test(t) ||
    /^2$/.test(t)
  ) {
    return "silver";
  }

  if (
    /\bpackage\s*3\b/.test(t) ||
    /^3$/.test(t)
  ) {
    return "gold";
  }

  if (
    /\bpackage\s*4\b/.test(t) ||
    /^4$/.test(t)
  ) {
    return "diamond";
  }

  return null;
}


/* =========================================================
   PAYMENT METHOD
========================================================= */

function detectPaymentMethod(
  text
) {

  const t =
    normalize(text);

  if (
    /\bpaypal\b/.test(t)
  ) {
    return "paypal";
  }

  if (
    /\bwise\b/.test(t) ||
    /\biban\b/.test(t) ||
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
    /\bmbway\b/.test(t) ||
    /\bmb way\b/.test(t)
  ) {
    return "mbway";
  }

  if (
    /\bcard\b/.test(t) ||
    /\bcredit card\b/.test(t) ||
    /\bdebit card\b/.test(t)
  ) {
    return "card";
  }

  return null;
}


/* =========================================================
   PACKAGE CONFIRMATION
========================================================= */

function buildPackageConfirmation(
  packageKey
) {

  const p =
    PACKAGES[packageKey];

  return `Perfect ❤️

You've selected the ${p.name} package.

€${p.price} = ${p.details}
${p.followers}

How would you like to pay?

PayPal
IBAN / Wise
Revolut
MB WAY
Credit/Debit Card`;
}


/* =========================================================
   PAYMENT MESSAGE
========================================================= */

function buildPaymentMessage(
  packageKey,
  method
) {

  const p =
    PACKAGES[packageKey];

  let details = "";

  if (
    method === "paypal"
  ) {
    details = PAYPAL_DETAILS;
  }
  else if (
    method === "iban"
  ) {
    details = IBAN_DETAILS;
  }
  else if (
    method === "revolut"
  ) {
    details = REVOLUT_DETAILS;
  }
  else if (
    method === "mbway"
  ) {
    details = MBWAY_DETAILS;
  }
  else {
    details =
      "Our team will assist you with the Credit/Debit Card payment ❤️";
  }

  return `Perfect ❤️

Package: ${p.name}

Package price: €${p.price.toFixed(2)}

Total: €${p.price.toFixed(2)}

Payment method: ${method.toUpperCase()}

${details}

After successful payment, please send us your payment screenshot ❤️`;
}


/* =========================================================
   MEDIA / LINK
========================================================= */

function getAttachmentInfo(
  message
) {

  const parts = [];

  for (
    const attachment
    of message?.attachments || []
  ) {

    parts.push(
      `type=${attachment.type || "unknown"}`
    );
  }

  if (
    message?.share
  ) {

    parts.push(
      `shared=${JSON.stringify(
        message.share
      )}`
    );
  }

  return parts.join("\n");
}


function hasMedia(
  attachmentInfo
) {

  return Boolean(
    attachmentInfo &&
    attachmentInfo.trim()
  );
}


function isLink(
  text
) {

  const t =
    String(text || "").trim();

  return (
    /^(https?:\/\/|www\.)\S+$/i.test(t) ||
    /\b(instagram\.com|instagr\.am|tiktok\.com|youtube\.com|youtu\.be|facebook\.com)\//i.test(t)
  );
}


/* =========================================================
   SAFE AI FOR LATER QUESTIONS ONLY
========================================================= */

function extractAIText(
  data
) {

  if (
    typeof data?.output_text ===
    "string"
  ) {

    return data.output_text.trim();
  }

  let text = "";

  for (
    const item of
    data?.output || []
  ) {

    for (
      const part of
      item.content || []
    ) {

      if (
        part.type ===
          "output_text" &&
        part.text
      ) {

        text += part.text;
      }
    }
  }

  return text.trim();
}


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
      .slice(-30)
      .map(
        m =>
          `${m.role}: ${m.text}`
      )
      .join("\n");

  const prompt =
`You are Global Promote's Instagram customer-support AI.

IMPORTANT:
The first three customer interactions are handled by fixed server messages. You are NOT allowed to replace or repeat them.

Remember this existing conversation:

${history}

Latest customer message:
${clientMessage || "[media]"}

Attachment:
${attachmentInfo || "none"}

Rules:
- Never restart the conversation.
- Never send the opening message.
- Never repeat the package list unless the server asks for it.
- Never invent prices.
- Never invent payment information.
- Answer only the latest genuine question.
- Keep the answer short and natural.
- If the customer asks about guarantees, use the approved guarantee information.
- If you don't know something, don't invent it.
- Do not create a new sales opening.

Return only the customer-facing reply.`;

  try {

    const response =
      await fetch(
        "https://api.openai.com/v1/responses",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
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
        "OPENAI ERROR:",
        data
      );

      return null;
    }

    return extractAIText(
      data
    );

  } catch (error) {

    console.error(
      "AI ERROR:",
      error.message
    );

    return null;
  }
}


/* =========================================================
   INSTAGRAM SEND
========================================================= */

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

          Authorization:
            `Bearer ${PAGE_ACCESS_TOKEN}`
        },

        body:
          JSON.stringify({

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

  if (
    !response.ok
  ) {

    console.error(
      "INSTAGRAM API ERROR:",
      data
    );

    throw new Error(
      "Instagram message failed"
    );
  }

  const id =
    data?.message_id ||
    data?.id;

  if (id) {
    outgoingMessages.add(
      String(id)
    );
  }

  return data;
}


/* =========================================================
   SAFE DELAY + MANUAL CANCEL
========================================================= */

async function sendReplySafely(
  senderId,
  conversation,
  reply,
  version
) {

  if (!reply) {
    return;
  }

  console.log(
    "Waiting before reply..."
  );

  await wait(
    replyDelay()
  );

  /*
   * If owner replied manually
   * during the delay, cancel AI.
   */
  if (
    (
      manualReplyVersion.get(
        senderId
      ) || 0
    ) !== version
  ) {

    console.log(
      "AI reply cancelled because manual reply was detected."
    );

    return;
  }

  const data =
    await sendInstagramMessage(
      senderId,
      reply
    );

  const sentMessageId =
    data?.message_id ||
    data?.id ||
    null;

  /*
   * Record exactly what was sent and which stage it
   * represents. This makes delayed replies deterministic.
   */
  conversation.lastOutgoingMessageId =
    sentMessageId
      ? String(sentMessageId)
      : null;

  conversation.lastOutgoingText =
    reply;

  conversation.lastOutgoingStage =
    conversation.stage;

  conversation.lastOutgoingAt =
    nowISO();

  saveMessage(
    conversation,
    "assistant",
    reply
  );

  await saveConversation(
    senderId,
    conversation
  );

  console.log(
    "REPLY SENT:",
    reply
  );

  return data;
}


/* =========================================================
   MAIN CUSTOMER PROCESSOR
========================================================= */

async function processClientMessage(
  senderId,
  clientMessage,
  attachmentInfo
) {

  const conversation =
    await getConversation(
      senderId
    );

  const version =
    manualReplyVersion.get(
      senderId
    ) || 0;

  const text =
    String(
      clientMessage || ""
    ).trim();

  const media =
    hasMedia(
      attachmentInfo
    );

  /*
   * Number of previous CUSTOMER
   * messages only.
   */
  const customerMessages =
    conversation.history.filter(
      x =>
        x.role === "client"
    ).length;

  console.log(
    "CUSTOMER MESSAGE:",
    senderId
  );

  console.log(
    "Customer message number:",
    customerMessages + 1
  );

  console.log(
    "Text:",
    text
  );

  console.log(
    "Attachment:",
    attachmentInfo || "none"
  );


  saveMessage(
    conversation,
    "client",
    text ||
      (
        media
          ? "[photo/video/media]"
          : "[media]"
      )
  );

  await saveConversation(
    senderId,
    conversation
  );


  /* =======================================================
     FIXED CONVERSATION FLOW
     The stage, not the number of historical messages,
     determines what the customer's message means.
  ======================================================= */

  if (
    conversation.stage === "NEW"
  ) {

    conversation.stage =
      "MESSAGE_ONE_SENT";

    await sendReplySafely(
      senderId,
      conversation,
      MESSAGE_ONE,
      version
    );

    return;
  }

  if (
    conversation.stage ===
    "MESSAGE_ONE_SENT"
  ) {

    conversation.stage =
      "MESSAGE_TWO_SENT";

    await sendReplySafely(
      senderId,
      conversation,
      MESSAGE_TWO,
      version
    );

    return;
  }

  if (
    conversation.stage ===
    "MESSAGE_TWO_SENT"
  ) {

    const directPackage =
      detectPackage(
        text
      );

    if (
      directPackage
    ) {

      conversation.selectedPackage =
        directPackage;

      conversation.stage =
        "PACKAGE_SELECTED";

      await sendReplySafely(
        senderId,
        conversation,
        buildPackageConfirmation(
          directPackage
        ),
        version
      );

      return;
    }

    conversation.stage =
      "PACKAGES_SHOWN";

    await sendReplySafely(
      senderId,
      conversation,
      PACKAGES_MESSAGE,
      version
    );

    return;
  }

  /*
   * If a previous version left the conversation in an
   * unknown/old stage, do NOT restart the opening.
   * Continue using the stored history and AI instead.
   */

  /* =======================================================
     PACKAGE SELECTION
  ======================================================= */

  const selectedPackage =
    detectPackage(
      text
    );

  if (
    selectedPackage
  ) {

    conversation.selectedPackage =
      selectedPackage;

    conversation.stage =
      "PACKAGE_SELECTED";

    await sendReplySafely(
      senderId,
      conversation,
      buildPackageConfirmation(
        selectedPackage
      ),
      version
    );

    return;
  }


  /* =======================================================
     PAYMENT METHOD
  ======================================================= */

  const payment =
    detectPaymentMethod(
      text
    );

  if (
    payment &&
    conversation.selectedPackage
  ) {

    conversation.paymentMethod =
      payment;

    conversation.stage =
      "PAYMENT_PENDING";

    await sendReplySafely(
      senderId,
      conversation,
      buildPaymentMessage(
        conversation.selectedPackage,
        payment
      ),
      version
    );

    return;
  }


  /* =======================================================
     GUARANTEE QUESTION
  ======================================================= */

  if (
    /\bguarantee\b|\bguaranteed\b|\brefund\b|\brefill\b/i
      .test(text)
  ) {

    await sendReplySafely(
      senderId,
      conversation,
      GUARANTEE_MESSAGE,
      version
    );

    return;
  }


  /* =======================================================
     ONLY NOW USE AI
     
     This prevents AI from creating random
     sales/opening/package messages.
  ======================================================= */

  const reply =
    await getAIReply(
      conversation,
      text,
      attachmentInfo
    );

  if (
    reply
  ) {

    await sendReplySafely(
      senderId,
      conversation,
      reply,
      version
    );

  } else {

    await saveConversation(
      senderId,
      conversation
    );
  }
       }
/* =========================================================
   WEBHOOK VERIFICATION
========================================================= */

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
        "WEBHOOK VERIFIED"
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


/* =========================================================
   INSTAGRAM WEBHOOK
========================================================= */

app.post(
  "/webhook",
  async (req, res) => {

    /*
     * ALWAYS LOG THE COMPLETE WEBHOOK.
     */
    console.log(
      "========================================"
    );

    console.log(
      "INSTAGRAM WEBHOOK RECEIVED"
    );

    console.log(
      JSON.stringify(
        req.body,
        null,
        2
      )
    );

    console.log(
      "========================================"
    );

    /*
     * Respond to Meta immediately.
     */
    res.sendStatus(200);

    const body =
      req.body;

    if (
      body?.object !==
      "instagram"
    ) {
      return;
    }

    if (
      !Array.isArray(
        body?.entry
      )
    ) {
      return;
    }


    for (
      const entry of
      body.entry
    ) {

      for (
        const event of
        entry.messaging || []
      ) {

        /*
         * NON-MESSAGE EVENTS MUST NEVER REACH THE AI.
         *
         * This includes seen/read, delivery, reactions and
         * other webhook notifications. Only event.message
         * from the customer is processed below.
         */
        if (
          event.read ||
          event.delivery ||
          event.reaction ||
          event.postback
        ) {
          console.log(
            "Non-message event ignored."
          );
          continue;
        }

        /*
         * Ignore events without a real message payload.
         */
        if (
          !event.message
        ) {
          continue;
        }


        const senderId =
          event.sender?.id;

        const messageId =
          event.message?.mid;

        const recipientId =
          event.recipient?.id;

        const isEcho =
          event.message?.is_echo === true;

        /*
         * Never process our own messages as customer messages.
         * Echo/manual handling is dealt with separately below.
         */
        if (
          isEcho ||
          String(senderId) ===
          String(INSTAGRAM_USER_ID)
        ) {
          /*
           * Handled by the existing own-message block below.
           */
        }


        console.log(
          "---------- MESSAGE EVENT ----------"
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
          "Message ID:",
          messageId
        );

        console.log(
          "Text:",
          event.message?.text ||
          "[NO TEXT]"
        );

        console.log(
          "is_echo:",
          isEcho
        );

        console.log(
          "Attachments:",
          JSON.stringify(
            event.message?.attachments ||
            []
          )
        );

        console.log(
          "Share:",
          JSON.stringify(
            event.message?.share ||
            null
          )
        );

        console.log(
          "-----------------------------------"
        );


        if (
          !senderId ||
          !messageId
        ) {
          continue;
        }


        /* =================================================
           OUR OWN MESSAGE / ECHO
        ================================================= */

        if (
          isEcho ||
          String(senderId) ===
            String(INSTAGRAM_USER_ID)
        ) {

          /*
           * If this is an AI message that we
           * already sent, simply ignore it.
           */
          if (
            outgoingMessages.has(
              String(messageId)
            )
          ) {

            outgoingMessages.delete(
              String(messageId)
            );

            console.log(
              "Our AI message echo ignored."
            );

            continue;
          }


          /*
           * Otherwise it is likely a
           * manual message sent by the owner.
           */
          if (
            recipientId
          ) {

            manualReplyVersion.set(
              recipientId,
              (
                manualReplyVersion.get(
                  recipientId
                ) || 0
              ) + 1
            );

            const conversation =
              await getConversation(
                recipientId
              );

            const ownText =
              event.message?.text ||
              "";

            if (
              ownText
            ) {

              saveMessage(
                conversation,
                "assistant",
                ownText
              );

              /*
               * Manual messages must keep the state machine
               * synchronized. This is important when the owner
               * has to resend a fixed message after an AI delay
               * or failed reply.
               */
              if (
                normalize(ownText) ===
                normalize(MESSAGE_ONE)
              ) {
                conversation.stage =
                  "MESSAGE_ONE_SENT";
              }
              else if (
                normalize(ownText) ===
                normalize(MESSAGE_TWO)
              ) {
                conversation.stage =
                  "MESSAGE_TWO_SENT";
              }
              else if (
                normalize(ownText) ===
                normalize(PACKAGES_MESSAGE)
              ) {
                conversation.stage =
                  "PACKAGES_SHOWN";
              }

              conversation.lastOutgoingText =
                ownText;

              conversation.lastOutgoingStage =
                conversation.stage;

              conversation.lastOutgoingAt =
                nowISO();

              conversation.lastOutgoingMessageId =
                messageId
                  ? String(messageId)
                  : null;

              await saveConversation(
                recipientId,
                conversation
              );
            }

            console.log(
              "MANUAL REPLY DETECTED. Waiting AI cancelled."
            );
          }

          continue;
        }


        /* =================================================
           DUPLICATE PROTECTION
        ================================================= */

        if (
          processedMessageIds.has(
            String(messageId)
          )
        ) {

          console.log(
            "DUPLICATE MESSAGE IGNORED:",
            messageId
          );

          continue;
        }

        processedMessageIds.set(
          String(messageId),
          Date.now()
        );

        setTimeout(
          () =>
            processedMessageIds.delete(
              String(messageId)
            ),
          60 * 60 * 1000
        );


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


        if (
          !clientMessage &&
          !attachmentInfo
        ) {

          console.log(
            "Empty message ignored."
          );

          continue;
        }


        /*
         * IMPORTANT:
         * Every customer message gets queued.
         *
         * Same customer:
         * 1 -> 2 -> 3 -> 4
         *
         * Different customers can
         * process independently.
         */
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
                "CUSTOMER PROCESSING ERROR:",
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
   MEMORY TEST
========================================================= */

/*
 * GET /admin/memory-test?sender_id=...
 * Requires x-admin-secret.
 *
 * This lets you verify from Render that the same sender ID
 * can be loaded from Supabase after a restart.
 */
app.get(
  "/admin/memory-test",
  async (req, res) => {

    if (!isAdmin(req)) {
      return res.sendStatus(403);
    }

    const senderId =
      String(
        req.query.sender_id ||
        ""
      ).trim();

    if (!senderId) {
      return res.status(400).json({
        success: false,
        error:
          "sender_id is required"
      });
    }

    const conversation =
      await supabaseGetConversation(
        senderId
      );

    if (!conversation) {
      return res.json({
        success: true,
        found: false,
        senderId,
        message:
          "No Supabase conversation found for this sender."
      });
    }

    return res.json({
      success: true,
      found: true,
      senderId,
      stage:
        conversation.stage,
      selectedPackage:
        conversation.selectedPackage,
      paymentMethod:
        conversation.paymentMethod,
      historyLength:
        Array.isArray(
          conversation.history
        )
          ? conversation.history.length
          : 0,
      lastOutgoingText:
        conversation.lastOutgoingText,
      lastOutgoingStage:
        conversation.lastOutgoingStage,
      lastOutgoingAt:
        conversation.lastOutgoingAt
    });
  }
);


/* =========================================================
   HEALTH
========================================================= */

app.get(
  "/health",
  (req, res) => {

    res.json({

      status: "ok",

      ai: Boolean(
        OPEN_AI
      ),

      instagram: Boolean(
        PAGE_ACCESS_TOKEN
      ),

      memory: Boolean(
        SUPABASE_URL &&
        SUPABASE_SERVICE_ROLE_KEY
      ),

      supabaseEnvironmentPresent:
        Boolean(
          SUPABASE_URL &&
          SUPABASE_SERVICE_ROLE_KEY
        ),

      supabaseTable:
        SUPABASE_TABLE,

      conversations:
        conversations.size,

      system:
        "simple-fixed-flow"

    });
  }
);


/* =========================================================
   ADMIN STATUS
========================================================= */

function isAdmin(
  req
) {

  return Boolean(
    ADMIN_SECRET &&
    req.headers[
      "x-admin-secret"
    ] === ADMIN_SECRET
  );
}


app.get(
  "/admin/status",
  async (req, res) => {

    if (
      !isAdmin(req)
    ) {

      return res.sendStatus(
        403
      );
    }

    const clients =
      [];

    for (
      const [
        senderId,
        conversation
      ]
      of conversations
        .entries()
    ) {

      clients.push({

        senderId,

        stage:
          conversation.stage,

        selectedPackage:
          conversation.selectedPackage,

        paymentMethod:
          conversation.paymentMethod,

        messages:
          conversation.history.length,

        lastSeenAt:
          conversation.lastSeenAt

      });
    }

    res.json({

      success: true,

      aiAlwaysOn: true,

      simpleFixedFlow: true,

      memory:
        Boolean(
          SUPABASE_URL &&
          SUPABASE_SERVICE_ROLE_KEY
        ),

      supabaseTable:
        SUPABASE_TABLE,

      clients

    });
  }
);


/* =========================================================
   ADMIN PAGE
========================================================= */

app.get(
  "/admin",
  (req, res) => {

    res.send(`
<!doctype html>

<html>

<head>

<meta name="viewport"
content="width=device-width,initial-scale=1">

<title>Global Promote AI</title>

<style>

body{
font-family:Arial;
background:#f5f5f5;
padding:20px
}

.card{
max-width:700px;
margin:auto;
background:white;
padding:20px;
border-radius:15px
}

input,button{
width:100%;
box-sizing:border-box;
padding:12px;
margin-top:10px
}

</style>

</head>

<body>

<div class="card">

<h2>🤖 Global Promote AI</h2>

<p>🟢 AI ALWAYS ON</p>

<p>Fixed conversation flow enabled.</p>

<input
id="secret"
type="password"
placeholder="ADMIN_SECRET"
>

<button onclick="loadStatus()">
Load Clients
</button>

<pre id="out"></pre>

</div>

<script>

async function loadStatus(){

const secret =
document.getElementById(
"secret"
).value;

const response =
await fetch(
"/admin/status",
{
headers:{
"x-admin-secret":
secret
}
}
);

document.getElementById(
"out"
).textContent =
await response.text();

}

</script>

</body>

</html>
`);
  }
);


/* =========================================================
   ROOT
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
   START SERVER
========================================================= */

app.listen(
  PORT,
  () => {

    console.log(
      "========================================"
    );

    console.log(
      "Global Promote Instagram AI started"
    );

    console.log(
      "Port:",
      PORT
    );

    console.log(
      "AI: ALWAYS ON"
    );

    console.log(
      "Fixed 1st/2nd/3rd flow: ENABLED"
    );

    console.log(
      "Per-client queue: ENABLED"
    );

    console.log(
      "Manual-reply cancellation: ENABLED"
    );

    console.log(
      "Supabase persistent memory:",
      supabaseConfigured()
        ? `ENABLED (${SUPABASE_TABLE})`
        : "NOT CONFIGURED"
    );

    console.log(
      "Instagram API:",
      PAGE_ACCESS_TOKEN
        ? "CONNECTED"
        : "NOT CONFIGURED"
    );

    console.log(
      "OpenAI:",
      OPEN_AI
        ? "CONNECTED"
        : "NOT CONFIGURED"
    );

    console.log(
      "========================================"
    );

  }
);
