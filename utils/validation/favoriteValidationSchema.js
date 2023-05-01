const Joi = require('joi');

const favoriteStatusSchema = Joi.object({
  favorite: Joi.boolean(),
});

module.exports = { favoriteStatusSchema };
