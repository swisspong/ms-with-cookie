const ProductService = require("../services/product-service");
const { RPCObserver, subscribeMessage } = require("../utils");

module.exports = (app, channel) => {
  const service = new ProductService(channel);

  app.use((req, res, next) => {
    console.log("app.use")
    RPCObserver("PRODUCT_RPC", service);
    next()
  });

  subscribeMessage(channel, service);
  app.get("/", async (req, res, next) => {
    const { data } = await service.getProducts();
    return res.status(200).json(data);
  });
  app.post("/create", async (req, res, next) => {
    const { name, desc, type, unit, price, available, suplier, banner } =
      req.body;
    // validation
    const { data } = await service.createProduct({
      name,
      desc,
      type,
      unit,
      price,
      available,
      suplier,
      banner,
    });
    return res.json(data);
  });

  app.get("/category/:type", async (req, res, next) => {
    const type = req.params.type;

    try {
      const { data } = await service.getProductsByCategory(type);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(404).json({ error });
    }
  });

  app.get("/:id", async (req, res, next) => {
    const productId = req.params.id;

    try {
      const { data } = await service.getProductDescription(productId);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(404).json({ error });
    }
  });

  app.post("/ids", async (req, res, next) => {
    const { ids } = req.body;
    const products = await service.getSelectedProducts(ids);
    return res.status(200).json(products);
  });
  app.get("/whoami", (req, res, next) => {
    return res
      .status(200)
      .json({ msg: "/ or /products : I am products Service" });
  });

  //get Top products and category
  app.get("/", async (req, res, next) => {
    //check validation
    try {
      const { data } = await service.getProducts();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(404).json({ error });
    }
  });
};
