require("dotenv").config();
const express = require("express");
const axios = require("axios");
const logic = require("./logic");
const scheduler = require("./scheduler");

const app = express();
app.use(express.json());

scheduler();

app.get("/webhook", (req, res) => {
  if (req.query["hub.verify_token"] === process.env.VERIFY_TOKEN)
    return res.send(req.query["hub.challenge"]);
  res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {
  const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (msg?.text) {
    const result = await logic(msg.text.body);
    if (result) {
      if (typeof result === "string") {
        await axios.post(
          `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`,
          { messaging_product: "whatsapp", to: msg.from, text: { body: result } },
          { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` } }
        );
      } else {
        await axios.post(
          `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`,
          {
            messaging_product: "whatsapp",
            to: msg.from,
            type: "image",
            image: { link: result.image, caption: result.caption }
          },
          { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` } }
        );
      }
    }
  }
  res.sendStatus(200);
});

app.listen(process.env.PORT || 3000, () =>
  console.log("Pregnancy WhatsApp bot running")
);
