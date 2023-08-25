const { OrderModel, CartModel, WishlistModel } = require("../models");
const { v4: uuidv4 } = require("uuid");
const _ = require("lodash");

//Dealing with data base operations
class ShoppingRepository {
  // Cart
  async cart(customerId) {
    return CartModel.findOne({ customerId });
  }

  async manageCart(customerId, product, qty, isRemove) {
    const cart = await CartModel.findOne({ customerId });
    if (cart) {
      if (isRemove) {
        const cartItems = _.filter(
          cart.items,
          (item) => item.product._id !== product._id
        );
        cart.items = cartItems;
        // handle remove case
      } else {
        const cartIndex = _.findIndex(cart.items, {
          product: { _id: product._id },
        });
        if (cartIndex > -1) {
          cart.items[cartIndex].unit = qty;
        } else {
          cart.items.push({ product: { ...product }, unit: qty });
        }
      }
      return await cart.save();
    } else {
      // create a new one
      return await CartModel.create({
        customerId,
        items: [{ product: { ...product }, unit: qty }],
      });
    }
  }

  async manageWishlist(customerId, product_id, isRemove = false) {
    const wishlist = await WishlistModel.findOne({ customerId });
    if (wishlist) {
      if (isRemove) {
        const produtcs = _.filter(
          wishlist.products,
          (product) => product._id !== product_id
        );
        wishlist.products = produtcs;
        // handle remove case
      } else {
        const wishlistIndex = _.findIndex(wishlist.products, {
          _id: product_id,
        });
        if (wishlistIndex < 0) {
          wishlist.products.push({ _id: product_id });
        }
      }
      return await wishlist.save();
    } else {
      // create a new one
      return await WishlistModel.create({
        customerId,
        wishlist: [{ _id: product_id }],
      });
    }
  }

  async getWishlistByCustomerId(customerId) {
    return WishlistModel.findOne({ customerId });
  }

  async orders(customerId, orderId) {
    if (orderId) {
      return OrderModel.findOne({ _id: orderId });
    } else {
      return OrderModel.find({ customerId });
    }
  }

  async createNewOrder(customerId, txnId) {
    const cart = await CartModel.findOne({ customerId: customerId });

    if (cart) {
      let amount = 0;

      let cartItems = cart.items;

      if (cartItems.length > 0) {
        //process Order

        cartItems.map((item) => {
          amount += parseInt(item.product.price) * parseInt(item.unit);
        });

        const orderId = uuidv4();

        const order = new OrderModel({
          orderId,
          customerId,
          amount,
          //status: "received",

          status: "pending",
          items: cartItems,
        });

        cart.items = [];

        const orderResult = await order.save();
        await cart.save();
        return orderResult;
      }
    }

    return {};
  }
  async updateOrderStatus(orderId, status) {
    const existingOrder = await OrderModel.findById(orderId);
    existingOrder.status = status;
    return await existingOrder.save();
  }

  async deleteProfileData(customerId) {
    return Promise.all([
      CartModel.findOneAndDelete({ customerId }),
      WishlistModel.findOneAndDelete({ customerId }),
    ]);
  }
}

module.exports = ShoppingRepository;
