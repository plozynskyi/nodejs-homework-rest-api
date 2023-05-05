const { Contact } = require('../db/contactsModel');

const getContactsService = async (
  owner,
  { page = 1, limit = 20, favorite }
) => {
  const skip = (page - 1) * limit;

  const contacts = await Contact.find({ owner }, '-createdAt -updatedAt', {
    skip,
    limit,
  }).populate('owner', 'name email subscription');
  return contacts;
};

const getContactByIdService = async (contactId, owner) => {
  const result = await Contact.findOne({ _id: contactId, owner });
  return result || null;
};

const addContactService = async ({ name, email, phone, favorite }, owner) => {
  const contact = new Contact({ name, email, phone, favorite, owner });
  console.log(contact.id);
  await contact.save();
  return contact;
};

const updateContactByIdService = async (
  contactId,
  { name, email, phone, favorite },
  owner
) => {
  const updateContact = await Contact.findOneAndUpdate(
    { _id: contactId, owner },
    {
      $set: { name, email, phone, favorite },
    },
    { new: true }
  );

  return updateContact || null;
};

const removeContactByIdService = async (contactId, owner) => {
  const removeContact = await Contact.findByIdAndDelete({
    _id: contactId,
    owner,
  });
  return removeContact || null;
};

const updateStatusContactByIdService = async (
  contactId,
  { favorite },
  owner
) => {
  const updateStatus = await Contact.findOneAndUpdate(
    {
      _id: contactId,
      owner,
    },
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
