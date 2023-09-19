const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please enter your Email address'],
      trim: true,
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid Email address'
      ]
    },
    phone: {
      type: String,
      default: null,
      required: [false, 'Please enter your phone Number']
    },
    password: {
      type: String,
      required: [true, 'Please A Valid Password is Required'],
      select: false
    },
    name: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, 'Please enter a Valid Name']
    },
    _phone: {
      type: Boolean,
      required: [true, 'Used to Know If phone Is Verified, State is Required'],
      default: false
    },
    _email: {
      type: Boolean,
      required: [true, 'Used to Know If Email Is Verified, State is Required'],
      default: false
    },
    TokenExpire: {
      type: Number,
      select: false
    },
    resetPasswordToken: {
      type: String,
      select: false
    },
    resetPasswordExpire: { type: Number, select: false }
  },
  {
    timestamps: true
  }
);
// Encrypt password using Bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Sign JWT
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    {
      user_id: this._id
    },
    process.env.JWT_SECRET
  );
};

module.exports = mongoose.model('Users', userSchema);
