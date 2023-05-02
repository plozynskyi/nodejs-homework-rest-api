const express = require('express');

const router = express.Router();

const {
  getContacts,
  getContactById,
  addContact,
  updateContactById,
  removeContactById,
  updateStatusContactById,
} = require('../../controllers/contactsControllers');

const validateBody = require('../../utils/validateBody');
const schemas = require('../../utils/validation/contactValidationSchemas');

const { authMiddleware } = require('../../middleware/authMiddleware');

router.use(authMiddleware);

router
  .route('/')
  .get(getContacts)
  .post(validateBody(schemas.contactValidationSchema), addContact);

router
  .route('/:contactId')
  .get(getContactById)
  .put(validateBody(schemas.contactValidationSchema), updateContactById)
  .delete(removeContactById);

router
  .route('/:contactId/favorite')
  .patch(validateBody(schemas.favoriteStatusSchema), updateStatusContactById);

module.exports = { contactsRouter: router };
