const Joi = require('joi');

const favoriteStatusSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

module.exports = { favoriteStatusSchema };
