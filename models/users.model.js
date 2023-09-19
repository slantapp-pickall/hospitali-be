const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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
    password: {
      type: String,
      required: [false, 'Please A Valid Password is Required'],
      select: false
    },
    uid: {
      type: String,
      required: [false, 'Please A Valid Password is Required'],
      select: false
    },
    name: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, 'Please enter a Valid Name']
    },
    image: {
      type: String,
      required: [true, 'Please enter image routes']
    },
    token: {
      type: String,
      required: [true, 'Please enter FCM For Device']
    },
    isAdmin: {
      type: Boolean,
      required: [true, 'State Is Required'],
      default: false
    }
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

// Match user UID in database
userSchema.methods.matchUID = async function (uid) {
  return (await uid) == this.uid;
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
