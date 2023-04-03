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

router.route('/').get(asyncWrapper(getContacts));
router.route('/').post(asyncWrapper(addContact));
router.route('/:contactId').get(asyncWrapper(getContactById));
router.route('/:contactId').put(asyncWrapper(updateContactById));
router.route('/:contactId').delete(asyncWrapper(removeContactById));
router
  .route('/:contactId/favorite')
  .patch(asyncWrapper(updateStatusContactById));

module.exports = { contactsRouter: router };
