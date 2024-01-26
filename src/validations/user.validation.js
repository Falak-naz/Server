import Joi from "joi";

export const UserValidationSchema = {
  add: {
    body: Joi.object().keys({
      name: Joi.string().required().alphanum().min(3).max(10).required(),
      email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
      password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,15}$')),
      token: Joi.string().optional()
    }),
  },
};
