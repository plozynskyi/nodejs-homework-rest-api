const {
  getContactsService,
  getContactByIdService,
  addContactService,
  updateContactByIdService,
  removeContactByIdService,
  updateStatusContactByIdService,
} = require('../services/contactsServices');

const { HttpError } = require('../helpers/HttpError');
const {
  contactValidationSchema,
  favoriteStatusSchema,
} = require('../utils/validation');

const getContacts = async (req, res, next) => {
  const contacts = await getContactsService();
  res.status(200).json({
    status: 'success',
    code: 200,
    data_length: contacts.length,
    data: {
      result: contacts,
    },
  });
};

const getContactById = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactByIdService(contactId);
  if (!contact) {
    throw new HttpError(404, `Contact with id - ${contactId} not found`);
  }
  res.status(200).json({
    status: 'success',
    code: 200,
    data: {
      contact,
    },
  });
};

const addContact = async (req, res, next) => {
  const { error } = contactValidationSchema.validate(req.body);
  if (error) {
    throw new HttpError(400, error.message);
  }
  const { name, email, phone, favorite } = req.body;
  const result = await addContactService({ name, email, phone, favorite });
  res.status(201).json({
    status: 'success',
    code: 201,
    data: {
      result: result,
    },
  });
};

const updateContactById = async (req, res, next) => {
  const { error } = contactValidationSchema.validate(req.body);
  if (error) {
    throw new HttpError(400, `Error validated`);
  }
  const { contactId } = req.params;
  const { name, email, phone, favorite } = req.body;
  const result = await updateContactByIdService(contactId, {
    name,
    email,
    phone,
    favorite,
  });

  if (!result) {
    throw new HttpError(404, `Contact with ${contactId} not found`);
  }
  res.status(200).json({
    status: 'success',
    code: 200,
    data: {
      result,
    },
  });
};

const removeContactById = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await removeContactByIdService(contactId);
  if (!result) {
    throw new HttpError(404, `Not found`);
  }
  res.json({
    status: 'success',
    code: 200,
    message: 'contact deleted',
    data: {
      result,
    },
  });
};

const updateStatusContactById = async (req, res, next) => {
  const { error } = favoriteStatusSchema.validate(req.body);
  if (error) {
    throw new HttpError(400, `missing field favorite`);
  }
  const { contactId } = req.params;
  const { favorite } = req.body;
  const result = await updateStatusContactByIdService(contactId, {
    favorite,
  });
  if (!result) {
    throw new HttpError(404, `Contact with ${contactId} not found`);
  }
  res.status(200).json({
    status: 'success',
    code: 200,
    data: {
      result,
    },
  });
};

module.exports = {
  getContacts,
  getContactById,
  addContact,
  updateContactById,
  removeContactById,
  updateStatusContactById,
};
