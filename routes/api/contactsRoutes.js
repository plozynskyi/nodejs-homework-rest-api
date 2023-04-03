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

const { asyncWrapper } = require('../../helpers/apiHelper');

const { authMiddleware } = require('../../middleware/authMiddleware');

router.use(authMiddleware);

router.route('/').get(asyncWrapper(getContacts)).post(asyncWrapper(addContact));

router
  .route('/:contactId')
  .get(asyncWrapper(getContactById))
  .put(asyncWrapper(updateContactById))
  .delete(asyncWrapper(removeContactById));

router
  .route('/:contactId/favorite')
  .patch(asyncWrapper(updateStatusContactById));

module.exports = { contactsRouter: router };
