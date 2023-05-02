const Joi = require('joi');

const contactValidationSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ua'] },
    })
    .required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});

const favoriteStatusSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

module.exports = { contactValidationSchema, favoriteStatusSchema };
