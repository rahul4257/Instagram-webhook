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
   CONTINUED — MESSAGE HISTORY
========================================================= */

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


    return (
      data[0]?.messages ||
      null
    );

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


    /* MESSAGE 3 / PACKAGES
       IS ALSO LOCKED */

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


  await saveConversation(
    senderId,
    conversation
  );


  return true;

}
/* =========================================================
   CONTINUED — DETECTION HELPERS
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
   CONTINUED — PROCESS USERNAME + MEDIA
========================================================= */

async function processUsernameAndMedia(
  senderId,
  conversation,
  text,
  attachmentInfo
) {

  let changed =
    false;


  if (
    text
  ) {

    const username =
      extractInstagramUsername(
        text
      );


    if (
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

  }


  if (
    hasMedia(
      attachmentInfo
    )
  ) {

    conversation.promotionMediaReceived =
      true;

    changed =
      true;

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
   PAYMENT DETAILS
========================================================= */

function getPaymentDetails(
  paymentMethod
) {

  if (
    !paymentMethod
  ) {

    return null;

  }


  const details = {

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


  return (
    details[
      paymentMethod
    ] ||
    null
  );

}


/* =========================================================
   PAGE-SPECIFIC PAYMENT DETAILS
========================================================= */

function getPagePaymentDetails(
  page,
  method
) {

  if (
    !page ||
    !method
  ) {

    return null;

  }


  const available =
    paymentMethodAvailable(
      page,
      method
    );


  if (
    !available
  ) {

    return null;

  }


  return getPaymentDetails(
    method
  );

}


/* =========================================================
   PACKAGE TIMEFRAME
========================================================= */

function getPackageTimeframe(
  packageKey
) {

  if (
    packageKey ===
    "gold"
  ) {

    return "3 days";

  }


  return "48 hours";

}


/* =========================================================
   GUARANTEE MESSAGE
========================================================= */

function buildGuaranteeMessage(
  page,
  packageKey
) {

  const selected =
    page?.packages?.[
      packageKey
    ];


  const timeframe =
    getPackageTimeframe(
      packageKey
    );


  if (
    selected
  ) {

    return `
Yes ❤️ The ${selected.name} package is guaranteed.

We will continue promoting your content until you receive the guaranteed followers included in your package.

Expected timeframe:
${timeframe}

If the guaranteed followers are not reached according to the guarantee policy, the eligible amount can be refunded. ❤️`;

  }


  return `
Yes ❤️ Our followers are guaranteed.

We continue the promotion until the guaranteed followers included in your selected package are reached.

Gold package timeframe: 3 days.
Other packages: 48 hours.

If the guaranteed followers are not reached according to the guarantee policy, the eligible amount can be refunded. ❤️`;

}


/* =========================================================
   LOCATION RESPONSE
========================================================= */

function buildLocationResponse(
  page
) {

  if (
    !page
  ) {

    return null;

  }


  if (
    page.key ===
    "europe"
  ) {

    return `
Yes dear ❤️ Our @expl.europe promotion is focused on Europe and European audiences.`;

  }


  if (
    page.key ===
    "canada"
  ) {

    return `
Yes dear ❤️ @expl.canada is focused on Canadian audiences.`;

  }


  if (
    page.key ===
    "miami"
  ) {

    return `
Yes dear ❤️ @expl.miami is focused on Miami and the Miami audience.`;

  }


  if (
    page.key ===
    "mentalxheal"
  ) {

    return `
Yes dear ❤️ @mentalxheal is focused on mental-health related audiences and content.`;

  }


  return null;

}


/* =========================================================
   LOCATION QUESTION DETECTION
========================================================= */

function isLocationQuestion(
  text
) {

  const t =
    normalize(
      text
    );


  return (
    /\bwhere\b/.test(t) ||
    /\blocation\b/.test(t) ||
    /\bwhich country\b/.test(t) ||
    /\bwhat country\b/.test(t) ||
    /\bwhat city\b/.test(t) ||
    /\bwhich city\b/.test(t) ||
    /\bfrom portugal\b/.test(t) ||
    /\bin portugal\b/.test(t) ||
    /\bin canada\b/.test(t) ||
    /\bin miami\b/.test(t) ||
    /\bin europe\b/.test(t)
  );

}


/* =========================================================
   PAYMENT QUESTION DETECTION
========================================================= */

function isPaymentQuestion(
  text
) {

  const t =
    normalize(
      text
    );


  return (
    /\bhow can i pay\b/.test(t) ||
    /\bhow do i pay\b/.test(t) ||
    /\bpayment\b/.test(t) ||
    /\bpay\b/.test(t) ||
    /\bpaying\b/.test(t) ||
    /\bpayment method\b/.test(t) ||
    /\bpayment methods\b/.test(t)
  );

}


/* =========================================================
   PACKAGE QUESTION DETECTION
========================================================= */

function isPackageQuestion(
  text
) {

  const t =
    normalize(
      text
    );


  return (
    /\bpackage\b/.test(t) ||
    /\bpackages\b/.test(t) ||
    /\bprice\b/.test(t) ||
    /\bprices\b/.test(t) ||
    /\bhow much\b/.test(t) ||
    /\bcost\b/.test(t) ||
    /\brate\b/.test(t)
  );

}


/* =========================================================
   PAYMENT METHOD FOLLOW-UP
   This is used after the 2-minute payment follow-up.
========================================================= */

function buildPaymentMethodQuestion(
  page
) {

  if (
    !page
  ) {

    return null;

  }


  return `
Sure ❤️ Which payment method do you have?

${page.paymentMethods.join(
  "\n"
)}`;

}


/* =========================================================
   PAYMENT DETAILS MESSAGE
========================================================= */

function buildPagePaymentMessage(
  page,
  conversation
) {

  if (
    !page ||
    !conversation.selectedPackage ||
    !conversation.paymentMethod
  ) {

    return null;

  }


  const selected =
    page.packages[
      conversation.selectedPackage
    ];


  const details =
    getPagePaymentDetails(
      page,
      conversation.paymentMethod
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

Price:
${page.currency}${selected.price}

Payment method:
${conversation.paymentMethod}

Payment details:

${details}

After successful payment, please send us the payment screenshot ❤️`;

}


/* =========================================================
   PAYMENT METHOD SAVING
========================================================= */

async function savePaymentMethod(
  senderId,
  conversation,
  page,
  method
) {

  if (
    !page ||
    !method
  ) {

    return false;

  }


  if (
    !paymentMethodAvailable(
      page,
      method
    )
  ) {

    return false;

  }


  conversation.paymentMethod =
    method;


  conversation.paymentDetailsSent =
    false;


  conversation.awaitingPaymentConfirmation =
    true;


  conversation.stage =
    "PAYMENT_PENDING";


  await saveConversation(
    senderId,
    conversation
  );


  return true;

}


/* =========================================================
   PACKAGE SELECTION
========================================================= */

async function savePackageSelection(
  senderId,
  conversation,
  page,
  packageKey
) {

  if (
    !page ||
    !packageKey ||
    !page.packages?.[
      packageKey
    ]
  ) {

    return false;

  }


  conversation.selectedPackage =
    packageKey;


  conversation.paymentMethod =
    null;


  conversation.paymentDetailsSent =
    false;


  conversation.paymentConfirmed =
    false;


  conversation.paymentProofReceived =
    false;


  conversation.awaitingPaymentConfirmation =
    true;


  conversation.stage =
    "PACKAGE_SELECTED";


  await saveConversation(
    senderId,
    conversation
  );


  return true;

}


/* =========================================================
   PAYMENT PROOF
========================================================= */

async function processPaymentProof(
  senderId,
  conversation,
  attachmentInfo
) {

  if (
    !hasMedia(
      attachmentInfo
    )
  ) {

    return false;

  }


  if (
    !conversation.selectedPackage
  ) {

    return false;

  }


  conversation.paymentProofReceived =
    true;


  conversation.paymentConfirmed =
    false;


  conversation.awaitingPaymentConfirmation =
    true;


  conversation.stage =
    "PAYMENT_PROOF_RECEIVED";


  await saveConversation(
    senderId,
    conversation
  );


  return true;

}


/* =========================================================
   PAYMENT CONFIRMATION
========================================================= */

async function markPaymentConfirmed(
  senderId,
  conversation
) {

  conversation.paymentConfirmed =
    true;


  conversation.awaitingPaymentConfirmation =
    false;


  updatePromotionComplete(
    conversation
  );


  if (
    !conversation.promotionComplete
  ) {

    conversation.stage =
      "PAYMENT_CONFIRMED";

  }


  await saveConversation(
    senderId,
    conversation
  );


  return true;

}


/* =========================================================
   LOCKED MESSAGE STATE
========================================================= */

function getLockedState(
  conversation
) {

  return {

    messageOneSent:
      Boolean(
        conversation.messageOneSent
      ),

    messageTwoSent:
      Boolean(
        conversation.messageTwoSent
      ),

    messageThreeSent:
      Boolean(
        conversation.packagesSent
      )

  };

}


/* =========================================================
   LOCKED MESSAGE 3 CHECK
========================================================= */

function messageThreeAlreadySent(
  conversation
) {

  return Boolean(
    conversation.packagesSent
  );

}


/* =========================================================
   LOCKED MESSAGE 2 CHECK
========================================================= */

function messageTwoAlreadySent(
  conversation
) {

  return Boolean(
    conversation.messageTwoSent
  );

}


/* =========================================================
   LOCKED MESSAGE 1 CHECK
========================================================= */

function messageOneAlreadySent(
  conversation
) {

  return Boolean(
    conversation.messageOneSent
  );

}
/* =========================================================
   ADMIN CLIENT LIST — CONTINUED
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


    const conversation =
      row?.messages;


    if (
      !conversation ||
      typeof conversation !==
        "object"
    ) {

      continue;

    }


    clients.push(
      buildAdminClient(
        senderId,
        conversation
      )
    );

  }


  return clients;

}


/* =========================================================
   ADMIN — GET CLIENTS
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
   ADMIN — GET SINGLE CLIENT
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


      if (
        !conversation
      ) {

        return res
          .status(
            404
          )
          .json({

            success:
              false,

            error:
              "Conversation not found"

          });

      }


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
        "ADMIN SINGLE CLIENT ERROR:",
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
   ADMIN — SEND MANUAL REPLY
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


      const text =
        String(
          req.body?.text ||
          ""
        ).trim();


      const requestedPageKey =
        String(
          req.body?.pageKey ||
          ""
        ).trim()
        .toLowerCase();


      if (
        !senderId ||
        !text
      ) {

        return res
          .status(
            400
          )
          .json({

            success:
              false,

            error:
              "senderId and text are required"

          });

      }


      const conversation =
        await getConversation(
          senderId
        );


      if (
        !conversation
      ) {

        return res
          .status(
            404
          )
          .json({

            success:
              false,

            error:
              "Conversation not found"

          });

      }


      const page =
        PAGE_CONFIGS[
          requestedPageKey ||
          conversation.pageKey
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
              "Page not found"

          });

      }


      conversation.pageKey =
        page.key;


      /*
         IMPORTANT:

         A manual reply invalidates any AI reply that
         was waiting to be sent.

         This prevents the AI from sending an old/
         irrelevant response after the admin has replied.
      */

      invalidatePendingAI(
        senderId
      );


      /*
         =====================================================
         RECOGNIZE MANUALLY SENT LOCKED MESSAGES
         =====================================================

         Message 1:
         If admin manually sends the exact Message 1,
         mark it as sent.

         Message 2:
         If admin manually sends Message 2, mark it as sent.

         Message 3:
         If admin manually sends the package list,
         mark packagesSent = true.

         Therefore the automatic bot will NOT send the
         same locked message again.
      */


      const normalizedManual =
        normalize(
          text
        );


      const normalizedMessageOne =
        normalize(
          MESSAGE_ONE
        );


      const normalizedMessageTwo =
        normalize(
          MESSAGE_TWO
        );


      if (
        normalizedManual ===
        normalizedMessageOne
      ) {

        conversation.messageOneSent =
          true;


        if (
          conversation.stage ===
          "NEW"
        ) {

          conversation.stage =
            "MESSAGE_ONE_SENT";

        }

      }


      if (
        normalizedManual ===
        normalizedMessageTwo
      ) {

        conversation.messageOneSent =
          true;

        conversation.messageTwoSent =
          true;


        conversation.stage =
          "MESSAGE_TWO_SENT";

      }


      /*
         PAGE-SPECIFIC PACKAGE MESSAGE

         This is the important Message 3 lock.
      */

      const packagesMessage =
        buildPackagesMessage(
          page
        );


      const normalizedPackages =
        normalize(
          packagesMessage
        );


      if (
        normalizedManual ===
        normalizedPackages
      ) {

        conversation.messageOneSent =
          true;

        conversation.messageTwoSent =
          true;

        conversation.packagesSent =
          true;


        conversation.stage =
          "PACKAGES_SHOWN";

      }


      /*
         Also recognize a manually sent package message
         even if spacing/line breaks differ.
      */

      if (
        normalizedPackages &&
        normalizedManual.length >
        40
      ) {

        const packageIndicators = [

          "bronze package",

          "silver package",

          "gold package",

          "diamond package"

        ];


        const indicatorCount =
          packageIndicators.filter(
            indicator =>
              normalizedManual.includes(
                indicator
              )
          ).length;


        if (
          indicatorCount >=
          3
        ) {

          conversation.messageOneSent =
            true;

          conversation.messageTwoSent =
            true;

          conversation.packagesSent =
            true;


          conversation.stage =
            "PACKAGES_SHOWN";

        }

      }


      /*
         =====================================================
         MANUAL PACKAGE SELECTION
         =====================================================
      */

      const manualPackage =
        detectPackage(
          text
        );


      if (
        manualPackage &&
        conversation.packagesSent
      ) {

        conversation.selectedPackage =
          manualPackage;


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

      }


      /*
         =====================================================
         MANUAL PAYMENT METHOD
         =====================================================
      */

      const manualPaymentMethod =
        detectPaymentMethod(
          text
        );


      if (
        manualPaymentMethod &&
        conversation.selectedPackage
      ) {

        if (
          paymentMethodAvailable(
            page,
            manualPaymentMethod
          )
        ) {

          conversation.paymentMethod =
            manualPaymentMethod;


          conversation.stage =
            "PAYMENT_PENDING";


          conversation.paymentDetailsSent =
            false;


          conversation.awaitingPaymentConfirmation =
            true;

        }

      }


      /*
         =====================================================
         MANUAL PAYMENT CONFIRMATION
         =====================================================
      */

      if (
        isSimplePaymentConfirmation(
          text
        ) &&
        conversation.paymentDetailsSent
      ) {

        conversation.paymentConfirmed =
          true;


        conversation.awaitingPaymentConfirmation =
          false;


        conversation.stage =
          "PAYMENT_CONFIRMED";


        cancelReminder(
          senderId
        );

      }


      saveMessage(
        conversation,
        "assistant",
        text
      );


      conversation.lastOutgoingText =
        text;


      conversation.lastOutgoingAt =
        nowISO();


      conversation.lastOutgoingStage =
        conversation.stage;


      await saveConversation(
        senderId,
        conversation
      );


      /*
         Try to send the manual message through
         the selected page.
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

        conversation.lastOutgoingMessageId =
          String(
            messageId
          );


        outgoingMessages.add(
          `${page.key}:${String(
            messageId
          )}`
        );

      }


      await saveConversation(
        senderId,
        conversation
      );


      /*
         If payment has already been confirmed,
         continue the promotion flow.
      */

      if (
        conversation.paymentConfirmed
      ) {

        await sendPromotionNextStep(
          page,
          senderId,
          conversation
        );

      }


      return res.json({

        success:
          true,

        messageId:
          messageId
            ? String(
                messageId
              )
            : null,

        stage:
          conversation.stage,

        messageOneSent:
          conversation.messageOneSent,

        messageTwoSent:
          conversation.messageTwoSent,

        packagesSent:
          conversation.packagesSent,

        selectedPackage:
          conversation.selectedPackage,

        paymentMethod:
          conversation.paymentMethod

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
   ADMIN — RESET CLIENT
========================================================= */

app.post(
  "/admin/reset",
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


      cancelReminder(
        senderId
      );


      invalidatePendingAI(
        senderId
      );


      const conversation =
        createConversation(
          senderId
        );


      conversations.set(
        senderId,
        conversation
      );


      await saveConversation(
        senderId,
        conversation
      );


      return res.json({

        success:
          true,

        message:
          "Conversation reset"

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
   ADMIN — PAGE CONFIG
========================================================= */

app.get(
  "/admin/pages",
  requireAdmin,
  (
    req,
    res
  ) => {

    const pages =
      Object.values(
        PAGE_CONFIGS
      ).map(
        page => ({

          key:
            page.key,

          username:
            page.username,

          id:
            page.id,

          currency:
            page.currency,

          packages:
            page.packages,

          paymentMethods:
            page.paymentMethods

        })
      );


    return res.json({

      success:
        true,

      pages

    });

  }
);
/* =========================================================
   ADMIN UI — CONTINUED
========================================================= */

.chat-overlay.show {
  visibility: visible;
  opacity: 1;
}

.chat-sheet {
  width: 100%;
  max-width: 850px;
  margin: auto;

  background: #fff;

  border-radius:
    18px 18px 0 0;

  max-height: 88vh;

  display: flex;
  flex-direction: column;

  transform:
    translateY(100%);

  transition:
    transform .22s ease;
}

.chat-overlay.show
.chat-sheet {
  transform:
    translateY(0);
}


/* =========================================================
   CHAT HEADER
========================================================= */

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 13px 14px;

  border-bottom:
    1px solid #eee;
}

.chat-header-left {
  min-width: 0;
}

.chat-header-name {
  font-size: 17px;
  font-weight: 700;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-header-info {
  margin-top: 3px;

  color: #777;

  font-size: 11px;
}

.close-chat {
  flex: 0 0 auto;

  width: 36px;
  height: 36px;

  border: 0;
  border-radius: 50%;

  background: #eee;

  font-size: 18px;
}


/* =========================================================
   CHAT MESSAGES
========================================================= */

.chat-messages {
  flex: 1;

  overflow-y: auto;

  padding: 14px;

  background: #f5f5f7;

  -webkit-overflow-scrolling:
    touch;
}

.chat-message {
  display: flex;

  margin-bottom: 8px;
}

.chat-message.client {
  justify-content: flex-start;
}

.chat-message.assistant {
  justify-content: flex-end;
}

.chat-bubble {
  max-width: 82%;

  padding: 10px 12px;

  border-radius: 14px;

  font-size: 14px;

  line-height: 1.45;

  white-space: pre-wrap;

  word-break: break-word;
}

.chat-message.client
.chat-bubble {
  background: #fff;

  border:
    1px solid #e2e2e2;

  border-bottom-left-radius:
    4px;
}

.chat-message.assistant
.chat-bubble {
  background: #1683ff;

  color: #fff;

  border-bottom-right-radius:
    4px;
}

.chat-time {
  display: block;

  margin-top: 4px;

  font-size: 9px;

  opacity: .6;
}


/* =========================================================
   CHAT FOOTER
========================================================= */

.chat-footer {
  padding: 10px;

  border-top:
    1px solid #eee;

  background: #fff;
}

.chat-reply-row {
  display: flex;

  gap: 8px;

  align-items: flex-end;
}

.chat-reply-row textarea {
  flex: 1;

  resize: none;

  min-height: 44px;
  max-height: 130px;

  margin: 0;
}

.chat-send {
  flex: 0 0 auto;

  border: 0;

  border-radius: 10px;

  background: #1683ff;

  color: #fff;

  padding: 12px 16px;

  font-size: 14px;

  font-weight: 600;
}


/* =========================================================
   MOBILE
========================================================= */

@media (
  max-width: 600px
) {

  .container {
    padding:
      8px;
  }

  .section {
    padding:
      12px;
  }

  .chat-sheet {
    max-height:
      92vh;
  }

  .chat-bubble {
    max-width:
      88%;
  }

}


/* =========================================================
   JAVASCRIPT
========================================================= */

const adminState = {

  secret:
    "",

  page:
    "all",

  search:
    "",

  clients:
    [],

  currentClient:
    null,

  currentScroll:
    0

};


/* =========================================================
   ADMIN ELEMENTS
========================================================= */

const loginSection =
  document.getElementById(
    "loginSection"
  );

const adminSection =
  document.getElementById(
    "adminSection"
  );

const secretInput =
  document.getElementById(
    "secretInput"
  );

const loginButton =
  document.getElementById(
    "loginButton"
  );

const loginStatus =
  document.getElementById(
    "loginStatus"
  );

const pageButtons =
  document.getElementById(
    "pageButtons"
  );

const searchInput =
  document.getElementById(
    "searchInput"
  );

const refreshButton =
  document.getElementById(
    "refreshButton"
  );

const clientsList =
  document.getElementById(
    "clientsList"
  );

const clientCount =
  document.getElementById(
    "clientCount"
  );

const chatOverlay =
  document.getElementById(
    "chatOverlay"
  );

const chatName =
  document.getElementById(
    "chatName"
  );

const chatInfo =
  document.getElementById(
    "chatInfo"
  );

const chatMessages =
  document.getElementById(
    "chatMessages"
  );

const chatInput =
  document.getElementById(
    "chatInput"
  );

const chatSend =
  document.getElementById(
    "chatSend"
  );

const closeChatButton =
  document.getElementById(
    "closeChat"
  );


/* =========================================================
   ADMIN REQUEST
========================================================= */

async function adminFetch(
  url,
  options = {}
) {

  const headers = {

    ...(options.headers || {}),

    "x-admin-secret":
      adminState.secret

  };


  const response =
    await fetch(
      url,
      {

        ...options,

        headers

      }
    );


  let data =
    null;


  try {

    data =
      await response.json();

  }

  catch (
    error
  ) {

    data =
      {};

  }


  if (
    !response.ok
  ) {

    throw new Error(
      data?.error ||
      `Request failed: ${response.status}`
    );

  }


  return data;

}


/* =========================================================
   LOGIN
========================================================= */

loginButton.onclick =
  async function () {

    const secret =
      secretInput.value.trim();


    if (
      !secret
    ) {

      loginStatus.textContent =
        "Enter admin secret.";

      return;

    }


    adminState.secret =
      secret;


    try {

      const data =
        await adminFetch(
          "/admin/clients"
        );


      if (
        !data.success
      ) {

        throw new Error(
          "Authentication failed"
        );

      }


      loginSection.style.display =
        "none";

      adminSection.style.display =
        "block";


      loginStatus.textContent =
        "";


      await loadClients();

    }

    catch (
      error
    ) {

      adminState.secret =
        "";

      loginStatus.textContent =
        error.message;

    }

  };


/* =========================================================
   PAGE FILTER
========================================================= */

function setPageFilter(
  page
) {

  adminState.page =
    page;


  document
    .querySelectorAll(
      ".page-button"
    )
    .forEach(
      button => {

        button.classList.toggle(
          "active",
          button.dataset.page ===
            page
        );

      }
    );


  renderClients();

}


/* =========================================================
   SEARCH
========================================================= */

searchInput.addEventListener(
  "input",
  function () {

    adminState.search =
      this.value
        .trim()
        .toLowerCase();


    renderClients();

  }
);


/* =========================================================
   LOAD CLIENTS
========================================================= */

async function loadClients() {

  try {

    const data =
      await adminFetch(
        "/admin/clients"
      );


    adminState.clients =
      Array.isArray(
        data.clients
      )
        ? data.clients
        : [];


    renderClients();

  }

  catch (
    error
  ) {

    clientsList.innerHTML =
      `<div class="empty">${escapeHtml(
        error.message
      )}</div>`;

  }

}


/* =========================================================
   FILTER CLIENTS
========================================================= */

function filteredClients() {

  const page =
    adminState.page;


  const search =
    adminState.search;


  return adminState.clients
    .filter(
      client => {

        if (
          page !==
          "all" &&
          client.page !==
          page
        ) {

          return false;

        }


        if (
          !search
        ) {

          return true;

        }


        const text =
          [
            client.username,
            client.senderId,
            client.page,
            client.stage,
            client.selectedPackage,
            client.paymentMethod
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();


        return text.includes(
          search
        );

      }
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(
  value
) {

  return String(
    value ??
    ""
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


/* =========================================================
   RENDER CLIENTS
========================================================= */

function renderClients() {

  const clients =
    filteredClients();


  clientCount.textContent =
    `${clients.length} client${
      clients.length === 1
        ? ""
        : "s"
    }`;


  if (
    !clients.length
  ) {

    clientsList.innerHTML =
      `<div class="empty">No clients found.</div>`;

    return;

  }


  clientsList.innerHTML =
    clients
      .map(
        client => {

          const name =
            client.username ||
            client.senderId ||
            "Unknown";


          const page =
            client.page ||
            "unknown";


          const stage =
            client.stage ||
            "NEW";


          const packageName =
            client.selectedPackage ||
            "—";


          const payment =
            client.paymentMethod ||
            "—";


          return `
<div class="client-card">

  <div class="client-name">
    ${escapeHtml(name)}
  </div>

  <div class="client-details">

    Page:
    ${escapeHtml(page)}

    <br>

    Stage:
    ${escapeHtml(stage)}

    <br>

    Package:
    ${escapeHtml(packageName)}

    <br>

    Payment:
    ${escapeHtml(payment)}

  </div>

  <button
    class="open-chat"
    onclick="openChat('${escapeHtml(
      client.senderId
    )}')"
  >
    Open Chat
  </button>

</div>`;

        }
      )
      .join("");

}


/* =========================================================
   OPEN CHAT
========================================================= */

async function openChat(
  senderId
) {

  try {

    const data =
      await adminFetch(
        `/admin/client/${encodeURIComponent(
          senderId
        )}`
      );


    adminState.currentClient =
      data.client;


    chatName.textContent =
      data.client.username ||
      senderId;


    chatInfo.textContent =
      `${data.client.page || "unknown"} • ${
        data.client.stage || "NEW"
      }`;


    renderChat(
      data.client.history ||
      []
    );


    chatOverlay.classList.add(
      "show"
    );


    document.body.style.overflow =
      "hidden";


    setTimeout(
      () => {

        chatMessages.scrollTop =
          chatMessages.scrollHeight;

      },
      50
    );

  }

  catch (
    error
  ) {

    alert(
      error.message
    );

  }

}


/* =========================================================
   CLOSE CHAT
========================================================= */

function closeChat() {

  chatOverlay.classList.remove(
    "show"
  );


  document.body.style.overflow =
    "";


  loadClients();

}


/* =========================================================
   RENDER CHAT
========================================================= */

function renderChat(
  history
) {

  chatMessages.innerHTML =
    "";


  if (
    !Array.isArray(
      history
    ) ||
    !history.length
  ) {

    chatMessages.innerHTML =
      `<div class="empty">No messages yet.</div>`;

    return;

  }


  history.forEach(
    item => {

      const wrapper =
        document.createElement(
          "div"
        );


      wrapper.className =
        `chat-message ${
          item.role ===
          "client"
            ? "client"
            : "assistant"
        }`;


      const bubble =
        document.createElement(
          "div"
        );


      bubble.className =
        "chat-bubble";


      bubble.textContent =
        item.text ||
        "";


      if (
        item.timestamp
      ) {

        const time =
          document.createElement(
            "span"
          );


        time.className =
          "chat-time";


        time.textContent =
          formatTime(
            item.timestamp
          );


        bubble.appendChild(
          time
        );

      }


      wrapper.appendChild(
        bubble
      );


      chatMessages.appendChild(
        wrapper
      );

    }
  );


  chatMessages.scrollTop =
    chatMessages.scrollHeight;

}


/* =========================================================
   FORMAT TIME
========================================================= */

function formatTime(
  timestamp
) {

  try {

    return new Date(
      timestamp
    ).toLocaleString();

  }

  catch (
    error
  ) {

    return "";

  }

}
/* =========================================================
   FILTER CLIENTS — CONTINUED
========================================================= */

function getFilteredClients() {

  let result =
    allClients.slice();


  if (
    selectedPage !==
    "all"
  ) {

    result =
      result.filter(
        function(client) {

          return (
            client.pageKey ===
            selectedPage
          );

        }
      );

  }


  const search =
    (
      document.getElementById(
        "search"
      )?.value ||
      ""
    )
      .trim()
      .toLowerCase();


  if (
    search
  ) {

    result =
      result.filter(
        function(client) {

          const username =
            String(
              client.username ||
              ""
            ).toLowerCase();


          const senderId =
            String(
              client.senderId ||
              ""
            ).toLowerCase();


          return (
            username.includes(
              search
            ) ||
            senderId.includes(
              search
            )
          );

        }
      );

  }


  return result;

}


/* =========================================================
   RENDER CLIENTS
========================================================= */

function renderClients() {

  const container =
    document.getElementById(
      "clients"
    );


  const count =
    document.getElementById(
      "clientCount"
    );


  const clients =
    getFilteredClients();


  count.textContent =
    clients.length;


  if (
    !clients.length
  ) {

    container.innerHTML =
      `
      <div class="empty">
        No clients found.
      </div>
      `;

    return;

  }


  container.innerHTML =
    clients
      .map(
        function(client) {

          const username =
            client.username ||
            "Unknown";


          const page =
            client.page ||
            client.pageKey ||
            "Unknown";


          const stage =
            client.stage ||
            "NEW";


          const lastMessage =
            client.lastCustomerMessage ||
            client.lastOutgoingText ||
            "";


          return `
          <div
            class="client-card"
            onclick="openClient('${escapeHtml(
              client.senderId
            )}')"
          >

            <div class="client-name">
              ${escapeHtml(
                username
              )}
            </div>

            <div class="client-details">

              Page:
              ${escapeHtml(
                page
              )}

              <br>

              Stage:
              ${escapeHtml(
                stage
              )}

              <br>

              ${escapeHtml(
                lastMessage
              )}

            </div>

          </div>
          `;

        }
      )
      .join("");

}


/* =========================================================
   OPEN CLIENT
========================================================= */

async function openClient(
  senderId
) {

  try {

    const response =
      await fetch(
        "/admin/client/" +
        encodeURIComponent(
          senderId
        ) +
        "?secret=" +
        encodeURIComponent(
          adminSecret
        ),
        {
          cache:
            "no-store"
        }
      );


    const data =
      await response.json();


    if (
      !response.ok
    ) {

      throw new Error(
        data.error ||
        "Unable to load client"
      );

    }


    selectedClient =
      data.client;


    savedScrollPosition =
      window.scrollY;


    renderChat();


    document
      .getElementById(
        "chatOverlay"
      )
      .classList.add(
        "show"
      );


    document.body.style.overflow =
      "hidden";


    setTimeout(
      function() {

        const messages =
          document.getElementById(
            "chatMessages"
          );


        messages.scrollTop =
          messages.scrollHeight;

      },
      50
    );

  }

  catch (
    error
  ) {

    console.error(
      error
    );


    alert(
      error.message
    );

  }

}


/* =========================================================
   CLOSE CHAT
========================================================= */

function closeChat() {

  const overlay =
    document.getElementById(
      "chatOverlay"
    );


  overlay.classList.remove(
    "show"
  );


  document.body.style.overflow =
    "";


  selectedClient =
    null;


  setTimeout(
    function() {

      window.scrollTo(
        0,
        savedScrollPosition
      );

    },
    50
  );

}


/* =========================================================
   OVERLAY CLICK
========================================================= */

function overlayClick(
  event
) {

  if (
    event.target &&
    event.target.id ===
      "chatOverlay"
  ) {

    closeChat();

  }

}


/* =========================================================
   RENDER CHAT
========================================================= */

function renderChat() {

  if (
    !selectedClient
  ) {

    return;

  }


  const title =
    document.getElementById(
      "chatTitle"
    );


  const messages =
    document.getElementById(
      "chatMessages"
    );


  title.innerHTML =
    `
    <strong>
      ${escapeHtml(
        selectedClient.username ||
        selectedClient.senderId
      )}
    </strong>

    <span>
      ${escapeHtml(
        selectedClient.page ||
        selectedClient.pageKey ||
        ""
      )}
    </span>
    `;


  const history =
    Array.isArray(
      selectedClient.history
    )
      ? selectedClient.history
      : [];


  if (
    !history.length
  ) {

    messages.innerHTML =
      `
      <div class="empty">
        No messages yet.
      </div>
      `;

    return;

  }


  messages.innerHTML =
    history
      .map(
        function(item) {

          const role =
            item.role ===
            "client"
              ? "client"
              : "assistant";


          return `
          <div
            class="chat-message ${role}"
          >

            ${escapeHtml(
              item.text ||
              ""
            )}

            ${
              item.timestamp
                ? `
                  <span class="chat-time">
                    ${escapeHtml(
                      formatTime(
                        item.timestamp
                      )
                    )}
                  </span>
                `
                : ""
            }

          </div>
          `;

        }
      )
      .join("");


  messages.scrollTop =
    messages.scrollHeight;

}


/* =========================================================
   SEND ADMIN REPLY
========================================================= */

async function sendAdminReply() {

  const clientId =
    document
      .getElementById(
        "adminClientId"
      )
      .value
      .trim();


  const pageKey =
    document
      .getElementById(
        "adminPage"
      )
      .value;


  const message =
    document
      .getElementById(
        "adminMessage"
      )
      .value
      .trim();


  if (
    !clientId
  ) {

    alert(
      "Enter Client ID."
    );

    return;

  }


  if (
    !message
  ) {

    alert(
      "Write a message."
    );

    return;

  }


  try {

    const response =
      await fetch(
        "/admin/reply",
        {

          method:
            "POST",

          headers: {

            "Content-Type":
              "application/json"

          },

          body:
            JSON.stringify({

              secret:
                adminSecret,

              senderId:
                clientId,

              pageKey:
                pageKey,

              message:
                message

            })

        }
      );


    const data =
      await response.json();


    if (
      !response.ok
    ) {

      throw new Error(
        data.error ||
        "Unable to send reply"
      );

    }


    document
      .getElementById(
        "adminMessage"
      )
      .value =
      "";


    setStatus(
      "Reply sent."
    );


    await loadClients();

  }

  catch (
    error
  ) {

    alert(
      error.message
    );

  }

}


/* =========================================================
   SEND CHAT REPLY
========================================================= */

async function sendChatReply() {

  if (
    !selectedClient
  ) {

    return;

  }


  const textarea =
    document.getElementById(
      "chatReply"
    );


  const message =
    textarea.value.trim();


  if (
    !message
  ) {

    return;

  }


  const senderId =
    selectedClient.senderId;


  const pageKey =
    selectedClient.pageKey ||
    selectedClient.page;


  try {

    const response =
      await fetch(
        "/admin/reply",
        {

          method:
            "POST",

          headers: {

            "Content-Type":
              "application/json"

          },

          body:
            JSON.stringify({

              secret:
                adminSecret,

              senderId:
                senderId,

              pageKey:
                pageKey,

              message:
                message

            })

        }
      );


    const data =
      await response.json();


    if (
      !response.ok
    ) {

      throw new Error(
        data.error ||
        "Unable to send reply"
      );

    }


    textarea.value =
      "";


    await refreshSelectedClient();

  }

  catch (
    error
  ) {

    alert(
      error.message
    );

  }

}


/* =========================================================
   REFRESH SELECTED CLIENT
========================================================= */

async function refreshSelectedClient() {

  if (
    !selectedClient
  ) {

    return;

  }


  try {

    const response =
      await fetch(
        "/admin/client/" +
        encodeURIComponent(
          selectedClient.senderId
        ) +
        "?secret=" +
        encodeURIComponent(
          adminSecret
        ),
        {
          cache:
            "no-store"
        }
      );


    const data =
      await response.json();


    if (
      !response.ok
    ) {

      throw new Error(
        data.error ||
        "Unable to refresh client"
      );

    }


    selectedClient =
      data.client;


    renderChat();

  }

  catch (
    error
  ) {

    console.error(
      error
    );

  }

}


/* =========================================================
   TOGGLE ADMIN REPLY
========================================================= */

function toggleAdminReply() {

  const form =
    document.getElementById(
      "adminForm"
    );


  form.classList.toggle(
    "show"
  );

}


/* =========================================================
   INITIAL LOAD
========================================================= */

window.addEventListener(
  "load",
  function() {

    adminSecret =
      localStorage.getItem(
        "adminSecret"
      ) ||
      "";


    if (
      adminSecret
    ) {

      loadClients();

    }

  }
);


/* =========================================================
   CHAT ESCAPE KEY
========================================================= */

document.addEventListener(
  "keydown",
  function(event) {

    if (
      event.key ===
      "Escape"
    ) {

      const overlay =
        document.getElementById(
          "chatOverlay"
        );


      if (
        overlay.classList.contains(
          "show"
        )
      ) {

        closeChat();

      }

    }

  }
);


/* =========================================================
   CHAT SEND — ENTER
========================================================= */

document
  .getElementById(
    "chatReply"
  )
  .addEventListener(
    "keydown",
    function(event) {

      if (
        event.key ===
          "Enter" &&
        !event.shiftKey
      ) {

        event.preventDefault();

        sendChatReply();

      }

    }
  );


/* =========================================================
   SEARCH ENTER
========================================================= */

document
  .getElementById(
    "search"
  )
  .addEventListener(
    "keydown",
    function(event) {

      if (
        event.key ===
        "Enter"
      ) {

        renderClients();

      }

    }
  );


/* =========================================================
   END ADMIN UI
========================================================= */
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
   ADMIN PAGE — SIMPLE VERSION 2

   - Page filters
   - Search
   - Client list
   - Slide-up chat
   - Same scroll position after closing chat
   - Admin Reply at top
========================================================= */

app.get(
  "/admin",
  (
    req,
    res
  ) => {

    res.send(`

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
>

<title>Instagram Admin</title>

<style>

* {
  box-sizing: border-box;
}

html,
body {

  margin: 0;

  padding: 0;

  background: #f5f5f7;

  color: #111;

  font-family:
    Arial,
    sans-serif;

}

body {

  min-height:
    100vh;

}

button,
input,
textarea,
select {

  font-family:
    inherit;

}

button {

  cursor:
    pointer;

}


/* =========================================================
   MAIN
========================================================= */

.container {

  width:
    100%;

  max-width:
    850px;

  margin:
    auto;

  padding:
    10px;

}

.title {

  font-size:
    25px;

  font-weight:
    700;

  margin:
    5px 0 14px;

}

.section {

  background:
    #fff;

  border-radius:
    16px;

  padding:
    14px;

  margin-bottom:
    12px;

  box-shadow:
    0 2px 8px rgba(
      0,
      0,
      0,
      .06
    );

}


/* =========================================================
   LOGIN
========================================================= */

.login-row {

  display:
    flex;

  gap:
    8px;

}

.login-row input {

  flex:
    1;

  min-width:
    0;

}

.login-row button {

  background:
    #1683ff;

  color:
    #fff;

  border:
    0;

  border-radius:
    10px;

  padding:
    0 18px;

  font-weight:
    600;

}

input,
textarea,
select {

  width:
    100%;

  border:
    1px solid #d1d1d1;

  border-radius:
    10px;

  padding:
    12px;

  font-size:
    15px;

  outline:
    none;

  background:
    #fff;

}

input:focus,
textarea:focus,
select:focus {

  border-color:
    #1683ff;

}

.status {

  margin-top:
    8px;

  font-size:
    12px;

  color:
    #777;

}


/* =========================================================
   PAGE FILTERS
========================================================= */

.page-title {

  font-size:
    17px;

  font-weight:
    700;

  margin-bottom:
    10px;

}

.page-buttons {

  display:
    flex;

  gap:
    7px;

  overflow-x:
    auto;

  padding-bottom:
    2px;

}

.page-button {

  flex:
    0 0 auto;

  border:
    0;

  border-radius:
    9px;

  background:
    #eee;

  color:
    #1683ff;

  padding:
    10px 14px;

  font-size:
    13px;

  font-weight:
    600;

}

.page-button.active {

  background:
    #1683ff;

  color:
    #fff;

}


/* =========================================================
   ADMIN REPLY
========================================================= */

.reply-toggle {

  width:
    100%;

  border:
    0;

  border-radius:
    10px;

  padding:
    12px;

  background:
    #eee;

  color:
    #1683ff;

  font-size:
    15px;

  font-weight:
    600;

}

.admin-form {

  display:
    none;

  margin-top:
    10px;

}

.admin-form.show {

  display:
    block;

}

.admin-form input,
.admin-form select,
.admin-form textarea {

  margin-bottom:
    8px;

}

.send-button {

  width:
    100%;

  border:
    0;

  border-radius:
    10px;

  padding:
    13px;

  background:
    #1683ff;

  color:
    #fff;

  font-size:
    15px;

  font-weight:
    600;

}


/* =========================================================
   SEARCH
========================================================= */

.search-row {

  display:
    flex;

  gap:
    8px;

  align-items:
    center;

}

.search-row input {

  flex:
    1;

}

.refresh-button {

  flex:
    0 0 auto;

  border:
    0;

  border-radius:
    10px;

  background:
    #eee;

  color:
    #1683ff;

  padding:
    12px 14px;

  font-size:
    14px;

}


/* =========================================================
   CLIENT LIST
========================================================= */

.clients-header {

  display:
    flex;

  justify-content:
    space-between;

  align-items:
    center;

  margin-bottom:
    10px;

}

.clients-title {

  font-size:
    18px;

  font-weight:
    700;

}

.client-count {

  font-size:
    12px;

  color:
    #777;

}

.client-card {

  border:
    1px solid #e0e0e0;

  border-radius:
    14px;

  padding:
    13px;

  margin-bottom:
    9px;

  background:
    #fff;

}

.client-name {

  font-size:
    17px;

  font-weight:
    700;

  word-break:
    break-word;

}

.client-details {

  color:
    #666;

  font-size:
    12px;

  line-height:
    1.7;

  margin-top:
    5px;

}

.open-chat {

  width:
    100%;

  margin-top:
    9px;

  border:
    0;

  border-radius:
    9px;

  background:
    #eee;

  color:
    #1683ff;

  padding:
    10px;

  font-size:
    14px;

  font-weight:
    600;

}

.empty {

  text-align:
    center;

  color:
    #777;

  padding:
    25px 10px;

  font-size:
    14px;

}


/* =========================================================
   SLIDE-UP CHAT
========================================================= */

.chat-overlay {

  position:
    fixed;

  inset:
    0;

  z-index:
    1000;

  background:
    rgba(
      0,
      0,
      0,
      .42
    );

  display:
    flex;

  align-items:
    flex-end;

  visibility:
    hidden;

  opacity:
    0;

  transition:
    opacity .2s ease,
    visibility .2s ease;

}

.chat-overlay.show {

  visibility:
    visible;

  opacity:
    1;

}

.chat-panel {

  width:
    100%;

  max-width:
    850px;

  margin:
    0 auto;

  height:
    88vh;

  background:
    #fff;

  border-radius:
    18px 18px 0 0;

  display:
    flex;

  flex-direction:
    column;

  transform:
    translateY(100%);

  transition:
    transform .25s ease;

  overflow:
    hidden;

}

.chat-overlay.show
.chat-panel {

  transform:
    translateY(0);

}


/* =========================================================
   CHAT HEADER
========================================================= */

.chat-top {

  flex:
    0 0 auto;

  padding:
    12px 14px;

  border-bottom:
    1px solid #e5e5e5;

  background:
    #fff;

}

.drag-line {

  width:
    38px;

  height:
    4px;

  border-radius:
    10px;

  background:
    #ccc;

  margin:
    0 auto 10px;

}

.chat-header-row {

  display:
    flex;

  align-items:
    center;

  gap:
    8px;

}

.chat-title {

  flex:
    1;

  min-width:
    0;

}

.chat-title strong {

  display:
    block;

  font-size:
    17px;

  word-break:
    break-word;

}

.chat-title span {

  display:
    block;

  color:
    #777;

  font-size:
    11px;

  margin-top:
    3px;

}

.close-chat {

  border:
    0;

  background:
    #eee;

  color:
    #333;

  border-radius:
    9px;

  padding:
    9px 12px;

  font-size:
    14px;

}


/* =========================================================
   CHAT MESSAGES
========================================================= */

.chat-messages {

  flex:
    1;

  overflow-y:
    auto;

  padding:
    14px;

  background:
    #f7f7f8;

}

.chat-message {

  max-width:
    85%;

  padding:
    10px 12px;

  border-radius:
    13px;

  margin-bottom:
    9px;

  white-space:
    pre-wrap;

  word-break:
    break-word;

  font-size:
    14px;

  line-height:
    1.4;

}

.chat-message.client {

  margin-right:
    auto;

  background:
    #e8e8ea;

}

.chat-message.assistant {

  margin-left:
    auto;

  background:
    #d9f7ef;

}

.chat-time {

  display:
    block;

  margin-top:
    5px;

  font-size:
    10px;

  color:
    #777;

}


/* =========================================================
   CHAT REPLY
========================================================= */

.chat-reply {

  flex:
    0 0 auto;

  padding:
    10px;

  border-top:
    1px solid #ddd;

  background:
    #fff;

}

.chat-reply textarea {

  min-height:
    65px;

  max-height:
    130px;

  resize:
    vertical;

  margin-bottom:
    7px;

}

.chat-actions {

  display:
    flex;

  gap:
    7px;

}

.chat-send {

  flex:
    1;

  border:
    0;

  border-radius:
    9px;

  background:
    #1683ff;

  color:
    white;

  padding:
    11px;

  font-weight:
    600;

}

.chat-refresh {

  border:
    0;

  border-radius:
    9px;

  background:
    #eee;

  color:
    #1683ff;

  padding:
    11px 13px;

}


/* =========================================================
   MOBILE
========================================================= */

@media (
  max-width: 500px
) {

  .container {

    padding:
      9px;

  }

  .chat-panel {

    height:
      92vh;

  }

  .chat-message {

    max-width:
      90%;

  }

}

</style>

</head>

<body>
/* =========================================================
   ADMIN REPLY — CONTINUED
========================================================= */

async function sendAdminReply() {

  const clientId =
    document.getElementById(
      "adminClientId"
    )
      .value
      .trim();


  const pageKey =
    document.getElementById(
      "adminPage"
    )
      .value;


  const message =
    document.getElementById(
      "adminMessage"
    )
      .value
      .trim();


  if (!clientId) {

    alert(
      "Enter Client ID."
    );

    return;

  }


  if (!message) {

    alert(
      "Write your reply."
    );

    return;

  }


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
                clientId,

              pageKey:
                pageKey,

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
        "Unable to send reply"
      );

    }


    document.getElementById(
      "adminMessage"
    ).value =
      "";


    setStatus(
      "Reply sent successfully."
    );


    await refreshSelectedClient();

  }

  catch (
    error
  ) {

    console.error(
      error
    );


    alert(
      error.message
    );

  }

}


