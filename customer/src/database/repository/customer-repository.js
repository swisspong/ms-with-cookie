const { CustomerModel, AddressModel } = require("../models");

class CustomerRepository {
  async createCustomer({ email, password, phone }) {
    const customer = new CustomerModel({
      email,
      password,
      phone,
      address: [],
    });
    const result = await customer.save();
    return result;
  }
  async createAddress({ _id, street, postalCode, city, country }) {
    const profile = await CustomerModel.findById(_id);

    if (profile) {
      const newAddress = new AddressModel({
        city,
        country,
        postal: postalCode,
        street,
      });
      await newAddress.save();
      profile.address.push(newAddress);
    }
    return await profile.save();
  }
  async findCustomerByEmail({ email }) {
    const existingCustomer = await CustomerModel.findOne({ email });
    return existingCustomer;
  }
  async findCustomerById({ id }) {
    const existingCustomer = await CustomerModel.findById(id).populate(
      "address"
    );
    return existingCustomer;
  }
  async deleteCustomerById(id) {
    return CustomerModel.findByIdAndDelete(id);
  }
}

module.exports = CustomerRepository;
