const express = require("express");
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "instagram_verify_2026";
const OPEN_AI = process.env.OPEN_AI || "";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-5-mini";
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN || "";
const INSTAGRAM_USER_ID = "17841404831696204";
const INSTAGRAM_API_VERSION = process.env.INSTAGRAM_API_VERSION || "v26.0";
const ADMIN_SECRET = process.env.ADMIN_SECRET || "";
const MEMORY_URL = process.env.MEMORY_URL || "";
const MEMORY_TOKEN = process.env.MEMORY_TOKEN || "";

const MESSAGE_ONE = `Hey dear ♥️
I see your profile, its a great content ♥️
Would you like to get featured on our page?`;

const PACKAGES_MESSAGE = `🎊 Instagram packages🎊

1️⃣ BRONZE PACKAGE 📦
👉 only 35€ = 2story
🎉(1.5k followers guaranteed)

2️⃣ SILVER PACKAGE 📦
👉 only 60€ = 1 post and 3stroy + 2 highlights 🎊
🎉(4k followers guaranteed)

3️⃣ GOLD PACKAGE 📦
👉 only 90€ = 3 post and 4 stroy +3 highlights 🎊
🎉(7k followers guaranteed)
Mostly client choose this package!!

4️⃣ DIAMOND PACKAGE 📦
👉 only 120€ = 5 post and 8 story + 7 highlights 🎊
🎉(10k followers guaranteed)

💥 CHOOSE YOUR PACKAGE 💥`;

const GUARANTEE_MESSAGE = `Yes ❤️ The followers are guaranteed because we upload your content on our pages and continue the promotion until you receive the followers included in your package.

If you don't gain the guaranteed followers, the amount will be refunded according to our guarantee policy. ❤️`;

const PACKAGES = {
  bronze: { name: "Bronze", price: 35, details: "2 stories", followers: "1.5K followers guaranteed" },
  silver: { name: "Silver", price: 60, details: "1 post\n3 stories\n2 highlights", followers: "4K followers guaranteed" },
  gold: { name: "Gold", price: 90, details: "3 posts\n4 stories\n3 highlights", followers: "7K followers guaranteed" },
  diamond: { name: "Diamond", price: 120, details: "5 posts\n8 stories\n7 highlights", followers: "10K followers guaranteed" }
};

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

const conversations = new Map();
const queues = new Map();
const processed = new Map();
const outgoing = new Set();
const manualVersion = new Map();

