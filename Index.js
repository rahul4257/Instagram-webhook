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

     This is the important fix for the old problem where
     a client replied hours later and the bot treated it
     as a completely new conversation.
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

}


/* =========================================================
   SCHEDULE REMINDER
========================================================= */

async function scheduleReminder(
  senderId,
  stage,
  outgoingMessageId,
  outgoingAt
) {

  /*
     Never schedule a reminder for an unsupported stage.
  */

  if (
    !REMINDER_TEXTS[stage]
  ) {

    return;

  }


  const key =
    String(senderId);


  cancelReminder(
    senderId
  );


  const conversation =
    await getConversation(
      senderId
    );


  /*
     The reminder is only valid for the exact message/stage
     that was sent.
  */

  conversation.reminder = {

    stage,

    messageId:
      outgoingMessageId
        ? String(outgoingMessageId)
        : null,

    sentAt:
      outgoingAt ||
      nowISO(),

    seen:
      false,

    dueAt:
      null,

    triggered:
      false

  };


  await saveConversation(
    senderId,
    conversation
  );


  /*
     IMPORTANT:

     We DO NOT start the reminder timer here.

     It starts only when Meta sends a READ event proving
     the client has seen the message.
  */

}


/* =========================================================
   START REMINDER AFTER READ
========================================================= */

