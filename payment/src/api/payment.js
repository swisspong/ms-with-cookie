
const PaymentService = require("../services/payment-service");
const {  subscribeMessage } = require("../utils");

module.exports = (app, channel) => {
  const service = new PaymentService(channel);

  subscribeMessage(channel, service);

  // app.delete("/profile", userAuth, async (req, res, next) => {
  //   try {
  //     const { _id } = req.user;
  //     const { data, payload } = await service.deleteProfile(_id);

  //     publishMessage(channel, SHOPPING_SERVICE, JSON.stringify(payload));
  //     return res.json(data);
  //   } catch (error) {
  //     next(error);
  //   }
  // });
  app.get("/whoami", (req, res, next) => {
    return res.status(200).json({ msg: "/payment :I am Payment Service" });
  });
};
