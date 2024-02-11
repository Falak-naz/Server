import Joi from "joi";

export const UserValidationSchema = {
  add: {
    body: Joi.object().keys({
      name: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9\\s]{3,10}$')),
      email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
      password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,15}$')),
      token: Joi.string().optional()
    }),
  },
  update: {
    body: Joi.object().keys({
      name: Joi.string().alphanum().min(3).max(10).optional(),
      email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).optional(),
      oldPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,15}$')).optional(),
      newPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,15}$')).optional(),
      phone: Joi.string().optional(),
      bio: Joi.string().optional(),
      birthDate: Joi.date().optional()
    }),
  },
};