async function startReminderAfterRead(
  senderId,
  readWatermark
) {

  const key =
    String(senderId);


  const conversation =
    await getConversation(
      senderId
    );


  const reminder =
    conversation.reminder;


  if (
    !reminder
  ) {

    return;

  }


  if (
    reminder.triggered
  ) {

    return;

  }


  /*
     Only start if this exact reminder hasn't already
     been marked as seen.
  */

  if (
    reminder.seen
  ) {

    return;

  }


  /*
     Meta's read watermark is milliseconds.
     Convert safely.
  */

  const watermark =
    Number(
      readWatermark
    );


  if (
    !Number.isFinite(watermark)
  ) {

    return;

  }


  const sentTime =
    new Date(
      reminder.sentAt
    ).getTime();


  /*
     The read event must be after the message was sent.
  */

  if (
    !Number.isFinite(sentTime) ||
    watermark < sentTime
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


  const dueAt =
    Date.now() + delay;


  reminder.dueAt =
    new Date(
      dueAt
    ).toISOString();


  await saveConversation(
    senderId,
    conversation
  );


  const timer =
    setTimeout(
      () => {

        processReminder(
          senderId,
          reminder.stage,
          reminder.messageId
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
    "REMINDER STARTED:",
    senderId,
    reminder.stage,
    delay
  );

}


/* =========================================================
   PROCESS REMINDER
========================================================= */

async function processReminder(
  senderId,
  expectedStage,
  expectedMessageId
) {

  const key =
    String(senderId);


  reminderTimers.delete(
    key
  );


  const conversation =
    await getConversation(
      senderId
    );


  const reminder =
    conversation.reminder;


  /*
     Customer may have replied while the timer was running.
  */

  if (
    !reminder ||
    reminder.triggered ||
    !reminder.seen
  ) {

    return;

  }


  /*
     If conversation moved to another stage,
     the old reminder is invalid.
  */

  if (
    conversation.stage !==
    expectedStage
  ) {

    return;

  }


  if (
    String(
      reminder.messageId || ""
    ) !==
    String(
      expectedMessageId || ""
    )
  ) {

    return;

  }


  /*
     Don't send the payment reminder if payment has already
     been confirmed.
  */

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


  /*
     We need the page associated with this conversation.
     For reminders, the last known page is stored.
  */

  const pageKey =
    conversation.pageKey;


  const page =
    PAGE_CONFIGS[
      pageKey
    ];


  /*
     Existing old conversations may not have pageKey.
     In that case we cannot safely send a multi-page reminder.
  */

  if (!page) {

    console.log(
      "REMINDER SKIPPED - PAGE UNKNOWN:",
      senderId
    );

    return;

  }


  const currentVersion =
    manualReplyVersion.get(
      key
    ) || 0;


  /*
     Send reminder through the same safe sender.
  */

  const data =
    await sendInstagramMessage(
      page,
      senderId,
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


  reminder.triggered =
    true;


  /*
     Remove the reminder after it has fired.
  */

  conversation.reminder =
    null;


  await saveConversation(
    senderId,
    conversation
  );


  console.log(
    "REMINDER SENT:",
    page.username,
    senderId,
    text
  );

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
     Customer may have replied during our delay.
     Do not send an old response.
  */

  const latest =
    await getConversation(
      senderId
    );


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
     Schedule a READ-triggered reminder for fixed messages.
  */

  if (
    reminderStage
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
   PAYMENT CONFIRMATION DETECTION
========================================================= */

function isPaymentClaim(
  text
) {

  const t =
    normalize(text);


  return (
    /\bpaid\b/.test(t) ||
    /\bi paid\b/.test(t) ||
    /\bpayment sent\b/.test(t) ||
    /\bpayment done\b/.test(t) ||
    /\bpayment completed\b/.test(t) ||
    /\bpayment complete\b/.test(t) ||
    /\btransfer sent\b/.test(t) ||
    /\bsent the payment\b/.test(t) ||
    /\bjust paid\b/.test(t)
  );

}


/* =========================================================
   PAYMENT YES
========================================================= */

function isPaymentConfirmedByClient(
  text
) {

  const t =
    normalize(text);


  return (
    /^(yes|yeah|yep|yup|done|completed|complete|it is|its done|payment done|payment completed)$/
      .test(t)
  ) ||

  (
    /\byes\b/.test(t) &&
    (
      /\bpaid\b/.test(t) ||
      /\bpayment\b/.test(t) ||
      /\bcompleted\b/.test(t) ||
      /\bdone\b/.test(t)
    )
  );

}


/* =========================================================
   PAYMENT NOT COMPLETE
========================================================= */

function isPaymentPending(
  text
) {

  const t =
    normalize(text);


  return (
    /\bpending\b/.test(t) ||
    /\bnot yet\b/.test(t) ||
    /\bnot done\b/.test(t) ||
    /\bnot completed\b/.test(t) ||
    /\bfailed\b/.test(t) ||
    /\bcan't\b/.test(t) ||
    /\bcannot\b/.test(t)
  );

}


/* =========================================================
   PAYMENT VERIFICATION QUESTION
========================================================= */

const PAYMENT_VERIFICATION_MESSAGE =
`Does the payment show as completed on your side? ❤️`;


/* =========================================================
   AFTER PAYMENT CONFIRMED
========================================================= */

const AFTER_PAYMENT_CONFIRMED_MESSAGE =
`Okay dear ❤️ please send me pictures that you wanna promote and your username, I will upload it within 24 hours after verifying your payment.`;


/* =========================================================
   PAYMENT PENDING RESPONSE
========================================================= */

const PAYMENT_PENDING_RESPONSE =
`No problem dear ❤️ Please let me know once the payment is completed and I'll help you with the next step.`;


/* =========================================================
   PAYMENT PROOF DETECTION
========================================================= */

function looksLikePaymentProof(
  attachmentInfo
) {

  if (
    !attachmentInfo
  ) {

    return false;

  }


  const t =
    normalize(
      attachmentInfo
    );


  return (
    t.includes("image") ||
    t.includes("photo") ||
    t.includes("file")
  );

}


/* =========================================================
   MAIN CUSTOMER PROCESSOR
========================================================= */

async function processClientMessage(
  page,
  senderId,
  clientMessage,
  attachmentInfo
) {

  const conversation =
    await getConversation(
      senderId
    );


  const key =
    String(senderId);


  const version =
    manualReplyVersion.get(
      key
    ) || 0;


  const text =
    String(
      clientMessage || ""
    ).trim();


  const media =
    Boolean(
      attachmentInfo &&
      attachmentInfo.trim()
    );


  console.log(
    "========================================"
  );


  console.log(
    "PAGE:",
    page.username
  );


  console.log(
    "CLIENT:",
    senderId
  );


  console.log(
    "STAGE:",
    conversation.stage
  );


  console.log(
    "TEXT:",
    text
  );


  /*
     Any genuine customer message cancels a pending reminder.

     This prevents:
     client replies -> old reminder still fires.
  */

  cancelReminder(
    senderId
  );


  if (
    conversation.reminder
  ) {

    conversation.reminder =
      null;

  }


  /*
     Save customer message first.
  */

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
     PAYMENT PROOF / PAYMENT CLAIM
  ======================================================= */

  if (
    conversation.paymentDetailsSent &&
    (
      isPaymentClaim(text) ||
      looksLikePaymentProof(
        attachmentInfo
      )
    )
  ) {

    conversation.paymentProofReceived =
      true;


    conversation.awaitingPaymentConfirmation =
      true;


    conversation.stage =
      "PAYMENT_VERIFICATION";


    await saveConversation(
      senderId,
      conversation
    );


    await sendReplySafely(
      page,
      senderId,
      conversation,
      PAYMENT_VERIFICATION_MESSAGE,
      version
    );


    return;

  }


  /* =======================================================
     CLIENT CONFIRMS PAYMENT
  ======================================================= */

  if (
    conversation.awaitingPaymentConfirmation &&
    isPaymentConfirmedByClient(text)
  ) {

    conversation.paymentConfirmed =
      true;


    conversation.awaitingPaymentConfirmation =
      false;


    conversation.stage =
      "PAYMENT_CONFIRMED";


    await saveConversation(
      senderId,
      conversation
    );


    await sendReplySafely(
      page,
      senderId,
      conversation,
      AFTER_PAYMENT_CONFIRMED_MESSAGE,
      version
    );


    return;

  }


  /* =======================================================
     PAYMENT NOT COMPLETE
  ======================================================= */

  if (
    conversation.awaitingPaymentConfirmation &&
    isPaymentPending(text)
  ) {

    conversation.awaitingPaymentConfirmation =
      false;


    await saveConversation(
      senderId,
      conversation
    );


    await sendReplySafely(
      page,
      senderId,
      conversation,
      PAYMENT_PENDING_RESPONSE,
      version
    );


    return;

  }


  /* =======================================================
     NEW CUSTOMER
  ======================================================= */

  if (
    conversation.stage ===
    "NEW"
  ) {

    conversation.pageKey =
      page.key;


    conversation.stage =
      "MESSAGE_ONE_SENT";


    await saveConversation(
      senderId,
      conversation
    );


    await sendReplySafely(
      page,
      senderId,
      conversation,
      MESSAGE_ONE,
      version,
      "MESSAGE_ONE_SENT"
    );


    return;

  }


  /* =======================================================
     MESSAGE ONE → MESSAGE TWO
  ======================================================= */

  if (
    conversation.stage ===
    "MESSAGE_ONE_SENT"
  ) {

    conversation.pageKey =
      page.key;


    conversation.stage =
      "MESSAGE_TWO_SENT";


    await saveConversation(
      senderId,
      conversation
    );


    await sendReplySafely(
      page,
      senderId,
      conversation,
      MESSAGE_TWO,
      version,
      "MESSAGE_TWO_SENT"
    );


    return;

  }


  /* =======================================================
     MESSAGE TWO → PACKAGE LIST
  ======================================================= */

  if (
    conversation.stage ===
    "MESSAGE_TWO_SENT"
  ) {

    const directPackage =
      detectPackage(
        text
      );


    /*
       If client directly says Gold/3/etc.,
       don't send package list again.
    */

    if (
      directPackage
    ) {

      conversation.selectedPackage =
        directPackage;


      conversation.stage =
        "PACKAGE_SELECTED";


      await saveConversation(
        senderId,
        conversation
      );


      await sendReplySafely(
        page,
        senderId,
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


    await saveConversation(
      senderId,
      conversation
    );


    await sendReplySafely(
      page,
      senderId,
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


    await saveConversation(
      senderId,
      conversation
    );


    await sendReplySafely(
      page,
      senderId,
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
        senderId,
        conversation,
        `That payment method isn't listed for ${page.username}. ❤️

Available methods:

${page.paymentMethods.join("\n")}`,
        version
      );


      return;

    }


    conversation.paymentMethod =
      paymentMethod;


    conversation.stage =
      "PAYMENT_PENDING";


    conversation.paymentDetailsSent =
      true;


    conversation.paymentConfirmed =
      false;


    conversation.paymentProofReceived =
      false;


    conversation.awaitingPaymentConfirmation =
      false;


    await saveConversation(
      senderId,
      conversation
    );


    /*
       Payment details are sent immediately.
    */

    await sendReplySafely(
      page,
      senderId,
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
     GUARANTEE
  ======================================================= */

  if (
    /\bguarantee\b|\bguaranteed\b|\brefund\b|\brefill\b/i
      .test(text)
  ) {

    await sendReplySafely(
      page,
      senderId,
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
    /\borganic\b|\breal followers\b|\bare.*followers.*real\b|\bfake followers\b/i
      .test(text)
  ) {

    await sendReplySafely(
      page,
      senderId,
      conversation,
      REAL_FOLLOWERS_MESSAGE,
      version
    );


    return;

  }


  /* =======================================================
     AI
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
      senderId,
      conversation,
      aiReply,
      version
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
            "READ / SEEN EVENT"
          );


          /*
             IMPORTANT:

             Read events do NOT go through the normal AI
             customer-message processor.

             Instead they only activate the appropriate
             follow-up timer.
          */

          const recipientId =
            event.recipient?.id;


          const watermark =
            event.read?.watermark;


          /*
             Depending on Meta's event shape, the sender is
             the Instagram page and recipient is the client.
          */

          if (
            recipientId &&
            watermark
          ) {

            /*
               The conversation is stored by CLIENT ID.
            */

            startReminderAfterRead(
              recipientId,
              watermark
            )
            .catch(
              error =>
                console.error(
                  "READ REMINDER ERROR:",
                  error
                )
            );

          }


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


            /*
               Cancel all pending reminders.
            */

            cancelReminder(
              customerId
            );


            /*
               Cancel AI responses currently waiting.
            */

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


              /*
                 Synchronize fixed stages if the owner
                 manually sends a fixed message.
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


        /* =================================================
           DUPLICATE PROTECTION
        ================================================= */

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


        /* =================================================
           CUSTOMER MESSAGE
        ================================================= */

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


        /*
           Every client message is processed in a per-client
           queue so two messages from the same client cannot
           corrupt the conversation order.
        */

        queueForClient(
          senderId,
          async () => {

            try {

              /*
                 Store page information before processing.
              */

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
        conversation.pageKey || null,

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
          conversation.history.length,

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
Global Promote AI
</title>

<style>

body{

  font-family:Arial;

  background:#f5f5f5;

  padding:20px;

}

.card{

  max-width:850px;

  margin:auto;

  background:white;

  padding:20px;

  border-radius:15px;

}

input,
button{

  width:100%;

  box-sizing:border-box;

  padding:12px;

  margin-top:10px;

}

pre{

  white-space:pre-wrap;

  word-break:break-word;

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
Persistent memory + reminders + payment verification
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

async function loadStatus(){

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
      "SEEN EVENTS: IGNORED AS AI MESSAGES"
    );


    console.log(
      "READ REMINDERS: ENABLED"
    );


    console.log(
      "SUPABASE MEMORY: ENABLED"
    );


    console.log(
      "MANUAL REPLY SYNC: ENABLED"
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

  }
);
