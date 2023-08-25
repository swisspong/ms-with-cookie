const dotenv = require("dotenv");
const path = require("path");
if (process.env.NODE_ENV !== "prod") {
  const configFile = path.resolve(
    __dirname,
    `../../.env.${process.env.NODE_ENV.trim()}`
  );

  dotenv.config({ path: configFile });
} else {
  dotenv.config();
}

module.exports = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGODB_URI,
  APP_SECRET: process.env.APP_SECRET,
  EXCHANGE_NAME: process.env.EXCHANGE_NAME,
  MSG_QUEUE_URL: process.env.MSG_QUEUE_URL,
  CUSTOMER_SERVICE: "customer_service",
  SHOPPING_SERVICE: "shopping_service",
};
