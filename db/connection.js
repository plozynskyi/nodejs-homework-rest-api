const { MongoClient, ServerApiVersion } = require('mongodb');

const collections = {};

const getCollections = () => {
  return collections;
};

const dotenv = require('dotenv');
dotenv.config();

const { MONGO_URL } = process.env;

const connectMongo = async () => {
  const client = await MongoClient.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });
  const db = client.db();
  collections.Contacts = db.collection('contacts');
  console.log('Database (MongoDB) connected successful');
};

module.exports = { connectMongo, getCollections };
