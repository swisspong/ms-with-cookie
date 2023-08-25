const { PAYMENT_SERVICE } = require("../config");
const ShoppingService = require("../services/shopping-service");
const { subscribeMessage, publishMessage } = require("../utils");
const UserAuth = require("./middlewares/auth");
const { v4: uuidv4 } = require("uuid");
const { SseModel } = require("../database/models");

module.exports = (app, channel) => {
  const service = new ShoppingService();


  subscribeMessage(channel, service);

 



  // Cart
  app.post("/cart", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const { product_id, qty } = req.body;
    const { data } = await service.addCartItem(_id, product_id, qty);
    res.status(200).json(data);
  });

  app.delete("/cart/:id", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const productId = req.params.id;
    const { data } = await service.removeCartItem(_id, productId);
    res.status(200).json(data);
  });

  app.get("/cart", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const data = await service.getCart(_id);
    return res.status(200).json(data);
  });

  // Wishlist
  app.post("/wishlist", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const { product_id } = req.body;
    console.log(req.body);
    const data = await service.addToWishlist(_id, product_id);
    return res.status(200).json(data);
  });
  app.get("/wishlist", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const data = await service.getWishlist(_id);
    return res.status(200).json(data);
  });
  app.delete("/wishlist/:id", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const product_id = req.params.id;
    const data = await service.removeFromWishlist(_id, product_id);
    return res.status(200).json(data);
  });

  // Orders
  app.post("/order", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const { txnNumber} = req.body;
    const { data, payload } = await service.createOrder(
      _id,
      txnNumber
    );
    publishMessage(channel, PAYMENT_SERVICE, JSON.stringify(payload));
    return res.status(200).json(data);
  });

  app.get("/order/:id", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const data = await service.getOrder(req.params.id);
    return res.status(200).json(data);
  });

  app.get("/orders", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const data = await service.getOrders(_id);
    return res.status(200).json(data);
  });

  app.get("/whoami", (req, res, next) => {
    return res.status(200).json({ msg: "/shoping : I am Shopping Service" });
  });
};
