const data = require("./data");
const utils = require("./utils");

module.exports = async (text) => {
  const msg = text.toLowerCase();

  for (const food in data.FOOD_DB) {
    if (msg.includes(food)) {
      return utils.format(
        `${food.toUpperCase()} : ${data.FOOD_DB[food]}`,
        `${food} : ${data.FOOD_DB[food]}`
      );
    }
  }

  if (msg === "safe foods") {
    return {
      type: "image",
      image: data.SAFE_FOOD_IMAGE,
      caption: utils.format(
        "🥗 Pregnancy safe foods",
        "🥗 ഗർഭകാലത്ത് സുരക്ഷിതമായ ഭക്ഷണങ്ങൾ"
      )
    };
  }

  if (msg === "avoid foods") {
    return {
      type: "image",
      image: data.AVOID_FOOD_IMAGE,
      caption: utils.format(
        "🚫 Foods to avoid during pregnancy",
        "🚫 ഗർഭകാലത്ത് ഒഴിവാക്കേണ്ട ഭക്ഷണങ്ങൾ"
      )
    };
  }

  if (msg === "limit foods") {
    return {
      type: "image",
      image: data.LIMIT_FOOD_IMAGE,
      caption: utils.format(
        "⚠️ Foods to limit during pregnancy",
        "⚠️ ഗർഭകാലത്ത് കുറയ്ക്കേണ്ട ഭക്ഷണങ്ങൾ"
      )
    };
  }

  return null;
};
