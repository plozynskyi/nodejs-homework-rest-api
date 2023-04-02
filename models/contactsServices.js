const ObjectId = require('mongodb').ObjectId;

const listContacts = async ({ db }) => {
  const { Contacts } = db;
  const data = await Contacts.find({}).toArray();
  return data;
};

const getContactById = async (id, req) => {
  const { Contacts } = req.db;
  const result = await Contacts.findOne({ _id: new ObjectId(id) });

  return result || null;
};

const addContact = async ({ body, db }) => {
  const { Contacts } = db;
  const name = body.name;
  const email = body.email;
  const phone = body.phone;
  const favorite = body.favorite;

  await Contacts.insertOne({ name, email, phone, favorite });

  return { name, email, phone, favorite };
};

const updateContact = async (id, { body, db }) => {
  const { Contacts } = db;
  const name = body.name;
  const email = body.email;
  const phone = body.phone;
  const favorite = body.favorite;

  await Contacts.updateOne(
    { _id: new ObjectId(id) },
    { $set: { name, email, phone } }
  );
  return { id, name, email, phone, favorite };
};

const removeContact = async (id, { body, db }) => {
  const { Contacts } = db;

  await Contacts.deleteOne({ _id: new ObjectId(id) });
  return { id };
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
};
