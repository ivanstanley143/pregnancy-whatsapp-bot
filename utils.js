const moment = require("moment-timezone");
const data = require("./data");

exports.now = () =>
  moment().tz(process.env.TIMEZONE || "Asia/Kolkata");

exports.getPregnancy = () => {
  const lmp = moment(data.LMP);
  const days = exports.now().diff(lmp, "days");
  return { week: Math.floor(days / 7) };
};

exports.getTrimester = (week) => {
  if (week <= 12) return 1;
  if (week <= 27) return 2;
  return 3;
};

exports.format = (en, ml) => {
  return `Hi ${data.NAME},
Assalamu Alaikkum 🌸

${en}
${ml}

${data.DISCLAIMER}`;
};
