const { ShoppingRepository } = require("../database");
const { SseModel } = require("../database/models");
const { formatData, RPCRequest } = require("../utils");

// All Business logic will be here
class ShoppingService {
  constructor() {
    this.repository = new ShoppingRepository();
  }

  // Cart Info
  async addCartItem(customerId, product_id, qty) {
    // Grab product info from product Service through RPC
    const productResponse = await RPCRequest("PRODUCT_RPC", {
      type: "VIEW_PRODUCT",
      data: product_id,
    });
    if (productResponse && productResponse._id) {
      const data = await this.repository.manageCart(
        customerId,
        productResponse,
        qty
      );
      return data;
    }

    throw new Error("Product data not found!");
  }

  async removeCartItem(customerId, product_id) {
    return await this.repository.manageCart(
      customerId,
      { _id: product_id },
      0,
      true
    );
  }

  async getCart(_id) {
    return this.repository.cart(_id);
  }

  // Wishlist
  async addToWishlist(customerId, product_id) {
    return this.repository.manageWishlist(customerId, product_id);
  }

  async removeFromWishlist(customerId, product_id) {
    return this.repository.manageWishlist(customerId, product_id, true);
  }

  async getWishlist(customerId) {
    const wishlist = await this.repository.getWishlistByCustomerId(customerId);
    if (!wishlist) {
      return {};
    }
    const { products } = wishlist;

    if (Array.isArray(products)) {
      const ids = products.map(({ _id }) => _id);
      // Perform RPC call
      const productResponse = await RPCRequest("PRODUCT_RPC", {
        type: "VIEW_PRODUCTS",
        data: ids,
      });
      if (productResponse) {
        return productResponse;
      }
    }

    return {};
  }

  // Orders
  async createOrder(customerId, txnNumber) {
    const data = await this.repository.createNewOrder(
      customerId,
      txnNumber,

    );
    const payload = {
      event: "ORDER_CREATED",
      data: data,
    };
    return { data, payload };
  }

  async getOrder(orderId) {
    return this.repository.orders("", orderId);
  }

  async getOrders(customerId) {
    return this.repository.orders(customerId);
  }

  async manageCart(customerId, item, qty, isRemove) {
    const cartResult = await this.repository.addCartItem(
      customerId,
      item,
      qty,
      isRemove
    );
    return formatData(cartResult);
  }

  // async SubscribeEvents(payload) {
  //   payload = JSON.parse(payload);
  //   const { event, data } = payload;
  //   const { userId, product, qty } = data;

  //   switch (event) {
  //     case "ADD_TO_CART":
  //       this.manageCart(userId, product, qty, false);
  //       break;
  //     case "REMOVE_FROM_CART":
  //       this.manageCart(userId, product, qty, true);
  //       break;
  //     default:
  //       break;
  //   }
  // }

  async deleteProfileData(customerId) {
    return this.repository.deleteProfileData(customerId);
  }
  async orderSuccess(orderId) {
    return this.repository.updateOrderStatus(orderId, "received");
  }

  async subscribeEvents(payload) {
    payload = JSON.parse(payload);
    const { event, data } = payload;
    switch (event) {
      case "DELETE_PROFILE":
        await this.deleteProfileData(data.userId);
        break;
      case "ORDER_PREPARED":
        console.log("success");
        setTimeout(async ()=>{
          const resultDb = await this.orderSuccess(data);

        },5000)
        //console.log(subscribers);

        break;
      default:
        break;
    }
  }

  // async GetOrderPayload(userId, order, event) {
  //   if (order) {
  //     const payload = {
  //       event: event,
  //       data: { userId, order },
  //     };

  //     return payload;
  //   } else {
  //     return FormateData({ error: "No Order Available" });
  //   }
  // }
}

module.exports = ShoppingService;
