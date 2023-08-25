const { default: mongoose } = require("mongoose");
const {
  NotFoundError,
  ValidationError,
} = require("../../../customer/src/utils/errors/app-errors");
const { SHOPPING_SERVICE } = require("../config");
const { ProductRepository } = require("../database");
const { formatData, publishMessage } = require("../utils");

class ProductService {
  constructor(channel) {
    this.channel = channel;
    this.repository = new ProductRepository();
  }
  
  async createProduct(productInputs) {
    const productResult = await this.repository.createProduct(productInputs);
    return formatData(productResult);
  }

  async getProducts() {
    const products = await this.repository.products();
    let categories = {};

    products.map(({ type }) => {
      categories[type] = type;
    });

    return formatData({
      products,
      categories: Object.keys(categories),
    });
  }

  async getProductDescription(productId) {
    const product = await this.repository.findById(productId);
    return formatData(product);
  }

  async getProductsByCategory(category) {
    const products = await this.repository.findByCategory(category);
    return formatData(products);
  }

  async getSelectedProducts(selectedIds) {
    const products = await this.repository.findSelectedProducts(selectedIds);
    return formatData(products);
  }

  async cutStock(order) {
    //const db = await databaseConnection();
    const session = await mongoose.startSession();
    try {
      console.log(order.items);
      session.startTransaction();
      const result = await Promise.all(
        order.items.map(async (item) => {
          const existingProduct = await this.repository.findById(
            item.product._id
          );
          // console.log(existingProduct);
          if (!existingProduct) throw new NotFoundError("Data Not Found!");
          if (existingProduct.unit < item.unit)
            throw new ValidationError("Product Not Enough!");

          existingProduct.unit = existingProduct.unit - item.unit;
          return await existingProduct.save();
        })
      );
      await session.commitTransaction();
      const payload = {
        event: "ORDER_PREPARED",
        data: order._id,
      };
      publishMessage(this.channel, SHOPPING_SERVICE, JSON.stringify(payload));
      return result;
    } catch (error) {
      console.log(error)
      await session.abortTransaction()
    }
    session.endSession();
  }

  // RPC Response
  async serveRPCRequest(payload) {
    const { type, data } = payload;
    switch (type) {
      case "VIEW_PRODUCT":
        return this.repository.findById(data);

      case "VIEW_PRODUCTS":
        return this.repository.findSelectedProducts(data);
      default:
        break;
    }
  }

  async subscribeEvents(payload) {
    payload = JSON.parse(payload);
    const { event, data } = payload;
    switch (event) {
      case "PAYMENT_BILLED":
        console.log("Payment billed start");
        await this.cutStock(data);

        break;
      default:
        break;
    }
  }
}

module.exports = ProductService;
