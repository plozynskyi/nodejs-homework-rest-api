const { Contact } = require('../db/contactsModel');

const getContactsService = async contactId => {
  const contacts = await Contact.find({ contactId });
  return contacts;
};

const getContactByIdService = async id => {
  const result = await Contact.findById(id);
  return result || null;
};

const addContactService = async (
  { name, email, phone, favorite },
  contactId
) => {
  const contact = new Contact({ name, email, phone, favorite, contactId });
  await contact.save();
  return contact;
};

const updateContactByIdService = async (
  id,
  { name, email, phone, favorite }
) => {
  const updateContact = await Contact.findByIdAndUpdate(
    id,
    {
      $set: { name, email, phone, favorite },
    },
    { new: true }
  );

  return updateContact || null;
};

const removeContactByIdService = async id => {
  const removeContact = await Contact.findByIdAndDelete(id);
  return removeContact || null;
};

const updateStatusContactByIdService = async (id, { favorite }) => {
  const updateStatus = await Contact.findByIdAndUpdate(
    id,
    {
      $set: { favorite },
    },
    { new: true }
  );
  return updateStatus || null;
};

module.exports = {
  getContactsService,
  getContactByIdService,
  addContactService,
  updateContactByIdService,
  removeContactByIdService,
  updateStatusContactByIdService,
};
