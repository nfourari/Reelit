
import { Schema, model } from 'mongoose';
import { hash, compare } from 'bcrypt';
import crypto from 'crypto';



const userSchema = new Schema(
{
  password:                     { type: String, required: true },

  firstName:                        { type: String, required: true },
  lastName:                         { type: String, required: true },

  email:                            { type: String, required: true, unique: true, lowercase: true, trim: true },

  totalCatches:                     { type: Number, default: 0 },                             // <- Running total of catches for user

  isEmailVerified:                  { type: Boolean, default: false },                       // <- Email verification state
  emailVerification:                { token: {type: String }, expiresAt: {type: Date }},    // <- one-time token + expiry timestamp for token

}, { timestamps: true });


// Hash password before saving in MongoDB
userSchema.pre('save', async function(next) 
{
  const userDocument = this;
  if (!userDocument.isModified('password')) 
    return next;

  const SALT_ROUNDS = 10;
  userDocument.password = await hash(userDocument.password, SALT_ROUNDS);
  next();
});


// Helper to compare passwords
userSchema.methods.verifyPassword = async function(enteredPlainTextPassword) 
{
  return compare(enteredPlainTextPassword, this.password);
};

userSchema.methods.generateEmailVerificationToken = function()
{
  const verificationToken = crypto.randomBytes(32).toString('hex');
  this.emailVerification = 
  {
    token: verificationToken, 
    expiresAt: Date.now() + 24 * 60 * 60 * 100
  };

  return verificationToken;
}


// Virtual relationship: 'user.catches' can be populated
// Fetch all catches belonging to the user
userSchema.virtual('catches', {
  ref:            'Catch',
  localField:     '_id',
  foreignField:   'userId',
})


// Include virutal fields when converting to JSON or plain objects
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', {virtuals: true });


export default model('User', userSchema, 'Users');

