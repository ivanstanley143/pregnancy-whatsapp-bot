const cron = require("node-cron");
const axios = require("axios");
const data = require("./data");
const utils = require("./utils");

let LAST_WEEK = null;
let LAST_TRIMESTER = null;

const sendText = async (to, text) => {
  await axios.post(
    `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`,
    { messaging_product: "whatsapp", to, text: { body: text } },
    { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` } }
  );
};

const sendImage = async (to, image, caption) => {
  await axios.post(
    `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to,
      type: "image",
      image: { link: image, caption }
    },
    { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` } }
  );
};

module.exports = () => {

  // 💧 Water
  data.WATER_TIMES.forEach(t => {
    cron.schedule(`${t.split(":")[1]} ${t.split(":")[0]} * * *`, () => {
      sendText(
        data.USER,
        utils.format("💧 Please drink water", "💧 ദയവായി വെള്ളം കുടിക്കൂ")
      );
    });
  });

  // 🍽 Meals with names
  const meals = {
    "09:00": ["🍽️ Breakfast time", "🍽️ പ്രഭാതഭക്ഷണ സമയം"],
    "12:00": ["🍎 Snack time", "🍎 ഇടക്കാല ലഘുഭക്ഷണം"],
    "15:00": ["🥗 Light meal time", "🥗 ലഘുഭക്ഷണ സമയം"],
    "18:00": ["☕ Evening snack time", "☕ സായാഹ്ന ലഘുഭക്ഷണം"],
    "19:30": ["🍽️ Dinner time", "🍽️ രാത്രി ഭക്ഷണം"],
    "21:30": ["🥛 Light food time", "🥛 പാൽ / ലഘുഭക്ഷണം"]
  };

  Object.keys(meals).forEach(t => {
    cron.schedule(`${t.split(":")[1]} ${t.split(":")[0]} * * *`, () => {
      sendText(data.USER, utils.format(meals[t][0], meals[t][1]));
    });
  });

  // 🌙 Weekly dua
  cron.schedule("0 9 * * 5", () => {
    const { week } = utils.getPregnancy();
    if (data.WEEKLY_DUA[week]) {
      sendText(
        data.USER,
        utils.format(
          `🌙 Weekly Dua\n${data.WEEKLY_DUA[week]}`,
          "🌙 ആഴ്ചയിലെ ദുആ"
        )
      );
    }
  });

  // 📅 Appointment
  cron.schedule("* * * * *", () => {
    const now = utils.now();
    data.APPOINTMENTS.forEach(a => {
      if (a.date === now.format("YYYY-MM-DD") &&
          a.time === now.format("HH:mm")) {
        const msg = utils.format(
          `📅 ${a.note}`,
          "📅 ഇന്ന് ഡോക്ടർ അപ്പോയിന്റ്മെന്റ്"
        );
        sendText(data.USER, msg);
        sendText(data.HUSBAND, msg);
      }
    });
  });

  // 🤰 Trimester & baby growth
  cron.schedule("* * * * *", () => {
    const { week } = utils.getPregnancy();
    const trimester = utils.getTrimester(week);

    if (trimester !== LAST_TRIMESTER) {
      sendImage(
        data.USER,
        data.TRIMESTER_IMAGES[trimester],
        utils.format(
          `🌸 Trimester ${trimester} started`,
          `🌸 ട്രൈമെസ്റ്റർ ${trimester} ആരംഭിച്ചു`
        )
      );
      LAST_TRIMESTER = trimester;
    }

    if (week !== LAST_WEEK && data.BABY_IMAGES[week]) {
      const b = data.BABY_IMAGES[week];
      sendImage(
        data.USER,
        b.image,
        utils.format(
          `🤰 Week ${week}\nBaby size: ${b.size}`,
          `🤰 ${week} ആഴ്ച\nകുഞ്ഞിന്റെ വലുപ്പം: ${b.size}`
        )
      );
      LAST_WEEK = week;
    }
  });
};
