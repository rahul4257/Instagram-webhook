const express = require("express");

const app = express();

app.use(express.json());


/* =========================================================
   ENVIRONMENT VARIABLES
========================================================= */

const VERIFY_TOKEN =
  process.env.VERIFY_TOKEN || "";

const OPEN_AI =
  process.env.OPEN_AI || "";

const OPENAI_MODEL =
  process.env.OPENAI_MODEL || "gpt-5-mini";

const PAGE_ACCESS_TOKEN =
  process.env.PAGE_ACCESS_TOKEN || "";

const EXPL_MIAMI_TOKEN =
  process.env.EXPL_MIAMI_TOKEN || "";

const EXPL_CANADA_TOKEN =
  process.env.EXPL_CANADA_TOKEN || "";

const MENTALXHEAL_TOKEN =
  process.env.MENTALXHEAL_TOKEN || "";

const INSTAGRAM_API_VERSION =
  process.env.INSTAGRAM_API_VERSION || "v26.0";

const PORT =
  process.env.PORT || 3000;

const ADMIN_SECRET =
  process.env.ADMIN_SECRET || "";


/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL =
  process.env.SUPABASE_URL || "";

const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const SUPABASE_TABLE =
  process.env.SUPABASE_TABLE || "Conversations";


/* =========================================================
   BUSINESS
========================================================= */

const BUSINESS_NAME =
  "Global Promote";


/* =========================================================
   PAGE CONFIGURATION
========================================================= */

const PAGE_CONFIGS = {

  europe: {

    key: "europe",

    username: "@expl.europe",

    id: "17841404831696204",

    token: PAGE_ACCESS_TOKEN,

    currency: "€",

    packages: {

      bronze: {
        name: "Bronze",
        price: 39,
        details: "2 story",
        followers: "1.5K followers guaranteed"
      },

      silver: {
        name: "Silver",
        price: 66,
        details:
          "1 post and 3 story + 2 highlights",
        followers: "4K followers guaranteed"
      },

      gold: {
        name: "Gold",
        price: 99,
        details:
          "3 post and 4 story + 3 highlights",
        followers: "7K followers guaranteed"
      },

      diamond: {
        name: "Diamond",
        price: 129,
        details:
          "5 post and 8 story + 7 highlights",
        followers: "10K followers guaranteed"
      }

    },

    paymentMethods: [
      "PayPal",
      "IBAN / Wise",
      "Revolut",
      "MB WAY",
      "Credit/Debit Card"
    ]

  },


  miami: {

    key: "miami",

    username: "@expl.miami",

    id: "17841403973063146",

    token: EXPL_MIAMI_TOKEN,

    currency: "$",

    packages: {

      bronze: {
        name: "Bronze",
        price: 38,
        details: "2 story",
        followers: "1K followers guaranteed"
      },

      silver: {
        name: "Silver",
        price: 66,
        details:
          "1 post and 3 story + 2 highlights",
        followers: "3K followers guaranteed"
      },

      gold: {
        name: "Gold",
        price: 99,
        details:
          "3 post and 4 story + 3 highlights",
        followers: "5K followers guaranteed"
      },

      diamond: {
        name: "Diamond",
        price: 129,
        details:
          "5 post and 8 story + 7 highlights",
        followers: "8K followers guaranteed"
      }

    },

    paymentMethods: [
      "PayPal",
      "Venmo",
      "Credit/Debit Card",
      "Bank Transfer (ACH / Wire Transfer)"
    ]

  },


  canada: {

    key: "canada",

    username: "@expl.canada",

    id: "17841452723605206",

    token: EXPL_CANADA_TOKEN,

    currency: "$",

    packages: {

      bronze: {
        name: "Bronze",
        price: 35,
        details: "2 Stories",
        followers:
          "300–400 Global Followers Guaranteed"
      },

      silver: {
        name: "Silver",
        price: 60,
        details:
          "1 Feed Post + 2 Stories",
        followers:
          "1.5K Followers Guaranteed (Includes 300–400 Canadian audience)"
      },

      gold: {
        name: "Gold",
        price: 99,
        details:
          "3 Feed Posts + 4 Stories",
        followers:
          "4.5K Guaranteed Followers (Only Canadian Audience)"
      },

      diamond: {
        name: "Diamond",
        price: 199,
        details:
          "5 Feed Posts + 8 Stories",
        followers:
          "10K Guaranteed Followers (Only Toronto Audience)"
      }

    },

    paymentMethods: [
      "E-transfer",
      "Bank Transfer",
      "Credit/Debit Card"
    ]

  },


  mentalxheal: {

    key: "mentalxheal",

    username: "@mentalxheal",

    id: "17841402953609202",

    token: MENTALXHEAL_TOKEN,

    currency: "$",

    packages: {

      bronze: {
        name: "Bronze",
        price: 39,
        details: "2 story",
        followers: "1K followers guaranteed"
      },

      silver: {
        name: "Silver",
        price: 66,
        details:
          "1 post and 3 story + 2 highlights",
        followers: "3K followers guaranteed"
      },

      gold: {
        name: "Gold",
        price: 99,
        details:
          "3 post and 4 story + 3 highlights",
        followers: "5K followers guaranteed"
      },

      diamond: {
        name: "Diamond",
        price: 129,
        details:
          "5 post and 8 story + 7 highlights",
        followers: "8K followers guaranteed"
      }

    },

    extraServices: [
      "TikTok",
      "Facebook",
      "YouTube"
    ],

    paymentMethods: [
      "PayPal",
      "Venmo",
      "IBAN",
      "E-transfer",
      "Credit/Debit Card",
      "Revolut"
    ]

  }

};


/* =========================================================
   PAGE LOOKUP
========================================================= */

function getPageById(id) {

  const value =
    String(id || "").trim();

  for (
    const page of
    Object.values(PAGE_CONFIGS)
  ) {

    if (
      String(page.id) === value
    ) {

      return page;

    }

  }

  return null;

}
/* =========================================================
   MANAGED PAGE PROTECTION
   Prevent AI-to-AI conversations
========================================================= */

const MANAGED_PAGE_IDS = new Set(
  Object.values(PAGE_CONFIGS)
    .map(page => String(page.id))
);


function isManagedPageEvent(event) {

  const senderId =
    String(event?.sender?.id || "").trim();

  const message =
    event?.message || {};

  /*
     Ignore Meta echo events from our own page.
  */

  if (
    message.is_echo === true
  ) {

    return true;

  }


  /*
     Ignore messages coming from ANY
     of our four AI-enabled pages.
  */

  if (
    senderId &&
    MANAGED_PAGE_IDS.has(senderId)
  ) {

    return true;

  }


  return false;

}

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
@mentalxheal
@expl.miami

