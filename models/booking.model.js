const mongoose = require('mongoose');

const bookSchema = mongoose.Schema(
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
    _payment: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Payments',
      required: false,
      default: null
    },
    services: [
      {
        service: {
          type: String
        },
        amount: {
          type: Number,
          default: 0
        }
      }
    ],
    total: {
      type: Number,
      required: true
    },
    vtotal: {
      type: Number,
      required: true
    },
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['success', 'pending', 'failed'],
        message: `Invalid State , Accpected States Are ['success','pending','failed']`
      },
      default: 'pending'
    },
    reference: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Bookings', bookSchema);
