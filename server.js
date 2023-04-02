const dotenv = require('dotenv');

const app = require('./app');
const { connectMongo } = require('./db/connection');

dotenv.config();

const { PORT } = process.env;

const start = async () => {
  try {
    await connectMongo();

    app.listen(PORT, err => {
      if (err) {
        console.log('Error at server launch', err);
      }
    });
  } catch (err) {
    console.log(`Failed to launch application with error: ${err.message} `);
  }
};

start();