function now() {
  return new Date().toISOString();
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function delay() {
  return 6500 + Math.floor(Math.random() * 2000);
}

function norm(t) {
  return String(t || "")
    .toLowerCase()
    .trim()
    .replace(/[.,!?]/g, " ")
    .replace(/\s+/g, " ");
}

function admin(req) {
  return ADMIN_SECRET &&
    req.headers["x-admin-secret"] === ADMIN_SECRET;
}

function newConversation(senderId) {
  return {
    senderId,
    history: [],
    stage: "NEW",
    selectedPackage: null,
    paymentMethod: null,
    lastSeenAt: now()
  };
}

function addMessage(c, role, text) {
  if (!text) return;

  c.history.push({
    role,
    text: String(text),
    timestamp: now()
  });

  if (c.history.length > 80) {
    c.history = c.history.slice(-80);
  }

  c.lastSeenAt = now();
}

async function memoryGet(senderId) {
  if (!MEMORY_URL || !MEMORY_TOKEN) return null;

  try {
    const key =
      encodeURIComponent(`instagram:${senderId}`);

    const r = await fetch(
      `${MEMORY_URL}/get/${key}`,
      {
        headers: {
          Authorization:
            `Bearer ${MEMORY_TOKEN}`
        }
      }
    );

    if (!r.ok) return null;

    const d = await r.json();

    return d?.result
      ? JSON.parse(d.result)
      : null;

  } catch (e) {
    console.error(
      "Memory GET:",
      e.message
    );

    return null;
  }
}

async function memorySave(
  senderId,
  conversation
) {
  if (!MEMORY_URL || !MEMORY_TOKEN) return;

  try {
    const key =
      encodeURIComponent(
        `instagram:${senderId}`
      );

    const value =
      encodeURIComponent(
        JSON.stringify(conversation)
      );

    const r = await fetch(
      `${MEMORY_URL}/set/${key}/${value}`,
      {
        method: "POST",
        headers: {
          Authorization:
            `Bearer ${MEMORY_TOKEN}`
        }
      }
    );

    if (!r.ok) {
      console.error(
        "Memory SAVE:",
        r.status
      );
    }

  } catch (e) {
    console.error(
      "Memory SAVE:",
      e.message
    );
  }
}

async function getConversation(senderId) {
  if (conversations.has(senderId)) {
    return conversations.get(senderId);
  }

  const saved =
    await memoryGet(senderId);

  const c =
    saved &&
    typeof saved === "object"
      ? saved
      : newConversation(senderId);

  c.senderId = senderId;
  c.history =
    Array.isArray(c.history)
      ? c.history
      : [];

  c.stage =
    c.stage || "NEW";

  c.selectedPackage =
    c.selectedPackage || null;

  c.paymentMethod =
    c.paymentMethod || null;

  conversations.set(
    senderId,
    c
  );

  return c;
   }
async function saveConversation(
  senderId,
  c
) {
  c.lastSeenAt = now();

  conversations.set(
    senderId,
    c
  );

  await memorySave(
    senderId,
    c
  );
}

function queue(
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
      queues.get(senderId) ===
      next
    ) {
      queues.delete(senderId);
    }
  }).catch(() => {});

  return next;
}

function attachmentInfo(
  message
) {
  const a = [];

  for (
    const x of
    message?.attachments || []
  ) {
    a.push(
      `type=${x.type || "unknown"}`
    );
  }

  if (message?.share) {
    a.push(
      `shared=${JSON.stringify(
        message.share
      )}`
    );
  }

  return a.join("\n");
}

function isLink(text) {
  const t =
    String(text || "").trim();

  return (
    /^(https?:\/\/|www\.)\S+$/i.test(t) ||
    /\b(instagram\.com|instagr\.am|tiktok\.com|youtube\.com|youtu\.be|facebook\.com)\//i.test(t)
  );
}

function isEmojiOnly(text) {
  const t =
    String(text || "").trim();

  if (!t) return false;

  try {
    return /^[\p{Extended_Pictographic}\p{Emoji_Presentation}\p{Emoji}\s\uFE0F\u200D]+$/u.test(t);
  } catch {
    return false;
  }
}

function packageListRequest(text) {
  const t = norm(text);

  return (
    /\bpackages?\b/.test(t) ||
    /\bprice list\b/.test(t) ||
    /\bpricing\b/.test(t) ||
    /\bprices?\b/.test(t) ||
    /\bcost\b/.test(t) ||
    /\bhow much\b/.test(t) ||
    /\bshow me.*package/.test(t)
  );
}

function packageSelection(
  text,
  c
) {
  const t = norm(text);

  if (/\bbronze\b/.test(t))
    return "bronze";

  if (/\bsilver\b/.test(t))
    return "silver";

  if (/\bgold\b/.test(t))
    return "gold";

  if (/\bdiamond\b/.test(t))
    return "diamond";

  if (
    c.stage ===
    "PACKAGES_SHOWN"
  ) {

    if (
      /^(1|1st|first|package 1|package one)$/.test(t)
    ) return "bronze";

    if (
      /^(2|2nd|second|package 2|package two)$/.test(t)
    ) return "silver";

    if (
      /^(3|3rd|third|package 3|package three)$/.test(t)
    ) return "gold";

    if (
      /^(4|4th|fourth|package 4|package four)$/.test(t)
    ) return "diamond";
  }

  return null;
}