/* =========================================================
   CHAT REPLY
========================================================= */

async function sendChatReply() {

  if (
    !selectedClient
  ) {

    return;

  }


  const textarea =
    document.getElementById(
      "chatReply"
    );


  const message =
    textarea.value.trim();


  if (!message) {

    return;

  }


  const senderId =
    selectedClient.senderId;


  const pageKey =
    selectedClient.pageKey ||
    selectedClient.page;


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
                senderId,

              pageKey:
                pageKey,

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
        "Unable to send reply"
      );

    }


    textarea.value =
      "";


    await refreshSelectedClient();

  }

  catch (
    error
  ) {

    console.error(
      error
    );


    alert(
      error.message
    );

  }

}


/* =========================================================
   ENTER KEY — CHAT
========================================================= */

document
  .getElementById(
    "chatReply"
  )
  .addEventListener(
    "keydown",
    function(event) {

      if (
        event.key ===
          "Enter" &&
        !event.shiftKey
      ) {

        event.preventDefault();

        sendChatReply();

      }

    }
  );


/* =========================================================
   ENTER KEY — LOGIN
========================================================= */

document
  .getElementById(
    "secret"
  )
  .addEventListener(
    "keydown",
    function(event) {

      if (
        event.key ===
        "Enter"
      ) {

        event.preventDefault();

        login();

      }

    }
  );


