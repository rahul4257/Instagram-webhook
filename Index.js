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
   MANAGED PAGE PROTECTION
========================================================= */

const MANAGED_PAGE_IDS =
  new Set(
    Object.values(
      PAGE_CONFIGS
    ).map(
      page =>
        String(
          page.id
        )
    )
  );


function isManagedPageEvent(
  event
) {

  const senderId =
    String(
      event?.sender?.id ||
      ""
    ).trim();


  const message =
    event?.message ||
    {};


  if (
    message.is_echo ===
    true
  ) {

    return true;

  }


  if (
    senderId &&
    MANAGED_PAGE_IDS.has(
      senderId
    )
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

    messageOneSent:
      false,

    messageTwoSent:
      false,

    packagesSent:
      false,

    promotionMediaReceived:
      false,

    promotionUsernameReceived:
      false,

    promotionUsernameRequested:
      false,

    promotionComplete:
      false,

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


    return data[0]?.messages ||
      null;

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


async function supabaseSaveConversation(
  senderId,
  conversation
) {

  if (
    !supabaseConfigured()
  ) {

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
              "resolution=merge-duplicates"

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


    const data =
      await response.text();


    if (
      !response.ok
    ) {

      console.error(
        "SUPABASE SAVE ERROR:",
        data
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

        `&order=updated_at.desc`,

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
   GET CONVERSATION
========================================================= */

async function getConversation(
  senderId
) {

  const key =
    String(
      senderId
    );


  let conversation =
    conversations.get(
      key
    );


  if (
    conversation
  ) {

    return conversation;

  }


  const stored =
    await supabaseGetConversation(
      key
    );


  if (
    stored &&
    typeof stored ===
      "object"
  ) {

    conversation =
      stored;

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

    conversation.messageOneSent =
      Boolean(
        conversation.messageOneSent
      );

    conversation.messageTwoSent =
      Boolean(
        conversation.messageTwoSent
      );

    conversation.packagesSent =
      Boolean(
        conversation.packagesSent
      );

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

    conversation.promotionMediaReceived =
      Boolean(
        conversation.promotionMediaReceived
      );

    conversation.promotionUsernameReceived =
      Boolean(
        conversation.promotionUsernameReceived
      );

    conversation.promotionUsernameRequested =
      Boolean(
        conversation.promotionUsernameRequested
      );

    conversation.promotionComplete =
      Boolean(
        conversation.promotionComplete
      );

    conversation.customerMessageVersion =
      Number(
        conversation.customerMessageVersion ||
        0
      );

    conversations.set(
      key,
      conversation
    );

    return conversation;

  }


  conversation =
    createConversation(
      key
    );


  conversations.set(
    key,
    conversation
  );


  await supabaseSaveConversation(
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


  await supabaseSaveConversation(
    key,
    conversation
  );


  return conversation;

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
   AI FALLBACK
========================================================= */

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


  const history =
    Array.isArray(
      conversation.history
    )
      ? conversation.history
          .slice(-40)
          .map(
            item => ({

              role:
                item.role ===
                "client"
                  ? "user"
                  : "assistant",

              content:
                String(
                  item.text ||
                  ""
                )

            })
          )
      : [];


  const systemPrompt = `
You are the AI sales assistant for ${BUSINESS_NAME}.

You are continuing an EXISTING Instagram conversation.

IMPORTANT RULES:

- Never restart the conversation.
- Never send the opening message again if it has already been sent.
- Never send MESSAGE_TWO again if it has already been sent.
- Never resend the package list if packages were already shown.
- Never ask for information that is already saved.
- Never invent package prices.
- Never invent payment details.
- Follow the fixed sales flow.
- Keep replies short, natural and friendly.
- Use ❤️ or 😊 naturally.
- If the customer's message is unclear, answer based on the previous conversation.
- Do not pretend that a payment is confirmed unless the system has confirmed it.
- Do not say that promotion is complete unless the system says it is complete.

Current page:
${page.username}

Current stage:
${conversation.stage}

Selected package:
${conversation.selectedPackage || "none"}

Payment method:
${conversation.paymentMethod || "none"}

Payment confirmed:
${Boolean(
    conversation.paymentConfirmed
  )}

Promotion media received:
${Boolean(
    conversation.promotionMediaReceived
  )}

Promotion username received:
${Boolean(
    conversation.promotionUsernameReceived ||
    conversation.clientUsername
  )}
`;


  try {

    const response =
      await fetch(
        "https://api.openai.com/v1/chat/completions",
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

              temperature:
                0.7,

              messages: [

                {

                  role:
                    "system",

                  content:
                    systemPrompt

                },

                ...history,

                {

                  role:
                    "user",

                  content:
                    String(
                      clientMessage ||
                      (
                        attachmentInfo
                          ? `[${attachmentInfo}]`
                          : ""
                      )
                    )

                }

              ]

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


    const reply =
      data?.choices?.[0]?.message?.content
        ?.trim();


    return (
      reply ||
      null
    );

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
   MANUAL REPLY PROTECTION
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


  if (
    Number(
      latest.customerMessageVersion ||
      0
    ) !==
    Number(
      conversation.customerMessageVersion ||
      0
    )
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
   PROMOTION COMPLETE
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
     Media is promotion media ONLY after payment
     has been confirmed.
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


  if (
    !conversation.promotionMediaReceived
  ) {

    message =
      "Perfect dear ❤️ Please send me the pictures that you want to promote.";

  }

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
   PAYMENT CONFIRMATION
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
   CLIENT MESSAGE PROCESSOR
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


  cancelReminder(
    key
  );


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
        "Thank you dear ❤️ Please send me your payment screenshot and confirm once the payment has been completed successfully.",
        version
      );


      return;

    }


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
        "Thank you dear ❤️ I received your payment screenshot. Please confirm once the payment has been completed successfully.",
        version
      );


      return;

    }


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


  if (
    packageKey &&
    conversation.packagesSent
  ) {

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
     FIRST MESSAGE
  ======================================================= */

  if (
    !conversation.messageOneSent
  ) {

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

  const version =
    getManualReplyVersion(
      key
    );


  await sendReplySafely(
    page,
    key,
    conversation,
    "Sure dear ❤️ Please tell me what you would like to know.",
    version
  );

}


/* =========================================================
   CLIENT MESSAGE QUEUE
========================================================= */

function enqueueClientMessage(
  page,
  senderId,
  clientMessage,
  attachmentInfo
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
        () =>
          processClientMessage(
            page,
            key,
            clientMessage,
            attachmentInfo
          )
      )
      .catch(
        error =>
          console.error(
            "CLIENT MESSAGE PROCESSING ERROR:",
            error.message
          )
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
  );


  return next;

}


/* =========================================================
   WEBHOOK VERIFICATION
========================================================= */

app.get(
  "/webhook",
  (
    req,
    res
  ) => {

    const mode =
      req.query["hub.mode"];


    const token =
      req.query["hub.verify_token"];


    const challenge =
      req.query["hub.challenge"];


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


    return res
      .sendStatus(
        403
      );

  }
);


/* =========================================================
   WEBHOOK
========================================================= */

app.post(
  "/webhook",
  async (
    req,
    res
  ) => {

    res.sendStatus(
      200
    );


    try {

      const body =
        req.body;


      if (
        !body ||
        body.object !==
        "instagram"
      ) {

        return;

      }


      const entries =
        Array.isArray(
          body.entry
        )
          ? body.entry
          : [];


      for (
        const entry
        of entries
      ) {

        const page =
          getPageById(
            entry.id
          );


        if (
          !page
        ) {

          continue;

        }


        const messaging =
          Array.isArray(
            entry.messaging
          )
            ? entry.messaging
            : [];


        for (
          const event
          of messaging
        ) {

          if (
            isManagedPageEvent(
              event
            )
          ) {

            continue;

          }


          if (
            event.read ||
            event.delivery
          ) {

            continue;

          }


          const senderId =
            String(
              event?.sender?.id ||
              ""
            ).trim();


          if (
            !senderId
          ) {

            continue;

          }


          const message =
            event?.message;


          if (
            !message
          ) {

            continue;

          }


          if (
            message.reaction
          ) {

            continue;

          }


          if (
            message.is_echo ===
            true
          ) {

            continue;

          }


          const messageId =
            String(
              message.mid ||
              message.id ||
              ""
            ).trim();


          if (
            messageId
          ) {

            const outgoingKey =
              `${page.key}:${messageId}`;


            if (
              outgoingMessages.has(
                outgoingKey
              )
            ) {

              continue;

            }


            if (
              processedMessageIds.has(
                outgoingKey
              )
            ) {

              continue;

            }


            processedMessageIds.set(
              outgoingKey,
              Date.now()
            );


            if (
              processedMessageIds.size >
              10000
            ) {

              const oldest =
                processedMessageIds
                  .entries()
                  .next()
                  .value;


              if (
                oldest
              ) {

                processedMessageIds.delete(
                  oldest[0]
                );

              }

            }

          }


          const clientMessage =
            String(
              message.text ||
              ""
            ).trim();


          const attachments =
            Array.isArray(
              message.attachments
            )
              ? message.attachments
              : [];


          const attachmentInfo =
            attachments.length
              ? attachments
                  .map(
                    attachment => {

                      const type =
                        attachment?.type ||
                        "unknown";


                      const url =
                        attachment?.payload?.url ||
                        "";


                      return `${type}:${url}`;

                    }
                  )
                  .join(
                    " | "
                  )
              : null;


          if (
            !clientMessage &&
            !attachmentInfo
          ) {

            continue;

          }


          const conversation =
            await getConversation(
              senderId
            );


          conversation.pageKey =
            page.key;


          if (
            !conversation.clientUsername
          ) {

            const username =
              await getInstagramUsername(
                page,
                senderId
              );


            if (
              username
            ) {

              conversation.clientUsername =
                username;


              conversation.promotionUsernameReceived =
                true;


              await saveConversation(
                senderId,
                conversation
              );

            }

          }


          enqueueClientMessage(
            page,
            senderId,
            clientMessage,
            attachmentInfo
          );

        }

      }

    }

    catch (
      error
    ) {

      console.error(
        "WEBHOOK ERROR:",
        error.message
      );

    }

  }
);
/* =========================================================
   ADMIN AUTHENTICATION
========================================================= */

function isAdminAuthorized(
  req
) {

  if (
    !ADMIN_SECRET
  ) {

    return false;

  }


  const provided =
    req.headers[
      "x-admin-secret"
    ] ||
    req.query.secret ||
    req.body?.secret;


  return (
    String(
      provided ||
      ""
    ) ===
    String(
      ADMIN_SECRET
    )
  );

}


function requireAdmin(
  req,
  res,
  next
) {

  if (
    !isAdminAuthorized(
      req
    )
  ) {

    return res
      .status(
        401
      )
      .json({

        success:
          false,

        error:
          "Unauthorized"

      });

  }


  next();

}


/* =========================================================
   ADMIN CLIENT DATA
========================================================= */

function normalizeAdminHistory(
  history
) {

  if (
    !Array.isArray(
      history
    )
  ) {

    return [];

  }


  return history.map(
    item => ({

      role:
        item?.role ===
        "client"
          ? "client"
          : "assistant",

      text:
        String(
          item?.text ||
          "[media]"
        ),

      timestamp:
        item?.timestamp ||
        null

    })
  );

}


function buildAdminClient(
  senderId,
  conversation
) {

  return {

    senderId:
      String(
        senderId
      ),

    username:
      conversation.clientUsername ||
      null,

    page:
      conversation.pageKey ||
      null,

    stage:
      conversation.stage ||
      "NEW",

    messageOneSent:
      Boolean(
        conversation.messageOneSent
      ),

    messageTwoSent:
      Boolean(
        conversation.messageTwoSent
      ),

    packagesSent:
      Boolean(
        conversation.packagesSent
      ),

    selectedPackage:
      conversation.selectedPackage ||
      null,

    paymentMethod:
      conversation.paymentMethod ||
      null,

    paymentConfirmed:
      Boolean(
        conversation.paymentConfirmed
      ),

    paymentProofReceived:
      Boolean(
        conversation.paymentProofReceived
      ),

    promotionMediaReceived:
      Boolean(
        conversation.promotionMediaReceived
      ),

    promotionUsernameReceived:
      Boolean(
        conversation.promotionUsernameReceived ||
        conversation.clientUsername
      ),

    promotionComplete:
      Boolean(
        conversation.promotionComplete
      ),

    reminder:
      conversation.reminder ||
      null,

    messages:
      Array.isArray(
        conversation.history
      )
        ? conversation.history.length
        : 0,

    history:
      normalizeAdminHistory(
        conversation.history
      ),

    lastOutgoingText:
      conversation.lastOutgoingText ||
      null,

    lastOutgoingMessageId:
      conversation.lastOutgoingMessageId ||
      null,

    lastOutgoingAt:
      conversation.lastOutgoingAt ||
      null,

    lastCustomerMessageAt:
      conversation.lastCustomerMessageAt ||
      null

  };

}


/* =========================================================
   ADMIN CLIENT LIST
========================================================= */

async function getAdminClients() {

  const rows =
    await supabaseGetAllConversations();


  const clients =
    [];


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


    const stored =
      row?.messages;


    if (
      !stored ||
      typeof stored !==
        "object" ||
      Array.isArray(
        stored
      )
    ) {

      continue;

    }


    stored.senderId =
      senderId;


    stored.history =
      normalizeAdminHistory(
        stored.history
      );


    conversations.set(
      senderId,
      stored
    );


    clients.push(
      buildAdminClient(
        senderId,
        stored
      )
    );

  }


  clients.sort(
    (
      a,
      b
    ) => {

      const aTime =
        new Date(
          a.lastCustomerMessageAt ||
          a.lastOutgoingAt ||
          0
        ).getTime();


      const bTime =
        new Date(
          b.lastCustomerMessageAt ||
          b.lastOutgoingAt ||
          0
        ).getTime();


      return (
        bTime -
        aTime
      );

    }
  );


  return clients;

}


/* =========================================================
   ADMIN CLIENTS API
========================================================= */

app.get(
  "/admin/clients",
  requireAdmin,
  async (
    req,
    res
  ) => {

    try {

      const clients =
        await getAdminClients();


      return res.json({

        success:
          true,

        clients

      });

    }

    catch (
      error
    ) {

      console.error(
        "ADMIN CLIENTS ERROR:",
        error.message
      );


      return res
        .status(
          500
        )
        .json({

          success:
            false,

          error:
            error.message

        });

    }

  }
);


/* =========================================================
   ADMIN SINGLE CLIENT
========================================================= */

app.get(
  "/admin/client/:senderId",
  requireAdmin,
  async (
    req,
    res
  ) => {

    try {

      const senderId =
        String(
          req.params.senderId ||
          ""
        ).trim();


      if (
        !senderId
      ) {

        return res
          .status(
            400
          )
          .json({

            success:
              false,

            error:
              "Missing senderId"

          });

      }


      const conversation =
        await getConversation(
          senderId
        );


      return res.json({

        success:
          true,

        client:
          buildAdminClient(
            senderId,
            conversation
          )

      });

    }

    catch (
      error
    ) {

      console.error(
        "ADMIN CLIENT ERROR:",
        error.message
      );


      return res
        .status(
          500
        )
        .json({

          success:
            false,

          error:
            error.message

        });

    }

  }
);


/* =========================================================
   ADMIN REPLY
========================================================= */

app.post(
  "/admin/reply",
  requireAdmin,
  async (
    req,
    res
  ) => {

    try {

      const senderId =
        String(
          req.body?.senderId ||
          ""
        ).trim();


      const message =
        String(
          req.body?.message ||
          ""
        ).trim();


      const requestedPage =
        req.body?.pageKey ||
        null;


      if (
        !senderId
      ) {

        return res
          .status(
            400
          )
          .json({

            success:
              false,

            error:
              "senderId is required"

          });

      }


      if (
        !message
      ) {

        return res
          .status(
            400
          )
          .json({

            success:
              false,

            error:
              "message is required"

          });

      }


      const conversation =
        await getConversation(
          senderId
        );


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

        return res
          .status(
            400
          )
          .json({

            success:
              false,

            error:
              "Client page is missing or invalid."

          });

      }


      /*
         ADMIN REPLY HAS PRIORITY.

         Cancel:
         - pending reminder
         - pending automatic AI reply
      */

      invalidatePendingAI(
        senderId
      );


      const data =
        await sendInstagramMessage(
          page,
          senderId,
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


      conversation.pageKey =
        page.key;


      saveMessage(
        conversation,
        "assistant",
        message
      );


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
        senderId,
        conversation
      );


      return res.json({

        success:
          true,

        messageId:
          messageId,

        senderId:
          senderId,

        username:
          conversation.clientUsername ||
          null,

        page:
          page.username

      });

    }

    catch (
      error
    ) {

      console.error(
        "ADMIN REPLY ERROR:",
        error.message
      );


      return res
        .status(
          500
        )
        .json({

          success:
            false,

          error:
            error.message

        });

    }

  }
);


/* =========================================================
   ADMIN RESET CLIENT
========================================================= */

app.post(
  "/admin/reset/:senderId",
  requireAdmin,
  async (
    req,
    res
  ) => {

    try {

      const senderId =
        String(
          req.params.senderId ||
          ""
        ).trim();


      if (
        !senderId
      ) {

        return res
          .status(
            400
          )
          .json({

            success:
              false,

            error:
              "Missing senderId"

          });

      }


      invalidatePendingAI(
        senderId
      );


      const conversation =
        createConversation(
          senderId
        );


      await saveConversation(
        senderId,
        conversation
      );


      return res.json({

        success:
          true,

        senderId:
          senderId

      });

    }

    catch (
      error
    ) {

      console.error(
        "ADMIN RESET ERROR:",
        error.message
      );


      return res
        .status(
          500
        )
        .json({

          success:
            false,

          error:
            error.message

        });

    }

  }
);
/* =========================================================
   ADMIN PAGE
========================================================= */

app.get(
  "/admin",
  (req, res) => {

    res.send(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Instagram Admin</title>

<style>

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #0f1115;
  color: #fff;
  font-family: Arial, sans-serif;
}

.header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #171a21;
  padding: 15px;
  border-bottom: 1px solid #292d36;
}

.header h2 {
  margin: 0 0 10px 0;
}

.login {
  display: flex;
  gap: 8px;
}

input,
textarea,
button {
  font-family: inherit;
}

input {
  flex: 1;
  background: #0c0e12;
  color: white;
  border: 1px solid #343945;
  border-radius: 8px;
  padding: 11px;
}

button {
  border: 0;
  border-radius: 8px;
  padding: 11px 15px;
  cursor: pointer;
  font-weight: bold;
}

.login button {
  background: #2196f3;
  color: white;
}

.layout {
  display: flex;
  height: calc(100vh - 116px);
}

.clients {
  width: 35%;
  min-width: 280px;
  overflow-y: auto;
  border-right: 1px solid #292d36;
  background: #14171d;
}

.client {
  padding: 14px;
  border-bottom: 1px solid #292d36;
  cursor: pointer;
}

.client:hover,
.client.active {
  background: #222631;
}

.client-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.client-stage {
  font-size: 12px;
  color: #9da5b4;
}

.client-time {
  font-size: 11px;
  color: #6f7785;
  margin-top: 5px;
}

.chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.chat-header {
  padding: 14px;
  background: #171a21;
  border-bottom: 1px solid #292d36;
}

.chat-header strong {
  display: block;
  margin-bottom: 5px;
}

.chat-header span {
  font-size: 12px;
  color: #9da5b4;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
}

.message {
  max-width: 80%;
  padding: 10px 12px;
  border-radius: 12px;
  margin-bottom: 10px;
  white-space: pre-wrap;
  word-break: break-word;
}

.message.client {
  background: #252a35;
  margin-right: auto;
}

.message.assistant {
  background: #075e54;
  margin-left: auto;
}

.message small {
  display: block;
  margin-top: 5px;
  opacity: .6;
  font-size: 10px;
}

.reply {
  padding: 12px;
  background: #171a21;
  border-top: 1px solid #292d36;
}

.reply textarea {
  width: 100%;
  min-height: 70px;
  resize: vertical;
  background: #0c0e12;
  color: white;
  border: 1px solid #343945;
  border-radius: 8px;
  padding: 10px;
}

.reply-buttons {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.send {
  background: #2196f3;
  color: white;
}

.reset {
  background: #d32f2f;
  color: white;
}

.refresh {
  background: #444b59;
  color: white;
}

.empty {
  color: #777;
  text-align: center;
  padding: 30px 15px;
}

.status {
  font-size: 12px;
  margin-top: 8px;
  color: #9da5b4;
}

@media(max-width:700px) {

  .layout {
    height: calc(100vh - 145px);
  }

  .clients {
    width: 38%;
    min-width: 125px;
  }

  .message {
    max-width: 90%;
  }

}

</style>
</head>

<body>

<div class="header">

  <h2>Instagram Admin</h2>

  <div class="login">

    <input
      id="secret"
      type="password"
      placeholder="Admin Secret"
    >

    <button onclick="loadClients()">
      Login
    </button>

    <button
      class="refresh"
      onclick="loadClients()"
    >
      Refresh
    </button>

  </div>

  <div
    id="status"
    class="status"
  >
    Enter ADMIN_SECRET and press Login.
  </div>

</div>


<div class="layout">

  <div
    id="clients"
    class="clients"
  >

    <div class="empty">
      No clients loaded.
    </div>

  </div>


  <div class="chat">

    <div
      id="chatHeader"
      class="chat-header"
    >

      <strong>
        Select a client
      </strong>

      <span>
        No conversation selected
      </span>

    </div>


    <div
      id="messages"
      class="messages"
    >

      <div class="empty">
        Select a client to view conversation.
      </div>

    </div>


    <div class="reply">

      <textarea
        id="replyText"
        placeholder="Type your reply..."
      ></textarea>

      <div class="reply-buttons">

        <button
          class="send"
          onclick="sendReply()"
        >
          Send Reply
        </button>

        <button
          class="reset"
          onclick="resetClient()"
        >
          Reset Client
        </button>

      </div>

    </div>

  </div>

</div>


<script>

let adminSecret = "";
let clients = [];
let selectedClient = null;


/* =========================================================
   HELPERS
========================================================= */

function setStatus(text) {

  document.getElementById(
    "status"
  ).textContent = text;

}


function escapeHtml(value) {

  return String(
    value || ""
  )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}


function formatTime(value) {

  if (!value) {
    return "";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  return date.toLocaleString();

}


/* =========================================================
   LOAD CLIENTS
========================================================= */

async function loadClients() {

  const secretInput =
    document.getElementById(
      "secret"
    );

  if (
    secretInput.value.trim()
  ) {

    adminSecret =
      secretInput.value.trim();

    localStorage.setItem(
      "adminSecret",
      adminSecret
    );

  }

  if (!adminSecret) {

    adminSecret =
      localStorage.getItem(
        "adminSecret"
      ) ||
      "";

  }

  if (!adminSecret) {

    setStatus(
      "Enter ADMIN_SECRET first."
    );

    return;

  }


  setStatus(
    "Loading clients..."
  );


  try {

    const response =
      await fetch(
        "/admin/clients?secret=" +
        encodeURIComponent(
          adminSecret
        )
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.error ||
        "Unable to load clients"
      );

    }


    clients =
      Array.isArray(
        data.clients
      )
        ? data.clients
        : [];


    renderClients();


    setStatus(
      clients.length +
      " client(s) loaded."
    );


    if (
      selectedClient
    ) {

      const updated =
        clients.find(
          client =>
            client.senderId ===
            selectedClient.senderId
        );


      if (updated) {

        selectedClient =
          updated;

        renderConversation();

      }

    }

  }

  catch (
    error
  ) {

    console.error(
      error
    );

    setStatus(
      "ERROR: " +
      error.message
    );

  }

}


/* =========================================================
   RENDER CLIENTS
========================================================= */

function renderClients() {

  const container =
    document.getElementById(
      "clients"
    );


  if (!clients.length) {

    container.innerHTML =
      '<div class="empty">No clients found.</div>';

    return;

  }


  container.innerHTML =
    clients
      .map(
        client => {

          const name =
            client.username ||
            client.senderId;


          const active =
            selectedClient &&
            selectedClient.senderId ===
            client.senderId
              ? "active"
              : "";


          return (

            '<div class="client ' +
            active +
            '" onclick="selectClient(\\'' +
            escapeHtml(
              client.senderId
            ) +
            '\\')">' +

              '<div class="client-name">' +
                escapeHtml(
                  name
                ) +
              '</div>' +

              '<div class="client-stage">' +
                escapeHtml(
                  client.stage ||
                  "NEW"
                ) +
              '</div>' +

              '<div class="client-time">' +
                escapeHtml(
                  formatTime(
                    client.lastCustomerMessageAt
                  )
                ) +
              '</div>' +

            '</div>'

          );

        }
      )
      .join("");

}


/* =========================================================
   SELECT CLIENT
========================================================= */

function selectClient(
  senderId
) {

  selectedClient =
    clients.find(
      client =>
        client.senderId ===
        senderId
    ) ||
    null;


  renderClients();
  renderConversation();

}


/* =========================================================
   RENDER CONVERSATION
========================================================= */

function renderConversation() {

  const header =
    document.getElementById(
      "chatHeader"
    );

  const messages =
    document.getElementById(
      "messages"
    );


  if (
    !selectedClient
  ) {

    header.innerHTML =
      "<strong>Select a client</strong>" +
      "<span>No conversation selected</span>";


    messages.innerHTML =
      '<div class="empty">' +
      "Select a client to view conversation." +
      "</div>";

    return;

  }


  const name =
    selectedClient.username ||
    selectedClient.senderId;


  header.innerHTML =
    "<strong>" +
      escapeHtml(
        name
      ) +
    "</strong>" +

    "<span>" +
      escapeHtml(
        "Page: " +
        (
          selectedClient.page ||
          "unknown"
        ) +
        " | Stage: " +
        (
          selectedClient.stage ||
          "NEW"
        )
      ) +
    "</span>";


  const history =
    Array.isArray(
      selectedClient.history
    )
      ? selectedClient.history
      : [];


  if (!history.length) {

    messages.innerHTML =
      '<div class="empty">' +
      "No messages yet." +
      "</div>";

    return;

  }


  messages.innerHTML =
    history
      .map(
        item => {

          const role =
            item.role ===
            "client"
              ? "client"
              : "assistant";


          return (

            '<div class="message ' +
            role +
            '">' +

              escapeHtml(
                item.text
              ) +

              (
                item.timestamp
                  ? (
                    '<small>' +
                    escapeHtml(
                      formatTime(
                        item.timestamp
                      )
                    ) +
                    "</small>"
                  )
                  : ""
              ) +

            "</div>"

          );

        }
      )
      .join("");


  messages.scrollTop =
    messages.scrollHeight;

}


/* =========================================================
   SEND ADMIN REPLY
========================================================= */

async function sendReply() {

  if (
    !selectedClient
  ) {

    alert(
      "Please select a client first."
    );

    return;

  }


  const textarea =
    document.getElementById(
      "replyText"
    );


  const message =
    textarea.value.trim();


  if (!message) {

    return;

  }


  if (!adminSecret) {

    alert(
      "Admin secret is missing."
    );

    return;

  }


  setStatus(
    "Sending reply..."
  );


  try {

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
              adminSecret

          },

          body:
            JSON.stringify({

              senderId:
                selectedClient.senderId,

              pageKey:
                selectedClient.page,

              message:
                message

            })

        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.error ||
        "Reply failed"
      );

    }


    textarea.value =
      "";


    setStatus(
      "Reply sent successfully."
    );


    await loadClients();


    const updated =
      clients.find(
        client =>
          client.senderId ===
          selectedClient.senderId
      );


    if (updated) {

      selectedClient =
        updated;

      renderClients();
      renderConversation();

    }

  }

  catch (
    error
  ) {

    console.error(
      error
    );


    setStatus(
      "ERROR: " +
      error.message
    );

  }

}


/* =========================================================
   RESET CLIENT
========================================================= */

async function resetClient() {

  if (
    !selectedClient
  ) {

    alert(
      "Please select a client first."
    );

    return;

  }


  const confirmed =
    confirm(
      "Reset this client's conversation?"
    );


  if (!confirmed) {

    return;

  }


  try {

    const response =
      await fetch(
        "/admin/reset/" +
        encodeURIComponent(
          selectedClient.senderId
        ) +
        "?secret=" +
        encodeURIComponent(
          adminSecret
        ),
        {

          method:
            "POST"

        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.error ||
        "Reset failed"
      );

    }


    setStatus(
      "Client conversation reset."
    );


    selectedClient =
      null;


    await loadClients();

    renderConversation();

  }

  catch (
    error
  ) {

    setStatus(
      "ERROR: " +
      error.message
    );

  }

}


/* =========================================================
   AUTO LOAD SAVED SECRET
========================================================= */

(function () {

  const saved =
    localStorage.getItem(
      "adminSecret"
    );


  if (saved) {

    adminSecret =
      saved;


    document.getElementById(
      "secret"
    ).value =
      saved;

  }

})();


/* =========================================================
   ENTER KEY
========================================================= */

document
  .getElementById(
    "replyText"
  )
  .addEventListener(
    "keydown",
    function(event) {

      if (
        event.key ===
        "Enter" &&
        event.ctrlKey
      ) {

        event.preventDefault();

        sendReply();

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
   HEALTH CHECK
========================================================= */

app.get(
  "/",
  (
    req,
    res
  ) => {

    res.json({

      success:
        true,

      service:
        BUSINESS_NAME,

      status:
        "online",

      time:
        nowISO()

    });

  }
);


/* =========================================================
   ADMIN HEALTH
========================================================= */

app.get(
  "/admin/health",
  requireAdmin,
  async (
    req,
    res
  ) => {

    const rows =
      await supabaseGetAllConversations();


    return res.json({

      success:
        true,

      status:
        "online",

      database:
        supabaseConfigured()
          ? "configured"
          : "not configured",

      conversations:
        rows.length,

      pages:
        Object.keys(
          PAGE_CONFIGS
        ),

      ai:
        Boolean(
          OPEN_AI
        ),

      time:
        nowISO()

    });

  }
);


/* =========================================================
   START SERVER
========================================================= */

async function startServer() {

  try {

    await hydrateAdminConversations();

    await restorePendingReminders();

  }

  catch (
    error
  ) {

    console.error(
      "STARTUP RESTORE ERROR:",
      error.message
    );

  }


  app.listen(
    PORT,
    () => {

      console.log(
        `${BUSINESS_NAME} server running on port ${PORT}`
      );


      console.log(
        "Instagram pages:",
        Object.values(
          PAGE_CONFIGS
        )
          .map(
            page =>
              page.username
          )
          .join(
            ", "
          )
      );


      console.log(
        "Supabase:",
        supabaseConfigured()
          ? "configured"
          : "NOT CONFIGURED"
      );


      console.log(
        "OpenAI:",
        OPEN_AI
          ? "configured"
          : "NOT CONFIGURED"
      );

    }
  );

}


startServer();
