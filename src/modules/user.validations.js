import Joi from 'joi';

export const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

export default {
  signup: {
    email: Joi.string().email().required(),
    password: Joi.string().regex(passwordRegex).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
  },
};
