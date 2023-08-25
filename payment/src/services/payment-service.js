const { PRODUCT_SERVICE } = require("../config");
const { PayementRepository } = require("../database");
const { publishMessage } = require("../utils");
const {
  NotFoundError,
  ValidationError,
} = require("../utils/errors/app-errors");

class PaymentService {
  constructor(channel) {
    this.channel = channel;
    this.repository = new PayementRepository();
  }
  async paidOrder({ order }) {
    const result = await this.repository.saveTransaction({
      orderId: order._id,
      amount: order.amount,
    });
    const payload = {
      event: "PAYMENT_BILLED",
      data: order,
    };
    publishMessage(this.channel, PRODUCT_SERVICE, JSON.stringify(payload));
    return result;
  }

  async deleteProfile(userId) {
    const data = await this.repository.deleteCustomerById(userId);
    const payload = {
      event: "DELETE_PROFILE",
      data: { userId },
    };
    return { data, payload };
  }

  async subscribeEvents(payload) {
    payload = JSON.parse(payload);
    const { event, data } = payload;
    switch (event) {
      case "ORDER_CREATED":
        console.log(data);
        await this.paidOrder({ order: data });

        break;
      default:
        break;
    }
  }
}

module.exports = PaymentService;
