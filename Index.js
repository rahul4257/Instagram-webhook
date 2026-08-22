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

    id:
      "17841404831696204",

    token:
      PAGE_ACCESS_TOKEN,

    currency:
      "€",

    packages: {

      bronze: {
        name: "Bronze",
        price: 39,
        details: "2 story",
        followers:
          "1.5K followers guaranteed"
      },

      silver: {
        name: "Silver",
        price: 66,
        details:
          "1 post and 3 story + 2 highlights",
        followers:
          "4K followers guaranteed"
      },

      gold: {
        name: "Gold",
        price: 99,
        details:
          "3 post and 4 story + 3 highlights",
        followers:
          "7K followers guaranteed"
      },

      diamond: {
        name: "Diamond",
        price: 129,
        details:
          "5 post and 8 story + 7 highlights",
        followers:
          "10K followers guaranteed"
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


  /* =======================================================
     MIAMI
  ======================================================= */

  miami: {

    key: "miami",

    username: "@expl.miami",

    id:
      "17841403973063146",

    token:
      EXPL_MIAMI_TOKEN,

    currency:
      "$",

    packages: {

      bronze: {
        name: "Bronze",
        price: 38,
        details: "2 story",
        followers:
          "1K followers guaranteed"
      },

      silver: {
        name: "Silver",
        price: 66,
        details:
          "1 post and 3 story + 2 highlights",
        followers:
          "3K followers guaranteed"
      },

      gold: {
        name: "Gold",
        price: 99,
        details:
          "3 post and 4 story + 3 highlights",
        followers:
          "5K followers guaranteed"
      },

      diamond: {
        name: "Diamond",
        price: 129,
        details:
          "5 post and 8 story + 7 highlights",
        followers:
          "8K followers guaranteed"
      }

    },

    paymentMethods: [
      "PayPal",
      "Venmo",
      "Credit/Debit Card",
      "Bank Transfer (ACH / Wire Transfer)"
    ]

  },


  /* =======================================================
     CANADA
  ======================================================= */

  canada: {

    key: "canada",

    username: "@expl.canada",

    id:
      "17841452723605206",

    token:
      EXPL_CANADA_TOKEN,

    currency:
      "$",

    packages: {

      bronze: {
        name: "Bronze",
        price: 35,
        details:
          "2 Stories",
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


  /* =======================================================
     MENTALXHEAL
  ======================================================= */

  mentalxheal: {

    key: "mentalxheal",

    username: "@mentalxheal",

    id:
      "17841402953609202",

    token:
      MENTALXHEAL_TOKEN,

    currency:
      "$",

    packages: {

      bronze: {
        name: "Bronze",
        price: 39,
        details:
          "2 story",
        followers:
          "1K followers guaranteed"
      },

      silver: {
        name: "Silver",
        price: 66,
        details:
          "1 post and 3 story + 2 highlights",
        followers:
          "3K followers guaranteed"
      },

      gold: {
        name: "Gold",
        price: 99,
        details:
          "3 post and 4 story +3 highlights",
        followers:
          "5K followers guaranteed"
      },

      diamond: {
        name: "Diamond",
        price: 129,
        details:
          "5 post and 8 story + 7 highlights",
        followers:
          "8K followers guaranteed"
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
    const page
    of Object.values(PAGE_CONFIGS)
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
  new Set();

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

    clientUsername:
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

    customerMessageVersion:
      0,

    lastSeenAt:
      nowISO(),

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


  conversation.lastSeenAt =
    nowISO();

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

    console.error(
      "SUPABASE NOT CONFIGURED"
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

          method:
            "GET",

          headers:
            supabaseHeaders()

        }

      );


    const data =
      await response.json();


    if (
      !response.ok
    ) {

      console.error(
        "SUPABASE GET ERROR:",
        data
      );

      return null;

    }


    if (
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


    if (
      Array.isArray(stored)
    ) {

      const conversation =
        createConversation(
          senderId
        );


      conversation.history =
        stored
          .map(
            item => ({

              role:
                item?.role ===
                "assistant"
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

            })
          )
          .filter(
            item =>
              item.text
          );


      return conversation;

    }


    return null;

  }

  catch (
    error
  ) {

    console.error(
      "SUPABASE GET EXCEPTION:",
      error.message
    );

    return null;

  }

}


/* =========================================================
   SUPABASE SAVE
========================================================= */

async function supabaseSaveConversation(
  senderId,
  conversation
) {

  if (
    !supabaseConfigured()
  ) {

    console.error(
      "SUPABASE NOT CONFIGURED - MEMORY NOT SAVED"
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

  catch (
    error
  ) {

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


  /*
     ALWAYS LOAD SUPABASE FIRST.

     This keeps the conversation alive if the client
     replies hours later or after a server restart.
  */

  const saved =
    await supabaseGetConversation(
      senderId
    );


  const conversation =
    saved &&
    typeof saved === "object"

      ? saved

      : createConversation(
          senderId
        );


  conversation.senderId =
    key;


  conversation.history =
    Array.isArray(
      conversation.history
    )
      ? conversation.history
      : [];


  conversation.pageKey =
    conversation.pageKey ||
    null;


  conversation.clientUsername =
    conversation.clientUsername ||
    null;


  conversation.stage =
    conversation.stage ||
    "NEW";


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


/* =========================================================
   SAVE
========================================================= */

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
    senderId,
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
    /\bbronze\b/.test(t)
  ) return "bronze";


  if (
    /\bsilver\b/.test(t)
  ) return "silver";


  if (
    /\bgold\b/.test(t)
  ) return "gold";


  if (
    /\bdiamond\b/.test(t)
  ) return "diamond";


  if (
    /\bpackage\s*1\b/.test(t) ||
    /^1$/.test(t)
  ) return "bronze";


  if (
    /\bpackage\s*2\b/.test(t) ||
    /^2$/.test(t)
  ) return "silver";


  if (
    /\bpackage\s*3\b/.test(t) ||
    /^3$/.test(t)
  ) return "gold";


  if (
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
    /\bcredit card\b/.test(t) ||
    /\bdebit card\b/.test(t) ||
    /\bcredit\/debit\b/.test(t) ||
    /\bcard\b/.test(t)
  ) return "card";


  if (
    /\bach\b/.test(t) ||
    /\bwire\b/.test(t) ||
    /\bbank transfer\b/.test(t) ||
    /\bbank\b/.test(t)
  ) return "achWire";


  return null;

}


/* =========================================================
   PAYMENT METHOD AVAILABLE?
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
          normalize(
            available
          ) ===
          normalize(
            expected
          )
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
   REMINDER SYSTEM
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


/* =========================================================
   REMINDER DELAYS
========================================================= */

const REMINDER_DELAYS = {

  MESSAGE_ONE_SENT:
    0,

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
   IMPORTANT:
   Reminder is created immediately after an automated
   message is successfully sent.

   It does NOT wait for a READ / SEEN webhook.
========================================================= */

async function scheduleReminder(
  senderId,
  stage,
  outgoingMessageId,
  outgoingAt
) {

  if (
    !REMINDER_TEXTS[stage]
  ) {

    return;

  }


  const key =
    String(senderId);


  cancelReminder(
    key
  );


  const conversation =
    await getConversation(
      key
    );


  const delay =
    REMINDER_DELAYS[
      stage
    ];


  if (
    delay === undefined
  ) {

    return;

  }


  const messageId =
    outgoingMessageId
      ? String(outgoingMessageId)
      : null;


  /*
     The reminder is considered active immediately.

     We intentionally set seen=true because the reminder
     no longer depends on Meta's READ event.
  */

  conversation.reminder = {

    stage,

    messageId,

    sentAt:
      outgoingAt ||
      nowISO(),

    seen:
      true,

    dueAt:
      new Date(
        Date.now() + delay
      ).toISOString(),

    triggered:
      false,

    customerMessageVersion:
      Number(
        conversation.customerMessageVersion ||
        0
      )

  };


  await saveConversation(
    key,
    conversation
  );


  /*
     Start timer immediately.
  */

  const timer =
    setTimeout(
      () => {

        processReminder(
          key,
          stage,
          messageId,
          conversation.customerMessageVersion
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


  console.log(
    "========================================"
  );

  console.log(
    "REMINDER TIMER STARTED IMMEDIATELY"
  );

  console.log(
    "CUSTOMER:",
    conversation.clientUsername ||
    key
  );

  console.log(
    "STAGE:",
    stage
  );

  console.log(
    "MESSAGE ID:",
    messageId
  );

  console.log(
    "DELAY:",
    delay,
    "ms"
  );

  console.log(
    "DUE AT:",
    conversation.reminder.dueAt
  );

  console.log(
    "========================================"
  );

}


/* =========================================================
   READ EVENT COMPATIBILITY
========================================================= */

async function startReminderAfterRead(
  senderId,
  readWatermark
) {

  /*
     READ / SEEN webhook is no longer required.

     This function remains only so an existing READ event
     cannot break the webhook.

     If a timer is already active, do nothing.
  */

  const key =
    String(senderId);


  if (
    reminderTimers.has(key)
  ) {

    return;

  }


  const conversation =
    await getConversation(
      key
    );


  const reminder =
    conversation.reminder;


  if (
    !reminder ||
    reminder.triggered
  ) {

    return;

  }


  /*
     If an old reminder exists in Supabase but has no active
     timer, recreate it using the remaining time.
  */

  if (
    !reminder.dueAt
  ) {

    return;

  }


  const dueAt =
    new Date(
      reminder.dueAt
    ).getTime();


  if (
    !Number.isFinite(dueAt)
  ) {

    return;

  }


  const remaining =
    Math.max(
      1000,
      dueAt - Date.now()
    );


  const page =
    PAGE_CONFIGS[
      conversation.pageKey
    ];


  if (
    !page
  ) {

    return;

  }


  const timer =
    setTimeout(
      () => {

        processReminder(
          key,
          reminder.stage,
          reminder.messageId,
          reminder.customerMessageVersion
        ).catch(
          error =>
            console.error(
              "REMINDER RESTORE ERROR:",
              error
            )
        );

      },
      remaining
    );


  reminderTimers.set(
    key,
    timer
  );


  console.log(
    "REMINDER RESTORED FROM EXISTING STATE:",
    key,
    remaining
  );

}


/* =========================================================
   PROCESS REMINDER
========================================================= */

async function processReminder(
  senderId,
  expectedStage,
  expectedMessageId,
  expectedCustomerVersion
) {

  const key =
    String(senderId);


  reminderTimers.delete(
    key
  );


  const conversation =
    await getConversation(
      key
    );


  const reminder =
    conversation.reminder;


  /*
     Reminder no longer exists.
  */

  if (
    !reminder
  ) {

    return;

  }


  /*
     Already triggered.
  */

  if (
    reminder.triggered
  ) {

    return;

  }


  /*
     Make sure the reminder still belongs to the
     exact outgoing message/stage.
  */

  if (
    conversation.stage !==
    expectedStage
  ) {

    conversation.reminder =
      null;

    await saveConversation(
      key,
      conversation
    );

    return;

  }


  if (
    String(
      reminder.messageId ||
      ""
    ) !==
    String(
      expectedMessageId ||
      ""
    )
  ) {

    return;

  }


  /*
     If customer sent a newer message, this reminder
     is obsolete.
  */

  if (
    Number(
      conversation.customerMessageVersion ||
      0
    ) !==
    Number(
      expectedCustomerVersion ||
      0
    )
  ) {

    conversation.reminder =
      null;

    await saveConversation(
      key,
      conversation
    );

    return;

  }


  /*
     Never send a payment reminder after payment is
     confirmed.
  */

  if (
    conversation.paymentConfirmed
  ) {

    conversation.reminder =
      null;

    await saveConversation(
      key,
      conversation
    );

    return;

  }


  const text =
    REMINDER_TEXTS[
      expectedStage
    ];


  if (!text) {

    return;

  }


  const page =
    PAGE_CONFIGS[
      conversation.pageKey
    ];


  if (!page) {

    console.log(
      "REMINDER SKIPPED - PAGE UNKNOWN:",
      key
    );

    return;

  }


  /*
     Send reminder.
  */

  let data;


  try {

    data =
      await sendInstagramMessage(
        page,
        key,
        text
      );

  }

  catch (
    error
  ) {

    console.error(
      "REMINDER SEND FAILED:",
      page.username,
      key,
      error.message
    );

    /*
       Keep the reminder state so it can be inspected
       instead of pretending it was successfully sent.
    */

    conversation.reminder =
      null;

    await saveConversation(
      key,
      conversation
    );

    return;

  }


  const messageId =
    data?.message_id ||
    data?.id ||
    null;


  if (
    messageId
  ) {

    outgoingMessages.add(
      `${page.key}:${String(messageId)}`
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


  /*
     The reminder has fired.

     IMPORTANT:
     Do not schedule another reminder automatically
     from a reminder itself.
  */

  conversation.reminder =
    null;


  await saveConversation(
    key,
    conversation
  );


  console.log(
    "========================================"
  );

  console.log(
    "REMINDER SENT"
  );

  console.log(
    "PAGE:",
    page.username
  );

  console.log(
    "CUSTOMER:",
    conversation.clientUsername ||
    key
  );

  console.log(
    "STAGE:",
    expectedStage
  );

  console.log(
    "TEXT:",
    text
  );

  console.log(
    "========================================"
  );

}


/* =========================================================
   CLIENT USERNAME LOOKUP
========================================================= */

async function getInstagramUsername(
  page,
  instagramUserId
) {

  if (
    !page?.token ||
    !instagramUserId
  ) {

    return null;

  }


  try {

    const url =
      `https://graph.instagram.com/${INSTAGRAM_API_VERSION}` +
      `/${encodeURIComponent(instagramUserId)}` +
      `?fields=username`;


    const response =
      await fetch(
        url,
        {

          method:
            "GET",

          headers: {

            Authorization:
              `Bearer ${page.token}`

          }

        }
      );


    const data =
      await response.json();


    if (
      !response.ok
    ) {

      console.error(
        "INSTAGRAM USERNAME LOOKUP ERROR:",
        page.username,
        data
      );

      return null;

    }


    return (
      data?.username ||
      null
    );

  }

  catch (
    error
  ) {

    console.error(
      "USERNAME LOOKUP EXCEPTION:",
      error.message
    );

    return null;

  }

}


/* =========================================================
   RESTORE PENDING REMINDERS AFTER SERVER RESTART
========================================================= */

async function restorePendingReminders() {

  if (
    !supabaseConfigured()
  ) {

    return;

  }


  try {

    const response =
      await fetch(

        `${SUPABASE_URL.replace(/\/+$/, "")}` +
        `/rest/v1/${encodeURIComponent(SUPABASE_TABLE)}` +
        `?select=id,messages` +
        `&limit=500`,

        {

          method:
            "GET",

          headers:
            supabaseHeaders()

        }

      );


    const rows =
      await response.json();


    if (
      !response.ok ||
      !Array.isArray(rows)
    ) {

      console.error(
        "REMINDER RESTORE ERROR:",
        rows
      );

      return;

    }


    for (
      const row
      of rows
    ) {

      const senderId =
        String(
          row?.id ||
          ""
        ).trim();


      const conversation =
        row?.messages;


      if (
        !senderId ||
        !conversation ||
        typeof conversation !==
        "object"
      ) {

        continue;

      }


      conversations.set(
        senderId,
        conversation
      );


      const reminder =
        conversation.reminder;


      if (
        !reminder ||
        !reminder.seen ||
        reminder.triggered ||
        !reminder.messageId ||
        !reminder.dueAt
      ) {

        continue;

      }


      const page =
        PAGE_CONFIGS[
          conversation.pageKey
        ];


      if (
        !page
      ) {

        continue;

      }


      const dueAt =
        new Date(
          reminder.dueAt
        ).getTime();


      if (
        !Number.isFinite(dueAt)
      ) {

        continue;

      }


      const remaining =
        Math.max(
          1000,
          dueAt -
          Date.now()
        );


      const existingTimer =
        reminderTimers.get(
          senderId
        );


      if (
        existingTimer
      ) {

        clearTimeout(
          existingTimer
        );

      }


      const timer =
        setTimeout(
          () => {

            processReminder(
              senderId,
              reminder.stage,
              reminder.messageId,
              reminder.customerMessageVersion
            ).catch(
              error =>
                console.error(
                  "RESTORED REMINDER ERROR:",
                  error
                )
            );

          },
          remaining
        );


      reminderTimers.set(
        senderId,
        timer
      );


      console.log(
        "REMINDER RESTORED:",
        page.username,
        conversation.clientUsername ||
        senderId,
        "DUE:",
        reminder.dueAt
      );

    }

  }

  catch (
    error
  ) {

    console.error(
      "REMINDER RESTORE EXCEPTION:",
      error.message
    );

  }

}


/* =========================================================
   AI RESPONSE EXTRACTION
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


  let text =
    "";


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
      .slice(-35)
      .map(
        message =>
          `${message.role}: ${message.text}`
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
`You are the customer-support and sales AI for Global Promote.

CURRENT PAGE:
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

IMPORTANT:

This is an existing customer conversation.

Remember the conversation history.

NEVER restart the conversation.

NEVER send the first opening message again.

NEVER send the second fixed message again.

NEVER randomly send the package list.

NEVER use another page's prices.

NEVER invent payment information.

Only use payment methods available for the current page.

If the customer asks how followers are guaranteed, explain that their content is promoted on our pages and promotion continues until the guaranteed followers are reached, according to the business guarantee policy.

If the customer asks whether followers are real or organic, explain naturally that the followers are real and organic because they are achieved through promoting the customer's content on different pages until the guaranteed amount is reached.

If the customer asks another reasonable business question, answer helpfully and naturally.

Keep replies short, friendly and professional.

Do not claim that payment has been verified unless the customer has confirmed that the payment is completed.

Do not say that a screenshot proves payment was received.

EXISTING CONVERSATION:

${history}

LATEST CUSTOMER MESSAGE:

${clientMessage || "[media]"}

ATTACHMENT:

${attachmentInfo || "none"}

Return ONLY the customer-facing answer.`;


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

  catch (
    error
  ) {

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
   SAFE FIXED / AI REPLY
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


  /*
     If the owner manually replied while AI was waiting,
     cancel this automatic response.
  */

  if (
    (
      manualReplyVersion.get(
        String(senderId)
      ) || 0
    ) !== version
  ) {

    console.log(
      "AI REPLY CANCELLED - MANUAL REPLY DETECTED"
    );

    return null;

  }


  /*
     Reload the conversation before sending.

     If the customer has already sent another message while
     the AI was waiting, the old automatic reply is cancelled.
  */

  const latest =
    await getConversation(
      senderId
    );


  if (
    latest.customerMessageVersion !==
    conversation.customerMessageVersion
  ) {

    console.log(
      "AI REPLY CANCELLED - NEW CUSTOMER MESSAGE"
    );

    return null;

  }


  /*
     Make sure the conversation has not moved to another
     stage while the AI was waiting.
  */

  if (
    latest !== conversation &&
    latest.lastSeenAt !==
    conversation.lastSeenAt
  ) {

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

    outgoingMessages.add(
      `${page.key}:${String(messageId)}`
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


  await saveConversation(
    senderId,
    conversation
  );


  /*
     IMPORTANT:

     Reminder starts immediately after the automated
     message is successfully sent.

     It DOES NOT wait for a READ event.
  */

  if (
    reminderStage &&
    messageId
  ) {

    await scheduleReminder(
      senderId,
      reminderStage,
      messageId,
      conversation.lastOutgoingAt
    );

  }


  return data;

}


/* =========================================================
   ADMIN REPLY
========================================================= */

async function sendAdminReply(
  page,
  senderId,
  text
) {

  const key =
    String(senderId);


  const conversation =
    await getConversation(
      key
    );


  /*
     Manual reply must cancel any reminder that is waiting.
  */

  cancelReminder(
    key
  );


  /*
     Cancel an AI response that may currently be waiting
     during its 6–9 second delay.
  */

  manualReplyVersion.set(
    key,
    (
      manualReplyVersion.get(
        key
      ) || 0
    ) + 1
  );


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

    outgoingMessages.add(
      `${page.key}:${String(messageId)}`
    );

  }


  saveMessage(
    conversation,
    "assistant",
    text
  );


  conversation.pageKey =
    page.key;


  conversation.lastOutgoingMessageId =
    messageId
      ? String(messageId)
      : null;


  conversation.lastOutgoingText =
    text;


  conversation.lastOutgoingStage =
    conversation.stage;


  conversation.lastOutgoingAt =
    nowISO();


  /*
     Manual messages do not automatically create reminders.
  */

  conversation.reminder =
    null;


  await saveConversation(
    key,
    conversation
  );


  return {

    messageId,

    page:
      page.key,

    username:
      conversation.clientUsername ||
      null

  };

}


/* =========================================================
   CLIENT MESSAGE PROCESSOR
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


  /*
     Every genuine customer message invalidates the
     reminder belonging to the previous outgoing message.
  */

  cancelReminder(
    key
  );


  /*
     Increment customer-message version.

     This prevents an old reminder or delayed AI reply from
     being sent after the customer has replied.
  */

  conversation.customerMessageVersion =
    Number(
      conversation.customerMessageVersion ||
      0
    ) + 1;


  conversation.pageKey =
    page.key;


  /*
     Resolve Instagram username once.

     The webhook normally gives us the Instagram-scoped
     user ID, not a username.
  */

  if (
    !conversation.clientUsername
  ) {

    const username =
      await getInstagramUsername(
        page,
        key
      );


    if (
      username
    ) {

      conversation.clientUsername =
        `@${String(username).replace(/^@/, "")}`;


      console.log(
        "CLIENT USERNAME FOUND:",
        page.username,
        conversation.clientUsername
      );

    }

  }


  /*
     Store customer's message BEFORE AI processing.
  */

  const combinedCustomerMessage =
    clientMessage ||
    (
      attachmentInfo
        ? `[${attachmentInfo}]`
        : ""
    );


  if (
    combinedCustomerMessage
  ) {

    saveMessage(
      conversation,
      "client",
      combinedCustomerMessage
    );

  }


  await saveConversation(
    key,
    conversation
  );


  /*
     Package selection.
  */

  const packageKey =
    detectPackage(
      clientMessage
    );


  if (
    packageKey
  ) {

    conversation.selectedPackage =
      packageKey;


    conversation.stage =
      "PACKAGE_SELECTED";


    conversation.paymentMethod =
      null;


    conversation.paymentDetailsSent =
      false;


    conversation.paymentConfirmed =
      false;


    conversation.paymentProofReceived =
      false;


    conversation.awaitingPaymentConfirmation =
      false;


    await saveConversation(
      key,
      conversation
    );


    const confirmation =
      buildPackageConfirmation(
        page,
        packageKey
      );


    if (
      confirmation
    ) {

      const version =
        manualReplyVersion.get(
          key
        ) || 0;


      await sendReplySafely(
        page,
        key,
        conversation,
        confirmation,
        version,
        "PACKAGE_SELECTED"
      );

      return;

    }

  }


  /*
     Payment method selection.
  */

  const paymentMethod =
    detectPaymentMethod(
      clientMessage
    );


  if (
    paymentMethod &&
    conversation.selectedPackage
  ) {

    if (
      paymentMethodAvailable(
        page,
        paymentMethod
      )
    ) {

      conversation.paymentMethod =
        paymentMethod;


      conversation.paymentDetailsSent =
        true;


      conversation.stage =
        "PAYMENT_PENDING";


      conversation.awaitingPaymentConfirmation =
        true;


      await saveConversation(
        key,
        conversation
      );


      const paymentMessage =
        buildPaymentMessage(
          page,
          conversation.selectedPackage,
          paymentMethod
        );


      if (
        paymentMessage
      ) {

        const version =
          manualReplyVersion.get(
            key
          ) || 0;


        await sendReplySafely(
          page,
          key,
          conversation,
          paymentMessage,
          version,
          "PAYMENT_PENDING"
        );


        return;

      }

    }

  }


  /*
     Payment confirmation detection.

     If the customer says that payment has been made,
     do NOT automatically consider it verified.

     First ask for confirmation / screenshot.
  */

  const normalized =
    normalize(
      clientMessage
    );


  const saysPaid =
    /\b(paid|payment\s*done|payment\s*completed|sent\s*payment|i\s*paid|done\s*payment)\b/
      .test(
        normalized
      );


  const hasScreenshot =
    Boolean(
      attachmentInfo &&
      /image|photo|media/i.test(
        attachmentInfo
      )
    );


  if (
    saysPaid ||
    hasScreenshot
  ) {

    conversation.paymentProofReceived =
      true;


    conversation.awaitingPaymentConfirmation =
      true;


    await saveConversation(
      key,
      conversation
    );


    const confirmationQuestion =
      `Thank you dear ❤️ Did the payment get completed successfully? Please confirm yes so I can proceed with your promotion.`;


    const version =
      manualReplyVersion.get(
        key
      ) || 0;


    await sendReplySafely(
      page,
      key,
      conversation,
      confirmationQuestion,
      version
    );


    return;

  }


  /*
     Customer confirms that payment is completed.

     Only now do we mark it as confirmed.
  */

  const confirmsPayment =
    /\b(yes|yeah|yep|yup|done|completed|successfully|it'?s done|payment is done|payment done)\b/
      .test(
        normalized
      );


  if (
    confirmsPayment &&
    (
      conversation.paymentProofReceived ||
      conversation.awaitingPaymentConfirmation
    )
  ) {

    conversation.paymentConfirmed =
      true;


    conversation.awaitingPaymentConfirmation =
      false;


    conversation.stage =
      "PAYMENT_CONFIRMED";


    conversation.reminder =
      null;


    cancelReminder(
      key
    );


    await saveConversation(
      key,
      conversation
    );


    const nextMessage =
      `Okay dear ❤️ Please send me the pictures that you want to promote and your username. I will upload it within 24 hours after verifying your payment. ❤️`;


    const version =
      manualReplyVersion.get(
        key
      ) || 0;


    await sendReplySafely(
      page,
      key,
      conversation,
      nextMessage,
      version
    );


    return;

  }


  /*
     NEW CUSTOMER
  */

  if (
    conversation.stage ===
    "NEW"
  ) {

    conversation.stage =
      "MESSAGE_ONE_SENT";


    await saveConversation(
      key,
      conversation
    );


    const version =
      manualReplyVersion.get(
        key
      ) || 0;


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


  /*
     If first message was already sent and the customer
     replied positively, send the second fixed message.
  */

  if (
    conversation.stage ===
    "MESSAGE_ONE_SENT"
  ) {

    conversation.stage =
      "MESSAGE_TWO_SENT";


    await saveConversation(
      key,
      conversation
    );


    const version =
      manualReplyVersion.get(
        key
      ) || 0;


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


  /*
     If second message was already sent and customer asks
     for packages, send package list.
  */

  const asksPackages =
    /\b(package|packages|price|prices|price list|pricing|how much|cost)\b/
      .test(
        normalized
      );


  if (
    conversation.stage ===
    "MESSAGE_TWO_SENT" &&
    asksPackages
  ) {

    conversation.stage =
      "PACKAGES_SHOWN";


    await saveConversation(
      key,
      conversation
    );


    const packagesMessage =
      buildPackagesMessage(
        page
      );


    const version =
      manualReplyVersion.get(
        key
      ) || 0;


    await sendReplySafely(
      page,
      key,
      conversation,
      packagesMessage,
      version,
      "PACKAGES_SHOWN"
    );


    return;

  }


  /*
     If customer has already seen packages and asks another
     normal question, use AI instead of restarting the sale.
  */

  const aiReply =
    await getAIReply(
      page,
      conversation,
      clientMessage,
      attachmentInfo
    );


  if (
    aiReply
  ) {

    const version =
      manualReplyVersion.get(
        key
      ) || 0;


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
     Fallback.
  */

  const fallback =
    `Sure dear ❤️ Please let me know what you would like to know about our promotion.`;


  const version =
    manualReplyVersion.get(
      key
    ) || 0;


  await sendReplySafely(
    page,
    key,
    conversation,
    fallback,
    version
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
   INSTAGRAM WEBHOOK
========================================================= */

app.post(
  "/webhook",
  async (req, res) => {

    /*
       Meta must receive 200 immediately.
    */

    res.sendStatus(200);


    const body =
      req.body;


    console.log(
      "========================================"
    );


    console.log(
      "INSTAGRAM WEBHOOK RECEIVED"
    );


    console.log(
      JSON.stringify(
        body,
        null,
        2
      )
    );


    console.log(
      "========================================"
    );


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

      /*
         The Instagram account that received the event.
      */

      const page =
        getPageById(
          entry?.id
        );


      if (!page) {

        console.log(
          "UNKNOWN INSTAGRAM PAGE:",
          entry?.id
        );


        continue;

      }


      console.log(
        "PAGE:",
        page.username
      );


      for (
        const event of
        entry.messaging || []
      ) {

        /* =================================================
           READ / SEEN EVENT
        ================================================= */

        if (
          event.read
        ) {

          console.log(
            "READ / SEEN EVENT RECEIVED - NO REMINDER ACTION REQUIRED"
          );


          /*
             Reminders now start immediately after the
             automated message is successfully sent.

             READ events are therefore ignored.
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


        console.log(
          "---------- MESSAGE EVENT ----------"
        );


        console.log(
          "PAGE:",
          page.username
        );


        console.log(
          "SENDER:",
          senderId
        );


        console.log(
          "RECIPIENT:",
          recipientId
        );


        console.log(
          "MESSAGE:",
          event.message?.text ||
          "[NO TEXT]"
        );


        console.log(
          "MESSAGE ID:",
          messageId
        );


        console.log(
          "IS ECHO:",
          isEcho
        );


        /* =================================================
           OUR OWN MESSAGE / MANUAL MESSAGE
        ================================================= */

        if (
          isEcho ||
          String(senderId) ===
          String(page.id)
        ) {

          const outgoingKey =
            `${page.key}:${String(messageId)}`;


          /*
             This is an AI message that our server sent.
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
              "OUR AI ECHO IGNORED"
            );


            continue;

          }


          /*
             Otherwise treat it as a manual message from
             the owner/admin.
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


              conversation.pageKey =
                page.key;


              conversation.lastOutgoingText =
                ownText;


              conversation.lastOutgoingStage =
                conversation.stage;


              conversation.lastOutgoingMessageId =
                String(messageId);


              conversation.lastOutgoingAt =
                nowISO();


              conversation.reminder =
                null;


              await saveConversation(
                customerId,
                conversation
              );

            }


            console.log(
              "MANUAL MESSAGE SYNCHRONIZED"
            );

          }


          continue;

        }


   /* =========================================================
   DUPLICATE PROTECTION
========================================================= */

const duplicateKey =
  `${page.key}:${String(messageId)}`;


if (
  processedMessageIds.has(
    duplicateKey
  )
) {

  console.log(
    "DUPLICATE MESSAGE IGNORED:",
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


/* =========================================================
   CUSTOMER MESSAGE
========================================================= */

const clientMessage =
  event.message?.text ||
  "";


const attachmentInfo =
  (event.message?.attachments || [])
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

  console.log(
    "EMPTY MESSAGE IGNORED"
  );

  continue;

}


/* =========================================================
   CLIENT QUEUE
========================================================= */

queueForClient(
  senderId,
  async () => {

    try {

      const conversation =
        await getConversation(
          senderId
        );


      /*
         Save the page immediately.

         This is important because the same client
         can interact with different pages.
      */

      conversation.pageKey =
        page.key;


      /*
         Save Instagram username if Meta
         has supplied it in the event.
      */

      const incomingUsername =
        event.sender?.username ||
        event.sender?.name ||
        event.message?.sender?.username ||
        null;


      if (
        incomingUsername
      ) {

        conversation.clientUsername =
          String(
            incomingUsername
          )
            .replace(/^@/, "")
            .trim();

      }


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

    catch (
      error
    ) {

      console.error(
        "CUSTOMER PROCESSING ERROR:",
        error
      );

    }

  }
);
         
 }
}

)
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

        success:
          false,

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

        success:
          true,

        found:
          false,

        senderId,

        message:
          "No Supabase conversation found."

      });

    }


    return res.json({

      success:
        true,

      found:
        true,

      senderId,

      pageKey:
        conversation.pageKey ||
        null,

      clientUsername:
        conversation.clientUsername ||
        null,

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
        reminderTimers.size,

      system:
        "Global Promote 4-Page AI"

    });

  }
);


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
   ADMIN REPLY API
========================================================= */

app.post(
  "/admin/reply",
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
        req.body?.sender_id ||
        ""
      ).trim();


    const username =
      String(
        req.body?.username ||
        ""
      )
        .trim()
        .replace(/^@/, "")
        .toLowerCase();


    const requestedPage =
      String(
        req.body?.page ||
        ""
      )
        .trim()
        .toLowerCase();


    const message =
      String(
        req.body?.text ||
        ""
      ).trim();


    if (
      !message
    ) {

      return res.status(400).json({

        success:
          false,

        error:
          "text is required"

      });

    }


    let customerId =
      senderId ||
      null;


    let conversation =
      null;


    /*
       Sender ID is the safest identifier.
    */

    if (
      customerId
    ) {

      conversation =
        await getConversation(
          customerId
        );

    }


    /*
       Username fallback.

       This allows the admin to find a client by username
       when sender_id is not supplied.
    */

    if (
      !conversation &&
      username
    ) {

      for (
        const [
          id,
          item
        ]
        of conversations.entries()
      ) {

        const savedUsername =
          String(
            item?.clientUsername ||
            ""
          )
            .replace(/^@/, "")
            .toLowerCase();


        const samePage =
          !requestedPage ||
          item?.pageKey ===
            requestedPage;


        if (
          savedUsername ===
            username &&
          samePage
        ) {

          customerId =
            String(id);


          conversation =
            item;


          break;

        }

      }

    }


    if (
      !conversation ||
      !customerId
    ) {

      return res.status(404).json({

        success:
          false,

        error:
          "Client not found. Select the client from the Admin list so its sender_id is used."

      });

    }


    const pageKey =
      requestedPage ||
      conversation.pageKey;


    const page =
      PAGE_CONFIGS[
        pageKey
      ];


    if (
      !page
    ) {

      return res.status(400).json({

        success:
          false,

        error:
          "Client page is missing or invalid."

      });

    }


    try {

      const result =
        await sendAdminReply(
          page,
          customerId,
          message
        );


      return res.json({

        success:
          true,

        page:
          result.page,

        pageUsername:
          page.username,

        senderId:
          customerId,

        username:
          result.username,

        messageId:
          result.messageId

      });

    }

    catch (
      error
    ) {

      console.error(
        "ADMIN REPLY ERROR:",
        error
      );


      return res.status(500).json({

        success:
          false,

        error:
          error.message

      });

    }

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


    const clients =
      [];


    for (
      const [
        senderId,
        conversation
      ]
      of conversations.entries()
    ) {

      clients.push({

        senderId,

        username:
          conversation.clientUsername ||
          null,

        page:
          conversation.pageKey ||
          null,

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
          Array.isArray(
            conversation.history
          )
            ? conversation.history.length
            : 0,

        lastOutgoingText:
          conversation.lastOutgoingText,

        lastOutgoingAt:
          conversation.lastOutgoingAt

      });

    }


    res.json({

      success:
        true,

      aiAlwaysOn:
        true,

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

      memory:
        supabaseConfigured(),

      activeReminders:
        reminderTimers.size,

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

<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
>

<title>
Global Promote Admin
</title>

<style>

body{

  font-family:Arial;

  background:#f5f5f5;

  padding:20px;

}

.card{

  max-width:900px;

  margin:auto;

  background:white;

  padding:20px;

  border-radius:15px;

  margin-bottom:15px;

}

input,
textarea,
select,
button{

  width:100%;

  box-sizing:border-box;

  padding:12px;

  margin-top:10px;

  border-radius:8px;

}

textarea{

  min-height:100px;

}

button{

  cursor:pointer;

}

pre{

  white-space:pre-wrap;

  word-break:break-word;

}

.client{

  border:1px solid #ddd;

  padding:12px;

  margin-top:10px;

  border-radius:10px;

}

.username{

  font-size:17px;

  font-weight:bold;

}

.meta{

  color:#666;

  font-size:13px;

  margin-top:5px;

}

.tabs{

  display:grid;

  grid-template-columns:repeat(5,1fr);

  gap:5px;

}

@media(max-width:650px){

  .tabs{

    grid-template-columns:1fr 1fr;

  }

}

</style>

</head>


<body>

<div class="card">

<h2>
🤖 Global Promote Admin
</h2>

<p>
4 PAGE AI SYSTEM
</p>

<p>
Europe • Miami • Canada • Mentalxheal
</p>

<input
  id="secret"
  type="password"
  placeholder="ADMIN_SECRET"
>

<button
  onclick="loadStatus()"
>
🔄 Load Clients
</button>

</div>


<div class="card">

<h3>
Clients
</h3>

<div class="tabs">

<button
  onclick="setPage('all')"
>
ALL
</button>

<button
  onclick="setPage('europe')"
>
EUROPE
</button>

<button
  onclick="setPage('miami')"
>
MIAMI
</button>

<button
  onclick="setPage('canada')"
>
CANADA
</button>

<button
  onclick="setPage('mentalxheal')"
>
MENTALXHEAL
</button>

</div>


<div id="clients">

Load clients first.

</div>

</div>


<div class="card">

<h3>
✉️ Admin Reply
</h3>


<input
  id="replyUsername"
  placeholder="@username"
>


<select
  id="replyPage"
>

<option value="europe">
@expl.europe
</option>

<option value="miami">
@expl.miami
</option>

<option value="canada">
@expl.canada
</option>

<option value="mentalxheal">
@mentalxheal
</option>

</select>


<input
  id="replySenderId"
  placeholder="Instagram client ID"
>


<textarea
  id="replyText"
  placeholder="Write your reply..."
></textarea>


<button
  onclick="sendReply()"
>
📤 Send Reply
</button>


<div id="replyResult">
</div>

</div>


<div class="card">

<h3>
System Status
</h3>

<pre id="out"></pre>

</div>


<script>

let allClients = [];

let currentPage = "all";


function getSecret(){

  return document
    .getElementById("secret")
    .value;

}


function setPage(page){

  currentPage =
    page;

  renderClients();

}


async function loadStatus(){

  const response =
    await fetch(
      "/admin/status",
      {

        headers: {

          "x-admin-secret":
            getSecret()

        }

      }
    );


  const data =
    await response.json();


  if (
    !response.ok
  ){

    document
      .getElementById("out")
      .textContent =
        JSON.stringify(
          data,
          null,
          2
        );

    return;

  }


  allClients =
    Array.isArray(
      data.clients
    )
      ? data.clients
      : [];


  document
    .getElementById("out")
    .textContent =
      JSON.stringify(
        {

          success:
            data.success,

          memory:
            data.memory,

          activeReminders:
            data.activeReminders,

          clients:
            allClients.length

        },
        null,
        2
      );


  renderClients();

}


function renderClients(){

  const box =
    document
      .getElementById("clients");


  const filtered =
    allClients.filter(
      client =>
        currentPage ===
          "all" ||
        client.page ===
          currentPage
    );


  if (
    !filtered.length
  ){

    box.innerHTML =
      "<p>No clients found.</p>";

    return;

  }


  box.innerHTML =
    filtered
      .map(
        (client, index) => {

          const username =
            client.username ||
            "Username not available";


          const reminder =
            client.reminder

              ? (
                  client.reminder.seen
                    ? "Reminder active"
                    : "Reminder pending"
                )

              : "No reminder";


          return (
  '<div class="client">' +

  '<div class="username">' +
  escapeHtml(username) +
  '</div>' +

  '<div class="meta">' +
  'Page: ' +
  escapeHtml(client.page || "") +
  '</div>' +

  '<div class="meta">' +
  'Stage: ' +
  escapeHtml(client.stage || "") +
  '</div>' +

  '<div class="meta">' +
  'Package: ' +
  escapeHtml(
    client.selectedPackage || "none"
  ) +
  '</div>' +

  '<div class="meta">' +
  'Payment: ' +
  escapeHtml(
    client.paymentMethod || "none"
  ) +
  '</div>' +

  '<div class="meta">' +
  escapeHtml(reminder) +
  '</div>' +

  '<div class="meta">' +
  'ID: ' +
  escapeHtml(
    client.senderId || ""
  ) +
  '</div>' +

  '<button ' +
  'onclick="selectClient(' +
  index +
  ')">' +
  'Reply' +
  '</button>' +

  '</div>'
);

      }
    )
    .join("");

}

function selectClient(index){

  const filtered =
    allClients.filter(
      client =>
        currentPage ===
          "all" ||
        client.page ===
          currentPage
    );


  const client =
    filtered[index];


  if (
    !client
  ){

    return;

  }


  document
    .getElementById(
      "replyUsername"
    )
    .value =
      client.username ||
      "";


  document
    .getElementById(
      "replyPage"
    )
    .value =
      client.page ||
      "europe";


  document
    .getElementById(
      "replySenderId"
    )
    .value =
      client.senderId ||
      "";


  document
    .getElementById(
      "replyText"
    )
    .focus();

}


async function sendReply(){

  const username =
    document
      .getElementById(
        "replyUsername"
      )
      .value
      .trim();


  const page =
    document
      .getElementById(
        "replyPage"
      )
      .value;


  const senderId =
    document
      .getElementById(
        "replySenderId"
      )
      .value
      .trim();


  const text =
    document
      .getElementById(
        "replyText"
      )
      .value
      .trim();


  const result =
    document
      .getElementById(
        "replyResult"
      );


  if (
    !text
  ){

    result.textContent =
      "Please write a message.";

    return;

  }


  result.textContent =
    "Sending...";


  try{

    const response =
      await fetch(
        "/admin/reply",
        {

          method:
            "POST",

          headers: {

            "Content-Type":
              "application/json",

            "x-admin-secret":
              getSecret()

          },

          body:
            JSON.stringify({

              username,

              page,

              sender_id:
                senderId,

              text

            })

        }
      );


    const data =
      await response.json();


    result.textContent =
      JSON.stringify(
        data,
        null,
        2
      );


    if (
      response.ok &&
      data.success
    ){

      document
        .getElementById(
          "replyText"
        )
        .value =
          "";


      await loadStatus();

    }

  }

  catch(error){

    result.textContent =
      error.message;

  }

}


function escapeHtml(
  value
){

  return String(
    value ?? ""
  )
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );

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
      "READ EVENTS: IGNORED FOR REMINDERS"
    );


    console.log(
      "REMINDERS: START IMMEDIATELY AFTER AUTOMATED SEND"
    );


    console.log(
      "SUPABASE MEMORY: ENABLED"
    );


    console.log(
      "MANUAL REPLY: ENABLED"
    );


    console.log(
      "CLIENT USERNAME LOOKUP: ENABLED"
    );


    console.log(
      "PAYMENT VERIFICATION: ENABLED"
    );


    console.log(
      "4 PAGE PACKAGE SYSTEM: ENABLED"
    );


    console.log(
      "========================================"
    );


    /*
       Restore any reminders that were already scheduled
       before a Render/server restart.
    */

    restorePendingReminders()
      .catch(
        error =>
          console.error(
            "STARTUP REMINDER RESTORE ERROR:",
            error
          )
      );

  }
);
