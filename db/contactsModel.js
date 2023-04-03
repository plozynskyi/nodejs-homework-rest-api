const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
    unique: true,
  },

  phone: {
    type: String,
    unique: true,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  contactId: {
    type: String,
    required: true,
  },
});

const Contact = mongoose.model('contact', contactSchema);

module.exports = { Contact };
