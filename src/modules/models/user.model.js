import validator from 'validator';
import { compareSync } from 'bcrypt-nodejs';
import mongoose, { Schema } from 'mongoose';
import { passwordRegex } from '../user.validations';

const UserSchema = new Schema({
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
});

UserSchema.methods = {
  toJSON() {
    return {
      _id: this._id,
      type: this.type,
    };
  },
  authenticatePassword(password) {
    return compareSync(password, this.password);
  },
};

export default mongoose.model('User', UserSchema, 'user');
