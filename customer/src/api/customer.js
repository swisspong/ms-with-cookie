const { SHOPPING_SERVICE } = require("../config");
const CustomerService = require("../services/customer-service");
const { publishMessage } = require("../utils");
const userAuth = require("./middlewares/auth");
module.exports = (app, channel) => {
  const service = new CustomerService();

  app.post("/signup", async (req, res, next) => {
    try {
      const { email, password, phone } = req.body;
      const data = await service.signUp({ email, password, phone });
      //return res.json(data);
      return res
        .cookie("acjid", data.token, {
          httpOnly: true,
          // sameSite: "None",
          secure: true,
        })
        .sendStatus(204);
    } catch (error) {
      next(error);
    }
  });

  app.post("/signin", async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const data = await service.signIn({ email, password });
     // return res.json(data);
      return res
        .cookie("acjid", data.token, {
          httpOnly: true,
          // sameSite: "None",
          secure: true,
        })
        .sendStatus(204);
    } catch (error) {
      next(error);
    }
  });

  app.post("/address", userAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { street, postalCode, city, country } = req.body;
      const data = await service.addNewAddress(_id, {
        city,
        country,
        postalCode,
        street,
      });
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });
  app.get("/profile", userAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const data = await service.getProfile({ _id });
    } catch (error) {
      next(error);
    }
  });
  app.delete("/profile", userAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data, payload } = await service.deleteProfile(_id);

      publishMessage(channel, SHOPPING_SERVICE, JSON.stringify(payload));
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });
  app.get("/whoami", (req, res, next) => {
    return res.status(200).json({ msg: "/customer :I am Customer Service" });
  });
};