function paymentMethod(text) {
  const t = norm(text);

  if (/\bpaypal\b/.test(t))
    return "paypal";

  if (
    /\biban\b|\bwise\b|\bbank\b/.test(t)
  )
    return "iban";

  if (/\brevolut\b/.test(t))
    return "revolut";

  if (
    /\bmb\s*way\b|\bmbway\b/.test(t)
  )
    return "mbway";

  if (
    /\bcredit card\b|\bdebit card\b|\bcard\b/.test(t)
  )
    return "card";

  return null;
}

function guaranteeQuestion(text) {
  return (
    /\bguarantee\b/.test(norm(text)) ||
    /\bguaranteed\b/.test(norm(text)) ||
    /\brefund\b/.test(norm(text)) ||
    /\brefill\b/.test(norm(text))
  );
}

function packageConfirmation(key) {
  const p = PACKAGES[key];

  return `Perfect ❤️ You've selected our ${p.name} package.

Package price: €${p.price.toFixed(2)}

${p.details}
${p.followers}

How would you like to pay? ❤️

PayPal
IBAN
Revolut
MB WAY
Credit/Debit Card`;
}

function paymentMessage(
  key,
  method
) {
  const p =
    PACKAGES[key];

  const fee =
    Math.round(
      p.price * 12
    ) / 100;

  const total =
    Math.round(
      (p.price + fee) * 100
    ) / 100;

  const details =
    method === "paypal"
      ? PAYPAL_DETAILS
      : method === "iban"
        ? IBAN_DETAILS
        : method === "mbway"
          ? MBWAY_DETAILS
          : method === "revolut"
            ? REVOLUT_DETAILS
            : "Our team will assist you with the Credit/Debit Card payment ❤️";

  return `Perfect ❤️

Package: ${p.name}

Package price: €${p.price.toFixed(2)}

12% payment fee: €${fee.toFixed(2)}

Total: €${total.toFixed(2)}

Payment method: ${method.toUpperCase()}

${details}

After successful payment, please send us your payment screenshot ❤️`;
}

function extractAI(data) {
  if (
    typeof data?.output_text ===
    "string"
  ) {
    return data.output_text.trim();
  }

  let out = "";

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
        typeof part.text ===
          "string"
      ) {
        out += part.text;
      }
    }
  }

  return out.trim();
}

async function aiReply(
  c,
  clientMessage,
  media
) {
  if (!OPEN_AI) return null;

  const history =
    c.history
      .slice(-30)
      .map(
        x =>
          `${x.role}: ${x.text}`
      )
      .join("\n");

  const prompt = `You are the simple Instagram sales/support AI for Global Promote.

BUSINESS:
Instagram promotion service.
Pages: @expl.europe, @expl.canada, @expl.atlanta, @expl.miami

PACKAGE PRICES (server sends the exact list; never rewrite it):
Bronze €35: 2 stories, 1.5k followers guaranteed
Silver €60: 1 post, 3 stories, 2 highlights, 4k followers guaranteed
Gold €90: 3 posts, 4 stories, 3 highlights, 7k followers guaranteed
Diamond €120: 5 posts, 8 stories, 7 highlights, 10k followers guaranteed

GUARANTEE:
${GUARANTEE_MESSAGE}

CURRENT CONVERSATION:
${history || "No previous chat."}

LATEST CUSTOMER MESSAGE:
${clientMessage || "[media]"}

MEDIA:
${media || "none"}`;
   const rules = `

RULES:
- Remember the conversation above. Never restart a returning chat.
- Answer the latest customer message first.
- Never send the opening message yourself; server controls it.
- Do not force packages into every message.
- A photo, video, reel or link is NOT automatically a package request.
- If the customer asks for prices/packages, the server sends the exact full list.
- Never change prices or invent payment details.
- If a customer chooses a package, the server handles the package confirmation.
- If a customer chooses a payment method after choosing a package, the server handles payment instructions.
- Keep replies short and natural.
- Never claim payment was received.
- Use the customer's language when practical.

Return only the customer-facing reply.`;

  try {
    const r = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
          Authorization:
            `Bearer ${OPEN_AI}`
        },
        body: JSON.stringify({
          model:
            OPENAI_MODEL,
          input:
            prompt + rules,
          max_output_tokens:
            350
        })
      }
    );

    const d =
      await r.json();

    if (!r.ok) {
      console.error(
        "OpenAI:",
        d
      );
      return null;
    }

    const reply =
      extractAI(d);

    return (
      reply &&
      reply !== "NO_REPLY"
    )
      ? reply
      : null;

  } catch (e) {
    console.error(
      "AI:",
      e.message
    );

    return null;
  }
}

