const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config();

const { MONGO_URL } = process.env;

const connectMongo = async () => {
  await mongoose
    .connect(MONGO_URL)
    .then(console.log('Database (MongoDB) connected successful'))
    .catch(error => {
      console.log(error.message);
      process.exit(1);
    });
};

module.exports = { connectMongo };
