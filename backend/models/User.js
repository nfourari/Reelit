// backend/models/User.js
// This file defines the User model for MongoDB using Mongoose.
// It includes fields for email, name, and a hashed password.
// The model is used for user authentication and registration in the application.
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  login:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  firstName: String,
  lastName:  String
});

module.exports = mongoose.model('User', userSchema, 'Users');

// This code defines a Mongoose schema for a User model.
// The schema includes fields for login, password, firstName, and lastName.
// The login field is required and must be unique, while the password field is also required.
// The firstName and lastName fields are optional.
// The model is then exported for use in other parts of the application.