const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema(
  {
    _user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Users',
      required: true
    },
    _asset: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Assets',
      required: true
    },
    rate: {
      type: Number,
      required: true,
      min: 0,
      max: 5
    },
    comment: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('rating', ratingSchema);
