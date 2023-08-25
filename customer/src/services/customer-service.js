const { CustomerRepository } = require("../database");
const bcrypt = require("bcryptjs");
const {
  validatePassword,
  generateSignature,
  generateSalt,
  comparePassword,
  generateHash,
  comparePasswordWithHash,
} = require("../utils");
const {
  NotFoundError,
  ValidationError,
} = require("../utils/errors/app-errors");

class CustomerService {
  constructor() {
    this.repository = new CustomerRepository();
  }
  async signIn({ email, password }) {
    const existingCustomer = await this.repository.findCustomerByEmail({
      email,
    });

    if (!existingCustomer)
      throw new NotFoundError("user not found with provided email id!");

    // const validPassword = await comparePassword(
    //   password,
    //   existingCustomer.password
    // );
    const validPassword = comparePasswordWithHash(
      password,
      existingCustomer.password
    );

    if (!validPassword) throw new ValidationError("password does not match!");

    const token = await generateSignature({
      email: existingCustomer.email,
      _id: existingCustomer.id,
    });
    return { id: existingCustomer._id, token };
  }
  async signUp({ email, password, phone }) {
    console.log("signup")
    const hash = generateHash(password);
    // const salt = bcrypt.genSaltSync(10);
    //   const hashPassword = bcrypt.hashSync(password, salt);
    //   console.log(hashPassword)
    const existingCustomer = await this.repository.createCustomer({
      email,
      password: hash,
      phone,
    });

    const token = await generateSignature({
      email: email,
      _id: existingCustomer._id,
    });
    return { id: existingCustomer._id, token };
  }
  async addNewAddress(_id, { street, postalCode, city, country }) {
    return this.repository.createAddress({
      _id,
      city,
      country,
      postalCode,
      street,
    });
  }
  async getProfile(id) {
    return this.repository.findCustomerById({ id });
  }

  async deleteProfile(userId) {
    const data = await this.repository.deleteCustomerById(userId);
    const payload = {
      event: "DELETE_PROFILE",
      data: { userId },
    };
    return { data, payload };
  }
}

module.exports = CustomerService;
