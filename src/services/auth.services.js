import passport from 'passport';
import LocalStrategy from 'passport-local';

import User from '../modules/models/user.model';
import Admin from '../modules/models/admin.model';
import Customer from '../modules/models/customer.model';
import Garment from '../modules/models/garment.model';

const localOpts = {
  usernameField: 'email',
};

// loacl strategy
const localStrategy = new LocalStrategy(localOpts, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false);
    } else if (!user.authenticatePassword(password)) {
      return done(null, false);
    }
    if (user.type === 'ADMIN') {
      return done(null, new Admin(user));
    } else if (user.type === 'CUSTOMER') {
      return done(null, new Customer(user));
    } else if (user.type === 'GARMENT') {
      return done(null, new Garment(user));
    }
  } catch (error) {
    return done(error, false);
  }
});

passport.use(localStrategy);

export const authLocal = passport.authenticate('local', { session: false });
