const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema(
  {
    _user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Users',
      required: true
    },
    _assets: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Assets',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['success', 'pending', 'failed'],
        message: `Invalid State , Accpected States Are ['success','pending','failed']`
      }
    },
    reference: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Payments', paymentSchema);
