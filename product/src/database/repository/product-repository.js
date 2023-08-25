const { ProductModel } = require("../models");

class ProductRepository {
  async createProduct({
    name,
    desc,
    type,
    unit,
    price,
    available,
    suplier,
    banner,
  }) {
    const product = new ProductModel({
      name,
      available,
      banner,
      desc,
      price,
      suplier,
      type,
      unit,
    });

    const result = await product.save();
    return result;
  }

  async products() {
    return await ProductModel.find();
  }
  async findById(id) {
    return await ProductModel.findById(id);
  }
  async findByCategory(category) {
    const product = await ProductModel.find({ type: category });
    return product;
  }
  async findSelectedProducts(selectedIds) {
    console.log(selectedIds)
    const products = await ProductModel.find()
      .where("_id")
      .in(selectedIds.map((_id) => _id))
      .exec();
    return products;
  }
}

module.exports = ProductRepository;
