const mongoose = require("mongoose");
const { DB_URL } = require("../config");

module.exports = async () => {
  try {
    mongoose.set("strictQuery", false);
    console.log(DB_URL);
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB Connected");
  } catch (error) {
    console.log("Error ===== ON DB Connection");
    console.log(error);
  }
};
