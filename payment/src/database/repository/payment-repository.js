const {  PaymentModel } = require("../models");

class PaymentRepository {
  async saveTransaction({ orderId, amount }) {
    const newTransaction = new PaymentModel({
      orderId,
      amount,
    });
    return newTransaction.save();
  }
}

module.exports = PaymentRepository;
