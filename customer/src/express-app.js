const express = require("express");
const cors = require("cors");
const { customer } = require("./api");
const { createChannel } = require("./utils");
const cookieParser = require("cookie-parser");

module.exports = async (app) => {
  app.use(express.json());
  app.use(cookieParser());
  // app.use(cors({
  //   origin:'http://localhost:3000',
  //   credentials:true
  // }));
  app.use(express.static(__dirname + "/public"));
  const channel = await createChannel();

  customer(app, channel);
};