async function sendInstagram(
  recipientId,
  text
) {
  if (!PAGE_ACCESS_TOKEN) {
    throw new Error(
      "PAGE_ACCESS_TOKEN is missing"
    );
  }

  const url =
    `https://graph.instagram.com/${INSTAGRAM_API_VERSION}/${INSTAGRAM_USER_ID}/messages`;

  const r =
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

  const d =
    await r.json();

  if (!r.ok) {
    console.error(
      "Instagram:",
      d
    );

    throw new Error(
      "Instagram message failed"
    );
  }

  const id =
    d?.message_id ||
    d?.id;

  if (id) {
    outgoing.add(
      String(id)
    );
  }

  return d;
}

async function sendReply(
  senderId,
  c,
  text,
  version
) {
  if (!text) return;

  /*
   * Human-like delay:
   * 6.5–8.5 seconds.
   */
  await sleep(
    delay()
  );

  /*
   * If you manually replied while
   * AI was waiting, cancel AI reply.
   */
  if (
    (manualVersion.get(
      senderId
    ) || 0) !== version
  ) {
    console.log(
      "AI reply cancelled because owner replied manually:",
      senderId
    );

    return;
  }

  try {
    const d =
      await sendInstagram(
        senderId,
        text
      );

    addMessage(
      c,
      "assistant",
      text
    );

    await saveConversation(
      senderId,
      c
    );

    console.log(
      "Reply sent:",
      senderId,
      d?.message_id ||
        d?.id ||
        ""
    );

  } catch (e) {
    console.error(
      "Send reply:",
      e.message
    );

    await saveConversation(
      senderId,
      c
    );
  }
}

