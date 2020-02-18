/* eslint-disable no-console*/

import mongoose from 'mongoose';

import constants from './constants';

// Connect the db
try {
  mongoose.connect(constants.Mongo_URL);
} catch (err) {
  mongoose.createConnection(constants.Mongo_URL);
}

mongoose.connection
  .once('open', () => console.log('MongoDB running'))
  .on('error', e => {
    throw e;
  });
