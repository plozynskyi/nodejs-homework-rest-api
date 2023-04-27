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

const { asyncWrapper } = require('../helpers/apiHelper');

let getContacts = async (req, res, next) => {
  // console.log(req.user); // -------------------------------------
  // console.log(req.user); // -------------------------------------
  const { _id: owner } = req.user;
  const contacts = await getContactsService(owner);
  res.status(200).json({
    status: 'success',
    code: 200,
    data_length: contacts.length,
    data: {
      result: contacts,
    },
  });
};

getContacts = asyncWrapper(getContacts);

let getContactById = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const contact = await getContactByIdService(contactId, owner);
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

getContactById = asyncWrapper(getContactById);

let addContact = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { error } = contactValidationSchema.validate(req.body);
  if (error) {
    throw new HttpError(400, error.message);
  }
  const { name, email, phone, favorite } = req.body;
  const result = await addContactService(
    {
      name,
      email,
      phone,
      favorite,
    },
    owner
  );
  res.status(201).json({
    status: 'success',
    code: 201,
    data: {
      result: result,
    },
  });
};

addContact = asyncWrapper(addContact);

let updateContactById = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { error } = contactValidationSchema.validate(req.body);
  if (error) {
    throw new HttpError(400, `Error validated`);
  }
  const { contactId } = req.params;
  const { name, email, phone, favorite } = req.body;
  const result = await updateContactByIdService(
    contactId,
    {
      name,
      email,
      phone,
      favorite,
    },
    owner
  );

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

updateContactById = asyncWrapper(updateContactById);

let removeContactById = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const result = await removeContactByIdService(contactId, owner);
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

removeContactById = asyncWrapper(removeContactById);

let updateStatusContactById = async (req, res, next) => {
  const { error } = favoriteStatusSchema.validate(req.body);
  if (error) {
    throw new HttpError(400, `missing field favorite`);
  }
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const { favorite } = req.body;
  const result = await updateStatusContactByIdService(
    contactId,
    {
      favorite,
    },
    owner
  );
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

updateStatusContactById = asyncWrapper(updateStatusContactById);

module.exports = {
  getContacts,
  getContactById,
  addContact,
  updateContactById,
  removeContactById,
  updateStatusContactById,
};
