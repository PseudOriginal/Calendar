const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../_helpers/db");

module.exports = {
  login,
  register,
  getUser,
  getUsers,
};

async function generateToken(res, params) {
  // Authentication successful
  const token = jwt.sign({ email: params.email }, params.secret, {
    expiresIn: "2h",
  });

  const expiration = 2 * 60 * 60 * 1000;

  return res.cookie("token", token, {
    expires: new Date(Date.now() + expiration),
    secure: false, // set to true if your using https
    httpOnly: true, // httpOnly cookie safest way to store sensitive data
  });
}

async function login({ email, password }, res) {
  let user = await db.User.scope("withHashPassword").findOne({
    where: { email },
  });
  const { secret } = db.config;

  const params = {
    email,
    secret,
  };

  if (!user || !(await bcrypt.compare(password, user.password)))
    throw "Email and/or password is incorrect!!";

  await generateToken(res, params);

  return { email };
}

async function register({ email, password }) {
  // Validate
  if (await db.User.findOne({ where: { email } }))
    throw `${email} is already taken`;

  // Hash password
  if (password) password = await bcrypt.hash(password, 10);

  // Save user
  await db.User.create({ email, password });
}

async function getUser(email) {
  const user = await db.User.findOne({ where: { email } });
  return user;
}

async function getUsers() {
  const users = await db.User.findAll();
  return users;
}

function omitHash(user) {
  const { hash, ...userWithoutHash } = user;
  return userWithoutHash;
}
