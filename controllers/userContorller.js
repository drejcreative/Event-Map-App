const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.OAUTH_CLIENT);

const User = require('../models/User');

exports.findOrCreateUser = async token => {
  // verify token
  const googleUser = await verifyAuth(token);
  // check if user exist
  const user = await checkIfUserExist(googleUser.email);

  return user ? user : createUser(googleUser);
}

const verifyAuth = async token => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.OAUTH_CLIENT,
    })
    return ticket.getPayload();
  } catch (error) {
    console.log('Error verify token', error);
  }
}

const checkIfUserExist = async email => await User.findOne({ email }).exec();

const createUser = user => {
  const { name, email, picture } = user;
  const newUser = { name, email, picture };
  return new User(newUser).save();
}
