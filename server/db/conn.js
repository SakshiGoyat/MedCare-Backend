const mongoose = require("mongoose");
const dotenv = require("dotenv");
const color = require("colors");
mongoose.set("strictQuery", true);

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE;

const connectDB = async () => {
  try {
    await mongoose
      .connect(DB)
      .then(() => {
        console.log(`MongoDb connected ${mongoose.connection.host}`.bgGreen.white);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(`Mongodb Server Issue ${error}.bgRed.white`);
  }
};

module.exports = connectDB;