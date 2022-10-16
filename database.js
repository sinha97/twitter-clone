const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();


class Database {
  constructor() {
    this.connect();
  }

  connect() {
    mongoose
      .connect(
        process.env.DATABASE
      )
      .then(() => {
        console.log("database connected ,successfuly!!!");
      })
      .catch((err) => {
        console.log("database connection err " + err);
      });
  }
}

module.exports = new Database();