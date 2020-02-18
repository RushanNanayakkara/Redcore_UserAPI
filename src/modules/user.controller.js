import nodemailer from 'nodemailer';
import randomstring from 'randomstring';
// import querystring from 'querystring';
import HttpStatus from 'http-status-codes';

import User from './models/user.model';
import Admin from './models/admin.model';
import Customer from './models/customer.model';
import Garment from './models/garment.model';

export async function signUp(req, res) {
  try {
    let user = null;
    if (req.body.type === 'ADMIN') {
      user = await Admin.create(req.body);
    } else if (req.body.type === 'CUSTOMER') {
      user = await Customer.create(req.body);
    } else if (req.body.type === 'GARMENT') {
      user = await Garment.create(req.body);
    }
    user.key = randomstring.generate(10);
    user.save();
    sendVerificationEmail(user.email, user.key);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json(error);
  }
}

export async function login(req, res) {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    return res.status(400).json(error);
  }
}

export async function deleteUser(req, res) {
  try {
    const user = await User.findById(req.body._id);
    if (!user._id.equals(req.body._id)) {
      return res.sendStatus(505);
    }
    await user.remove();
    return res.sendStatus(200);
  } catch (error) {
    return res.status(HttpStatus.BAD_REQUEST).json(error);
  }
}

// not used
export async function checkExist(req, res) {
  const user = await User.findById(req.body._id);
  if (user) {
    res.send(1);
  } else {
    res.send(0);
  }
}

export async function updateUser(req, res) {
  let user = null;
  try {
    user = await User.findById(req.body._id);
    if (user.type === 'ADMIN') {
      user = new Admin(user);
    } else if (user.type === 'CUSTOMER') {
      user = new Customer(user);
    } else if (user.type === 'GARMENT') {
      user = new Garment(user);
    }
    Object.keys(req.body).forEach(key => {
      user[key] = req.body[key];
    });

    return res.status(HttpStatus.OK).json(await user.save());
  } catch (error) {
    return res.status(HttpStatus.BAD_REQUEST).json(error);
  }
}

export async function verifyEmail(req, res) {
  try {
    let user = null;
    user = await User.findById(req.query._id);
    if (user.type === 'ADMIN') {
      user = new Admin(user);
    } else if (user.type === 'CUSTOMER') {
      user = new Customer(user);
    } else if (user.type === 'GARMENT') {
      user = new Garment(user);
    }
    if (user.key === req.query.key) {
      user.verified = true;
      user.key = randomstring.generate(10);
      user = await user.save();
      res.status(HttpStatus.OK).json('SUCCESS');
      return;
    }
    return res.status(HttpStatus.OK).json('FAIL');
  } catch (error) {
    return res.status(HttpStatus.BAD_REQUEST).json(error);
  }
}

export async function getUserData(req, res) {
  try {
    let user = await User.findById(req.query.id);
    if (!user) {
      res.sendStatus(404);
    }
    if (user.type === 'ADMIN') {
      user = new Admin(user);
    } else if (user.type === 'CUSTOMER') {
      user = new Customer(user);
    } else if (user.type === 'GARMENT') {
      user = new Garment(user);
    }
    return res.status(HttpStatus.OK).json(user);
  } catch (error) {
    return res.status(HttpStatus.BAD_REQUEST).json(error);
  }
}

export async function sendNewVerificationEmail(req, res) {
  let user = null;
  try {
    user = await User.findById(req.query._id);
    if (user.type === 'ADMIN') {
      user = new Admin(user);
    } else if (user.type === 'CUSTOMER') {
      user = new Customer(user);
    } else if (user.type === 'GARMENT') {
      user = new Garment(user);
    }
    user.key = randomstring.generate(10);
    user.save();
    sendVerificationEmail(user.email, user.key);
    return res.status(HttpStatus.OK).send();
  } catch (error) {
    return res.status(HttpStatus.BAD_REQUEST).json(error);
  }
}

async function sendVerificationEmail(email, key) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'rushannana@gmail.com',
      pass: 'ozzlznsdfvghaxlf',
    },
  });

  const mailOptions = {
    from: 'rushannana@gmail.com',
    to: email,
    subject: 'Redcore Designer Email Conformation',
    html: `
      <h1><span style:"color:'red';">Red</span>core Designer</h1>
      Please enter following code to confirm email
      ${key}
    `,
  };

  /* eslint-disable no-console */
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
}
