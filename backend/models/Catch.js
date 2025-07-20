import { mongoose } from 'mongoose';

const catchSchema = new mongoose.Schema({
  userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  catchName:      { type: String, required: true },
  catchWeight:    { type: Number, required: true },
  catchLength:    { type: Number, required: true },
  catchLocation:  { type: String, required: true },
  catchComment:   { type: String, required: false },
  caughtAt:       { type: Date, default: Date.now },
  imageUrl:       { type: String }
}, { timestamps: true });

const Catch = mongoose.model('Catch', catchSchema, 'Catches');
export default Catch;
