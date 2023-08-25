const express = require("express");
const cors = require("cors");
const { payment } = require("./api");
const { createChannel } = require("./utils");

module.exports = async (app) => {
  app.use(express.json());
  app.use(cors());
  app.use(express.static(__dirname + "/public"));
  const channel = await createChannel();

  payment(app, channel);
};
