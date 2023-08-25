const express = require("express");
const { databaseConnnection } = require("./database");
const expressApp = require("./express-app");
const errorHandler = require("./utils/errors");
const { createChannel } = require("./utils");
const { PORT } = require("./config");

const startServer = async () => {
  const app = express();

  await databaseConnnection();

  const channel = await createChannel();

  await expressApp(app, channel);

  errorHandler(app);

  app
    .listen(PORT, () => {
      console.log(`listening on port ${PORT}`);
    })
    .on("error", (err) => {
      console.log(err);
      process.exit();
    })
    .on("close", () => {
      channel.close();
    });
};

startServer();