async function processMessage(
  senderId,
  messageId,
  text,
  media
) {
  const c =
    await getConversation(
      senderId
    );

  if (
    c.processedIds?.includes(
      messageId
    )
  ) {
    return;
  }

  c.processedIds =
    Array.isArray(
      c.processedIds
    )
      ? c.processedIds
      : [];

  c.processedIds.push(
    messageId
  );

  c.processedIds =
    c.processedIds.slice(
      -100
    );

  const first =
    c.history.filter(
      x =>
        x.role === "client"
    ).length === 0;

  const hasText =
    Boolean(
      String(
        text || ""
      ).trim()
    );

  const link =
    isLink(text);

  const emoji =
    isEmojiOnly(text);

  const version =
    manualVersion.get(
      senderId
    ) || 0;

  addMessage(
    c,
    "client",
    hasText
      ? text
      : (
          media
            ? "[photo/video/media]"
            : "[media]"
        )
  );

  await saveConversation(
    senderId,
    c
  );

  /*
   * FIRST MESSAGE
   *
   * Normal text -> opening message.
   *
   * Photo/video/link/emoji ->
   * no opening sales message.
   */
  if (first) {

    if (
      hasText &&
      !media &&
      !link &&
      !emoji
    ) {

      c.stage =
        "OPENING_SENT";

      await sendReply(
        senderId,
        c,
        MESSAGE_ONE,
        version
      );

    } else {

      c.stage =
        "FIRST_MEDIA_OR_LINK";

      const reply =
        media
          ? "Thanks ❤️ I received your photo/video. Tell me what you'd like to know and I'll help you."
          : link
            ? "Thanks ❤️ I received your link. Tell me what you'd like to know and I'll help you."
            : "Hey ❤️ How can I help you?";

      await sendReply(
        senderId,
        c,
        reply,
        version
      );
    }

    return;
  }

  /*
   * PHOTO / VIDEO LATER
   *
   * Never automatically show packages.
   */
  if (
    !hasText &&
    media
  ) {

    await sendReply(
      senderId,
      c,
      "Thanks ❤️ I received your photo/video. Tell me what you'd like to know and I'll help you.",
      version
    );

    return;
  }

  /*
   * LINK LATER
   */
  if (
    link &&
    !media
  ) {

    await sendReply(
      senderId,
      c,
      "Thanks ❤️ I received your link. Tell me what you'd like to know and I'll help you.",
      version
    );

    return;
  }

  /*
   * EXACT PACKAGE LIST
   *
   * AI does not generate this.
   */
  if (
    packageListRequest(
      text
    )
  ) {

    c.stage =
      "PACKAGES_SHOWN";

    await sendReply(
      senderId,
      c,
      PACKAGES_MESSAGE,
      version
    );

    return;
  }

  /*
   * PACKAGE SELECTION
   */
  const selected =
    packageSelection(
      text,
      c
    );

  if (selected) {

    c.selectedPackage =
      selected;

    c.paymentMethod =
      null;

    c.stage =
      "PACKAGE_SELECTED";

    await sendReply(
      senderId,
      c,
      packageConfirmation(
        selected
      ),
      version
    );

    return;
  }

  /*
   * PAYMENT METHOD
   */
  const method =
    paymentMethod(
      text
    );

  if (
    method &&
    c.selectedPackage
  ) {

    c.paymentMethod =
      method;

    c.stage =
      "PAYMENT_PENDING";

    await sendReply(
      senderId,
      c,
      paymentMessage(
        c.selectedPackage,
        method
      ),
      version
    );

    return;
  }

  /*
   * GUARANTEE
   */
  if (
    guaranteeQuestion(
      text
    )
  ) {

    await sendReply(
      senderId,
      c,
      GUARANTEE_MESSAGE,
      version
    );

    return;
  }

  /*
   * NORMAL AI CONVERSATION
   *
   * AI receives the stored chat history.
   */
  const reply =
    await aiReply(
      c,
      text,
      media
    );

  if (reply) {
    await sendReply(
      senderId,
      c,
      reply,
      version
    );
  } else {
    await saveConversation(
      senderId,
      c
    );
  }
}
function handleEcho(event) {

  const mid =
    event?.message?.mid
      ? String(
          event.message.mid
        )
      : "";

  const customerId =
    event?.recipient?.id;

  const text =
    event?.message?.text ||
    "";

  /*
   * This was our own AI message.
   * Do NOT treat it as a manual reply.
   */
  if (
    mid &&
    outgoing.has(mid)
  ) {

    outgoing.delete(mid);

    return;
  }

  /*
   * This is a manual message sent
   * from Instagram by the owner.
   *
   * Cancel any AI reply waiting.
   */
  if (!customerId) return;

  manualVersion.set(
    customerId,
    (
      manualVersion.get(
        customerId
      ) || 0
    ) + 1
  );

  getConversation(
    customerId
  )
    .then(
      async c => {

        if (text) {
          addMessage(
            c,
            "assistant",
            text
          );
        }

        await saveConversation(
          customerId,
          c
        );

        console.log(
          "Manual reply detected; waiting AI reply cancelled:",
          customerId
        );
      }
    )
    .catch(
      e =>
        console.error(
          "Echo:",
          e.message
        )
    );
}


app.get(
  "/webhook",
  (req, res) => {

    if (
      req.query[
        "hub.mode"
      ] === "subscribe" &&
      req.query[
        "hub.verify_token"
      ] === VERIFY_TOKEN
    ) {

      return res
        .status(200)
        .send(
          req.query[
            "hub.challenge"
          ]
        );
    }

    return res.sendStatus(
      403
    );
  }
);