I will upload your post on these pages and from that you will gain 1k to 15k guaranteed followers according to your package. Can I show you our packages ?`;


/* =========================================================
   GUARANTEE
========================================================= */

const GUARANTEE_MESSAGE =
`Yes ❤️ The followers are guaranteed because we upload your content on our pages and continue the promotion until you receive the followers included in your package.

If you don't gain the guaranteed followers, the amount will be refunded according to our guarantee policy. ❤️`;


/* =========================================================
   REAL / ORGANIC
========================================================= */

const REAL_FOLLOWERS_MESSAGE =
`Of course ❤️ All the followers are real and organic because followers are achieved by sharing and promoting your content on different pages until you reach the followers included in your package.

We don't simply add random followers. Your content is promoted to real audiences through our network of pages. ❤️`;


/* =========================================================
   PAYMENT DETAILS
========================================================= */

const PAYMENT_DETAILS = {

  paypal:
`PayPal:
pay@globalpromote.in
https://paypal.me/RamanKumar4257`,

  venmo:
`Venmo:
Risa-Ramos-2
https://venmo.com/u/Risa-Ramos-2`,

  etransfer:
`E-transfer:
pay@globalpromote.in`,

  iban:
`Bank / Wise:

Account name: Rahul Kumar
IBAN: BE36967747881581
SWIFT/BIC: TRWIBEB1XXX
Bank: Wise

Bank address:
Rue du Trône 100, 3rd floor
Brussels, 1050
Belgium`,

  achWire:
`Bank Transfer / ACH / Wire:

Name: Rahul
Account type: Checking
Routing number: 026073150
Account number: 8313696908

Bank:
Community Federal Savings Bank

Bank address:
89-16 Jamaica Ave
Woodhaven, NY 11421
United States

SWIFT/BIC:
CMFGUS33`,

  revolut:
`Revolut:
Tag: @clavis02pk
Payment link:
https://revolut.me/clavis02pk`,

  mbway:
`MB WAY:
Number: +351 968 188 499
Name: Andre Santana`,

  card:
`Credit/Debit Card:
Our team will provide the secure card payment instructions.`

};


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
  new Map();

const manualReplyVersion =
  new Map();

const reminderTimers =
  new Map();


/* =========================================================
   HELPERS
========================================================= */

function nowISO() {

  return new Date().toISOString();

}


function wait(ms) {

  return new Promise(
    resolve =>
      setTimeout(resolve, ms)
  );

}


function replyDelay() {

  return (
    6000 +
    Math.floor(
      Math.random() * 3000
    )
  );

}


function normalize(text) {

  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[.,!?]/g, " ")
    .replace(/\s+/g, " ");

}


function hasMedia(
  attachmentInfo
) {

  return Boolean(
    String(
      attachmentInfo || ""
    ).trim()
  );

     }
/* =========================================================
   CONVERSATION
========================================================= */

function createConversation(
  senderId
) {

  return {

    senderId:
      String(senderId),

    pageKey:
      null,

    stage:
      "NEW",

    history:
      [],

    selectedPackage:
      null,

    paymentMethod:
      null,

    paymentDetailsSent:
      false,

    paymentConfirmed:
      false,

    paymentProofReceived:
      false,

    awaitingPaymentConfirmation:
      false,

    lastCustomerMessageAt:
      null,

    customerMessageVersion:
      0,

    lastOutgoingMessageId:
      null,

    lastOutgoingText:
      null,

    lastOutgoingStage:
      null,

    lastOutgoingAt:
      null,

    reminder:
      null

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

    text:
      String(text),

    timestamp:
      nowISO()

  });

  if (
    conversation.history.length > 80
  ) {

    conversation.history =
      conversation.history.slice(-80);

  }

}


/* =========================================================
   SUPABASE
========================================================= */

function supabaseConfigured() {

  return Boolean(
    SUPABASE_URL &&
    SUPABASE_SERVICE_ROLE_KEY
  );

}


