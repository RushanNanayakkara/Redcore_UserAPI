import validator from 'validator';
import { hashSync, compareSync } from 'bcrypt-nodejs';
import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import { passwordRegex } from '../user.validations';
import constants from '../../config/constants';

require('mongoose-type-url');

const CustomerSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required!'],
    trim: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: '{VALUE} is not a valid email!',
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    trim: true,
    minlength: [6, 'Password need to be minimun of length 6'],
    validate: {
      validator(password) {
        return passwordRegex.test(password);
      },
      message: 'Invalid password!',
    },
  },
  type: {
    type: String,
    required: [true, 'type required'],
    enum: ['CUSTOMER', 'GARMENT', 'ADMIN'],
  },
  verified: {
    type: Boolean,
    default: false,
  },
  firstName: {
    type: String,
    required: [true, 'First name is required!'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required!'],
    trim: true,
  },
  tel: {
    type: String,
    validate: {
      validator(tel) {
        return /(^\+[\d]{11})|(^0[\d]{9})/.test(tel);
      },
      message: '{VALUE} is not a valid telephone no!',
    },
    required: [true, 'tel-no is required'],
  },
  address: {
    type: String,
    validate: {
      validator(address) {
        return address.length < 100;
      },
    },
    required: [true, 'address is required'],
  },
  key: String,
});

CustomerSchema.methods = {
  _hashPassword(password) {
    return hashSync(password);
  },

  authenticatePassword(password) {
    return compareSync(password, this.password);
  },

  createToken() {
    return jwt.sign(
      {
        _id: this._id,
      },
      constants.JWT_Secret,
    );
  },

  toJSON() {
    return {
      _id: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
      token: `JWT ${this.createToken()}`,
      type: this.type,
      tel: this.tel,
      address: this.address,
      email: this.email,
      verified: this.verified,
    };
  },
};

CustomerSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = this._hashPassword(this.password);
    return next();
  }
  return next();
});

export default mongoose.model('Customer', CustomerSchema, 'user');