app.post(
  "/webhook",
  (req, res) => {

    /*
     * Respond to Meta immediately.
     */
    res.sendStatus(200);

    const body =
      req.body;

    if (
      body?.object !==
        "instagram" ||
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

      for (
        const event of
        entry.messaging || []
      ) {

        if (
          event.read?.mid
        ) {
          continue;
        }

        if (
          !event.message
        ) {
          continue;
        }

        /*
         * is_echo = our outgoing message.
         */
        if (
          event.message
            .is_echo === true
        ) {

          handleEcho(
            event
          );

          continue;
        }

        const senderId =
          event.sender?.id;

        const messageId =
          event.message?.mid;

        if (
          !senderId ||
          !messageId ||
          String(senderId) ===
            String(
              INSTAGRAM_USER_ID
            )
        ) {
          continue;
        }

        /*
         * Duplicate protection.
         */
        if (
          processed.has(
            String(messageId)
          )
        ) {
          continue;
        }

        processed.set(
          String(messageId),
          Date.now()
        );

        setTimeout(
          () =>
            processed.delete(
              String(messageId)
            ),
          60 * 60 * 1000
        );

        const text =
          event.message.text ||
          "";

        const media =
          attachmentInfo(
            event.message
          );

        if (
          !text &&
          !media
        ) {
          continue;
        }

        /*
         * Same customer's messages are
         * processed in order:
         *
         * 1 -> 2 -> 3
         *
         * Different clients can run
         * at the same time.
         */
        queue(
          senderId,
          () =>
            processMessage(
              senderId,
              String(messageId),
              text,
              media
            )
        ).catch(
          e =>
            console.error(
              "Process:",
              e.message
            )
        );
      }
    }
  }
);


app.get(
  "/health",
  (req, res) =>
    res.json({
      status: "ok",
      aiAlwaysOn: true,
      memory:
        Boolean(
          MEMORY_URL &&
          MEMORY_TOKEN
        ),
      conversations:
        conversations.size
    })
);


app.get(
  "/admin/status",
  async (req, res) => {

    if (
      !admin(req)
    ) {
      return res.sendStatus(
        403
      );
    }

    res.json({

      aiAlwaysOn:
        true,

      memory:
        Boolean(
          MEMORY_URL &&
          MEMORY_TOKEN
        ),

      clients:
        [
          ...conversations.values()
        ].map(c => ({

          senderId:
            c.senderId,

          stage:
            c.stage,

          selectedPackage:
            c.selectedPackage,

          paymentMethod:
            c.paymentMethod,

          messages:
            c.history.length,

          lastSeenAt:
            c.lastSeenAt

        }))
    });
  }
);


app.get(
  "/admin/client/:senderId",
  async (req, res) => {

    if (
      !admin(req)
    ) {
      return res.sendStatus(
        403
      );
    }

    res.json(
      await getConversation(
        req.params.senderId
      )
    );
  }
);


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
padding:20px;
background:#f5f5f5
}

input,button{
padding:12px;
margin:5px 0;
width:100%;
box-sizing:border-box
}

.card{
background:#fff;
padding:18px;
border-radius:12px;
margin:auto;
max-width:700px
}
</style>
</head>

<body>

<div class="card">

<h2>🤖 Global Promote AI</h2>

<p>🟢 AI ALWAYS ON</p>

<input
id="s"
type="password"
placeholder="ADMIN_SECRET"
>

<button onclick="load()">
View Clients
</button>

<pre id="out"></pre>

</div>

<script>

async function load(){

const s =
document.getElementById(
"s"
).value;

const r =
await fetch(
"/admin/status",
{
headers:{
"x-admin-secret":s
}
}
);

document.getElementById(
"out"
).textContent =
await r.text();

}

</script>

</body>
</html>
`);
  }
);


app.get(
  "/",
  (req, res) =>
    res.send(
      "Global Promote Instagram AI is running!"
    )
);


app.listen(
  PORT,
  () => {

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
      "Per-client queue: ENABLED"
    );

    console.log(
      "Manual-reply cancellation: ENABLED"
    );

    console.log(
      "Persistent memory:",
      MEMORY_URL
        ? "ENABLED"
        : "NOT CONFIGURED"
    );

  }
);