/* =========================================================
   INITIALIZE
========================================================= */

window.addEventListener(
  "load",
  function() {

    const savedSecret =
      localStorage.getItem(
        "adminSecret"
      );


    if (
      savedSecret
    ) {

      adminSecret =
        savedSecret;


      document
        .getElementById(
          "secret"
        )
        .value =
        savedSecret;


      loadClients();

    }

  }
);


/* =========================================================
   ESCAPE KEY — CLOSE CHAT
========================================================= */

document.addEventListener(
  "keydown",
  function(event) {

    if (
      event.key ===
      "Escape"
    ) {

      const overlay =
        document.getElementById(
          "chatOverlay"
        );


      if (
        overlay &&
        overlay.classList.contains(
          "show"
        )
      ) {

        closeChat();

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
   SERVER START
========================================================= */

app.listen(
  PORT,
  () => {

    console.log(
      `${BUSINESS_NAME} server running on port ${PORT}`
    );

  }
);
/* =========================================================
   CHAT REPLY — CONTINUED
========================================================= */

async function sendChatReply() {

  if (!selectedClient) {

    return;

  }


  const textarea =
    document.getElementById(
      "chatReply"
    );


  const message =
    textarea.value.trim();


  if (!message) {

    return;

  }


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


    await refreshSelectedClient();

  }

  catch (
    error
  ) {

    alert(
      error.message
    );

  }

}


/* =========================================================
   CTRL/CMD + ENTER TO SEND
========================================================= */

document
  .getElementById(
    "chatReply"
  )
  .addEventListener(
    "keydown",
    function(event) {

      if (
        event.key ===
          "Enter" &&
        (
          event.ctrlKey ||
          event.metaKey
        )
      ) {

        event.preventDefault();

        sendChatReply();

      }

    }
  );


/* =========================================================
   LOAD SAVED SECRET
========================================================= */

(function() {

  const saved =
    localStorage.getItem(
      "adminSecret"
    );


  if (saved) {

    adminSecret =
      saved;


    document
      .getElementById(
        "secret"
      )
      .value =
      saved;


    loadClients();

  }

})();


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
