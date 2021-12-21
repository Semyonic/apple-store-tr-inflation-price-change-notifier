require("dotenv").config();
const notifier = require("node-notifier");
const { get } = require("axios");
const { join } = require("path");

let cache;
const notificationConfig = {
  icon: join(__dirname, "resources/apple.png"),
  wait: true,
};

setInterval(async () => {
  const result = await get(process.env.MACBOOK_AIR_16);
  const price = parseFloat(
    result.data.body.replace.purchaseInfo.priceData.fullPrice.raw.price
  ).toFixed(2);
  if (!cache) {
    cache = price;
  } else if (price === cache) return;
  else if (price > cache) {
    notifier.notify({
      ...notificationConfig,
      title: "Price increased",
      message: `Price changed from ${cache} to ${price}`,
    });
  } else if (price < cache) {
    notifier.notify({
      ...notificationConfig,
      title: "Price decreased",
      message: `Price changed from ${cache} to ${price}`,
    });
  }
}, Number(process.env.CHECK_INTERVAL));
