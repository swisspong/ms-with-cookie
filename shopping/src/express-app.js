const express = require("express");
const cors = require("cors");
const path = require("path");
const { shopping, appEvents } = require("./api");
const { createChannel } = require("./utils");
const cookieParser = require("cookie-parser");

module.exports = async (app) => {
  app.use(express.json());
  //   var whitelist = ["http://localhost:3000", "http://localhost:3001"];
  //   var corsOptionsDelegate = function (req, callback) {
  //     var corsOptions;
  //     if (whitelist.indexOf(req.header("Origin")) !== -1) {
  //       corsOptions = { origin: true, credentials: true }; // reflect (enable) the requested origin in the CORS response
  //     } else {
  //       corsOptions = { origin: false, credentials: true }; // disable CORS for this request
  //     }
  //     callback(null, corsOptions); // callback expects two parameters: error and options
  //   };
  //   app.use(cors(corsOptionsDelegate));
  //   app.use(
  //     cors({
  //       methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",

  //     })
  //   );
  app.use(cookieParser())
  // app.use(
  //   cors({
  //     origin: "http://localhost:3000",
  //     credentials: true,
  //   })
  // );
  app.use(express.static(__dirname + "/public"));

  //api
  // appEvents(app);

  const channel = await createChannel();

  shopping(app, channel);
  // error handling
};
