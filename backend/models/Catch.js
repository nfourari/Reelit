const mongoose = require('mongoose');

const catchSchema = new mongoose.Schema({
  userId:        { type: String, required: true },
  catchName:     { type: String, required: true },
  catchWeight:   { type: Number, required: true },  // <- fixed
  catchLength:   { type: Number, required: true },  // <- fixed
  catchLocation: { type: String, required: true },
  catchComment:  { type: String, required: false }
});

module.exports = mongoose.model('Catch', catchSchema, 'Catches');
