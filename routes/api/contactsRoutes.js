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

const { authMiddleware } = require('../../middleware/authMiddleware');

router.use(authMiddleware);

router.route('/').get(getContacts).post(addContact);

router
  .route('/:contactId')
  .get(getContactById)
  .put(updateContactById)
  .delete(removeContactById);

router.route('/:contactId/favorite').patch(updateStatusContactById);

module.exports = { contactsRouter: router };
