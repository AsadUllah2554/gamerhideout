const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
  },
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  profilePicture: {
    type: String,
  },
  coverPicture: {
    type: String,
  },

  friends: {
    type: Array,
  },
  phonenumber: {
    type: Number,
  },
  friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
  inventory: [{ type: Schema.Types.ObjectId, ref: "Item" }], // Marketplace items listed by user
  gamerTags: { type: Map, of: String }, // In-game usernames for various platforms
  city: {
    type: String,
  },
  country: {
    type: String,
  },
  socialLinks: {
    github: String,
    linkedin: String,
    twitter: String,
  },
  blocked: {
    type: Boolean,
    default: false,
  },
});

// static signup Method

UserSchema.statics.signup = async function (name, username, email, password) {
  // validation
  if (!email || !password) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password is not strong enough");
  }
  const emailExists = await this.findOne({ email });
  if (emailExists) {
    throw Error("Email already exists");
  }

  const usernNameExists = await this.findOne({ username });
  if (usernNameExists) {
    throw Error("Username already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await this.create({
    name,
    username,
    email,
    password: hashedPassword,
  });
  return user;
};

// static login Method

UserSchema.statics.login = async function (email, password) {
  console.log("email"+email)
  // validation
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw Error("Incorrect email");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect password");
  }
  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

module.exports = mongoose.model("User", UserSchema);
