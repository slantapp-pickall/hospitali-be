const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema(
  {
    _user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Users',
      required: true
    },
    _asset: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Asset',
      default: null
    },
    subject: {
      type: String
    },
    body: {
      type: String
    },
    seen: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('notification', notificationSchema);
