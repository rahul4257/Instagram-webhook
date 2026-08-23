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

    locationFocus:
      "Europe",

    packages: {

      bronze: {

        name:
          "Bronze",

        price:
          39,

        details:
          "2 story",

        followers:
          "1.5K followers guaranteed",

        timeframe:
          "48 hours"

      },

      silver: {

        name:
          "Silver",

        price:
          66,

        details:
          "1 post and 3 story + 2 highlights",

        followers:
          "4K followers guaranteed",

        timeframe:
          "48 hours"

      },

      gold: {

        name:
          "Gold",

        price:
          99,

        details:
          "3 post and 4 story + 3 highlights",

        followers:
          "7K followers guaranteed",

        timeframe:
          "3 days"

      },

      diamond: {

        name:
          "Diamond",

        price:
          129,

        details:
          "5 post and 8 story + 7 highlights",

        followers:
          "10K followers guaranteed",

        timeframe:
          "48 hours"

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

    locationFocus:
      "Miami",

    packages: {

      bronze: {

        name:
          "Bronze",

        price:
          38,

        details:
          "2 story",

        followers:
          "1K followers guaranteed",

        timeframe:
          "48 hours"

      },

      silver: {

        name:
          "Silver",

        price:
          66,

        details:
          "1 post and 3 story + 2 highlights",

        followers:
          "3K followers guaranteed",

        timeframe:
          "48 hours"

      },

      gold: {

        name:
          "Gold",

        price:
          99,

        details:
          "3 post and 4 story + 3 highlights",

        followers:
          "5K followers guaranteed",

        timeframe:
          "3 days"

      },

      diamond: {

        name:
          "Diamond",

        price:
          129,

        details:
          "5 post and 8 story + 7 highlights",

        followers:
          "8K followers guaranteed",

        timeframe:
          "48 hours"

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

    locationFocus:
      "Canada",

    packages: {

      bronze: {

        name:
          "Bronze",

        price:
          35,

        details:
          "2 Stories",

        followers:
          "300–400 Global Followers Guaranteed",

        timeframe:
          "48 hours"

      },

      silver: {

        name:
          "Silver",

        price:
          60,

        details:
          "1 Feed Post + 2 Stories",

        followers:
          "1.5K Followers Guaranteed (Includes 300–400 Canadian audience)",

        timeframe:
          "48 hours"

      },

      gold: {

        name:
          "Gold",

        price:
          99,

        details:
          "3 Feed Posts + 4 Stories",

        followers:
          "4.5K Guaranteed Followers (Only Canadian Audience)",

        timeframe:
          "3 days"

      },

      diamond: {

        name:
          "Diamond",

        price:
          199,

        details:
          "5 Feed Posts + 8 Stories",

        followers:
          "10K Guaranteed Followers (Only Toronto Audience)",

        timeframe:
          "48 hours"

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

    locationFocus:
      "mental-health audiences",

    packages: {

      bronze: {

        name:
          "Bronze",

        price:
          39,

        details:
          "2 story",

        followers:
          "1K followers guaranteed",

        timeframe:
          "48 hours"

      },

      silver: {

        name:
          "Silver",

        price:
          66,

        details:
          "1 post and 3 story + 2 highlights",

        followers:
          "3K followers guaranteed",

        timeframe:
          "48 hours"

      },

      gold: {

        name:
          "Gold",

        price:
          99,

        details:
          "3 post and 4 story +3 highlights",

        followers:
          "5K followers guaranteed",

        timeframe:
          "3 days"

      },

      diamond: {

        name:
          "Diamond",

        price:
          129,

        details:
          "5 post and 8 story + 7 highlights",

        followers:
          "8K followers guaranteed",

        timeframe:
          "48 hours"

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
   GUARANTEE MESSAGE
========================================================= */

const GUARANTEE_MESSAGE =
`Yes ❤️ The followers are guaranteed because we upload your content on our pages and continue the promotion until you receive the followers included in your package.

If you don't gain the guaranteed followers, the amount will be refunded according to our guarantee policy. ❤️`;


/* =========================================================
   REAL / ORGANIC FOLLOWERS
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
   PAGE-SPECIFIC PAYMENT DETAILS
========================================================= */

PAGE_CONFIGS.europe.paymentDetails = {

  paypal:
    PAYMENT_DETAILS.paypal,

  iban:
    PAYMENT_DETAILS.iban,

  revolut:
    PAYMENT_DETAILS.revolut,

  mbway:
    PAYMENT_DETAILS.mbway,

  card:
    PAYMENT_DETAILS.card

};


PAGE_CONFIGS.miami.paymentDetails = {

  paypal:
    PAYMENT_DETAILS.paypal,

  venmo:
    PAYMENT_DETAILS.venmo,

  card:
    PAYMENT_DETAILS.card,

  achWire:
    PAYMENT_DETAILS.achWire

};


PAGE_CONFIGS.canada.paymentDetails = {

  etransfer:
    PAYMENT_DETAILS.etransfer,

  achWire:
    PAYMENT_DETAILS.achWire,

  card:
    PAYMENT_DETAILS.card

};


PAGE_CONFIGS.mentalxheal.paymentDetails = {

  paypal:
    PAYMENT_DETAILS.paypal,

  venmo:
    PAYMENT_DETAILS.venmo,

  iban:
    PAYMENT_DETAILS.iban,

  etransfer:
    PAYMENT_DETAILS.etransfer,

  card:
    PAYMENT_DETAILS.card,

  revolut:
    PAYMENT_DETAILS.revolut

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


/* =========================================================
   SAVE MESSAGE
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
   END PART 1
========================================================= */
/* =========================================================
   SUPABASE HELPERS
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


/* =========================================================
   LOAD ONE CONVERSATION
========================================================= */

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


    if (
      !response.ok
    ) {

      console.error(
        "Supabase GET:",
        await response.text()
      );

      return null;

    }


    const data =
      await response.json();


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
      "Supabase GET error:",
      error.message
    );

    return null;

  }

}


/* =========================================================
   SAVE ONE CONVERSATION
========================================================= */

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


    if (
      !response.ok
    ) {

      console.error(
        "Supabase SAVE:",
        await response.text()
      );

      return false;

    }


    return true;

  }

  catch (
    error
  ) {

    console.error(
      "Supabase SAVE error:",
      error.message
    );

    return false;

  }

}


/* =========================================================
   LOAD ALL CONVERSATIONS
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

        `&order=updated_at.desc`,

        {

          method:
            "GET",

          headers:
            supabaseHeaders()

        }

      );


    if (
      !response.ok
    ) {

      console.error(
        "Supabase LIST:",
        await response.text()
      );

      return [];

    }


    const data =
      await response.json();


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
      "Supabase LIST error:",
      error.message
    );

    return [];

  }

}


/* =========================================================
   RESTORE LOCKED MESSAGE STATE
========================================================= */

function syncLockedFlagsFromHistory(
  conversation
) {

  if (
    !conversation ||
    !Array.isArray(
      conversation.history
    )
  ) {

    return conversation;

  }


  for (
    const item
    of conversation.history
  ) {

    if (
      item?.role !==
      "assistant"
    ) {

      continue;

    }


    const text =
      String(
        item.text ||
        ""
      );


    if (
      text ===
      MESSAGE_ONE
    ) {

      conversation.messageOneSent =
        true;

    }


    if (
      text ===
      MESSAGE_TWO
    ) {

      conversation.messageOneSent =
        true;

      conversation.messageTwoSent =
        true;

    }


    if (
      text.includes(
        "BRONZE"
      ) &&
      text.includes(
        "SILVER"
      ) &&
      text.includes(
        "GOLD"
      ) &&
      text.includes(
        "DIAMOND"
      )
    ) {

      conversation.messageOneSent =
        true;

      conversation.messageTwoSent =
        true;

      conversation.packagesSent =
        true;

    }

  }


  if (
    conversation.packagesSent
  ) {

    conversation.stage =
      "PACKAGES_SHOWN";

  }

  else if (
    conversation.messageTwoSent
  ) {

    conversation.stage =
      "MESSAGE_TWO_SENT";

  }

  else if (
    conversation.messageOneSent
  ) {

    conversation.stage =
      "MESSAGE_ONE_SENT";

  }


  return conversation;

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

    syncLockedFlagsFromHistory(
      conversation
    );

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


    conversation.customerMessageVersion =
      Number(
        conversation.customerMessageVersion ||
        0
      );


    syncLockedFlagsFromHistory(
      conversation
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
   RESTORE ALL CONVERSATIONS
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


    const conversation =
      row?.messages;


    if (
      !conversation ||
      typeof conversation !==
        "object"
    ) {

      continue;

    }


    conversation.senderId =
      senderId;


    conversation.history =
      Array.isArray(
        conversation.history
      )
        ? conversation.history
        : [];


    syncLockedFlagsFromHistory(
      conversation
    );


    conversations.set(
      senderId,
      conversation
    );

  }

}


/* =========================================================
   USERNAME HELPERS
========================================================= */

function normalizeUsername(
  username
) {

  return String(
    username || ""
  )
    .trim()
    .replace(
      /^@+/,
      ""
    )
    .toLowerCase();

}


function formatUsername(
  username
) {

  const value =
    normalizeUsername(
      username
    );


  if (
    !value
  ) {

    return "";

  }


  return `@${value}`;

}


function extractUsername(
  text
) {

  const match =
    String(
      text || ""
    ).match(
      /@([a-zA-Z0-9._]{2,30})/
    );


  if (
    !match
  ) {

    return "";

  }


  return formatUsername(
    match[1]
  );

}


/* =========================================================
   PACKAGE DETECTION
========================================================= */

function detectPackage(
  text
) {

  const value =
    normalize(
      text
    );


  if (
    /\bbronze\b/.test(
      value
    ) ||
    /^1$/.test(
      value
    )
  ) {

    return "bronze";

  }


  if (
    /\bsilver\b/.test(
      value
    ) ||
    /^2$/.test(
      value
    )
  ) {

    return "silver";

  }


  if (
    /\bgold\b/.test(
      value
    ) ||
    /^3$/.test(
      value
    )
  ) {

    return "gold";

  }


  if (
    /\bdiamond\b/.test(
      value
    ) ||
    /^4$/.test(
      value
    )
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

  const value =
    normalize(
      text
    );


  if (
    /\bpaypal\b/.test(
      value
    )
  ) {

    return "paypal";

  }


  if (
    /\bvenmo\b/.test(
      value
    )
  ) {

    return "venmo";

  }


  if (
    /\brevolut\b/.test(
      value
    )
  ) {

    return "revolut";

  }


  if (
    /\bmb\s*way\b/.test(
      value
    ) ||
    /\bmbway\b/.test(
      value
    )
  ) {

    return "mbway";

  }


  if (
    /\be[\s-]?transfer\b/.test(
      value
    ) ||
    /\binterac\b/.test(
      value
    )
  ) {

    return "etransfer";

  }


  if (
    /\bwise\b/.test(
      value
    ) ||
    /\biban\b/.test(
      value
    )
  ) {

    return "iban";

  }


  if (
    /\bach\b/.test(
      value
    ) ||
    /\bwire\b/.test(
      value
    ) ||
    /\bbank transfer\b/.test(
      value
    )
  ) {

    return "achWire";

  }


  if (
    /\bcredit\b/.test(
      value
    ) ||
    /\bdebit\b/.test(
      value
    ) ||
    /\bcard\b/.test(
      value
    )
  ) {

    return "card";

  }


  return null;

}


/* =========================================================
   INTEREST / QUESTION DETECTION
========================================================= */

function isPositiveInterest(
  text
) {

  const value =
    normalize(
      text
    );


  return (
    /\byes\b/.test(value) ||
    /\byep\b/.test(value) ||
    /\bsure\b/.test(value) ||
    /\binterested\b/.test(value) ||
    /\bshow me\b/.test(value) ||
    /\bsend me\b/.test(value) ||
    /\bplease send\b/.test(value) ||
    /\bsounds good\b/.test(value) ||
    /\bokay\b/.test(value) ||
    /\bok\b/.test(value)
  );

}


function isGuaranteeQuestion(
  text
) {

  const value =
    normalize(
      text
    );


  return (
    /\bguarantee\b/.test(value) ||
    /\bguaranteed\b/.test(value) ||
    /\brefund\b/.test(value) ||
    /\brefund policy\b/.test(value)
  );

}


function isLocationQuestion(
  text
) {

  const value =
    normalize(
      text
    );


  return (
    /\bwhere\b/.test(value) ||
    /\blocation\b/.test(value) ||
    /\bcountry\b/.test(value) ||
    /\barea\b/.test(value) ||
    /\bcity\b/.test(value)
  );

}


function isNegative(
  text
) {

  const value =
    normalize(
      text
    );


  return (
    /\bno thanks\b/.test(value) ||
    /\bnot interested\b/.test(value) ||
    /\bno thank you\b/.test(value) ||
    /^no$/.test(value)
  );

}


/* =========================================================
   END PART 2
========================================================= */
/* =========================================================
   PACKAGE MESSAGE BUILDER
========================================================= */

function buildPackagesMessage(
  page
) {

  if (
    !page
  ) {

    return "";

  }


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
👉 only 99€ = 3 post and 4stroy +3 highlights 🎊
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


  const timeframe =
    packageKey ===
    "gold"
      ? "3 days"
      : "48 hours";


  return `
Perfect ❤️

You've selected the ${selected.name} package.

${page.currency}${selected.price} = ${selected.details}

🎯 ${selected.followers}

⏱️ Delivery timeframe:
${timeframe}

How will you pay?

${page.paymentMethods.join(
  "\n"
)}`;

}


/* =========================================================
   PAYMENT DETAILS
========================================================= */

function getPaymentDetails(
  page,
  method
) {

  if (
    !page ||
    !method
  ) {

    return null;

  }


  return (
    page.paymentDetails?.[
      method
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
  method
) {

  const selected =
    page?.packages?.[
      packageKey
    ];


  const details =
    getPaymentDetails(
      page,
      method
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
${method}

Payment details:

${details}

After successful payment, please send us your payment screenshot ❤️`;

}


/* =========================================================
   PAGE-SPECIFIC PAYMENT DETAILS
========================================================= */

PAGE_CONFIGS.europe.paymentDetails = {

  paypal:
    PAYMENT_DETAILS.paypal,

  iban:
    PAYMENT_DETAILS.iban,

  revolut:
    PAYMENT_DETAILS.revolut,

  mbway:
    PAYMENT_DETAILS.mbway,

  card:
    PAYMENT_DETAILS.card

};


PAGE_CONFIGS.miami.paymentDetails = {

  paypal:
    PAYMENT_DETAILS.paypal,

  venmo:
    PAYMENT_DETAILS.venmo,

  card:
    PAYMENT_DETAILS.card,

  achWire:
    PAYMENT_DETAILS.achWire

};


PAGE_CONFIGS.canada.paymentDetails = {

  etransfer:
    PAYMENT_DETAILS.etransfer,

  achWire:
    PAYMENT_DETAILS.achWire,

  card:
    PAYMENT_DETAILS.card

};


PAGE_CONFIGS.mentalxheal.paymentDetails = {

  paypal:
    PAYMENT_DETAILS.paypal,

  venmo:
    PAYMENT_DETAILS.venmo,

  iban:
    PAYMENT_DETAILS.iban,

  etransfer:
    PAYMENT_DETAILS.etransfer,

  card:
    PAYMENT_DETAILS.card,

  revolut:
    PAYMENT_DETAILS.revolut

};


/* =========================================================
   LOCKED MESSAGE CLASSIFICATION
========================================================= */

function classifyLockedMessage(
  page,
  text
) {

  const value =
    String(
      text || ""
    ).trim();


  if (
    value ===
    MESSAGE_ONE
  ) {

    return "MESSAGE_ONE";

  }


  if (
    value ===
    MESSAGE_TWO
  ) {

    return "MESSAGE_TWO";

  }


  if (
    value.includes(
      "BRONZE PACKAGE"
    ) &&
    value.includes(
      "SILVER PACKAGE"
    ) &&
    value.includes(
      "GOLD PACKAGE"
    ) &&
    value.includes(
      "DIAMOND PACKAGE"
    )
  ) {

    return "PACKAGES";

  }


  return null;

}


/* =========================================================
   LOCKED MESSAGE FLAGS
========================================================= */

function restoreLockedFlags(
  conversation
) {

  if (
    !conversation
  ) {

    return conversation;

  }


  syncLockedFlagsFromHistory(
    conversation
  );


  return conversation;

}


/* =========================================================
   MANUAL MESSAGE RECOGNITION
========================================================= */

function recognizeManualLockedMessage(
  conversation,
  text,
  page
) {

  const type =
    classifyLockedMessage(
      page,
      text
    );


  if (
    type ===
    "MESSAGE_ONE"
  ) {

    conversation.messageOneSent =
      true;

    conversation.stage =
      "MESSAGE_ONE_SENT";

    return type;

  }


  if (
    type ===
    "MESSAGE_TWO"
  ) {

    conversation.messageOneSent =
      true;

    conversation.messageTwoSent =
      true;

    conversation.stage =
      "MESSAGE_TWO_SENT";

    return type;

  }


  if (
    type ===
    "PACKAGES"
  ) {

    conversation.messageOneSent =
      true;

    conversation.messageTwoSent =
      true;

    conversation.packagesSent =
      true;

    conversation.stage =
      "PACKAGES_SHOWN";

    return type;

  }


  return null;

}


/* =========================================================
   NEXT LOCKED MESSAGE
========================================================= */

function getNextLockedMessage(
  conversation,
  page
) {

  if (
    !conversation.messageOneSent
  ) {

    return {

      type:
        "MESSAGE_ONE",

      text:
        MESSAGE_ONE

    };

  }


  if (
    !conversation.messageTwoSent
  ) {

    return {

      type:
        "MESSAGE_TWO",

      text:
        MESSAGE_TWO

    };

  }


  if (
    !conversation.packagesSent
  ) {

    return {

      type:
        "PACKAGES",

      text:
        buildPackagesMessage(
          page
        )

    };

  }


  return null;

}


/* =========================================================
   SEND LOCKED MESSAGE
========================================================= */

async function sendLockedMessage(
  senderId,
  conversation,
  page,
  locked
) {

  if (
    !locked?.text
  ) {

    return false;

  }


  if (
    locked.type ===
    "MESSAGE_ONE" &&
    conversation.messageOneSent
  ) {

    return false;

  }


  if (
    locked.type ===
    "MESSAGE_TWO" &&
    conversation.messageTwoSent
  ) {

    return false;

  }


  if (
    locked.type ===
    "PACKAGES" &&
    conversation.packagesSent
  ) {

    return false;

  }


  const result =
    await sendInstagramMessage(
      page,
      senderId,
      locked.text
    );


  if (
    !result?.success
  ) {

    return false;

  }


  saveMessage(
    conversation,
    "assistant",
    locked.text
  );


  if (
    locked.type ===
    "MESSAGE_ONE"
  ) {

    conversation.messageOneSent =
      true;

    conversation.stage =
      "MESSAGE_ONE_SENT";

  }


  if (
    locked.type ===
    "MESSAGE_TWO"
  ) {

    conversation.messageOneSent =
      true;

    conversation.messageTwoSent =
      true;

    conversation.stage =
      "MESSAGE_TWO_SENT";

  }


  if (
    locked.type ===
    "PACKAGES"
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


  conversation.lastOutgoingText =
    locked.text;

  conversation.lastOutgoingStage =
    locked.type;

  conversation.lastOutgoingAt =
    nowISO();


  await saveConversation(
    senderId,
    conversation
  );


  return true;

}


/* =========================================================
   END PART 3
========================================================= */
/* =========================================================
   GUARANTEE / LOCATION / QUESTION HELPERS
========================================================= */

function buildLocationAnswer(
  page
) {

  if (
    !page
  ) {

    return "";

  }


  if (
    page.key ===
    "europe"
  ) {

    return `We mainly promote your content to audiences across Europe through our Europe page network ❤️`;

  }


  if (
    page.key ===
    "miami"
  ) {

    return `This promotion is focused on the Miami audience through our @expl.miami page ❤️`;

  }


  if (
    page.key ===
    "canada"
  ) {

    return `This promotion is focused on Canada through our @expl.canada page. The Gold package is for Canadian audiences, while the Diamond package is specifically for Toronto ❤️`;

  }


  if (
    page.key ===
    "mentalxheal"
  ) {

    return `This promotion is focused on mental-health related audiences through @mentalxheal ❤️`;

  }


  return "";

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
   GUARANTEE ANSWER
========================================================= */

function buildGuaranteeAnswer(
  page,
  conversation
) {

  const packageKey =
    conversation?.selectedPackage;


  if (
    packageKey &&
    page?.packages?.[
      packageKey
    ]
  ) {

    const selected =
      page.packages[
        packageKey
      ];


    return `
Yes ❤️ Your ${selected.name} package is guaranteed.

${selected.followers}

We continue the promotion until the guaranteed followers included in your package are reached.

If the guaranteed result is not reached according to the package terms, the refund policy applies. ❤️`;

  }


  return GUARANTEE_MESSAGE;

}


/* =========================================================
   SIMPLE QUESTION DETECTION
========================================================= */

function isQuestion(
  text
) {

  const value =
    String(
      text || ""
    ).trim();


  return (
    value.includes(
      "?"
    ) ||
    /^(what|how|where|when|why|which|can|do|does|is|are|will|who)\b/i
      .test(
        value
      )
  );

}


/* =========================================================
   PAYMENT QUESTION
========================================================= */

function isPaymentQuestion(
  text
) {

  const value =
    normalize(
      text
    );


  return (
    /\bpay\b/.test(
      value
    ) ||
    /\bpayment\b/.test(
      value
    ) ||
    /\bpaying\b/.test(
      value
    ) ||
    /\bhow do i pay\b/.test(
      value
    )
  );

}


/* =========================================================
   PAYMENT PROOF DETECTION
========================================================= */

function isPaymentProofMessage(
  text,
  attachmentInfo
) {

  const value =
    normalize(
      text
    );


  if (
    attachmentInfo
  ) {

    return true;

  }


  return (
    /\bpayment screenshot\b/.test(
      value
    ) ||
    /\bproof of payment\b/.test(
      value
    ) ||
    /\bpayment proof\b/.test(
      value
    ) ||
    /\bhere is the payment\b/.test(
      value
    ) ||
    /\bpaid\b/.test(
      value
    )
  );

}


/* =========================================================
   PAYMENT METHOD LIST
========================================================= */

function buildPaymentMethodsMessage(
  page
) {

  if (
    !page
  ) {

    return "";

  }


  return `
How will you pay? ❤️

${page.paymentMethods.join(
  "\n"
)}`;

}


/* =========================================================
   INVALID PAYMENT METHOD
========================================================= */

function buildInvalidPaymentMethodMessage(
  page
) {

  return `
Please choose one of the payment methods available for ${page.username}:

${page.paymentMethods.join(
  "\n"
)}

Once you choose the method, I'll send you the correct payment details ❤️`;

}


/* =========================================================
   SELECTED PACKAGE PAYMENT FLOW
========================================================= */

async function handlePackageSelection(
  senderId,
  conversation,
  page,
  packageKey
) {

  if (
    !page?.packages?.[
      packageKey
    ]
  ) {

    return false;

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

  conversation.awaitingPaymentConfirmation =
    false;


  const message =
    buildPackageConfirmation(
      page,
      packageKey
    );


  if (
    !message
  ) {

    return false;

  }


  const result =
    await sendInstagramMessage(
      page,
      senderId,
      message
    );


  if (
    !result?.success
  ) {

    return false;

  }


  saveMessage(
    conversation,
    "assistant",
    message
  );


  conversation.lastOutgoingText =
    message;

  conversation.lastOutgoingStage =
    "PACKAGE_SELECTED";

  conversation.lastOutgoingAt =
    nowISO();


  await saveConversation(
    senderId,
    conversation
  );


  scheduleTwoMinuteReminder(
    senderId,
    conversation,
    "PAYMENT_METHOD"
  );


  return true;

}


/* =========================================================
   PAYMENT METHOD FLOW
========================================================= */

async function handlePaymentMethod(
  senderId,
  conversation,
  page,
  method
) {

  if (
    !paymentMethodAvailable(
      page,
      method
    )
  ) {

    const invalid =
      buildInvalidPaymentMethodMessage(
        page
      );


    await sendInstagramMessage(
      page,
      senderId,
      invalid
    );


    saveMessage(
      conversation,
      "assistant",
      invalid
    );


    await saveConversation(
      senderId,
      conversation
    );


    return false;

  }


  if (
    !conversation.selectedPackage
  ) {

    const message =
      buildPaymentMethodsMessage(
        page
      );


    await sendInstagramMessage(
      page,
      senderId,
      message
    );


    saveMessage(
      conversation,
      "assistant",
      message
    );


    await saveConversation(
      senderId,
      conversation
    );


    return false;

  }


  const message =
    buildPaymentMessage(
      page,
      conversation.selectedPackage,
      method
    );


  if (
    !message
  ) {

    return false;

  }


  const result =
    await sendInstagramMessage(
      page,
      senderId,
      message
    );


  if (
    !result?.success
  ) {

    return false;

  }


  conversation.paymentMethod =
    method;

  conversation.paymentDetailsSent =
    true;

  conversation.awaitingPaymentConfirmation =
    true;

  conversation.stage =
    "PAYMENT_PENDING";


  saveMessage(
    conversation,
    "assistant",
    message
  );


  conversation.lastOutgoingText =
    message;

  conversation.lastOutgoingStage =
    "PAYMENT_PENDING";

  conversation.lastOutgoingAt =
    nowISO();


  await saveConversation(
    senderId,
    conversation
  );


  scheduleTwoMinuteReminder(
    senderId,
    conversation,
    "PAYMENT_PENDING"
  );


  return true;

}


/* =========================================================
   SEND INSTAGRAM MESSAGE
========================================================= */

async function sendInstagramMessage(
  page,
  recipientId,
  text
) {

  if (
    !page?.token
  ) {

    console.error(
      "Missing page access token for:",
      page?.username
    );

    return {

      success:
        false,

      error:
        "Missing page token"

    };

  }


  if (
    !recipientId ||
    !text
  ) {

    return {

      success:
        false,

      error:
        "Missing recipient or text"

    };

  }


  try {

    const response =
      await fetch(

        `https://graph.facebook.com/${INSTAGRAM_API_VERSION}/me/messages`,

        {

          method:
            "POST",

          headers: {

            "Content-Type":
              "application/json"

          },

          body:
            JSON.stringify({

              recipient: {

                id:
                  recipientId

              },

              message: {

                text:
                  String(
                    text
                  )

              },

              access_token:
                page.token

            })

        }

      );


    const data =
      await response.json();


    if (
      !response.ok
    ) {

      console.error(
        "Instagram send error:",
        data
      );


      return {

        success:
          false,

        error:
          data?.error?.message ||
          "Instagram API error",

        data

      };

    }


    const messageId =
      data?.message_id ||
      data?.id ||
      null;


    if (
      messageId
    ) {

      outgoingMessages.add(
        String(
          messageId
        )
      );

    }


    return {

      success:
        true,

      messageId,

      data

    };

  }

  catch (
    error
  ) {

    console.error(
      "Instagram send exception:",
      error.message
    );


    return {

      success:
        false,

      error:
        error.message

    };

  }

}


/* =========================================================
   REMINDER CONSTANT
========================================================= */

const REMINDER_DELAY_MS =
  2 * 60 * 1000;


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

}


/* =========================================================
   SCHEDULE 2-MINUTE REMINDER
========================================================= */

function scheduleTwoMinuteReminder(
  senderId,
  conversation,
  reminderType
) {

  cancelReminder(
    senderId
  );


  const key =
    String(
      senderId
    );


  const version =
    Number(
      conversation.customerMessageVersion ||
      0
    );


  const timer =
    setTimeout(
      async function() {

        try {

          const current =
            conversations.get(
              key
            );


          if (
            !current
          ) {

            return;

          }


          if (
            Number(
              current.customerMessageVersion ||
              0
            ) !==
            version
          ) {

            return;

          }


          if (
            reminderType ===
            "MESSAGE_ONE" &&
            current.messageOneSent
          ) {

            return;

          }


          if (
            reminderType ===
            "MESSAGE_TWO" &&
            current.messageTwoSent
          ) {

            return;

          }


          if (
            reminderType ===
            "PACKAGES" &&
            current.packagesSent
          ) {

            return;

          }


          if (
            reminderType ===
            "PAYMENT_METHOD" &&
            current.paymentMethod
          ) {

            return;

          }


          if (
            reminderType ===
            "PAYMENT_PENDING" &&
            current.paymentConfirmed
          ) {

            return;

          }


          const page =
            PAGE_CONFIGS[
              current.pageKey
            ];


          if (
            !page
          ) {

            return;

          }


          let reminderText =
            "";


          if (
            reminderType ===
            "PAYMENT_METHOD"
          ) {

            reminderText =
              `Hey ❤️ Which payment method do you have?

${page.paymentMethods.join(
  "\n"
)}`;

          }


          else if (
            reminderType ===
            "PAYMENT_PENDING"
          ) {

            reminderText =
              `Hey ❤️ Just checking in. Please send your payment screenshot once the payment is completed.`;

          }


          else {

            const locked =
              getNextLockedMessage(
                current,
                page
              );


            if (
              !locked
            ) {

              return;

            }


            reminderText =
              locked.text;

          }


          if (
            !reminderText
          ) {

            return;

          }


          const result =
            await sendInstagramMessage(
              page,
              key,
              reminderText
            );


          if (
            !result?.success
          ) {

            return;

          }


          saveMessage(
            current,
            "assistant",
            reminderText
          );


          current.lastOutgoingText =
            reminderText;

          current.lastOutgoingAt =
            nowISO();


          await saveConversation(
            key,
            current
          );

        }

        catch (
          error
        ) {

          console.error(
            "REMINDER ERROR:",
            error.message
          );

        }

        finally {

          reminderTimers.delete(
            key
          );

        }

      },
      REMINDER_DELAY_MS
    );


  reminderTimers.set(
    key,
    timer
  );


  conversation.reminder = {

    type:
      reminderType,

    scheduledAt:
      nowISO(),

    delay:
      REMINDER_DELAY_MS

  };

}


/* =========================================================
   END PART 4
========================================================= */
/* =========================================================
   REMINDER RESTORATION
========================================================= */

async function restorePendingReminders() {

  for (
    const conversation
    of conversations.values()
  ) {

    if (
      !conversation?.reminder?.type
    ) {

      continue;

    }


    const senderId =
      String(
        conversation.senderId ||
        ""
      );


    if (
      !senderId
    ) {

      continue;

    }


    const reminderType =
      conversation.reminder.type;


    const scheduledAt =
      Date.parse(
        conversation.reminder.scheduledAt ||
        ""
      );


    if (
      !Number.isFinite(
        scheduledAt
      )
    ) {

      continue;

    }


    const elapsed =
      Date.now() -
      scheduledAt;


    const remaining =
      Math.max(
        1000,
        REMINDER_DELAY_MS -
        elapsed
      );


    cancelReminder(
      senderId
    );


    const version =
      Number(
        conversation.customerMessageVersion ||
        0
      );


    const timer =
      setTimeout(
        async function() {

          try {

            const current =
              conversations.get(
                senderId
              );


            if (
              !current
            ) {

              return;

            }


            if (
              Number(
                current.customerMessageVersion ||
                0
              ) !==
              version
            ) {

              return;

            }


            const page =
              PAGE_CONFIGS[
                current.pageKey
              ];


            if (
              !page
            ) {

              return;

            }


            let reminderText =
              "";


            if (
              reminderType ===
              "PAYMENT_METHOD"
            ) {

              if (
                current.paymentMethod
              ) {

                return;

              }


              reminderText =
                `Hey ❤️ Which payment method do you have?

${page.paymentMethods.join(
  "\n"
)}`;

            }


            else if (
              reminderType ===
              "PAYMENT_PENDING"
            ) {

              if (
                current.paymentConfirmed
              ) {

                return;

              }


              reminderText =
                `Hey ❤️ Just checking in. Please send your payment screenshot once the payment is completed.`;

            }


            else {

              const locked =
                getNextLockedMessage(
                  current,
                  page
                );


              if (
                !locked
              ) {

                return;

              }


              reminderText =
                locked.text;

            }


            const result =
              await sendInstagramMessage(
                page,
                senderId,
                reminderText
              );


            if (
              !result?.success
            ) {

              return;

            }


            saveMessage(
              current,
              "assistant",
              reminderText
            );


            current.lastOutgoingText =
              reminderText;

            current.lastOutgoingAt =
              nowISO();


            await saveConversation(
              senderId,
              current
            );

          }

          catch (
            error
          ) {

            console.error(
              "RESTORED REMINDER ERROR:",
              error.message
            );

          }

          finally {

            reminderTimers.delete(
              senderId
            );

          }

        },
        remaining
      );


    reminderTimers.set(
      senderId,
      timer
    );

  }

}


/* =========================================================
   CANCEL ALL REMINDERS FOR CONVERSATION
========================================================= */

function cancelConversationReminder(
  conversation
) {

  if (
    !conversation
  ) {

    return;

  }


  cancelReminder(
    conversation.senderId
  );


  conversation.reminder =
    null;

}


/* =========================================================
   MESSAGE VERSION
========================================================= */

function registerCustomerMessage(
  conversation
) {

  conversation.customerMessageVersion =
    Number(
      conversation.customerMessageVersion ||
      0
    ) + 1;


  cancelReminder(
    conversation.senderId
  );


  conversation.reminder =
    null;

}


/* =========================================================
   ADMIN MANUAL MESSAGE DETECTION
========================================================= */

function processManualMessageForWorkflow(
  conversation,
  page,
  message
) {

  const text =
    String(
      message || ""
    ).trim();


  const type =
    classifyLockedMessage(
      page,
      text
    );


  if (
    type ===
    "MESSAGE_ONE"
  ) {

    conversation.messageOneSent =
      true;

    conversation.stage =
      "MESSAGE_ONE_SENT";


    return type;

  }


  if (
    type ===
    "MESSAGE_TWO"
  ) {

    conversation.messageOneSent =
      true;

    conversation.messageTwoSent =
      true;

    conversation.stage =
      "MESSAGE_TWO_SENT";


    return type;

  }


  if (
    type ===
    "PACKAGES"
  ) {

    conversation.messageOneSent =
      true;

    conversation.messageTwoSent =
      true;

    conversation.packagesSent =
      true;

    conversation.stage =
      "PACKAGES_SHOWN";


    return type;

  }


  return null;

}


/* =========================================================
   OUTGOING MESSAGE REGISTRATION
========================================================= */

function registerOutgoingMessage(
  conversation,
  text,
  stage
) {

  conversation.lastOutgoingText =
    text;

  conversation.lastOutgoingStage =
    stage;

  conversation.lastOutgoingAt =
    nowISO();

}


/* =========================================================
   SEND AI REQUEST
========================================================= */

async function askOpenAI(
  conversation,
  page,
  customerMessage
) {

  if (
    !OPEN_AI
  ) {

    return "";

  }


  const history =
    Array.isArray(
      conversation.history
    )
      ? conversation.history
      : [];


  const recentHistory =
    history
      .slice(
        -20
      )
      .map(
        item =>
          `${item.role}: ${item.text}`
      )
      .join(
        "\n"
      );


  const systemPrompt =
`You are the sales assistant for Global Promote.

You are currently handling the page:
${page.username}

Location/audience:
${page.locationFocus}

IMPORTANT WORKFLOW RULES:

1. Message 1, Message 2 and Packages are LOCKED messages.
2. Never invent or repeat a locked message if it has already been sent.
3. Never skip a required locked message.
4. If the customer asks a question, answer the question naturally.
5. Answering a question NEVER cancels the next locked workflow message.
6. Never restart Message 1 simply because the customer replied after hours.
7. Use the existing conversation history and stage.
8. Do not give another generic sales fallback when the customer has asked a specific question.
9. After Message 2, words such as yes, sure, show me, send me, interested, okay or sounds good mean the customer wants the packages.
10. Guarantee/refund questions should receive the guarantee answer.
11. Location questions must be answered according to this specific page.
12. Gold delivery timeframe is 3 days.
13. All other package delivery timeframes are 48 hours.
14. Never mix packages or payment methods between pages.
15. If a package has already been selected, do not send the package list again.
16. If a payment method has been selected, do not ask the customer to select a package again.
17. Never claim that payment was received unless the conversation explicitly confirms it.
18. Keep responses concise and relevant.

Current stage:
${conversation.stage}

Message 1 sent:
${conversation.messageOneSent}

Message 2 sent:
${conversation.messageTwoSent}

Packages sent:
${conversation.packagesSent}

Selected package:
${conversation.selectedPackage || "none"}

Payment method:
${conversation.paymentMethod || "none"}

Recent conversation:
${recentHistory}`;


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
                0.25,

              messages: [

                {
                  role:
                    "system",

                  content:
                    systemPrompt

                },

                {
                  role:
                    "user",

                  content:
                    customerMessage

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

      return "";

    }


    return String(
      data?.choices?.[0]?.message?.content ||
      ""
    ).trim();

  }

  catch (
    error
  ) {

    console.error(
      "OPENAI REQUEST ERROR:",
      error.message
    );

    return "";

  }

}


/* =========================================================
   GENERIC FALLBACK PROTECTION
========================================================= */

const GENERIC_FALLBACKS = [

  "Thanks for your message! Let me know if you are interested.",

  "Sure! Let me know if you would like to continue.",

  "Thanks for reaching out! How can I help you?",

  "Please let me know if you are interested."

];


function isGenericFallback(
  text
) {

  const normalizedText =
    normalize(
      text
    );


  return GENERIC_FALLBACKS
    .some(
      fallback =>
        normalize(
          fallback
        ) ===
        normalizedText
    );

}


/* =========================================================
   REPEATED REPLY PROTECTION
========================================================= */

function wasAlreadySent(
  conversation,
  text
) {

  const value =
    normalize(
      text
    );


  if (
    !value
  ) {

    return true;

  }


  const history =
    Array.isArray(
      conversation.history
    )
      ? conversation.history
      : [];


  return history
    .some(
      item =>
        item.role ===
          "assistant" &&
        normalize(
          item.text
        ) ===
          value
    );

}


/* =========================================================
   GET SAFE AI REPLY
========================================================= */

async function getSafeAIReply(
  conversation,
  page,
  customerMessage
) {

  const reply =
    await askOpenAI(
      conversation,
      page,
      customerMessage
    );


  if (
    !reply
  ) {

    return "";

  }


  if (
    isGenericFallback(
      reply
    )
  ) {

    return "";

  }


  if (
    wasAlreadySent(
      conversation,
      reply
    )
  ) {

    return "";

  }


  return reply;

}


/* =========================================================
   END PART 5
========================================================= */
/* =========================================================
   WORKFLOW RESPONSE ENGINE
========================================================= */

async function handleCustomerMessage(
  senderId,
  page,
  conversation,
  customerMessage,
  attachmentInfo = null
) {

  const text =
    String(
      customerMessage || ""
    ).trim();


  if (
    !text &&
    !attachmentInfo
  ) {

    return;

  }


  /* -------------------------------------------------------
     SAVE CUSTOMER MESSAGE FIRST
  ------------------------------------------------------- */

  saveMessage(
    conversation,
    "client",
    text ||
      "[Attachment]"
  );


  registerCustomerMessage(
    conversation
  );


  await saveConversation(
    senderId,
    conversation
  );


  /* -------------------------------------------------------
     PACKAGE SELECTION
     Must be checked before AI fallback.
  ------------------------------------------------------- */

  const packageKey =
    detectPackage(
      text
    );


  if (
    packageKey &&
    conversation.packagesSent
  ) {

    await handlePackageSelection(
      senderId,
      conversation,
      page,
      packageKey
    );

    return;

  }


  /* -------------------------------------------------------
     PAYMENT METHOD
     Must be checked after package selection.
  ------------------------------------------------------- */

  const paymentMethod =
    detectPaymentMethod(
      text
    );


  if (
    paymentMethod &&
    conversation.selectedPackage
  ) {

    await handlePaymentMethod(
      senderId,
      conversation,
      page,
      paymentMethod
    );

    return;

  }


  /* -------------------------------------------------------
     PAYMENT PROOF
  ------------------------------------------------------- */

  if (
    conversation.paymentDetailsSent &&
    isPaymentProofMessage(
      text,
      attachmentInfo
    )
  ) {

    conversation.paymentProofReceived =
      true;

    conversation.awaitingPaymentConfirmation =
      false;

    conversation.stage =
      "PAYMENT_PROOF_RECEIVED";


    const proofReply =
      `Thank you ❤️ We received your payment proof. Our team will verify it and continue your promotion.`;


    const result =
      await sendInstagramMessage(
        page,
        senderId,
        proofReply
      );


    if (
      result?.success
    ) {

      saveMessage(
        conversation,
        "assistant",
        proofReply
      );

    }


    cancelConversationReminder(
      conversation
    );


    await saveConversation(
      senderId,
      conversation
    );


    return;

  }


  /* -------------------------------------------------------
     PAYMENT CONFIRMATION
  ------------------------------------------------------- */

  if (
    conversation.paymentDetailsSent &&
    isSimplePaymentConfirmation(
      text
    )
  ) {

    conversation.paymentConfirmed =
      true;

    conversation.awaitingPaymentConfirmation =
      false;

    conversation.stage =
      "PAYMENT_CONFIRMED";


    const confirmation =
      `Perfect ❤️ Thank you. Please send your payment screenshot so our team can verify the payment.`;


    const result =
      await sendInstagramMessage(
        page,
        senderId,
        confirmation
      );


    if (
      result?.success
    ) {

      saveMessage(
        conversation,
        "assistant",
        confirmation
      );

    }


    cancelConversationReminder(
      conversation
    );


    await saveConversation(
      senderId,
      conversation
    );


    return;

  }


  /* -------------------------------------------------------
     GUARANTEE / REFUND
     This must be answered without skipping workflow.
  ------------------------------------------------------- */

  if (
    isGuaranteeQuestion(
      text
    )
  ) {

    const guarantee =
      buildGuaranteeAnswer(
        page,
        conversation
      );


    const result =
      await sendInstagramMessage(
        page,
        senderId,
        guarantee
      );


    if (
      result?.success
    ) {

      saveMessage(
        conversation,
        "assistant",
        guarantee
      );

    }


    await saveConversation(
      senderId,
      conversation
    );


    /*
       Important:
       Guarantee answer does NOT cancel
       the locked workflow.
    */

    if (
      !conversation.messageOneSent
    ) {

      scheduleTwoMinuteReminder(
        senderId,
        conversation,
        "MESSAGE_ONE"
      );

    }

    else if (
      !conversation.messageTwoSent
    ) {

      scheduleTwoMinuteReminder(
        senderId,
        conversation,
        "MESSAGE_TWO"
      );

    }

    else if (
      !conversation.packagesSent
    ) {

      scheduleTwoMinuteReminder(
        senderId,
        conversation,
        "PACKAGES"
      );

    }

    else if (
      conversation.selectedPackage &&
      !conversation.paymentMethod
    ) {

      scheduleTwoMinuteReminder(
        senderId,
        conversation,
        "PAYMENT_METHOD"
      );

    }


    return;

  }


  /* -------------------------------------------------------
     LOCATION QUESTION
  ------------------------------------------------------- */

  if (
    isLocationQuestion(
      text
    )
  ) {

    const locationReply =
      buildLocationAnswer(
        page
      );


    if (
      locationReply
    ) {

      const result =
        await sendInstagramMessage(
          page,
          senderId,
          locationReply
        );


      if (
        result?.success
      ) {

        saveMessage(
          conversation,
          "assistant",
          locationReply
        );

      }


      await saveConversation(
        senderId,
        conversation
      );

    }


    /*
       Location answer does not cancel
       the locked workflow.
    */

    if (
      !conversation.messageOneSent
    ) {

      scheduleTwoMinuteReminder(
        senderId,
        conversation,
        "MESSAGE_ONE"
      );

    }

    else if (
      !conversation.messageTwoSent
    ) {

      scheduleTwoMinuteReminder(
        senderId,
        conversation,
        "MESSAGE_TWO"
      );

    }

    else if (
      !conversation.packagesSent
    ) {

      scheduleTwoMinuteReminder(
        senderId,
        conversation,
        "PACKAGES"
      );

    }


    return;

  }


  /* -------------------------------------------------------
     POSITIVE RESPONSE AFTER MESSAGE 2
     MUST OPEN PACKAGES.
  ------------------------------------------------------- */

  if (
    conversation.messageTwoSent &&
    !conversation.packagesSent &&
    isPositiveInterest(
      text
    )
  ) {

    await sendLockedMessage(
      senderId,
      conversation,
      page,
      {
        type:
          "PACKAGES",

        text:
          buildPackagesMessage(
            page
          )

      }
    );


    cancelConversationReminder(
      conversation
    );


    return;

  }


  /* -------------------------------------------------------
     POSITIVE RESPONSE BEFORE MESSAGE 2
     MUST NOT SKIP MESSAGE 2.
  ------------------------------------------------------- */

  if (
    conversation.messageOneSent &&
    !conversation.messageTwoSent &&
    isPositiveInterest(
      text
    )
  ) {

    await sendLockedMessage(
      senderId,
      conversation,
      page,
      {
        type:
          "MESSAGE_TWO",

        text:
          MESSAGE_TWO

      }
    );


    scheduleTwoMinuteReminder(
      senderId,
      conversation,
      "PACKAGES"
    );


    return;

  }


  /* -------------------------------------------------------
     FIRST CLIENT MESSAGE
  ------------------------------------------------------- */

  if (
    !conversation.messageOneSent
  ) {

    await sendLockedMessage(
      senderId,
      conversation,
      page,
      {
        type:
          "MESSAGE_ONE",

        text:
          MESSAGE_ONE

      }
    );


    scheduleTwoMinuteReminder(
      senderId,
      conversation,
      "MESSAGE_TWO"
    );


    return;

  }


  /* -------------------------------------------------------
     NEGATIVE RESPONSE
  ------------------------------------------------------- */

  if (
    isNegative(
      text
    )
  ) {

    const reply =
      `No problem ❤️ If you ever want to promote your profile, feel free to message us anytime.`;


    if (
      !wasAlreadySent(
        conversation,
        reply
      )
    ) {

      const result =
        await sendInstagramMessage(
          page,
          senderId,
          reply
        );


      if (
        result?.success
      ) {

        saveMessage(
          conversation,
          "assistant",
          reply
        );

      }

    }


    await saveConversation(
      senderId,
      conversation
    );


    return;

  }


  /* -------------------------------------------------------
     AI ANSWER
     Questions are answered here.
     The locked workflow remains active.
  ------------------------------------------------------- */

  const aiReply =
    await getSafeAIReply(
      conversation,
      page,
      text
    );


  if (
    aiReply
  ) {

    const result =
      await sendInstagramMessage(
        page,
        senderId,
        aiReply
      );


    if (
      result?.success
    ) {

      saveMessage(
        conversation,
        "assistant",
        aiReply
      );


      registerOutgoingMessage(
        conversation,
        aiReply,
        "AI"
      );

    }


    await saveConversation(
      senderId,
      conversation
    );

  }


  /* -------------------------------------------------------
     AFTER AI ANSWER:
     schedule the required locked message.
  ------------------------------------------------------- */

  if (
    !conversation.messageOneSent
  ) {

    scheduleTwoMinuteReminder(
      senderId,
      conversation,
      "MESSAGE_ONE"
    );

  }

  else if (
    !conversation.messageTwoSent
  ) {

    scheduleTwoMinuteReminder(
      senderId,
      conversation,
      "MESSAGE_TWO"
    );

  }

  else if (
    !conversation.packagesSent
  ) {

    scheduleTwoMinuteReminder(
      senderId,
      conversation,
      "PACKAGES"
    );

  }

  else if (
    conversation.selectedPackage &&
    !conversation.paymentMethod
  ) {

    scheduleTwoMinuteReminder(
      senderId,
      conversation,
      "PAYMENT_METHOD"
    );

  }

  else if (
    conversation.paymentDetailsSent &&
    !conversation.paymentConfirmed
  ) {

    scheduleTwoMinuteReminder(
      senderId,
      conversation,
      "PAYMENT_PENDING"
    );

  }


  await saveConversation(
    senderId,
    conversation
  );

}


/* =========================================================
   QUEUE CUSTOMER MESSAGES
========================================================= */

function queueCustomerMessage(
  senderId,
  page,
  conversation,
  customerMessage,
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
        async function() {

          await handleCustomerMessage(
            key,
            page,
            conversation,
            customerMessage,
            attachmentInfo
          );

        }
      );


  clientQueues.set(
    key,
    next
  );


  next.finally(
    function() {

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
   PROCESS WEBHOOK MESSAGE
========================================================= */

async function processWebhookMessage(
  event,
  page
) {

  if (
    !event
  ) {

    return;

  }


  if (
    event.message?.is_echo ===
    true
  ) {

    return;

  }


  const senderId =
    String(
      event.sender?.id ||
      ""
    ).trim();


  if (
    !senderId
  ) {

    return;

  }


  const message =
    event.message ||
    {};


  const messageId =
    String(
      message.mid ||
      ""
    ).trim();


  if (
    messageId
  ) {

    if (
      processedMessageIds.has(
        messageId
      )
    ) {

      return;

    }


    processedMessageIds.set(
      messageId,
      Date.now()
    );

  }


  const conversation =
    await getConversation(
      senderId
    );


  conversation.pageKey =
    page.key;


  const text =
    String(
      message.text ||
      ""
    ).trim();


  let attachmentInfo =
    null;


  if (
    Array.isArray(
      message.attachments
    ) &&
    message.attachments.length
  ) {

    attachmentInfo =
      message.attachments;

    conversation.promotionMediaReceived =
      true;

  }


  const username =
    extractUsername(
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

  }


  await saveConversation(
    senderId,
    conversation
  );


  queueCustomerMessage(
    senderId,
    page,
    conversation,
    text,
    attachmentInfo
  );

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
        .status(200)
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
   WEBHOOK RECEIVE
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
        req.body ||
        {};


      if (
        body.object !==
        "instagram"
      ) {

        return;

      }


      for (
        const entry
        of (
          body.entry ||
          []
        )
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


        for (
          const event
          of (
            entry.messaging ||
            []
          )
        ) {

          if (
            !event.message
          ) {

            continue;

          }


          await processWebhookMessage(
            event,
            page
          );

        }

      }

    }

    catch (
      error
    ) {

      console.error(
        "WEBHOOK PROCESS ERROR:",
        error.message
      );

    }

  }
);


/* =========================================================
   HEALTH CHECK
========================================================= */

app.get(
  "/health",
  (
    req,
    res
  ) => {

    res.json({

      ok:
        true,

      service:
        "Global Promote",

      supabase:
        supabaseConfigured(),

      openai:
        Boolean(
          OPEN_AI
        ),

      pages:
        Object.values(
          PAGE_CONFIGS
        ).map(
          page =>
            page.username
        )

    });

  }
);


/* =========================================================
   END PART 6
========================================================= */
/* =========================================================
   ADMIN AUTHENTICATION
========================================================= */

function requireAdmin(
  req,
  res,
  next
) {

  const secret =
    String(
      req.headers["x-admin-secret"] ||
      req.query?.secret ||
      req.body?.secret ||
      ""
    ).trim();


  if (
    !ADMIN_SECRET ||
    secret !== ADMIN_SECRET
  ) {

    return res
      .status(401)
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
   ADMIN CLIENT LIST
========================================================= */

function conversationToClient(
  conversation
) {

  return {

    senderId:
      conversation.senderId,

    username:
      conversation.clientUsername ||
      conversation.username ||
      conversation.senderId,

    pageKey:
      conversation.pageKey,

    page:
      PAGE_CONFIGS[
        conversation.pageKey
      ]?.username ||
      conversation.pageKey ||
      "",

    stage:
      conversation.stage ||
      "NEW",

    lastCustomerMessage:
      [...(
        conversation.history ||
        []
      )]
        .reverse()
        .find(
          item =>
            item.role ===
            "client"
        )?.text ||
      "",

    lastOutgoingText:
      conversation.lastOutgoingText ||
      "",

    lastSeenAt:
      conversation.lastSeenAt ||
      null,

    selectedPackage:
      conversation.selectedPackage ||
      null,

    paymentMethod:
      conversation.paymentMethod ||
      null,

    history:
      conversation.history ||
      []

  };

}


/* =========================================================
   ADMIN — ALL CLIENTS
========================================================= */

app.get(
  "/admin/clients",
  requireAdmin,
  async (
    req,
    res
  ) => {

    try {

      await hydrateAdminConversations();


      const clients =
        Array.from(
          conversations.values()
        )
          .map(
            conversation =>
              conversationToClient(
                conversation
              )
          );


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
        .status(500)
        .json({

          success:
            false,

          error:
            "Unable to load clients"

        });

    }

  }
);


/* =========================================================
   ADMIN — ONE CLIENT
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
          .status(400)
          .json({

            success:
              false,

            error:
              "Missing sender ID"

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
          conversationToClient(
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
        .status(500)
        .json({

          success:
            false,

          error:
            "Unable to load client"

        });

    }

  }
);


/* =========================================================
   ADMIN MANUAL REPLY
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


      const pageKey =
        String(
          req.body?.pageKey ||
          ""
        ).trim();


      const message =
        String(
          req.body?.message ||
          ""
        ).trim();


      if (
        !senderId
      ) {

        return res
          .status(400)
          .json({

            success:
              false,

            error:
              "Missing senderId"

          });

      }


      if (
        !message
      ) {

        return res
          .status(400)
          .json({

            success:
              false,

            error:
              "Message cannot be empty"

          });

      }


      const conversation =
        await getConversation(
          senderId
        );


      const resolvedPageKey =
        pageKey ||
        conversation.pageKey;


      const page =
        PAGE_CONFIGS[
          resolvedPageKey
        ];


      if (
        !page
      ) {

        return res
          .status(400)
          .json({

            success:
              false,

            error:
              "Invalid page"

          });

      }


      conversation.pageKey =
        resolvedPageKey;


      /*
         IMPORTANT:
         If admin manually sends Message 1,
         Message 2 or Packages, update the
         workflow flags immediately.
      */

      const lockedType =
        processManualMessageForWorkflow(
          conversation,
          page,
          message
        );


      /*
         A manual reply is an intentional
         outgoing action. It must not be
         treated as a customer message.
      */

      const result =
        await sendInstagramMessage(
          page,
          senderId,
          message
        );


      if (
        !result?.success
      ) {

        return res
          .status(502)
          .json({

            success:
              false,

            error:
              result.error ||
              "Instagram message failed"

          });

      }


      saveMessage(
        conversation,
        "assistant",
        message
      );


      registerOutgoingMessage(
        conversation,
        message,
        lockedType ||
        "ADMIN"
      );


      /*
         A manually sent locked message
         cancels its pending reminder.
      */

      if (
        lockedType
      ) {

        cancelConversationReminder(
          conversation
        );

      }


      /*
         If admin manually sent Message 1,
         next required locked message is Message 2.
      */

      if (
        lockedType ===
        "MESSAGE_ONE"
      ) {

        scheduleTwoMinuteReminder(
          senderId,
          conversation,
          "MESSAGE_TWO"
        );

      }


      /*
         If admin manually sent Message 2,
         next required locked message is Packages.
      */

      else if (
        lockedType ===
        "MESSAGE_TWO"
      ) {

        scheduleTwoMinuteReminder(
          senderId,
          conversation,
          "PACKAGES"
        );

      }


      /*
         If admin manually sent Packages,
         workflow continues from package selection.
      */

      else if (
        lockedType ===
        "PACKAGES"
      ) {

        conversation.stage =
          "PACKAGES_SHOWN";

      }


      await saveConversation(
        senderId,
        conversation
      );


      return res.json({

        success:
          true,

        lockedType:
          lockedType,

        client:
          conversationToClient(
            conversation
          )

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
        .status(500)
        .json({

          success:
            false,

          error:
            error.message ||
            "Unable to send reply"

        });

    }

  }
);


/* =========================================================
   ADMIN — PAGE INFORMATION
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
      )
        .map(
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
   ADMIN STATUS
========================================================= */

app.get(
  "/admin/status",
  requireAdmin,
  (
    req,
    res
  ) => {

    return res.json({

      success:
        true,

      conversations:
        conversations.size,

      queues:
        clientQueues.size,

      reminders:
        reminderTimers.size,

      supabase:
        supabaseConfigured(),

      openai:
        Boolean(
          OPEN_AI
        )

    });

  }
);


/* =========================================================
   ADMIN UI HTML
========================================================= */

function adminHtml() {

  return `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
/>

<title>
Global Promote Admin
</title>

<style>

* {
  box-sizing:
    border-box;
}

body {
  margin:
    0;

  font-family:
    Arial,
    sans-serif;

  background:
    #f5f5f5;

  color:
    #111;
}

.header {
  position:
    sticky;

  top:
    0;

  z-index:
    10;

  padding:
    18px;

  background:
    #fff;

  border-bottom:
    1px solid #ddd;
}

.header h1 {
  margin:
    0 0 12px;
}

.toolbar {
  display:
    flex;

  gap:
    10px;

  flex-wrap:
    wrap;
}

.toolbar input,
.toolbar select,
.toolbar button {
  padding:
    10px;

  border:
    1px solid #ccc;

  border-radius:
    8px;
}

.toolbar input {
  flex:
    1;

  min-width:
    180px;
}

.toolbar button {
  cursor:
    pointer;

  background:
    #111;

  color:
    #fff;
}

.clients {
  padding:
    16px;
}

.client-card {
  background:
    #fff;

  padding:
    15px;

  margin-bottom:
    10px;

  border-radius:
    12px;

  border:
    1px solid #ddd;

  cursor:
    pointer;
}

.client-card:hover {
  background:
    #fafafa;
}

.client-name {
  font-weight:
    bold;

  margin-bottom:
    7px;
}

.client-details {
  color:
    #666;

  font-size:
    13px;

  line-height:
    1.6;
}

.empty {
  padding:
    40px;

  text-align:
    center;

  color:
    #777;
}

#chatOverlay {
  display:
    none;

  position:
    fixed;

  inset:
    0;

  z-index:
    100;

  background:
    rgba(
      0,
      0,
      0,
      .55
    );
}

#chatOverlay.show {
  display:
    flex;

  align-items:
    center;

  justify-content:
    center;
}

.chat-box {
  width:
    min(
      95vw,
      650px
    );

  height:
    min(
      90vh,
      800px
    );

  background:
    #fff;

  border-radius:
    15px;

  display:
    flex;

  flex-direction:
    column;

  overflow:
    hidden;
}

.chat-header {
  padding:
    15px;

  border-bottom:
    1px solid #ddd;

  display:
    flex;

  justify-content:
    space-between;
}

.chat-title span {
  display:
    block;

  color:
    #777;

  font-size:
    12px;

  margin-top:
    4px;
}

.chat-messages {
  flex:
    1;

  overflow-y:
    auto;

  padding:
    15px;

  background:
    #f5f5f5;
}

.chat-message {
  max-width:
    80%;

  padding:
    10px 12px;

  margin-bottom:
    9px;

  border-radius:
    12px;

  white-space:
    pre-wrap;
}

.chat-message.client {
  background:
    #fff;

  margin-right:
    auto;

  border:
    1px solid #ddd;
}

.chat-message.assistant {
  background:
    #111;

  color:
    #fff;

  margin-left:
    auto;
}

.chat-time {
  display:
    block;

  font-size:
    10px;

  opacity:
    .65;

  margin-top:
    5px;
}

.chat-input {
  padding:
    10px;

  border-top:
    1px solid #ddd;

  display:
    flex;

  gap:
    8px;
}

.chat-input textarea {
  flex:
    1;

  resize:
    none;

  min-height:
    45px;

  padding:
    10px;

  border:
    1px solid #ccc;

  border-radius:
    8px;
}

.chat-input button {
  padding:
    10px 15px;

  border:
    0;

  border-radius:
    8px;

  background:
    #111;

  color:
    #fff;

  cursor:
    pointer;
}

.close-chat {
  border:
    0;

  background:
    transparent;

  font-size:
    24px;

  cursor:
    pointer;
}

.admin-form {
  display:
    none;

  padding:
    15px;

  background:
    #fff;

  border-bottom:
    1px solid #ddd;
}

.admin-form.show {
  display:
    block;
}

.admin-form input,
.admin-form select,
.admin-form textarea {
  width:
    100%;

  margin-bottom:
    8px;

  padding:
    10px;

  border:
    1px solid #ccc;

  border-radius:
    8px;
}

.admin-form button {
  padding:
    10px 15px;

  background:
    #111;

  color:
    #fff;

  border:
    0;

  border-radius:
    8px;
}

</style>

</head>

<body>

<div class="header">

  <h1>
    Global Promote Admin
  </h1>

  <div class="toolbar">

    <input
      id="search"
      type="text"
      placeholder="Search clients..."
    >

    <select
      id="pageFilter"
    >

      <option value="all">
        All Pages
      </option>

      <option value="europe">
        @expl.europe
      </option>

      <option value="canada">
        @expl.canada
      </option>

      <option value="mentalxheal">
        @mentalxheal
      </option>

      <option value="miami">
        @expl.miami
      </option>

    </select>

    <button
      onclick="loadClients()"
    >
      Refresh
    </button>

    <button
      onclick="toggleAdminReply()"
    >
      Manual Reply
    </button>

  </div>

  <div
    id="clientCount"
  >
    0
  </div>

</div>


<div
  id="adminForm"
  class="admin-form"
>

  <input
    id="adminClientId"
    placeholder="Client ID"
  >

  <select
    id="adminPage"
  >

    <option value="europe">
      @expl.europe
    </option>

    <option value="canada">
      @expl.canada
    </option>

    <option value="mentalxheal">
      @mentalxheal
    </option>

    <option value="miami">
      @expl.miami
    </option>

  </select>

  <textarea
    id="adminMessage"
    placeholder="Write message..."
  ></textarea>

  <button
    onclick="sendAdminReply()"
  >
    Send
  </button>

</div>


<div
  id="clients"
  class="clients"
>

  <div class="empty">
    Loading clients...
  </div>

</div>


<div
  id="chatOverlay"
  onclick="overlayClick(event)"
>

  <div
    class="chat-box"
  >

    <div
      class="chat-header"
    >

      <div
        id="chatTitle"
        class="chat-title"
      ></div>

      <button
        class="close-chat"
        onclick="closeChat()"
      >
        ×
      </button>

    </div>

    <div
      id="chatMessages"
      class="chat-messages"
    ></div>

    <div
      class="chat-input"
    >

      <textarea
        id="chatReply"
        placeholder="Reply..."
      ></textarea>

      <button
        onclick="sendChatReply()"
      >
        Send
      </button>

    </div>

  </div>

</div>


<script>

let adminSecret =
  localStorage.getItem(
    "adminSecret"
  ) || "";


let allClients = [];

let selectedPage =
  "all";

let selectedClient =
  null;

let savedScrollPosition =
  0;


/* =========================================================
   ADMIN SECRET
========================================================= */

if (
  !adminSecret
) {

  adminSecret =
    prompt(
      "Enter Admin Secret"
    ) || "";

  if (
    adminSecret
  ) {

    localStorage.setItem(
      "adminSecret",
      adminSecret
    );

  }

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(
  value
) {

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


/* =========================================================
   FORMAT TIME
========================================================= */

function formatTime(
  value
) {

  if (
    !value
  ) {

    return "";

  }


  const date =
    new Date(
      value
    );


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
   STATUS
========================================================= */

function setStatus(
  message
) {

  console.log(
    message
  );

}


/* =========================================================
   LOAD CLIENTS
========================================================= */

async function loadClients() {

  try {

    const response =
      await fetch(
        "/admin/clients?secret=" +
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
        "Unable to load clients"
      );

    }


    allClients =
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

    console.error(
      error
    );


    alert(
      error.message
    );

  }

}


/* =========================================================
   PAGE FILTER
========================================================= */

document
  .getElementById(
    "pageFilter"
  )
  .addEventListener(
    "change",
    function() {

      selectedPage =
        this.value;

      renderClients();

    }
  );


/* =========================================================
   SEARCH
========================================================= */

document
  .getElementById(
    "search"
  )
  .addEventListener(
    "input",
    function() {

      renderClients();

    }
  );


/* =========================================================
   RENDER CLIENTS
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
  '<div class="empty">' +
  'No clients found.' +
  '</div>';

    container.innerHTML =
  clients
    .map(
      function(client) {

        return (
          '<div class="client-card">' +

            '<div class="client-name">' +
              escapeHtml(
                client.username ||
                "Unknown"
              ) +
            '</div>' +

            '<div class="client-details">' +

              'Page: ' +
              escapeHtml(
                client.page ||
                client.pageKey ||
                "Unknown"
              ) +

              '<br>' +

              'Stage: ' +
              escapeHtml(
                client.stage ||
                "NEW"
              ) +

              '<br>' +

              escapeHtml(
                client.lastCustomerMessage ||
                client.lastOutgoingText ||
                ""
              ) +

            '</div>' +

          '</div>'
        );

      }
    )
    .join("");

/* =========================================================
   END PART 7
========================================================= */
`;
}
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


                      return (
                        `${type}:${url}`
                      );

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


          /*
           * IMPORTANT:
           *
           * The saved conversation is loaded
           * BEFORE enqueueing the new message.
           *
           * This keeps the existing stage,
           * Message 1/2/packages state,
           * selected package and payment state.
           */

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

        clients:
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
            "Unable to load clients"

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


      const client =
        buildAdminClient(
          senderId,
          conversation
        );


      return res.json({

        success:
          true,

        client:
          client

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
            "Unable to load client"

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


      const conversation =
        await getConversation(
          senderId
        );


      conversation.stage =
        "NEW";

      conversation.messageOneSent =
        false;

      conversation.messageTwoSent =
        false;

      conversation.packagesSent =
        false;

      conversation.selectedPackage =
        null;

      conversation.paymentMethod =
        null;

      conversation.paymentConfirmed =
        false;

      conversation.paymentProofReceived =
        false;

      conversation.promotionComplete =
        false;

      conversation.reminder =
        null;


      await saveConversation(
        senderId,
        conversation
      );


      return res.json({

        success:
          true

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
            "Unable to reset client"

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


      const pageKey =
        String(
          req.body?.pageKey ||
          ""
        ).trim();


      const message =
        String(
          req.body?.message ||
          ""
        ).trim();


      if (
        !senderId ||
        !pageKey ||
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
              "senderId, pageKey and message are required"

          });

      }


      const page =
        getPageByKey(
          pageKey
        );


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
              "Invalid page"

          });

      }


      await sendInstagramMessage(
        page,
        senderId,
        message
      );


      const conversation =
        await getConversation(
          senderId
        );


      if (
        !Array.isArray(
          conversation.history
        )
      ) {

        conversation.history =
          [];

      }


      conversation.history.push({

        role:
          "assistant",

        text:
          message,

        timestamp:
          new Date().toISOString()

      });


      conversation.lastOutgoingText =
        message;


      conversation.lastOutgoingAt =
        new Date().toISOString();


      await saveConversation(
        senderId,
        conversation
      );


      return res.json({

        success:
          true

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
            error.message ||
            "Unable to send reply"

        });

    }

  }
);
/* =========================================================
   ADMIN PAGE
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
  font-family: Arial, sans-serif;
}

body {
  min-height: 100vh;
}

button,
input,
textarea,
select {
  font-family: inherit;
}

button {
  cursor: pointer;
}


/* =========================================================
   MAIN
========================================================= */

.container {
  width: 100%;
  max-width: 850px;
  margin: auto;
  padding: 10px;
}

.title {
  font-size: 25px;
  font-weight: 700;
  margin: 5px 0 14px;
}

.section {
  background: #fff;
  border-radius: 16px;
  padding: 14px;
  margin-bottom: 12px;
  box-shadow:
    0 2px 8px rgba(0,0,0,.06);
}


/* =========================================================
   LOGIN
========================================================= */

.login-row {
  display: flex;
  gap: 8px;
}

.login-row input {
  flex: 1;
  min-width: 0;
}

.login-row button {
  background: #1683ff;
  color: #fff;
  border: 0;
  border-radius: 10px;
  padding: 0 18px;
  font-weight: 600;
}

input,
textarea,
select {
  width: 100%;
  border: 1px solid #d1d1d1;
  border-radius: 10px;
  padding: 12px;
  font-size: 15px;
  outline: none;
  background: #fff;
}

input:focus,
textarea:focus,
select:focus {
  border-color: #1683ff;
}

.status {
  margin-top: 8px;
  font-size: 12px;
  color: #777;
}


/* =========================================================
   PAGE FILTERS
========================================================= */

.page-title {
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 10px;
}

.page-buttons {
  display: flex;
  gap: 7px;
  overflow-x: auto;
  padding-bottom: 2px;
}

.page-button {
  flex: 0 0 auto;
  border: 0;
  border-radius: 9px;
  background: #eee;
  color: #1683ff;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 600;
}

.page-button.active {
  background: #1683ff;
  color: #fff;
}


/* =========================================================
   ADMIN REPLY
========================================================= */

.reply-toggle {
  width: 100%;
  border: 0;
  border-radius: 10px;
  padding: 12px;
  background: #eee;
  color: #1683ff;
  font-size: 15px;
  font-weight: 600;
}

.admin-form {
  display: none;
  margin-top: 10px;
}

.admin-form.show {
  display: block;
}

.admin-form input,
.admin-form select,
.admin-form textarea {
  margin-bottom: 8px;
}

.send-button {
  width: 100%;
  border: 0;
  border-radius: 10px;
  padding: 13px;
  background: #1683ff;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
}


/* =========================================================
   SEARCH
========================================================= */

.search-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.search-row input {
  flex: 1;
}

.refresh-button {
  flex: 0 0 auto;
  border: 0;
  border-radius: 10px;
  background: #eee;
  color: #1683ff;
  padding: 12px 14px;
  font-size: 14px;
}


/* =========================================================
   CLIENT LIST
========================================================= */

.clients-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.clients-title {
  font-size: 18px;
  font-weight: 700;
}

.client-count {
  font-size: 12px;
  color: #777;
}

.client-card {
  border: 1px solid #e0e0e0;
  border-radius: 14px;
  padding: 13px;
  margin-bottom: 9px;
  background: #fff;
}

.client-name {
  font-size: 17px;
  font-weight: 700;
  word-break: break-word;
}

.client-details {
  color: #666;
  font-size: 12px;
  line-height: 1.7;
  margin-top: 5px;
}

.open-chat {
  width: 100%;
  margin-top: 9px;
  border: 0;
  border-radius: 9px;
  background: #eee;
  color: #1683ff;
  padding: 10px;
  font-size: 14px;
  font-weight: 600;
}

.empty {
  text-align: center;
  color: #777;
  padding: 25px 10px;
  font-size: 14px;
}


/* =========================================================
   SLIDE-UP CHAT
========================================================= */

.chat-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0,0,0,.42);
  display: flex;
  align-items: flex-end;
  visibility: hidden;
  opacity: 0;
  transition:
    opacity .2s ease,
    visibility .2s ease;
}

.chat-overlay.show {
  visibility: visible;
  opacity: 1;
}

.chat-panel {
  width: 100%;
  max-width: 850px;
  margin: 0 auto;
  height: 88vh;
  background: #fff;
  border-radius:
    18px 18px 0 0;
  display: flex;
  flex-direction: column;
  transform:
    translateY(100%);
  transition:
    transform .25s ease;
  overflow: hidden;
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
  flex: 0 0 auto;
  padding: 12px 14px;
  border-bottom:
    1px solid #e5e5e5;
  background: #fff;
}

.drag-line {
  width: 38px;
  height: 4px;
  border-radius: 10px;
  background: #ccc;
  margin:
    0 auto 10px;
}

.chat-header-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chat-title {
  flex: 1;
  min-width: 0;
}

.chat-title strong {
  display: block;
  font-size: 17px;
  word-break: break-word;
}

.chat-title span {
  display: block;
  color: #777;
  font-size: 11px;
  margin-top: 3px;
}

.close-chat {
  border: 0;
  background: #eee;
  color: #333;
  border-radius: 9px;
  padding: 9px 12px;
  font-size: 14px;
}


/* =========================================================
   CHAT MESSAGES
========================================================= */

.chat-messages {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 14px;
  background: #f7f7f8;
}

.chat-message {
  max-width: 82%;
  padding: 10px 12px;
  border-radius: 14px;
  margin-bottom: 8px;
  font-size: 14px;
  line-height: 1.45;
  white-space: pre-wrap;
  word-break: break-word;
}

.chat-message.client {
  margin-right: auto;
  background: #fff;
  border:
    1px solid #e2e2e2;
}

.chat-message.assistant {
  margin-left: auto;
  background: #1683ff;
  color: #fff;
}

.chat-time {
  display: block;
  font-size: 9px;
  opacity: .65;
  margin-top: 4px;
}


/* =========================================================
   CHAT REPLY
========================================================= */

.chat-reply {
  flex: 0 0 auto;
  display: flex;
  gap: 8px;
  padding: 10px;
  border-top:
    1px solid #e5e5e5;
  background: #fff;
}

.chat-reply textarea {
  flex: 1;
  resize: none;
  min-height: 44px;
  max-height: 120px;
  margin: 0;
}

.chat-reply button {
  flex: 0 0 auto;
  border: 0;
  border-radius: 10px;
  background: #1683ff;
  color: #fff;
  padding: 0 16px;
  font-weight: 600;
}


/* =========================================================
   MOBILE
========================================================= */

@media (
  max-width: 600px
) {

  .container {
    padding: 8px;
  }

  .title {
    font-size: 22px;
  }

  .chat-panel {
    height: 92vh;
  }

}

</style>

</head>

<body>

<div
  class="container"
>

  <div
    class="title"
  >
    Instagram Admin
  </div>


  <div
    class="section"
  >

    <div
      class="login-row"
    >

      <input
        id="secret"
        type="password"
        placeholder="Admin Secret"
      >

      <button
        onclick="saveSecret()"
      >
        Login
      </button>

    </div>


    <div
      id="status"
      class="status"
    ></div>

  </div>


  <div
    class="section"
  >

    <div
      class="page-title"
    >
      Pages
    </div>


    <div
      id="pageButtons"
      class="page-buttons"
    ></div>

  </div>


  <div
    class="section"
  >

    <button
      id="replyToggle"
      class="reply-toggle"
      onclick="toggleAdminReply()"
    >
      ✉️ Admin Reply
    </button>


    <div
      id="adminForm"
      class="admin-form"
    >

      <input
        id="adminClientId"
        placeholder="Client ID"
      >


      <select
        id="adminPage"
      ></select>


      <textarea
        id="adminMessage"
        rows="4"
        placeholder="Write reply..."
      ></textarea>


      <button
        class="send-button"
        onclick="sendAdminReply()"
      >
        Send Reply
      </button>

    </div>

  </div>


  <div
    class="section"
  >

    <div
      class="search-row"
    >

      <input
        id="search"
        placeholder="Search username or client ID..."
        oninput="renderClients()"
      >

      <button
        class="refresh-button"
        onclick="loadClients()"
      >
        Refresh
      </button>

    </div>

  </div>


  <div
    class="section"
  >

    <div
      class="clients-header"
    >

      <div
        class="clients-title"
      >
        Clients
      </div>


      <div
        id="clientCount"
        class="client-count"
      >
        0
      </div>

    </div>


    <div
      id="clients"
    ></div>

  </div>

</div>


<div
  id="chatOverlay"
  class="chat-overlay"
  onclick="overlayClick(event)"
>

  <div
    class="chat-panel"
  >

    <div
      class="chat-top"
    >

      <div
        class="drag-line"
      ></div>


      <div
        class="chat-header-row"
      >

        <div
          id="chatTitle"
          class="chat-title"
        ></div>


        <button
          class="close-chat"
          onclick="closeChat()"
        >
          Close
        </button>

      </div>

    </div>


    <div
      id="chatMessages"
      class="chat-messages"
    ></div>


    <div
      class="chat-reply"
    >

      <textarea
        id="chatReply"
        rows="1"
        placeholder="Reply..."
      ></textarea>


      <button
        onclick="sendChatReply()"
      >
        Send
      </button>

    </div>

  </div>

</div>


<script>
let adminSecret = "";
let allClients = [];
let selectedPage = "all";
let selectedClient = null;


/* =========================================================
   ADMIN LOGIN
========================================================= */

function saveSecret() {

  const input =
    document.getElementById(
      "secret"
    );

  adminSecret =
    input.value.trim();


  if (!adminSecret) {

    setStatus(
      "Enter Admin Secret."
    );

    return;

  }


  localStorage.setItem(
    "adminSecret",
    adminSecret
  );


  loadClients();

}


/* =========================================================
   STATUS
========================================================= */

function setStatus(
  message
) {

  const status =
    document.getElementById(
      "status"
    );


  if (
    status
  ) {

    status.textContent =
      message;

  }

}


/* =========================================================
   LOAD CLIENTS
========================================================= */

async function loadClients() {

  if (
    !adminSecret
  ) {

    setStatus(
      "Admin Secret required."
    );

    return;

  }


  setStatus(
    "Loading..."
  );


  try {

    const response =
      await fetch(
        "/admin/clients?secret=" +
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
        "Unable to load clients"
      );

    }


    allClients =
      Array.isArray(
        data.clients
      )
        ? data.clients
        : [];


    renderPageButtons();
    renderAdminPages();
    renderClients();


    setStatus(
      "Loaded " +
      allClients.length +
      " clients."
    );

  }

  catch (
    error
  ) {

    console.error(
      error
    );


    setStatus(
      error.message
    );

  }

}


/* =========================================================
   PAGE BUTTONS
========================================================= */

function renderPageButtons() {

  const container =
    document.getElementById(
      "pageButtons"
    );


  if (
    !container
  ) {

    return;

  }


  const pages =
    Array.from(
      new Set(
        allClients
          .map(
            client =>
              client.pageKey ||
              client.page
          )
          .filter(
            Boolean
          )
      )
    );


  let html =
    '<button class="page-button ' +
    (
      selectedPage ===
      "all"
        ? "active"
        : ""
    ) +
    '" onclick="selectPage(\'all\')">' +
    'All' +
    '</button>';


  pages.forEach(
    function(page) {

      html +=
        '<button class="page-button ' +
        (
          selectedPage ===
          page
            ? "active"
            : ""
        ) +
        '" onclick="selectPage(\'' +
        escapeHtml(
          page
        ) +
        '\')">' +
        escapeHtml(
          page
        ) +
        '</button>';

    }
  );


  container.innerHTML =
    html;

}


/* =========================================================
   SELECT PAGE
========================================================= */

function selectPage(
  page
) {

  selectedPage =
    page;


  renderPageButtons();
  renderClients();

}


/* =========================================================
   ADMIN PAGE SELECT
========================================================= */

function renderAdminPages() {

  const select =
    document.getElementById(
      "adminPage"
    );


  if (
    !select
  ) {

    return;

  }


  const pages =
    Array.from(
      new Set(
        allClients
          .map(
            client =>
              client.pageKey ||
              client.page
          )
          .filter(
            Boolean
          )
      )
    );


  select.innerHTML =
    pages
      .map(
        function(page) {

          return (
            '<option value="' +
            escapeHtml(
              page
            ) +
            '">' +
            escapeHtml(
              page
            ) +
            '</option>'
          );

        }
      )
      .join("");

}


/* =========================================================
   FILTER CLIENTS
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
            selectedPage ||
            client.page ===
            selectedPage
          );

        }
      );

  }


  const searchInput =
    document.getElementById(
      "search"
    );


  const search =
    (
      searchInput?.value ||
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


  if (
    !container
  ) {

    return;

  }


  const clients =
    getFilteredClients();


  if (
    count
  ) {

    count.textContent =
      clients.length;

  }


  if (
    !clients.length
  ) {

    container.innerHTML =
      '<div class="empty">' +
      'No clients found.' +
      '</div>';

    return;

  }


  container.innerHTML =
    clients
      .map(
        function(client) {

          const id =
            String(
              client.senderId ||
              ""
            );


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


          const last =
            client.lastCustomerMessage ||
            client.lastOutgoingText ||
            "";


          return (
            '<div class="client-card">' +

              '<div class="client-name">' +
                escapeHtml(
                  username
                ) +
              '</div>' +

              '<div class="client-details">' +
                'Page: ' +
                escapeHtml(
                  page
                ) +
                '<br>' +
                'Stage: ' +
                escapeHtml(
                  stage
                ) +
                '<br>' +
                escapeHtml(
                  last
                ) +
              '</div>' +

              '<button class="open-chat" ' +
              'onclick="openClient(\'' +
              escapeHtml(
                id
              ) +
              '\')">' +
              'Open Chat' +
              '</button>' +

            '</div>'
          );

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


    renderChat();


    const overlay =
      document.getElementById(
        "chatOverlay"
      );


    if (
      overlay
    ) {

      overlay.classList.add(
        "show"
      );

    }


    document.body.style.overflow =
      "hidden";


    setTimeout(
      function() {

        const messages =
          document.getElementById(
            "chatMessages"
          );


        if (
          messages
        ) {

          messages.scrollTop =
            messages.scrollHeight;

        }

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


  if (
    overlay
  ) {

    overlay.classList.remove(
      "show"
    );

  }


  document.body.style.overflow =
    "";


  selectedClient =
    null;

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


  if (
    !title ||
    !messages
  ) {

    return;

  }


  title.innerHTML =
    '<strong>' +
    escapeHtml(
      selectedClient.username ||
      selectedClient.senderId
    ) +
    '</strong>' +

    '<span>' +
    escapeHtml(
      selectedClient.page ||
      selectedClient.pageKey ||
      ""
    ) +
    '</span>';


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
      '<div class="empty">' +
      'No messages yet.' +
      '</div>';

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


          const text =
            item.text ||
            "";


          const time =
            item.timestamp
              ? (
                  '<span class="chat-time">' +
                  escapeHtml(
                    formatTime(
                      item.timestamp
                    )
                  ) +
                  '</span>'
                )
              : "";


          return (
            '<div class="chat-message ' +
            role +
            '">' +

              escapeHtml(
                text
              ) +

              time +

            '</div>'
          );

        }
      )
      .join("");


  messages.scrollTop =
    messages.scrollHeight;

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


  if (
    !textarea
  ) {

    return;

  }


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


  if (
    form
  ) {

    form.classList.toggle(
      "show"
    );

  }

}


/* =========================================================
   FORMAT TIME
========================================================= */

function formatTime(
  value
) {

  if (
    !value
  ) {

    return "";

  }


  try {

    return new Date(
      value
    ).toLocaleString();

  }

  catch (
    error
  ) {

    return String(
      value
    );

  }

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


    const secretInput =
      document.getElementById(
        "secret"
      );


    if (
      secretInput &&
      adminSecret
    ) {

      secretInput.value =
        adminSecret;

    }


    if (
      adminSecret
    ) {

      loadClients();

    }

  }
);


/* =========================================================
   CHAT SEND — ENTER
========================================================= */

const chatReplyInput =
  document.getElementById(
    "chatReply"
  );


if (
  chatReplyInput
) {

  chatReplyInput.addEventListener(
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

}


/* =========================================================
   SEARCH — ENTER
========================================================= */

const searchInput =
  document.getElementById(
    "search"
  );


if (
  searchInput
) {

  searchInput.addEventListener(
    "keydown",
    function(event) {

      if (
        event.key ===
        "Enter"
      ) {

        event.preventDefault();

        renderClients();

      }

    }
  );

}


/* =========================================================
   ESCAPE KEY
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
/* =========================================================
   END ADMIN UI SCRIPT
========================================================= */

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
  (
    req,
    res
  ) => {

    res.send(
      "Instagram automation is running."
    );

  }
);


/* =========================================================
   START SERVER
========================================================= */

async function startServer() {

  try {

    await hydrateAdminConversations();


    await restorePendingReminders();


    app.listen(
      PORT,
      () => {

        console.log(
          `Server running on port ${PORT}`
        );

      }
    );

  }

  catch (
    error
  ) {

    console.error(
      "SERVER START ERROR:",
      error
    );


    process.exit(
      1
    );

  }

}


startServer();


/* =========================================================
   END FILE
========================================================= */
