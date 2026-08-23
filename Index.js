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

    key:
      "europe",

    username:
      "@expl.europe",

    id:
      "17841404831696204",

    token:
      PAGE_ACCESS_TOKEN,

    currency:
      "€",

    packages: {

      bronze: {

        name:
          "Bronze",

        price:
          39,

        details:
          "2 story",

        followers:
          "1.5K followers guaranteed"

      },

      silver: {

        name:
          "Silver",

        price:
          66,

        details:
          "1 post and 3 story + 2 highlights",

        followers:
          "4K followers guaranteed"

      },

      gold: {

        name:
          "Gold",

        price:
          99,

        details:
          "3 post and 4 story + 3 highlights",

        followers:
          "7K followers guaranteed"

      },

      diamond: {

        name:
          "Diamond",

        price:
          129,

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

    key:
      "miami",

    username:
      "@expl.miami",

    id:
      "17841403973063146",

    token:
      EXPL_MIAMI_TOKEN,

    currency:
      "$",

    packages: {

      bronze: {

        name:
          "Bronze",

        price:
          38,

        details:
          "2 story",

        followers:
          "1K followers guaranteed"

      },

      silver: {

        name:
          "Silver",

        price:
          66,

        details:
          "1 post and 3 story + 2 highlights",

        followers:
          "3K followers guaranteed"

      },

      gold: {

        name:
          "Gold",

        price:
          99,

        details:
          "3 post and 4 story + 3 highlights",

        followers:
          "5K followers guaranteed"

      },

      diamond: {

        name:
          "Diamond",

        price:
          129,

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

    key:
      "canada",

    username:
      "@expl.canada",

    id:
      "17841452723605206",

    token:
      EXPL_CANADA_TOKEN,

    currency:
      "$",

    packages: {

      bronze: {

        name:
          "Bronze",

        price:
          35,

        details:
          "2 Stories",

        followers:
          "300–400 Global Followers Guaranteed"

      },

      silver: {

        name:
          "Silver",

        price:
          60,

        details:
          "1 Feed Post + 2 Stories",

        followers:
          "1.5K Followers Guaranteed (Includes 300–400 Canadian audience)"

      },

      gold: {

        name:
          "Gold",

        price:
          99,

        details:
          "3 Feed Posts + 4 Stories",

        followers:
          "4.5K Guaranteed Followers (Only Canadian Audience)"

      },

      diamond: {

        name:
          "Diamond",

        price:
          199,

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

    key:
      "mentalxheal",

    username:
      "@mentalxheal",

    id:
      "17841402953609202",

    token:
      MENTALXHEAL_TOKEN,

    currency:
      "$",

    packages: {

      bronze: {

        name:
          "Bronze",

        price:
          39,

        details:
          "2 story",

        followers:
          "1K followers guaranteed"

      },

      silver: {

        name:
          "Silver",

        price:
          66,

        details:
          "1 post and 3 story + 2 highlights",

        followers:
          "3K followers guaranteed"

      },

      gold: {

        name:
          "Gold",

        price:
          99,

        details:
          "3 post and 4 story +3 highlights",

        followers:
          "5K followers guaranteed"

      },

      diamond: {

        name:
          "Diamond",

        price:
          129,

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

function getPageById(
  id
) {

  const value =
    String(
      id || ""
    ).trim();


  for (
    const page
    of Object.values(
      PAGE_CONFIGS
    )
  ) {

    if (
      String(
        page.id
      ) ===
      value
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

  return new Date()
    .toISOString();

}


function wait(
  ms
) {

  return new Promise(
    resolve =>
      setTimeout(
        resolve,
        ms
      )
  );

}


function replyDelay() {

  return (
    6000 +
    Math.floor(
      Math.random() *
      3000
    )
  );

}


function normalize(
  text
) {

  return String(
    text || ""
  )
    .toLowerCase()
    .trim()
    .replace(
      /[.,!?]/g,
      " "
    )
    .replace(
      /\s+/g,
      " "
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
      String(
        senderId
      ),

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

  if (
    !text
  ) {

    return;

  }


  conversation.history.push({

    role,

    text:
      String(
        text
      ),

    timestamp:
      nowISO()

  });


  if (
    conversation.history.length >
    80
  ) {

    conversation.history =
      conversation.history.slice(
        -80
      );

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

        `${SUPABASE_URL.replace(
          /\/+$/,
          ""
        )}` +

        `/rest/v1/${encodeURIComponent(
          SUPABASE_TABLE
        )}` +

        `?select=id,messages,updated_at` +

        `&id=eq.${encodeURIComponent(
          senderId
        )}` +

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
      !Array.isArray(
        data
      ) ||
      !data.length
    ) {

      return null;

    }


    const stored =
      data[0]?.messages;


    if (
      stored &&
      typeof stored ===
        "object" &&
      !Array.isArray(
        stored
      )
    ) {

      return stored;

    }


    if (
      Array.isArray(
        stored
      )
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

        `${SUPABASE_URL.replace(
          /\/+$/,
          ""
        )}` +

        `/rest/v1/${encodeURIComponent(
          SUPABASE_TABLE
        )}`,

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
                String(
                  senderId
                ),

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
    String(
      senderId
    );


  if (
    conversations.has(
      key
    )
  ) {

    return conversations.get(
      key
    );

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
    typeof saved ===
      "object"

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


  conversations.set(
    key,
    conversation
  );


  return conversation;

}


/* =========================================================
   SAVE CONVERSATION
========================================================= */

async function saveConversation(
  senderId,
  conversation
) {

  const key =
    String(
      senderId
    );


  conversation.senderId =
    key;


  conversations.set(
    key,
    conversation
  );


  return supabaseSaveConversation(
    key,
    conversation
  );

}
/* =========================================================
   SUPABASE - ALL CONVERSATIONS
========================================================= */

async function supabaseGetAllConversations() {

  if (
    !supabaseConfigured()
  ) {

    return [];

  }


  try {

    const response =
      await fetch(

        `${SUPABASE_URL.replace(
          /\/+$/,
          ""
        )}` +

        `/rest/v1/${encodeURIComponent(
          SUPABASE_TABLE
        )}` +

        `?select=id,messages,updated_at` +

        `&order=updated_at.desc` +

        `&limit=1000`,

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
        "SUPABASE LIST ERROR:",
        data
      );

      return [];

    }


    return Array.isArray(
      data
    )
      ? data
      : [];

  }

  catch (
    error
  ) {

    console.error(
      "SUPABASE LIST EXCEPTION:",
      error.message
    );

    return [];

  }

}


/* =========================================================
   HYDRATE ADMIN CONVERSATIONS
========================================================= */

async function hydrateAdminConversations() {

  const rows =
    await supabaseGetAllConversations();


  for (
    const row
    of rows
  ) {

    const senderId =
      String(
        row?.id ||
        ""
      ).trim();


    if (
      !senderId
    ) {

      continue;

    }


    if (
      !row?.messages ||
      typeof row.messages !==
        "object"
    ) {

      continue;

    }


    const conversation =
      row.messages;


    conversation.senderId =
      senderId;


    conversation.history =
      Array.isArray(
        conversation.history
      )
        ? conversation.history
        : [];


    conversation.clientUsername =
      conversation.clientUsername ||
      null;


    conversation.pageKey =
      conversation.pageKey ||
      null;


    conversations.set(
      senderId,
      conversation
    );

  }


  return conversations;

}


/* =========================================================
   USERNAME NORMALIZATION
========================================================= */

function normalizeInstagramUsername(
  username
) {

  if (
    !username
  ) {

    return null;

  }


  const value =
    String(
      username
    )
      .trim()
      .replace(
        /^@+/,
        ""
      );


  if (
    !value
  ) {

    return null;

  }


  return `@${value}`;

}


/* =========================================================
   EXTRACT USERNAME
========================================================= */

function extractInstagramUsername(
  text
) {

  const match =
    String(
      text || ""
    ).match(
      /(?:^|\s)@([a-zA-Z0-9._]{1,30})\b/
    );


  if (
    !match
  ) {

    return null;

  }


  return normalizeInstagramUsername(
    match[1]
  );

}


/* =========================================================
   SAVE USERNAME
========================================================= */

async function setConversationUsername(
  senderId,
  username
) {

  const normalized =
    normalizeInstagramUsername(
      username
    );


  if (
    !normalized
  ) {

    return false;

  }


  const conversation =
    await getConversation(
      senderId
    );


  if (
    !conversation
  ) {

    return false;

  }


  if (
    conversation.clientUsername ===
    normalized
  ) {

    conversation.promotionUsernameReceived =
      true;


    await saveConversation(
      senderId,
      conversation
    );


    return true;

  }


  conversation.clientUsername =
    normalized;


  conversation.promotionUsernameReceived =
    true;


  await saveConversation(
    senderId,
    conversation
  );


  console.log(
    "CLIENT USERNAME SAVED:",
    normalized,
    senderId
  );


  return true;

}


/* =========================================================
   META USERNAME LOOKUP
========================================================= */

async function getInstagramUsername(
  page,
  senderId
) {

  if (
    !page?.token ||
    !senderId
  ) {

    return null;

  }


  try {

    const response =
      await fetch(

        `https://graph.instagram.com/${INSTAGRAM_API_VERSION}` +

        `/${encodeURIComponent(
          senderId
        )}` +

        `?fields=username`,

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
        "META USERNAME ERROR:",
        data
      );

      return null;

    }


    return normalizeInstagramUsername(
      data?.username
    );

  }

  catch (
    error
  ) {

    console.error(
      "META USERNAME EXCEPTION:",
      error.message
    );

    return null;

  }

}


/* =========================================================
   CUSTOMER MESSAGE USERNAME
========================================================= */

async function processUsernameFromMessage(
  senderId,
  conversation,
  text
) {

  const username =
    extractInstagramUsername(
      text
    );


  if (
    !username
  ) {

    return false;

  }


  conversation.clientUsername =
    username;


  conversation.promotionUsernameReceived =
    true;


  conversation.promotionUsernameRequested =
    false;


  await saveConversation(
    senderId,
    conversation
  );


  console.log(
    "USERNAME FROM MESSAGE:",
    username,
    senderId
  );


  return true;

}


/* =========================================================
   DETECTION HELPERS
========================================================= */

function detectPackage(
  text
) {

  const t =
    normalize(
      text
    );


  if (
    /\bbronze\b/.test(t) ||
    /\bpackage\s*1\b/.test(t) ||
    /^1$/.test(t)
  ) {

    return "bronze";

  }


  if (
    /\bsilver\b/.test(t) ||
    /\bpackage\s*2\b/.test(t) ||
    /^2$/.test(t)
  ) {

    return "silver";

  }


  if (
    /\bgold\b/.test(t) ||
    /\bpackage\s*3\b/.test(t) ||
    /^3$/.test(t)
  ) {

    return "gold";

  }


  if (
    /\bdiamond\b/.test(t) ||
    /\bpackage\s*4\b/.test(t) ||
    /^4$/.test(t)
  ) {

    return "diamond";

  }


  return null;

}


/* =========================================================
   PAYMENT METHOD DETECTION
========================================================= */

function detectPaymentMethod(
  text
) {

  const t =
    normalize(
      text
    );


  if (
    /\bpaypal\b/.test(t)
  ) {

    return "paypal";

  }


  if (
    /\bvenmo\b/.test(t)
  ) {

    return "venmo";

  }


  if (
    /\be[\s-]?transfer\b/.test(t)
  ) {

    return "etransfer";

  }


  if (
    /\biban\b/.test(t) ||
    /\bwise\b/.test(t)
  ) {

    return "iban";

  }


  if (
    /\brevolut\b/.test(t)
  ) {

    return "revolut";

  }


  if (
    /\bmb[\s-]?way\b/.test(t)
  ) {

    return "mbway";

  }


  if (
    /\bcredit\s*\/?\s*debit\b/.test(t) ||
    /\bcredit card\b/.test(t) ||
    /\bdebit card\b/.test(t)
  ) {

    return "card";

  }


  if (
    /\bach\b/.test(t) ||
    /\bwire\b/.test(t) ||
    /\bbank transfer\b/.test(t) ||
    /\bbank\b/.test(t)
  ) {

    return "achWire";

  }


  return null;

}


/* =========================================================
   PAYMENT METHOD ALIASES
========================================================= */

const PAYMENT_METHOD_ALIASES = {

  paypal: [
    "paypal"
  ],

  venmo: [
    "venmo"
  ],

  etransfer: [
    "e-transfer",
    "etransfer"
  ],

  iban: [
    "iban",
    "wise",
    "iban / wise"
  ],

  revolut: [
    "revolut"
  ],

  mbway: [
    "mb way",
    "mbway"
  ],

  card: [
    "credit/debit card",
    "credit card",
    "debit card"
  ],

  achWire: [
    "bank transfer",
    "bank transfer (ach / wire transfer)",
    "ach",
    "wire transfer"
  ]

};


/* =========================================================
   CHECK PAYMENT METHOD FOR PAGE
========================================================= */

function paymentMethodAvailable(
  page,
  method
) {

  if (
    !page ||
    !method
  ) {

    return false;

  }


  const aliases =
    PAYMENT_METHOD_ALIASES[
      method
    ] || [];


  return page.paymentMethods.some(
    paymentMethod => {

      const normalized =
        normalize(
          paymentMethod
        );


      return aliases.some(
        alias =>
          normalized ===
          normalize(
            alias
          )
      );

    }
  );

}


/* =========================================================
   PACKAGE MESSAGE
========================================================= */

function buildPackagesMessage(
  page
) {

  if (
    page.key ===
    "europe"
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
    page.key ===
    "miami"
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
    page.key ===
    "canada"
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
    page.key ===
    "mentalxheal"
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

  const selected =
    page?.packages?.[
      packageKey
    ];


  if (
    !selected
  ) {

    return null;

  }


  return `
Perfect ❤️

You've selected the ${selected.name} package.

${page.currency}${selected.price} = ${selected.details}
🎯 ${selected.followers}

How would you like to pay?

${page.paymentMethods.join(
  "\n"
)}`;

}


/* =========================================================
   PAYMENT DETAILS
========================================================= */

function getPaymentDetails(
  paymentMethod
) {

  return (
    PAYMENT_DETAILS[
      paymentMethod
    ] ||
    null
  );

}


/* =========================================================
   PAYMENT MESSAGE
========================================================= */

function buildPaymentMessage(
  page,
  packageKey,
  paymentMethod
) {

  const selected =
    page?.packages?.[
      packageKey
    ];


  const details =
    getPaymentDetails(
      paymentMethod
    );


  if (
    !selected ||
    !details
  ) {

    return null;

  }


  return `
Perfect ❤️

Package:
${selected.name}

Package price:
${page.currency}${selected.price}

Payment method:
${paymentMethod}

Payment details:

${details}

After successful payment, please send us your payment screenshot ❤️`;

}


/* =========================================================
   BASIC DETECTION
========================================================= */

function isPositiveInterest(
  text
) {

  const t =
    normalize(
      text
    );


  return (
    /\byes\b/.test(t) ||
    /\byep\b/.test(t) ||
    /\byup\b/.test(t) ||
    /\bsure\b/.test(t) ||
    /\binterested\b/.test(t) ||
    /\bsounds good\b/.test(t) ||
    /\bokay\b/.test(t) ||
    /\bok\b/.test(t) ||
    /\bshow me\b/.test(t) ||
    /\bsend me\b/.test(t)
  );

}


function isNegative(
  text
) {

  const t =
    normalize(
      text
    );


  return (
    /not interested/.test(t) ||
    /no thanks/.test(t) ||
    /^no$/.test(t) ||
    /\bstop\b/.test(t) ||
    /don't message/.test(t)
  );

}


function isGuaranteeQuestion(
  text
) {

  const t =
    normalize(
      text
    );


  return (
    /\bguarantee\b/.test(t) ||
    /\bguaranteed\b/.test(t) ||
    /\brefund\b/.test(t) ||
    /\brefunded\b/.test(t)
  );

}


function isPaymentConfirmation(
  text
) {

  const t =
    normalize(
      text
    );


  return (
    /\bpaid\b/.test(t) ||
    /payment done/.test(t) ||
    /payment completed/.test(t) ||
    /payment sent/.test(t) ||
    /i paid/.test(t) ||
    /paid already/.test(t) ||
    /successfully paid/.test(t)
  );

}


function hasMedia(
  attachmentInfo
) {

  return Boolean(
    attachmentInfo &&
    String(
      attachmentInfo
    ).trim()
  );

}


/* =========================================================
   REMINDER CONFIGURATION
========================================================= */

const REMINDER_TEXTS = {

  MESSAGE_ONE_SENT:
    "Are you interested? ❤️",

  MESSAGE_TWO_SENT:
    "Can I show you our packages? 😊",

  PACKAGES_SHOWN:
    "So which package would you like to choose? ❤️",

  PAYMENT_PENDING:
    "Did you try to make the payment? ❤️ Let me know if you need any help."

};


const REMINDER_DELAYS = {

  /*
     FIRST OPENING REMINDER:
     EXACTLY 1 MINUTE.
  */

  MESSAGE_ONE_SENT:
    60 * 1000,

  MESSAGE_TWO_SENT:
    2 * 60 * 1000,

  PACKAGES_SHOWN:
    3 * 60 * 1000,

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
    String(
      senderId
    );


  const timer =
    reminderTimers.get(
      key
    );


  if (
    timer
  ) {

    clearTimeout(
      timer
    );

  }


  reminderTimers.delete(
    key
  );


  const conversation =
    conversations.get(
      key
    );


  if (
    conversation
  ) {

    conversation.reminder =
      null;

  }

}


/* =========================================================
   MANUAL REPLY VERSION
========================================================= */

function invalidatePendingAI(
  senderId
) {

  const key =
    String(
      senderId
    );


  manualReplyVersion.set(
    key,
    (
      manualReplyVersion.get(
        key
      ) || 0
    ) + 1
  );


  cancelReminder(
    key
  );

}


function getManualReplyVersion(
  senderId
) {

  return (
    manualReplyVersion.get(
      String(
        senderId
      )
    ) || 0
  );

}


function manualReplyStillValid(
  senderId,
  version
) {

  return (
    getManualReplyVersion(
      senderId
    ) ===
    version
  );

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

  const delay =
    REMINDER_DELAYS[
      stage
    ];


  if (
    !delay ||
    !messageId
  ) {

    return;

  }


  const key =
    String(
      senderId
    );


  cancelReminder(
    key
  );


  const conversation =
    await getConversation(
      key
    );


  const version =
    Number(
      conversation.customerMessageVersion ||
      0
    );


  const dueAt =
    new Date(
      Date.now() +
      delay
    ).toISOString();


  conversation.reminder = {

    stage:
      stage,

    messageId:
      String(
        messageId
      ),

    sentAt:
      sentAt ||
      nowISO(),

    dueAt:
      dueAt,

    customerMessageVersion:
      version

  };


  await saveConversation(
    key,
    conversation
  );


  const timer =
    setTimeout(
      () => {

        processReminder(
          key,
          stage,
          String(
            messageId
          ),
          version
        )
          .catch(
            error =>
              console.error(
                "REMINDER ERROR:",
                error.message
              )
          );

      },
      delay
    );


  reminderTimers.set(
    key,
    timer
  );

}


/* =========================================================
   PROCESS REMINDER
========================================================= */

async function processReminder(
  senderId,
  expectedStage,
  expectedMessageId,
  expectedVersion
) {

  const key =
    String(
      senderId
    );


  reminderTimers.delete(
    key
  );


  const conversation =
    await getConversation(
      key
    );


  const reminder =
    conversation.reminder;


  if (
    !reminder
  ) {

    return;

  }


  /*
     A customer reply invalidates the reminder.
  */

  if (
    Number(
      conversation.customerMessageVersion ||
      0
    ) !==
    Number(
      expectedVersion ||
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


  if (
    String(
      reminder.messageId
    ) !==
    String(
      expectedMessageId
    )
  ) {

    return;

  }


  if (
    conversation.stage !==
    expectedStage
  ) {

    return;

  }


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


  const page =
    PAGE_CONFIGS[
      conversation.pageKey
    ];


  if (
    !page
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


  if (
    !text
  ) {

    return;

  }


  const version =
    getManualReplyVersion(
      key
    );


  if (
    !manualReplyStillValid(
      key,
      version
    )
  ) {

    return;

  }


  try {

    const data =
      await sendInstagramMessage(
        page,
        key,
        text
      );


    const newMessageId =
      data?.message_id ||
      data?.id ||
      null;


    if (
      newMessageId
    ) {

      outgoingMessages.add(
        `${page.key}:${String(
          newMessageId
        )}`
      );

    }


    saveMessage(
      conversation,
      "assistant",
      text
    );


    conversation.lastOutgoingMessageId =
      newMessageId
        ? String(
            newMessageId
          )
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

  }

  catch (
    error
  ) {

    console.error(
      "REMINDER SEND ERROR:",
      error.message
    );


    conversation.reminder =
      null;


    await saveConversation(
      key,
      conversation
    );

  }

}


/* =========================================================
   RESTORE REMINDERS AFTER RESTART
========================================================= */

async function restorePendingReminders() {

  const rows =
    await supabaseGetAllConversations();


  for (
    const row
    of rows
  ) {

    const senderId =
      String(
        row?.id ||
        ""
      ).trim();


    if (
      !senderId
    ) {

      continue;

    }


    const conversation =
      row?.messages;


    if (
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
      !reminder.dueAt ||
      !reminder.messageId
    ) {

      continue;

    }


    const dueTime =
      new Date(
        reminder.dueAt
      ).getTime();


    if (
      !Number.isFinite(
        dueTime
      )
    ) {

      conversation.reminder =
        null;


      await saveConversation(
        senderId,
        conversation
      );


      continue;

    }


    const delay =
      Math.max(
        1000,
        dueTime -
        Date.now()
      );


    cancelReminder(
      senderId
    );


    const timer =
      setTimeout(
        () => {

          processReminder(
            senderId,
            reminder.stage,
            reminder.messageId,
            reminder.customerMessageVersion
          )
            .catch(
              error =>
                console.error(
                  "RESTORED REMINDER ERROR:",
                  error.message
                )
            );

        },
        delay
      );


    reminderTimers.set(
      senderId,
      timer
    );

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
    !page ||
    !page.token
  ) {

    throw new Error(
      `Instagram page token missing for ${
        page?.username ||
        "unknown page"
      }`
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
                String(
                  recipientId
                )

            },

            message: {

              text:
                String(
                  text
                )

            }

          })

      }
    );


  const data =
    await response.json();


  if (
    !response.ok
  ) {

    throw new Error(
      data?.error?.message ||
      `Instagram API error ${response.status}`
    );

  }


  return data;

}


/* =========================================================
   SAFE AUTOMATIC SEND
========================================================= */

async function sendReplySafely(
  page,
  senderId,
  conversation,
  text,
  version,
  reminderStage = null
) {

  if (
    !text
  ) {

    return null;

  }


  const key =
    String(
      senderId
    );


  /*
     Small human-like delay.

     IMPORTANT:
     The first reminder is NOT here.
     Reminder timing is controlled separately
     by scheduleReminder().
  */

  await wait(
    replyDelay()
  );


  if (
    !manualReplyStillValid(
      key,
      version
    )
  ) {

    return null;

  }


  const latest =
    await getConversation(
      key
    );


  /*
     If the client replied while AI was waiting,
     don't send the old AI answer.
  */

  if (
    latest.customerMessageVersion !==
    conversation.customerMessageVersion
  ) {

    return null;

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

    outgoingMessages.add(
      `${page.key}:${String(
        messageId
      )}`
    );

  }


  latest.pageKey =
    page.key;


  saveMessage(
    latest,
    "assistant",
    text
  );


  latest.lastOutgoingMessageId =
    messageId
      ? String(
          messageId
        )
      : null;


  latest.lastOutgoingText =
    text;


  latest.lastOutgoingStage =
    latest.stage;


  latest.lastOutgoingAt =
    nowISO();


  await saveConversation(
    key,
    latest
  );


  /*
     Only schedule a reminder when the caller
     explicitly requested one.
  */

  if (
    reminderStage &&
    messageId
  ) {

    await scheduleReminder(
      key,
      reminderStage,
      messageId,
      latest.lastOutgoingAt
    );

  }


  return data;

}


/* =========================================================
   ADMIN REPLY
========================================================= */

async function sendAdminReplyMessage(
  senderId,
  message,
  requestedPage = null
) {

  const key =
    String(
      senderId
    );


  const conversation =
    await getConversation(
      key
    );


  if (
    !conversation
  ) {

    throw new Error(
      "Client conversation not found."
    );

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

    throw new Error(
      "Client page is missing or invalid."
    );

  }


  /*
     Admin reply cancels:
     1. reminder
     2. pending delayed AI reply
  */

  invalidatePendingAI(
    key
  );


  const data =
    await sendInstagramMessage(
      page,
      key,
      message
    );


  const messageId =
    data?.message_id ||
    data?.id ||
    null;


  if (
    messageId
  ) {

    outgoingMessages.add(
      `${page.key}:${String(
        messageId
      )}`
    );

  }


  saveMessage(
    conversation,
    "assistant",
    message
  );


  conversation.pageKey =
    page.key;


  conversation.lastOutgoingMessageId =
    messageId
      ? String(
          messageId
        )
      : null;


  conversation.lastOutgoingText =
    message;


  conversation.lastOutgoingStage =
    conversation.stage;


  conversation.lastOutgoingAt =
    nowISO();


  conversation.reminder =
    null;


  await saveConversation(
    key,
    conversation
  );


  return {

    success:
      true,

    senderId:
      key,

    username:
      conversation.clientUsername ||
      null,

    page:
      page.username,

    pageKey:
      page.key,

    messageId:
      messageId

  };

}


/* =========================================================
   PROMOTION STATE
========================================================= */

function updatePromotionComplete(
  conversation
) {

  conversation.promotionComplete =
    Boolean(

      conversation.paymentConfirmed &&

      conversation.promotionMediaReceived &&

      (
        conversation.promotionUsernameReceived ||
        conversation.clientUsername
      )

    );


  if (
    conversation.promotionComplete
  ) {

    conversation.stage =
      "PROMOTION_COMPLETE";

  }

}


/* =========================================================
   PROCESS USERNAME + MEDIA
========================================================= */

async function processUsernameAndMedia(
  senderId,
  conversation,
  text,
  attachmentInfo
) {

  let changed =
    false;


  /*
     Username received from customer text.
  */

  const username =
    extractInstagramUsername(
      text
    );


  if (
    username &&
    conversation.clientUsername !==
    username
  ) {

    conversation.clientUsername =
      username;


    conversation.promotionUsernameReceived =
      true;


    conversation.promotionUsernameRequested =
      false;


    changed =
      true;

  }


  /*
     IMPORTANT:

     Media is promotion media ONLY after
     payment is confirmed.

     This fixes the previous problem where
     sending a picture before payment caused
     the bot to ask for the same picture again.
  */

  if (
    conversation.paymentConfirmed &&
    hasMedia(
      attachmentInfo
    )
  ) {

    if (
      !conversation.promotionMediaReceived
    ) {

      conversation.promotionMediaReceived =
        true;


      changed =
        true;

    }

  }


  updatePromotionComplete(
    conversation
  );


  if (
    changed
  ) {

    await saveConversation(
      senderId,
      conversation
    );

  }


  return changed;

}


/* =========================================================
   NEXT PROMOTION STEP
========================================================= */

async function sendPromotionNextStep(
  page,
  senderId,
  conversation
) {

  if (
    !conversation.paymentConfirmed
  ) {

    return;

  }


  updatePromotionComplete(
    conversation
  );


  if (
    conversation.promotionComplete
  ) {

    await saveConversation(
      senderId,
      conversation
    );


    return;

  }


  let message =
    null;


  /*
     Ask for pictures ONLY if payment is confirmed
     and pictures have not already been received.
  */

  if (
    !conversation.promotionMediaReceived
  ) {

    message =
      "Perfect dear ❤️ Please send me the pictures that you want to promote.";

  }


  /*
     Ask for username ONLY if it isn't already saved.
  */

  else if (
    !conversation.promotionUsernameReceived &&
    !conversation.clientUsername
  ) {

    message =
      "Perfect dear ❤️ Please send me your Instagram username.";


    conversation.promotionUsernameRequested =
      true;

  }


  if (
    !message
  ) {

    return;

  }


  /*
     Don't repeat the exact same request.
  */

  if (
    conversation.lastOutgoingText ===
    message
  ) {

    await saveConversation(
      senderId,
      conversation
    );


    return;

  }


  const version =
    getManualReplyVersion(
      senderId
    );


  await sendReplySafely(
    page,
    senderId,
    conversation,
    message,
    version
  );


  if (
    message.includes(
      "username"
    )
  ) {

    conversation.promotionUsernameRequested =
      true;


    await saveConversation(
      senderId,
      conversation
    );

  }

}


/* =========================================================
   PAYMENT CONFIRMATION HELPER
========================================================= */

function isSimplePaymentConfirmation(
  text
) {

  const t =
    normalize(
      text
    );


  return (

    /\bpaid\b/.test(t) ||

    /payment\s+(is\s+)?done/.test(t) ||

    /payment\s+(is\s+)?completed/.test(t) ||

    /payment\s+sent/.test(t) ||

    /payment\s+made/.test(t) ||

    /i\s+paid/.test(t) ||

    /paid\s+already/.test(t) ||

    /successfully\s+paid/.test(t)

  );

}


/* =========================================================
   AI FALLBACK
========================================================= */

function buildAIHistory(
  conversation
) {

  return conversation.history
    .slice(-40)
    .map(
      item => {

        const role =
          item.role ===
          "assistant"
            ? "assistant"
            : "client";


        return (
          `${role}: ${item.text}`
        );

      }
    )
    .join(
      "\n"
    );

}


async function getAIReply(
  page,
  conversation,
  clientMessage,
  attachmentInfo
) {

  if (
    !OPEN_AI
  ) {

    return null;

  }


  const packageSummary =
    Object.values(
      page.packages
    )
      .map(
        item =>
          `${item.name}: ${page.currency}${item.price} = ${item.details}; ${item.followers}`
      )
      .join(
        "\n"
      );


  const history =
    buildAIHistory(
      conversation
    );


  const prompt =
`You are the Instagram sales assistant for Global Promote.

PAGE:
${page.username}

CURRENT STAGE:
${conversation.stage}

CLIENT USERNAME:
${conversation.clientUsername || "not available"}

SELECTED PACKAGE:
${conversation.selectedPackage || "none"}

PAYMENT METHOD:
${conversation.paymentMethod || "none"}

PACKAGES ALREADY SENT:
${conversation.packagesSent ? "YES" : "NO"}

PAYMENT DETAILS ALREADY SENT:
${conversation.paymentDetailsSent ? "YES" : "NO"}

PAYMENT CONFIRMED:
${conversation.paymentConfirmed ? "YES" : "NO"}

PROMOTION MEDIA RECEIVED:
${conversation.promotionMediaReceived ? "YES" : "NO"}

PROMOTION USERNAME RECEIVED:
${conversation.promotionUsernameReceived ? "YES" : "NO"}

STRICT RULES:

1. Continue the existing conversation.
2. NEVER restart the conversation.
3. NEVER send the opening message again.
4. NEVER send MESSAGE_TWO again.
5. NEVER send the package list if packagesSent is YES.
6. NEVER invent a package price.
7. NEVER invent payment details.
8. NEVER ask for promotion pictures before payment is confirmed.
9. After payment is confirmed, never ask for pictures if they were already received.
10. Never ask for the Instagram username if it is already saved.
11. If the client asks a normal question, answer it naturally.
12. Keep replies short and suitable for Instagram.
13. Use the conversation history to understand what has already been discussed.
14. Do not claim that payment is confirmed unless the conversation state says it is confirmed.
15. Do not change conversation state yourself.
16. Do not send the fixed opening, second message, or package list yourself.

AVAILABLE PACKAGES:
${packageSummary}

CONVERSATION HISTORY:
${history}

LATEST CUSTOMER MESSAGE:
${clientMessage || "[media received]"}

ATTACHMENT:
${attachmentInfo || "none"}

Return ONLY the customer-facing reply.`;

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


    if (
      typeof data.output_text ===
      "string"
    ) {

      return data.output_text.trim();

    }


    let output =
      "";


    for (
      const item
      of data.output || []
    ) {

      for (
        const part
        of item.content || []
      ) {

        if (
          part.type ===
            "output_text" &&
          part.text
        ) {

          output +=
            part.text;

        }

      }

    }


    return output.trim() ||
      null;

  }

  catch (
    error
  ) {

    console.error(
      "OPENAI EXCEPTION:",
      error.message
    );


    return null;

  }

}
/* =========================================================
   CUSTOMER MESSAGE PROCESSOR
========================================================= */

async function processClientMessage(
  page,
  senderId,
  clientMessage,
  attachmentInfo
) {

  const key =
    String(
      senderId
    );


  const conversation =
    await getConversation(
      key
    );


  if (
    !conversation
  ) {

    return;

  }


  /*
     Any genuine customer message cancels the
     current reminder.
  */

  cancelReminder(
    key
  );


  /*
     Increment customer-message version.

     This prevents an old delayed AI response from
     being sent after the customer has already replied.
  */

  conversation.customerMessageVersion =
    Number(
      conversation.customerMessageVersion ||
      0
    ) + 1;


  conversation.lastCustomerMessageText =
    String(
      clientMessage ||
      ""
    );


  conversation.lastCustomerMessageAt =
    nowISO();


  conversation.pageKey =
    page.key;


  /*
     Try to get username from the customer's message.
  */

  await processUsernameFromMessage(
    key,
    conversation,
    clientMessage
  );


  /*
     If username wasn't supplied in the message,
     try Meta's username field.
  */

  if (
    !conversation.clientUsername
  ) {

    const metaUsername =
      await getInstagramUsername(
        page,
        key
      );


    if (
      metaUsername
    ) {

      conversation.clientUsername =
        metaUsername;


      conversation.promotionUsernameReceived =
        true;

    }

  }


  /*
     Save the incoming customer message BEFORE
     processing it.

     This is critical for AI memory.
  */

  saveMessage(
    conversation,
    "client",
    clientMessage ||
      (
        attachmentInfo
          ? `[${attachmentInfo}]`
          : "[media]"
      )
  );


  await saveConversation(
    key,
    conversation
  );


  /* =======================================================
     PAYMENT CONFIRMED FLOW
  ======================================================= */

  if (
    conversation.paymentConfirmed
  ) {

    await processUsernameAndMedia(
      key,
      conversation,
      clientMessage,
      attachmentInfo
    );


    /*
       If both media and username are already available,
       nothing else should be requested.
    */

    updatePromotionComplete(
      conversation
    );


    await saveConversation(
      key,
      conversation
    );


    if (
      conversation.promotionComplete
    ) {

      return;

    }


    /*
       Only ask for whatever is still missing.
    */

    await sendPromotionNextStep(
      page,
      key,
      conversation
    );


    return;

  }


  /* =======================================================
     PAYMENT DETAILS ALREADY SENT
  ======================================================= */

  if (
    conversation.paymentDetailsSent
  ) {

    /*
       Customer explicitly says payment is done.
    */

    if (
      isSimplePaymentConfirmation(
        clientMessage
      )
    ) {

      conversation.paymentProofReceived =
        true;


      conversation.awaitingPaymentConfirmation =
        true;


      await saveConversation(
        key,
        conversation
      );


      const version =
        getManualReplyVersion(
          key
        );


      await sendReplySafely(
        page,
        key,
        conversation,
        "Thank you dear ❤️ Please confirm once the payment has been completed successfully so I can proceed with your promotion.",
        version
      );


      return;

    }


    /*
       If customer sends an attachment after payment
       details, treat it as payment proof.

       It is NOT promotion media until payment
       has been confirmed.
    */

    if (
      hasMedia(
        attachmentInfo
      )
    ) {

      conversation.paymentProofReceived =
        true;


      conversation.awaitingPaymentConfirmation =
        true;


      await saveConversation(
        key,
        conversation
      );


      const version =
        getManualReplyVersion(
          key
        );


      await sendReplySafely(
        page,
        key,
        conversation,
        "Thank you dear ❤️ Please confirm once the payment has been completed successfully so I can proceed with your promotion.",
        version
      );


      return;

    }


    /*
       If payment proof was received and the client
       sends a simple confirmation, mark payment confirmed.
    */

    if (
      conversation.awaitingPaymentConfirmation &&
      (
        normalize(
          clientMessage
        ) ===
        "yes" ||

        normalize(
          clientMessage
        ) ===
        "done" ||

        normalize(
          clientMessage
        ) ===
        "completed" ||

        normalize(
          clientMessage
        ) ===
        "confirmed"
      )
    ) {

      conversation.paymentConfirmed =
        true;


      conversation.awaitingPaymentConfirmation =
        false;


      conversation.stage =
        "PAYMENT_CONFIRMED";


      cancelReminder(
        key
      );


      await saveConversation(
        key,
        conversation
      );


      /*
         IMPORTANT:
         After payment confirmation, the next step
         is promotion media / username.

         It will NOT ask for payment again.
      */

      await sendPromotionNextStep(
        page,
        key,
        conversation
      );


      return;

    }

  }


  /* =======================================================
     PACKAGE SELECTION
  ======================================================= */

  const packageKey =
    detectPackage(
      clientMessage
    );


  /*
     A package number/name is only treated as a package
     selection AFTER the package list was already sent.
  */

  if (
    packageKey &&
    conversation.packagesSent
  ) {

    /*
       Don't send the same package confirmation repeatedly.
    */

    if (
      conversation.selectedPackage ===
      packageKey
    ) {

      return;

    }


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
        getManualReplyVersion(
          key
        );


      await sendReplySafely(
        page,
        key,
        conversation,
        confirmation,
        version
      );

    }


    return;

  }


  /* =======================================================
     PAYMENT METHOD
  ======================================================= */

  const paymentMethod =
    detectPaymentMethod(
      clientMessage
    );


  if (
    paymentMethod &&
    conversation.selectedPackage
  ) {

    /*
       Make sure this payment method is available
       for this particular page.
    */

    if (
      !paymentMethodAvailable(
        page,
        paymentMethod
      )
    ) {

      const version =
        getManualReplyVersion(
          key
        );


      await sendReplySafely(
        page,
        key,
        conversation,
        `That payment method isn't available for this page ❤️

Available payment methods:

${page.paymentMethods.join(
  "\n"
)}

Please choose one of these.`,
        version
      );


      return;

    }


    /*
       Do NOT send the same payment details again.
    */

    if (
      conversation.paymentDetailsSent &&
      conversation.paymentMethod ===
      paymentMethod
    ) {

      return;

    }


    const paymentMessage =
      buildPaymentMessage(
        page,
        conversation.selectedPackage,
        paymentMethod
      );


    if (
      !paymentMessage
    ) {

      return;

    }


    conversation.paymentMethod =
      paymentMethod;


    conversation.paymentDetailsSent =
      true;


    conversation.paymentConfirmed =
      false;


    conversation.paymentProofReceived =
      false;


    conversation.awaitingPaymentConfirmation =
      true;


    conversation.stage =
      "PAYMENT_PENDING";


    await saveConversation(
      key,
      conversation
    );


    const version =
      getManualReplyVersion(
        key
      );


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


  /* =======================================================
     GUARANTEE QUESTION
  ======================================================= */

  if (
    isGuaranteeQuestion(
      clientMessage
    )
  ) {

    const version =
      getManualReplyVersion(
        key
      );


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
     REAL / ORGANIC QUESTION
  ======================================================= */

  const normalizedMessage =
    normalize(
      clientMessage
    );


  if (
    /real followers/.test(
      normalizedMessage
    ) ||

    /organic followers/.test(
      normalizedMessage
    ) ||

    /fake followers/.test(
      normalizedMessage
    ) ||

    /bot followers/.test(
      normalizedMessage
    ) ||

    /^real$/.test(
      normalizedMessage
    )
  ) {

    const version =
      getManualReplyVersion(
        key
      );


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
     NEGATIVE RESPONSE
  ======================================================= */

  if (
    isNegative(
      clientMessage
    )
  ) {

    conversation.stage =
      "CLOSED";


    await saveConversation(
      key,
      conversation
    );


    return;

  }


  /* =======================================================
     FIRST OPENING MESSAGE
  ======================================================= */

  if (
    !conversation.messageOneSent
  ) {

    /*
       Mark BEFORE sending.

       This prevents duplicate webhook events from
       sending the opening message twice.
    */

    conversation.messageOneSent =
      true;


    conversation.stage =
      "MESSAGE_ONE_SENT";


    await saveConversation(
      key,
      conversation
    );


    const version =
      getManualReplyVersion(
        key
      );


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
     SECOND MESSAGE
  ======================================================= */

  if (
    !conversation.messageTwoSent
  ) {

    /*
       Only send the second message after a positive
       response.

       It can NEVER be sent again after the flag is true.
    */

    if (
      !isPositiveInterest(
        clientMessage
      )
    ) {

      const ai =
        await getAIReply(
          page,
          conversation,
          clientMessage,
          attachmentInfo
        );


      if (
        ai
      ) {

        const version =
          getManualReplyVersion(
            key
          );


        await sendReplySafely(
          page,
          key,
          conversation,
          ai,
          version
        );

      }


      return;

    }


    conversation.messageTwoSent =
      true;


    conversation.stage =
      "MESSAGE_TWO_SENT";


    await saveConversation(
      key,
      conversation
    );


    const version =
      getManualReplyVersion(
        key
      );


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
     PACKAGE REQUEST
  ======================================================= */

  const asksPackages =
    /\b(package|packages|price|prices|pricing|price list|how much|cost)\b/.test(
      normalizedMessage
    );


  if (
    !conversation.packagesSent &&
    asksPackages
  ) {

    /*
       Mark BEFORE sending to prevent duplicate packages
       from multiple webhook events.
    */

    conversation.packagesSent =
      true;


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
      getManualReplyVersion(
        key
      );


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


  /* =======================================================
     AI FALLBACK
  ======================================================= */

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
      getManualReplyVersion(
        key
      );


    await sendReplySafely(
      page,
      key,
      conversation,
      aiReply,
      version
    );


    return;

  }


  /* =======================================================
     FINAL FALLBACK
  ======================================================= */

  const fallback =
    conversation.packagesSent

      ? "Sure dear ❤️ Please let me know what you would like to know about our promotion."

      : "Sure dear ❤️ Please let me know how I can help you.";


  const version =
    getManualReplyVersion(
      key
    );


  await sendReplySafely(
    page,
    key,
    conversation,
    fallback,
    version
  );

}


/* =========================================================
   WEBHOOK VERIFY
========================================================= */

app.get(
  "/webhook",
  (
    req,
    res
  ) => {

    const mode =
      req.query[
        "hub.mode"
      ];


    const token =
      req.query[
        "hub.verify_token"
      ];


    const challenge =
      req.query[
        "hub.challenge"
      ];


    if (
      mode ===
      "subscribe" &&

      token ===
      VERIFY_TOKEN
    ) {

      return res
        .status(
          200
        )
        .send(
          challenge
        );

    }


    return res.sendStatus(
      403
    );

  }
);


/* =========================================================
   CLIENT QUEUE
========================================================= */

function queueForClient(
  senderId,
  task
) {

  const key =
    String(
      senderId
    );


  const previous =
    clientQueues.get(
      key
    ) ||
    Promise.resolve();


  const next =
    previous
      .catch(
        () => {}
      )
      .then(
        task
      );


  clientQueues.set(
    key,
    next
  );


  next.finally(
    () => {

      if (
        clientQueues.get(
          key
        ) ===
        next
      ) {

        clientQueues.delete(
          key
        );

      }

    }
  ).catch(
    () => {}
  );


  return next;

}


/* =========================================================
   WEBHOOK EVENT HELPERS
========================================================= */

function isReadEvent(
  event
) {

  return Boolean(
    event?.read
  );

}


function isDeliveryEvent(
  event
) {

  return Boolean(
    event?.delivery
  );

}


function isReactionEvent(
  event
) {

  return Boolean(
    event?.reaction
  );

}


function isEchoMessage(
  event
) {

  return (
    event?.message?.is_echo ===
    true
  );

}


/* =========================================================
   WEBHOOK POST
========================================================= */

app.post(
  "/webhook",
  (
    req,
    res
  ) => {

    /*
       Always acknowledge Meta immediately.
    */

    res.sendStatus(
      200
    );


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
      const entry
      of body.entry
    ) {

      const page =
        getPageById(
          entry?.id
        );


      if (
        !page
      ) {

        continue;

      }


      const messaging =
        Array.isArray(
          entry?.messaging
        )
          ? entry.messaging
          : [];


      for (
        const event
        of messaging
      ) {

        /*
           NEVER reply to:
           - read
           - delivery
           - reaction
           - non-message events
        */

        if (
          isReadEvent(
            event
          ) ||

          isDeliveryEvent(
            event
          ) ||

          isReactionEvent(
            event
          ) ||

          !event?.message
        ) {

          continue;

        }


        const senderId =
          event?.sender?.id;


        const recipientId =
          event?.recipient?.id;


        const messageId =
          event?.message?.mid;


        if (
          !senderId ||
          !messageId
        ) {

          continue;

        }


        const outgoingKey =
          `${page.key}:${String(
            messageId
          )}`;


        /*
           Ignore messages that our own application
           already knows it sent.
        */

        if (
          outgoingMessages.has(
            outgoingKey
          )
        ) {

          outgoingMessages.delete(
            outgoingKey
          );


          continue;

        }


        /*
           Ignore Meta echo messages.
        */

        if (
          isEchoMessage(
            event
          )
        ) {

          continue;

        }


        /* =================================================
           DUPLICATE WEBHOOK PROTECTION
        ================================================= */

        const duplicateKey =
          `${page.key}:${String(
            messageId
          )}`;


        if (
          processedMessageIds.has(
            duplicateKey
          )
        ) {

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
           MESSAGE CONTENT
        ================================================= */

        const clientMessage =
          String(
            event.message?.text ||
            ""
          ).trim();


        const attachments =
          Array.isArray(
            event.message?.attachments
          )
            ? event.message.attachments
            : [];


        const attachmentInfo =
          attachments
            .map(
              attachment =>
                `type=${
                  attachment?.type ||
                  "unknown"
                }`
            )
            .join(
              "\n"
            );


        const hasShare =
          Boolean(
            event.message?.share
          );


        if (
          !clientMessage &&
          !attachmentInfo &&
          !hasShare
        ) {

          continue;

        }


        /* =================================================
           CUSTOMER QUEUE
        ================================================= */

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


              /*
                 Meta may provide the username directly.
              */

              const incomingUsername =
                event?.sender?.username ||
                null;


              if (
                incomingUsername
              ) {

                conversation.clientUsername =
                  normalizeInstagramUsername(
                    incomingUsername
                  );


                conversation.promotionUsernameReceived =
                  true;

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

  }
);
 

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
      "FIRST REMINDER: 1 MINUTE AFTER AUTOMATED OPENING"
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
