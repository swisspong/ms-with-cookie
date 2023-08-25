const express = require("express");
const cors = require("cors");

const { createChannel } = require("./utils");
const { product } = require("./api");
const bodyParser = require("body-parser");

module.exports = async (app) => {
  // app.use(express.json());
  app.use(bodyParser.json());
  // var whitelist = ["http://localhost:3000", "http://localhost:3001"];
  // var corsOptionsDelegate = function (req, callback) {
  //   var corsOptions;
  //   if (whitelist.indexOf(req.header("Origin")) !== -1) {
  //     corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  //   } else {
  //     corsOptions = { origin: false }; // disable CORS for this request
  //   }
  //   callback(null, corsOptions); // callback expects two parameters: error and options
  // };
  // app.use(cors(corsOptionsDelegate));
  // app.use(cors({
  //   origin:'http://localhost:3000',
  //   credentials:true
  // }));
  //app.use(console.log("ds"))

  app.use(express.static(__dirname + "/public"));

  const channel = await createChannel();

  product(app, channel);

  // error handling
};
