import { mongoose } from 'mongoose';

const catchSchema = new mongoose.Schema({
  userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // <- new
  catchName:      { type: String, required: true },
  catchWeight:    { type: Number, required: true },  // <- fixed
  catchLength:    { type: Number, required: true },  // <- fixed
  catchLocation:  { type: String, required: true },
  catchComment:   { type: String, required: false },
  caughtAt:       { type: Date, default: Date.now }
}, { timestamps: true });

const Catch = mongoose.model('Catch', catchSchema, 'Catches');
export default Catch;