function supabaseHeaders() {

  return {

    apikey:
      SUPABASE_SERVICE_ROLE_KEY,

    Authorization:
      `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,

    "Content-Type":
      "application/json"

  };

}


async function supabaseGetConversation(
  senderId
) {

  if (
    !supabaseConfigured()
  ) {

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

          method:
            "GET",

          headers:
            supabaseHeaders()

        }

      );

    const data =
      await response.json();

    if (
      !response.ok ||
      !Array.isArray(data) ||
      !data.length
    ) {

      return null;

    }

    const stored =
      data[0]?.messages;

    if (
      stored &&
      typeof stored === "object" &&
      !Array.isArray(stored)
    ) {

      return stored;

    }

    return null;

  }

  catch (error) {

    console.error(
      "SUPABASE GET ERROR:",
      error.message
    );

    return null;

  }

}


async function supabaseSaveConversation(
  senderId,
  conversation
) {

  if (
    !supabaseConfigured()
  ) {

    console.error(
      "SUPABASE NOT CONFIGURED"
    );

    return false;

  }

  try {

    const response =
      await fetch(

        `${SUPABASE_URL.replace(/\/+$/, "")}` +
        `/rest/v1/${encodeURIComponent(SUPABASE_TABLE)}`,

        {

          method:
            "POST",

          headers: {

            ...supabaseHeaders(),

            Prefer:
              "resolution=merge-duplicates,return=minimal"

          },

          body:
            JSON.stringify({

              id:
                String(senderId),

              messages:
                conversation,

              updated_at:
                nowISO()

            })

        }

      );

    const raw =
      await response.text();

    if (
      !response.ok
    ) {

      console.error(
        "SUPABASE SAVE ERROR:",
        response.status,
        raw
      );

      return false;

    }

    return true;

  }

  catch (error) {

    console.error(
      "SUPABASE SAVE EXCEPTION:",
      error.message
    );

    return false;

  }

}


/* =========================================================
   GET CONVERSATION
========================================================= */

async function getConversation(
  senderId
) {

  const key =
    String(senderId);


  if (
    conversations.has(key)
  ) {

    return conversations.get(key);

  }


  const saved =
    await supabaseGetConversation(
      key
    );


  const conversation =
    saved &&
    typeof saved === "object"

      ? saved

      : createConversation(
          key
        );


  conversation.senderId =
    key;

  conversation.pageKey =
    conversation.pageKey ||
    null;

  conversation.stage =
    conversation.stage ||
    "NEW";

  conversation.history =
    Array.isArray(
      conversation.history
    )
      ? conversation.history
      : [];

  conversation.selectedPackage =
    conversation.selectedPackage ||
    null;

  conversation.paymentMethod =
    conversation.paymentMethod ||
    null;

  conversation.paymentDetailsSent =
    Boolean(
      conversation.paymentDetailsSent
    );

  conversation.paymentConfirmed =
    Boolean(
      conversation.paymentConfirmed
    );

  conversation.paymentProofReceived =
    Boolean(
      conversation.paymentProofReceived
    );

  conversation.awaitingPaymentConfirmation =
    Boolean(
      conversation.awaitingPaymentConfirmation
    );

  conversation.customerMessageVersion =
    Number(
      conversation.customerMessageVersion ||
      0
    );

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

  conversation.reminder =
    conversation.reminder ||
    null;


  conversations.set(
    key,
    conversation
  );


  return conversation;

}


async function saveConversation(
  senderId,
  conversation
) {

  const key =
    String(senderId);

  conversations.set(
    key,
    conversation
  );

  return await supabaseSaveConversation(
    key,
    conversation
  );

}


/* =========================================================
   CLIENT QUEUE
========================================================= */

function queueForClient(
  senderId,
  task
) {

  const key =
    String(senderId);

  const previous =
    clientQueues.get(key) ||
    Promise.resolve();

  const next =
    previous
      .catch(() => {})
      .then(task);

  clientQueues.set(
    key,
    next
  );

  next.finally(() => {

    if (
      clientQueues.get(key) ===
      next
    ) {

      clientQueues.delete(key);

    }

  }).catch(() => {});

  return next;

}


/* =========================================================
   PACKAGE DETECTION
========================================================= */

function detectPackage(
  text
) {

  const t =
    normalize(text);

  if (
    /\bbronze\b/.test(t) ||
    /\bpackage\s*1\b/.test(t) ||
    /^1$/.test(t)
  ) return "bronze";

  if (
    /\bsilver\b/.test(t) ||
    /\bpackage\s*2\b/.test(t) ||
    /^2$/.test(t)
  ) return "silver";

  if (
    /\bgold\b/.test(t) ||
    /\bpackage\s*3\b/.test(t) ||
    /^3$/.test(t)
  ) return "gold";

  if (
    /\bdiamond\b/.test(t) ||
    /\bpackage\s*4\b/.test(t) ||
    /^4$/.test(t)
  ) return "diamond";

  return null;

}


/* =========================================================
   PAYMENT METHOD DETECTION
========================================================= */

function detectPaymentMethod(
  text
) {

  const t =
    normalize(text);

  if (
    /\bpaypal\b/.test(t)
  ) return "paypal";

  if (
    /\bvenmo\b/.test(t)
  ) return "venmo";

  if (
    /\be[\s-]?transfer\b/.test(t)
  ) return "etransfer";

  if (
    /\biban\b/.test(t) ||
    /\bwise\b/.test(t)
  ) return "iban";

  if (
    /\brevolut\b/.test(t)
  ) return "revolut";

  if (
    /\bmb[\s-]?way\b/.test(t)
  ) return "mbway";

  if (
    /\bach\b/.test(t) ||
    /\bwire\b/.test(t) ||
    /\bbank transfer\b/.test(t) ||
    /\bbank\b/.test(t)
  ) return "achWire";

  if (
    /\bcredit card\b/.test(t) ||
    /\bdebit card\b/.test(t) ||
    /\bcredit\/debit\b/.test(t) ||
    /\bcard\b/.test(t)
  ) return "card";

  return null;

}


/* =========================================================
   PAYMENT METHOD AVAILABLE
========================================================= */

function paymentMethodAvailable(
  page,
  method
) {

  const names = {

    paypal:
      ["PayPal"],

    venmo:
      ["Venmo"],

    etransfer:
      ["E-transfer"],

    iban:
      ["IBAN", "IBAN / Wise"],

    revolut:
      ["Revolut"],

    mbway:
      ["MB WAY"],

    card:
      ["Credit/Debit Card"],

    achWire:
      [
        "Bank Transfer",
        "Bank Transfer (ACH / Wire Transfer)"
      ]

  };


  return (
    names[method] || []
  ).some(
    expected =>
      page.paymentMethods.some(
        available =>
          normalize(available) ===
          normalize(expected)
      )
  );

}


/* =========================================================
   PACKAGE MESSAGE
========================================================= */

function buildPackagesMessage(
  page
) {

  if (
    page.key === "europe"
  ) {

    return `
🎊 Instagram packages🎊

1️⃣ BRONZE PACKAGE 📦
👉 only 39€ = 2story
🎉(1.5k followers guaranteed)

2️⃣ SILVER PACKAGE 📦
👉 only 66€ = 1 post and 3stroy + 2 highlights 🎊
🎉(4k followers guaranteed)

3️⃣ GOLD PACKAGE 📦
👉 only 99€ = 3 post and 4 stroy +3 highlights 🎊
🎉(7k followers guaranteed)
Mostly client choose this package!!

4️⃣ DIAMOND PACKAGE 📦
👉 only 129€ = 5 post and 8 story + 7 highlights 🎊
🎉(10k followers guaranteed)

💥 CHOOSE YOUR PACKAGE 💥`;

  }


  if (
    page.key === "miami"
  ) {

    return `
🎊 INSTAGRAM packages🎊

1️⃣ BRONZE PACKAGE 📦
👉 only 38$ = 2 story
🎉(1k followers guaranteed)

2️⃣ SILVER PACKAGE 📦
👉 only 66$ = 1 post and 3stroy + 2 highlights 🎊
🎉(3k followers guaranteed)

3️⃣ GOLD PACKAGE 📦
👉 only 99$ = 3 post and 4stroy +3 highlights 🎊
🎉(5k followers guaranteed)
Mostly client choose this package!!

4️⃣ DIAMOND PACKAGE 📦
👉 only 129$ = 5 post and 8 story + 7 highlights 🎊
🎉(8k followers guaranteed)

💥 CHOOSE YOUR PACKAGE 💥`;

  }


  if (
    page.key === "canada"
  ) {

    return `
🎉 INSTAGRAM PROMOTION PACKAGES 🎉

🥉 BRONZE — $35
✅ 2 Stories
🎯 300–400 Global Followers Guaranteed

🥈 SILVER — $60
✅ 1 Feed Post + 2 Stories
🎯 1.5K Followers Guaranteed (Includes 300–400 Canadian audience)

🥇 GOLD ⭐ — $99 (Most Popular)
✅ 3 Feed Posts + 4 Stories
🎯 4.5K Guaranteed Followers (Only Canadian Audience)

💎 DIAMOND 👑 — $199
✅ 5 Feed Posts + 8 Stories
🎯 10K Guaranteed Followers (Only Toronto Audience)

━━━━━━━━━━━━━━━━━━

📩 Choose your package & DM us to get started! 🚀`;

  }


  if (
    page.key === "mentalxheal"
  ) {

    return `
🎊 INSTAGRAM packages🎊

1️⃣ BRONZE PACKAGE 📦
👉 only 39$ = 2 story
🎉(1k followers guaranteed)

2️⃣ SILVER PACKAGE 📦
👉 only 66$ = 1 post and 3stroy + 2 highlights 🎊
🎉(3k followers guaranteed)

3️⃣ GOLD PACKAGE 📦
👉 only 99$ = 3 post and 4stroy +3 highlights 🎊
🎉(5k followers guaranteed)
Mostly client choose this package!!

4️⃣ DIAMOND PACKAGE 📦
👉 only 129$ = 5 post and 8 story + 7 highlights 🎊
🎉(8k followers guaranteed)

WE ALSO PROVIDE PACKAGES FOR:

TIKTOK
FACEBOOK
YOUTUBE

💥 CHOOSE YOUR PACKAGE 💥`;

  }

  return "";

}


/* =========================================================
   PACKAGE CONFIRMATION
========================================================= */

function buildPackageConfirmation(
  page,
  packageKey
) {

  const p =
    page.packages[packageKey];

  if (!p) return null;

  return `
Perfect ❤️

You've selected the ${p.name} package.

${page.currency}${p.price} = ${p.details}
🎯 ${p.followers}

How would you like to pay?

${page.paymentMethods.join("\n")}`;

}


/* =========================================================
   PAYMENT MESSAGE
========================================================= */

function buildPaymentMessage(
  page,
  packageKey,
  method
) {

  const p =
    page.packages[packageKey];

  if (!p) return null;

  if (
    !paymentMethodAvailable(
      page,
      method
    )
  ) {

    return `
That payment method isn't listed for this page.

Available methods:

${page.paymentMethods.join("\n")}

Please choose one of these ❤️`;

  }

  const details =
    PAYMENT_DETAILS[method];

  return `
Perfect ❤️

Package:
${p.name}

Package price:
${page.currency}${p.price}

Payment method:
${method.toUpperCase()}

Payment details:

${details}

After successful payment, please send us your payment screenshot ❤️`;

     }
/* =========================================================
   REMINDERS
========================================================= */

const REMINDER_TEXTS = {

  MESSAGE_ONE_SENT:
    "Are you interested? ❤️",

  MESSAGE_TWO_SENT:
    "Can I show you our packages? 😊",

  PACKAGES_SHOWN:
    "So which package would you like to choose? ❤️",

  PACKAGE_SELECTED:
    "Which mode of payment do you have? ❤️",

  PAYMENT_PENDING:
    "Did you try to make the payment? ❤️ Let me know if you need any help."

};


/*
   First reminder was not given an exact delay in the
   original requirements, so it is set to 1 minute.
*/

const REMINDER_DELAYS = {

  MESSAGE_ONE_SENT:
    1 * 60 * 1000,

  MESSAGE_TWO_SENT:
    2 * 60 * 1000,

  PACKAGES_SHOWN:
    3 * 60 * 1000,

  PACKAGE_SELECTED:
    1 * 60 * 1000,

  PAYMENT_PENDING:
    5 * 60 * 1000

};


/* =========================================================
   CANCEL REMINDER
========================================================= */

function cancelReminder(
  senderId
) {

  const key =
    String(senderId);

  const timer =
    reminderTimers.get(key);

  if (timer) {

    clearTimeout(timer);

    reminderTimers.delete(key);

  }

  const conversation =
    conversations.get(key);

  if (conversation) {

    conversation.reminder =
      null;

  }

}


/* =========================================================
   SCHEDULE REMINDER
========================================================= */

async function scheduleReminder(
  senderId,
  stage,
  messageId,
  sentAt
) {

  if (
    !REMINDER_TEXTS[stage]
  ) {

    return;

  }

  const key =
    String(senderId);

  cancelReminder(key);

  const conversation =
    await getConversation(key);

  conversation.reminder = {

    stage,

    messageId:
      messageId
        ? String(messageId)
        : null,

    sentAt:
      sentAt ||
      nowISO(),

    seen:
      false,

    triggered:
      false,

    customerMessageVersion:
      conversation.customerMessageVersion

  };

  await saveConversation(
    key,
    conversation
  );

}


/* =========================================================
   START REMINDER AFTER READ
========================================================= */

async function startReminderAfterRead(
  customerId,
  page,
  watermark
) {

  const key =
    String(customerId);

  const conversation =
    await getConversation(key);

  if (
    !conversation.reminder
  ) {

    return;

  }

  const reminder =
    conversation.reminder;

  if (
    reminder.triggered ||
    reminder.seen
  ) {

    return;

  }

  if (
    !reminder.messageId
  ) {

    return;

  }

  const watermarkNumber =
    Number(watermark);

  if (
    !Number.isFinite(
      watermarkNumber
    )
  ) {

    return;

  }

  const sentTime =
    new Date(
      reminder.sentAt
    ).getTime();

  if (
    !Number.isFinite(sentTime)
  ) {

    return;

  }

  if (
    watermarkNumber < sentTime
  ) {

    return;

  }


  /*
     The READ event is only allowed to activate
     the reminder for the exact current outgoing message.
  */

  if (
    String(
      conversation.lastOutgoingMessageId || ""
    ) !==
    String(
      reminder.messageId
    )
  ) {

    return;

  }


  reminder.seen =
    true;

  const delay =
    REMINDER_DELAYS[
      reminder.stage
    ];

  if (
    delay === undefined
  ) {

    return;

  }


  const timer =
    setTimeout(
      () => {

        processReminder(
          key,
          page,
          reminder.stage,
          reminder.messageId,
          reminder.customerMessageVersion
        ).catch(
          error =>
            console.error(
              "REMINDER ERROR:",
              error
            )
        );

      },
      delay
    );


  reminderTimers.set(
    key,
    timer
  );


  await saveConversation(
    key,
    conversation
  );


  console.log(
    "REMINDER TIMER STARTED:",
    page.username,
    key,
    reminder.stage,
    delay
  );

}


/* =========================================================
   PROCESS REMINDER
========================================================= */

async function processReminder(
  senderId,
  page,
  expectedStage,
  expectedMessageId,
  expectedCustomerVersion
) {

  const key =
    String(senderId);

  reminderTimers.delete(key);

  const conversation =
    await getConversation(key);

  const reminder =
    conversation.reminder;

  if (
    !reminder ||
    reminder.triggered ||
    !reminder.seen
  ) {

    return;

  }


  /*
     Customer replied after the original message.
  */

  if (
    Number(
      conversation.customerMessageVersion
    ) !==
    Number(
      expectedCustomerVersion
    )
  ) {

    return;

  }


  /*
     Conversation moved forward.
  */

  if (
    conversation.stage !==
    expectedStage
  ) {

    return;

  }


  if (
    String(
      conversation.lastOutgoingMessageId || ""
    ) !==
    String(expectedMessageId || "")
  ) {

    return;

  }


  if (
    conversation.paymentConfirmed
  ) {

    return;

  }


  const text =
    REMINDER_TEXTS[
      expectedStage
    ];

  if (!text) {

    return;

  }


  const data =
    await sendInstagramMessage(
      page,
      key,
      text
    );


  const messageId =
    data?.message_id ||
    data?.id ||
    null;


  if (
    messageId
  ) {

    outgoingMessages.set(
      `${page.key}:${String(messageId)}`,
      {
        customerId: key,
        pageKey: page.key,
        type: "reminder"
      }
    );

  }


  saveMessage(
    conversation,
    "assistant",
    text
  );


  conversation.lastOutgoingMessageId =
    messageId
      ? String(messageId)
      : null;

  conversation.lastOutgoingText =
    text;

  conversation.lastOutgoingStage =
    expectedStage;

  conversation.lastOutgoingAt =
    nowISO();

  conversation.reminder =
    null;


  await saveConversation(
    key,
    conversation
  );


  console.log(
    "REMINDER SENT:",
    page.username,
    key
  );

}


/* =========================================================
   AI TEXT EXTRACTION
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

        text +=
          part.text;

      }

    }

  }

  return text.trim();

}


/* =========================================================
   AI
========================================================= */

async function getAIReply(
  page,
  conversation,
  clientMessage,
  attachmentInfo
) {

  if (!OPEN_AI) {

    return null;

  }


  const history =
    conversation.history
      .slice(-40)
      .map(
        item =>
          `${item.role}: ${item.text}`
      )
      .join("\n");


  const packageInfo =
    Object.values(
      page.packages
    )
      .map(
        p =>
          `${p.name}: ${page.currency}${p.price} - ${p.details} - ${p.followers}`
      )
      .join("\n");


  const prompt =
`You are the customer-support and sales assistant for ${BUSINESS_NAME}.

CURRENT INSTAGRAM PAGE:
${page.username}

CURRENT PAGE PACKAGES:
${packageInfo}

CURRENT PAGE PAYMENT METHODS:
${page.paymentMethods.join(", ")}

CURRENT STAGE:
${conversation.stage}

SELECTED PACKAGE:
${conversation.selectedPackage || "none"}

PAYMENT METHOD:
${conversation.paymentMethod || "none"}

RULES:

- This is an existing customer conversation.
- Remember all previous messages.
- Never restart the conversation.
- Never send the opening message again.
- Never send MESSAGE TWO again unless the fixed conversation flow specifically requires it.
- Never randomly send the package list.
- Never use another page's price.
- Never invent payment details.
- Only mention payment methods available on this page.
- Keep answers short, natural and friendly.
- If asked how followers are guaranteed, explain the approved guarantee.
- If asked whether followers are real/organic, explain that they are achieved through promotion of their content on different pages.
- If asked another business question, answer naturally.
- Never claim payment is verified unless the customer has confirmed it.
- Never say a screenshot itself proves payment was received.

CONVERSATION HISTORY:

${history}

LATEST CUSTOMER MESSAGE:

${clientMessage || "[media]"}

ATTACHMENT:

${attachmentInfo || "none"}

Return only the customer-facing response.`;


  try {

    const response =
      await fetch(
        "https://api.openai.com/v1/responses",
        {

          method:
            "POST",

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
                350

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

  }

  catch (error) {

    console.error(
      "OPENAI ERROR:",
      error.message
    );

    return null;

  }

}


/* =========================================================
   INSTAGRAM SEND
========================================================= */

async function sendInstagramMessage(
  page,
  recipientId,
  text
) {

  if (
    !page?.token
  ) {

    throw new Error(
      `Instagram token missing for ${page?.username}`
    );

  }


  const url =
    `https://graph.instagram.com/${INSTAGRAM_API_VERSION}` +
    `/${page.id}/messages`;


  const response =
    await fetch(
      url,
      {

        method:
          "POST",

        headers: {

          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${page.token}`

        },

        body:
          JSON.stringify({

            recipient: {

              id:
                recipientId

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
      page.username,
      data
    );

    throw new Error(
      `Instagram message failed for ${page.username}`
    );

  }


  return data;

}


/* =========================================================
   SAFE REPLY
========================================================= */

async function sendReplySafely(
  page,
  senderId,
  conversation,
  reply,
  version,
  reminderStage = null
) {

  if (!reply) {

    return null;

  }


  await wait(
    replyDelay()
  );


  if (
    (
      manualReplyVersion.get(
        String(senderId)
      ) || 0
    ) !== version
  ) {

    return null;

  }


  /*
     Do not send a stale reply if the customer sent
     another message while the AI was waiting.
  */

  const current =
    await getConversation(
      senderId
    );


  if (
    current.customerMessageVersion !==
    conversation.customerMessageVersion
  ) {

    console.log(
      "STALE AI RESPONSE CANCELLED"
    );

    return null;

  }


  const data =
    await sendInstagramMessage(
      page,
      senderId,
      reply
    );


  const messageId =
    data?.message_id ||
    data?.id ||
    null;


  if (
    messageId
  ) {

    outgoingMessages.set(
      `${page.key}:${String(messageId)}`,
      {
        customerId:
          String(senderId),

        pageKey:
          page.key,

        type:
          "ai"
      }
    );

  }


  conversation.pageKey =
    page.key;

  conversation.lastOutgoingMessageId =
    messageId
      ? String(messageId)
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


  if (
    reminderStage &&
    messageId
  ) {

    conversation.reminder = {

      stage:
        reminderStage,

      messageId:
        String(messageId),

      sentAt:
        conversation.lastOutgoingAt,

      seen:
        false,

      triggered:
        false,

      customerMessageVersion:
        conversation.customerMessageVersion

    };

  }
  else {

    conversation.reminder =
      null;

  }


  await saveConversation(
    senderId,
    conversation
  );


  return data;

}
/* =========================================================
   POSITIVE REPLY DETECTION
========================================================= */

function isPositive(
  text
) {

  const t =
    normalize(text);

  return Boolean(
    /^(yes|yeah|yep|yup|sure|okay|ok|interested|i am interested|send|show me|go ahead|yes please|sure please)$/.test(t) ||
    /\b(yes|interested|sure|go ahead)\b/.test(t)
  );

}


/* =========================================================
   NEGATIVE
========================================================= */

function isNegative(
  text
) {

  const t =
    normalize(text);

  return Boolean(
    /\b(no thanks|not interested|no thank you|stop|remove me)\b/.test(t)
  );

}


/* =========================================================
   GUARANTEE QUESTION
========================================================= */

function isGuaranteeQuestion(
  text
) {

  const t =
    normalize(text);

  return (
    t.includes("guarantee") ||
    t.includes("guaranteed") ||
    t.includes("refund") ||
    t.includes("how do you guarantee")
  );

}


/* =========================================================
   REAL / ORGANIC QUESTION
========================================================= */

function isRealFollowerQuestion(
  text
) {

  const t =
    normalize(text);

  return (
    (
      t.includes("real") ||
      t.includes("organic") ||
      t.includes("genuine")
    ) &&
    (
      t.includes("followers") ||
      t.includes("follow")
    )
  );

}


/* =========================================================
   PAYMENT PROOF / PAID DETECTION
========================================================= */

function claimsPayment(
  text,
  attachmentInfo
) {

  const t =
    normalize(text);

  const paymentWords =
    [
      "paid",
      "payment done",
      "payment completed",
      "i have paid",
      "sent payment",
      "payment sent",
      "done payment"
    ];

  return (
    paymentWords.some(
      word =>
        t.includes(word)
    ) ||
    Boolean(
      attachmentInfo
    ) &&
    (
      t.includes("payment") ||
      t.includes("paid")
    )
  );

}


/* =========================================================
   PROCESS CUSTOMER MESSAGE
========================================================= */

async function processClientMessage(
  page,
  senderId,
  clientMessage,
  attachmentInfo
) {

  const key =
    String(senderId);


  const conversation =
    await getConversation(
      key
    );


  conversation.pageKey =
    page.key;


  /*
     A real customer message always cancels the
     reminder belonging to the previous outgoing message.
  */

  cancelReminder(key);


  /*
     Increase customer message version BEFORE doing
     anything else. This makes all old reminder/AI jobs stale.
  */

  conversation.customerMessageVersion =
    Number(
      conversation.customerMessageVersion || 0
    ) + 1;


  conversation.lastCustomerMessageAt =
    nowISO();


  const text =
    String(
      clientMessage || ""
    ).trim();


  const media =
    hasMedia(
      attachmentInfo
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
    key,
    conversation
  );


  const version =
    manualReplyVersion.get(key) || 0;


  console.log(
    "CUSTOMER MESSAGE:",
    page.username,
    key,
    "STAGE:",
    conversation.stage,
    "TEXT:",
    text
  );


  /* =======================================================
     PAYMENT CONFIRMATION
  ======================================================= */

  if (
    conversation.awaitingPaymentConfirmation
  ) {

    const normalized =
      normalize(text);


    if (
      /\b(yes|yeah|yep|yup|correct|done|payment is done|it is done)\b/
        .test(normalized)
    ) {

      conversation.paymentConfirmed =
        true;

      conversation.awaitingPaymentConfirmation =
        false;

      conversation.stage =
        "PAYMENT_CONFIRMED";


      const reply =
`Okay dear ❤️ Please send me the pictures that you wanna promote and your username, I will upload it within 24 hours after verifying your payment.`;

      await sendReplySafely(
        page,
        key,
        conversation,
        reply,
        version
      );

      return;

    }


    const reply =
`No problem ❤️ Please let me know once the payment is completed.`;

    await sendReplySafely(
      page,
      key,
      conversation,
      reply,
      version
    );

    return;

  }


  /* =======================================================
     PAYMENT PROOF
  ======================================================= */

  if (
    claimsPayment(
      text,
      attachmentInfo
    )
  ) {

    conversation.paymentProofReceived =
      true;

    conversation.awaitingPaymentConfirmation =
      true;


    const reply =
`Thank you dear ❤️ Did the payment go through successfully?`;

    await sendReplySafely(
      page,
      key,
      conversation,
      reply,
      version
    );

    return;

  }


  /* =======================================================
     GUARANTEE
  ======================================================= */

  if (
    isGuaranteeQuestion(text)
  ) {

    await sendReplySafely(
      page,
      key,
      conversation,
      GUARANTEE_MESSAGE,
      version
    );

    return;

  }


  /* =======================================================
     REAL / ORGANIC
  ======================================================= */

  if (
    isRealFollowerQuestion(text)
  ) {

    await sendReplySafely(
      page,
      key,
      conversation,
      REAL_FOLLOWERS_MESSAGE,
      version
    );

    return;

  }


  /* =======================================================
     NEGATIVE
  ======================================================= */

  if (
    isNegative(text)
  ) {

    conversation.stage =
      "NEGATIVE";

    await sendReplySafely(
      page,
      key,
      conversation,
      `No problem ❤️ If you ever change your mind, just message us.`,
      version
    );

    return;

  }


  /* =======================================================
     NEW → MESSAGE ONE
  ======================================================= */

  if (
    conversation.stage ===
    "NEW"
  ) {

    conversation.stage =
      "MESSAGE_ONE_SENT";


    await sendReplySafely(
      page,
      key,
      conversation,
      MESSAGE_ONE,
      version,
      "MESSAGE_ONE_SENT"
    );

    return;

  }


  /* =======================================================
     MESSAGE ONE → MESSAGE TWO
     
     ONLY the customer's NEXT REAL MESSAGE can
     advance this stage.
  ======================================================= */

  if (
    conversation.stage ===
    "MESSAGE_ONE_SENT"
  ) {

    conversation.stage =
      "MESSAGE_TWO_SENT";


    await sendReplySafely(
      page,
      key,
      conversation,
      MESSAGE_TWO,
      version,
      "MESSAGE_TWO_SENT"
    );

    return;

  }


  /* =======================================================
     MESSAGE TWO → PACKAGES
     
     IMPORTANT:
     This is exactly ONE response.
  ======================================================= */

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
        page,
        key,
        conversation,
        buildPackageConfirmation(
          page,
          directPackage
        ),
        version,
        "PACKAGE_SELECTED"
      );

      return;

    }


    conversation.stage =
      "PACKAGES_SHOWN";


    await sendReplySafely(
      page,
      key,
      conversation,
      buildPackagesMessage(page),
      version,
      "PACKAGES_SHOWN"
    );

    return;

  }


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
      page,
      key,
      conversation,
      buildPackageConfirmation(
        page,
        selectedPackage
      ),
      version,
      "PACKAGE_SELECTED"
    );

    return;

  }


  /* =======================================================
     PAYMENT METHOD
  ======================================================= */

  const paymentMethod =
    detectPaymentMethod(
      text
    );


  if (
    paymentMethod &&
    conversation.selectedPackage
  ) {

    if (
      !paymentMethodAvailable(
        page,
        paymentMethod
      )
    ) {

      await sendReplySafely(
        page,
        key,
        conversation,
        `That payment method isn't available on this page ❤️

Available methods:

${page.paymentMethods.join("\n")}`,
        version,
        "PACKAGE_SELECTED"
      );

      return;

    }


    conversation.paymentMethod =
      paymentMethod;

    conversation.stage =
      "PAYMENT_PENDING";

    conversation.paymentDetailsSent =
      true;


    await sendReplySafely(
      page,
      key,
      conversation,
      buildPaymentMessage(
        page,
        conversation.selectedPackage,
        paymentMethod
      ),
      version,
      "PAYMENT_PENDING"
    );

    return;

  }


  /* =======================================================
     AI FALLBACK
  ======================================================= */

  const aiReply =
    await getAIReply(
      page,
      conversation,
      text,
      attachmentInfo
    );


  if (
    aiReply
  ) {

    await sendReplySafely(
      page,
      key,
      conversation,
      aiReply,
      version
    );

    return;

  }


  /*
     If AI fails, don't restart the conversation.
  */

  await saveConversation(
    key,
    conversation
  );

}


/* =========================================================
   ADMIN AUTH
========================================================= */

function isAdmin(
  req
) {

  return Boolean(

    ADMIN_SECRET &&

    req.headers[
      "x-admin-secret"
    ] ===
    ADMIN_SECRET

  );

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
   GET CUSTOMER ID FROM READ EVENT
========================================================= */

function getCustomerIdFromReadEvent(
  event,
  page
) {

  const sender =
    String(
      event.sender?.id || ""
    );

  const recipient =
    String(
      event.recipient?.id || ""
    );


  /*
     The page ID is known.
     The other ID is the customer.
  */

  if (
    sender &&
    sender !== String(page.id)
  ) {

    return sender;

  }


  if (
    recipient &&
    recipient !== String(page.id)
  ) {

    return recipient;

  }


  return null;

}


/* =========================================================
   INSTAGRAM WEBHOOK
========================================================= */

app.post(
  "/webhook",
  async (req, res) => {

    /*
       Meta gets 200 immediately.
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
        body.entry
      )
    ) {

      return;

    }


    for (
      const entry of
      body.entry
    ) {

      const page =
        getPageById(
          entry?.id
        );


      if (!page) {

        console.log(
          "UNKNOWN PAGE:",
          entry?.id
        );

        continue;

      }


      for (
        const event of
        entry.messaging || []
      ) {
/* =================================================
   BLOCK AI-TO-AI EVENTS
================================================= */

if (
  isManagedPageEvent(event)
) {

  console.log(
    "🚫 AI-TO-AI EVENT IGNORED:",
    page.username,
    "SENDER:",
    event?.sender?.id,
    "RECIPIENT:",
    event?.recipient?.id
  );

  continue;

}

        /* =================================================
           READ / SEEN
           
           THIS BLOCK MUST FINISH WITH continue.
           
           READ EVENTS NEVER ENTER CUSTOMER PROCESSOR.
        ================================================= */

        if (
          event.read
        ) {

          console.log(
            "READ / SEEN EVENT:",
            page.username
          );


          const customerId =
            getCustomerIdFromReadEvent(
              event,
              page
            );


          const watermark =
            event.read?.watermark;


          if (
            customerId &&
            watermark
          ) {

            startReminderAfterRead(
              customerId,
              page,
              watermark
            ).catch(
              error =>
                console.error(
                  "READ REMINDER ERROR:",
                  error
                )
            );

          }


          /*
             CRITICAL:
             A read event can NEVER continue below.
          */

          continue;

        }


        /* =================================================
           DELIVERY
        ================================================= */

        if (
          event.delivery
        ) {

          console.log(
            "DELIVERY EVENT IGNORED"
          );

          continue;

        }


        /* =================================================
           REACTION / POSTBACK
        ================================================= */

        if (
          event.reaction ||
          event.postback
        ) {

          console.log(
            "REACTION / POSTBACK IGNORED"
          );

          continue;

        }


        /* =================================================
           NO MESSAGE
        ================================================= */

        if (
          !event.message
        ) {

          continue;

        }


        const senderId =
          event.sender?.id;

        const recipientId =
          event.recipient?.id;

        const messageId =
          event.message?.mid;

        const isEcho =
          event.message?.is_echo === true;


        if (
          !senderId ||
          !messageId
        ) {

          continue;

        }


        /* =================================================
           ECHO / OUR MESSAGE
        ================================================= */

        if (
          isEcho ||
          String(senderId) ===
          String(page.id)
        ) {

          const outgoingKey =
            `${page.key}:${String(messageId)}`;


          /*
             This was sent by our server.
          */

          if (
            outgoingMessages.has(
              outgoingKey
            )
          ) {

            outgoingMessages.delete(
              outgoingKey
            );


            console.log(
              "OUR MESSAGE ECHO IGNORED"
            );

            continue;

          }


          /*
             Not one of our tracked messages.
             Therefore it may be a manual message.
          */

          if (
            recipientId
          ) {

            const customerId =
              String(recipientId);


            cancelReminder(
              customerId
            );


            manualReplyVersion.set(
              customerId,
              (
                manualReplyVersion.get(
                  customerId
                ) || 0
              ) + 1
            );


            const conversation =
              await getConversation(
                customerId
              );


            const ownText =
              String(
                event.message?.text ||
                ""
              ).trim();


            if (
              ownText
            ) {

              saveMessage(
                conversation,
                "assistant",
                ownText
              );


              conversation.pageKey =
                page.key;


              /*
                 Synchronize the exact stage.
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
                normalize(
                  buildPackagesMessage(page)
                )
              ) {

                conversation.stage =
                  "PACKAGES_SHOWN";

              }


              conversation.lastOutgoingText =
                ownText;

              conversation.lastOutgoingMessageId =
                String(messageId);

              conversation.lastOutgoingStage =
                conversation.stage;

              conversation.lastOutgoingAt =
                nowISO();

              conversation.reminder =
                null;


              await saveConversation(
                customerId,
                conversation
              );


              console.log(
                "MANUAL MESSAGE SYNCHRONIZED:",
                page.username,
                customerId
              );

            }

          }


          continue;

        }


        /* =================================================
           DUPLICATE CUSTOMER MESSAGE PROTECTION
        ================================================= */

        const duplicateKey =
          `${page.key}:${String(messageId)}`;


        if (
          processedMessageIds.has(
            duplicateKey
          )
        ) {

          console.log(
            "DUPLICATE IGNORED:",
            messageId
          );

          continue;

        }


        processedMessageIds.set(
          duplicateKey,
          Date.now()
        );


        setTimeout(
          () => {

            processedMessageIds.delete(
              duplicateKey
            );

          },
          60 * 60 * 1000
        );


        /* =================================================
           CUSTOMER MESSAGE
        ================================================= */

        const clientMessage =
          typeof event.message?.text ===
          "string"

            ? event.message.text.trim()

            : "";


        const attachmentInfo =
          (
            event.message?.attachments ||
            []
          )
            .map(
              attachment =>
                `type=${attachment.type || "unknown"}`
            )
            .join("\n");


        const hasMessage =
          Boolean(
            clientMessage ||
            attachmentInfo ||
            event.message?.share
          );


        if (!hasMessage) {

          continue;

        }


        /*
           Every customer has ONE sequential queue.
        */

        queueForClient(
          senderId,
          async () => {

            try {

              const conversation =
                await getConversation(
                  senderId
                );


              conversation.pageKey =
                page.key;


              await saveConversation(
                senderId,
                conversation
              );


              await processClientMessage(
                page,
                senderId,
                clientMessage,
                attachmentInfo
              );

            }

            catch (error) {

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

app.get(
  "/admin/memory-test",
  async (req, res) => {

    if (
      !isAdmin(req)
    ) {

      return res.sendStatus(
        403
      );

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
          "No Supabase conversation found."

      });

    }


    return res.json({

      success: true,

      found: true,

      senderId,

      pageKey:
        conversation.pageKey,

      stage:
        conversation.stage,

      selectedPackage:
        conversation.selectedPackage,

      paymentMethod:
        conversation.paymentMethod,

      paymentDetailsSent:
        conversation.paymentDetailsSent,

      paymentConfirmed:
        conversation.paymentConfirmed,

      paymentProofReceived:
        conversation.paymentProofReceived,

      awaitingPaymentConfirmation:
        conversation.awaitingPaymentConfirmation,

      customerMessageVersion:
        conversation.customerMessageVersion,

      reminder:
        conversation.reminder,

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

      lastOutgoingMessageId:
        conversation.lastOutgoingMessageId,

      lastOutgoingAt:
        conversation.lastOutgoingAt

    });

  }
);


/* =========================================================
   ADMIN STATUS
========================================================= */

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


    const clients = [];


    for (
      const [
        senderId,
        conversation
      ]
      of conversations.entries()
    ) {

      clients.push({

        senderId,

        page:
          conversation.pageKey,

        stage:
          conversation.stage,

        selectedPackage:
          conversation.selectedPackage,

        paymentMethod:
          conversation.paymentMethod,

        paymentConfirmed:
          conversation.paymentConfirmed,

        paymentProofReceived:
          conversation.paymentProofReceived,

        reminder:
          conversation.reminder,

        messages:
          conversation.history.length,

        lastOutgoingText:
          conversation.lastOutgoingText,

        lastOutgoingMessageId:
          conversation.lastOutgoingMessageId,

        lastOutgoingAt:
          conversation.lastOutgoingAt

      });

    }


    return res.json({

      success: true,

      pages:
        Object.values(
          PAGE_CONFIGS
        ).map(
          page => ({

            username:
              page.username,

            id:
              page.id,

            token:
              Boolean(page.token)

          })
        ),

      supabase:
        supabaseConfigured(),

      activeReminders:
        reminderTimers.size,

      clients

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

      status:
        "ok",

      ai:
        Boolean(OPEN_AI),

      supabase:
        supabaseConfigured(),

      pages:
        Object.values(
          PAGE_CONFIGS
        ).map(
          page => ({

            username:
              page.username,

            id:
              page.id,

            token:
              Boolean(page.token)

          })
        ),

      conversations:
        conversations.size,

      activeReminders:
        reminderTimers.size

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

<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
>

<title>
Global Promote AI
</title>

<style>

body {
  font-family: Arial;
  background: #f5f5f5;
  padding: 20px;
}

.card {
  max-width: 850px;
  margin: auto;
  background: white;
  padding: 20px;
  border-radius: 15px;
}

input,
button {
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  margin-top: 10px;
}

pre {
  white-space: pre-wrap;
  word-break: break-word;
}

</style>

</head>

<body>

<div class="card">

<h2>
🤖 Global Promote AI
</h2>

<p>
🟢 4 PAGE AI SYSTEM
</p>

<p>
Europe • Miami • Canada • Mentalxheal
</p>

<p>
Supabase Memory • Seen Reminders • Payment Flow
</p>

<input
  id="secret"
  type="password"
  placeholder="ADMIN_SECRET"
>

<button
  onclick="loadStatus()"
>
Load Status
</button>

<pre id="out"></pre>

</div>

<script>

async function loadStatus() {

  const secret =
    document.getElementById(
      "secret"
    ).value;

  const response =
    await fetch(
      "/admin/status",
      {

        headers: {

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
      "Global Promote 4-Page Instagram AI is running!"
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
      "GLOBAL PROMOTE 4-PAGE AI STARTED"
    );

    console.log(
      "PORT:",
      PORT
    );

    console.log(
      "AI:",
      OPEN_AI
        ? "CONNECTED"
        : "MISSING"
    );

    console.log(
      "SUPABASE:",
      supabaseConfigured()
        ? "CONNECTED"
        : "MISSING"
    );

    console.log(
      "----------------------------------------"
    );


    for (
      const page
      of Object.values(
        PAGE_CONFIGS
      )
    ) {

      console.log(
        page.username,
        "|",
        page.id,
        "| TOKEN:",
        page.token
          ? "CONNECTED"
          : "MISSING"
      );

    }


    console.log(
      "----------------------------------------"
    );

    console.log(
      "READ / SEEN EVENTS: NEVER PROCESSED AS CUSTOMER MESSAGES"
    );

    console.log(
      "EXACT OUTGOING MESSAGE TRACKING: ENABLED"
    );

    console.log(
      "REMINDERS: ENABLED"
    );

    console.log(
      "SUPABASE MEMORY: ENABLED"
    );

    console.log(
      "MANUAL REPLY SYNC: ENABLED"
    );

    console.log(
      "PAYMENT PROOF FLOW: ENABLED"
    );

    console.log(
      "4-PAGE PACKAGE SYSTEM: ENABLED"
    );

    console.log(
      "========================================"
    );

  }
);
