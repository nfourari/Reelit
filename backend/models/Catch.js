const mongoose = require('mongoose');

const catchSchema = new mongoose.Schema({
  userId:  { type: String, required: true },
  catchName: { type: String, required: true },
  catchWeight:  { type: float, required: true },
  catchLength:  { type: float, required: true },
  catchLocation: { type: String, required: true},
  catchComment: { type: String, required: false}
});


module.exports = mongoose.model('Catch', catchSchema, 'Catches');
