const mongoose = require('mongoose');

const assetsSchema = mongoose.Schema(
  {
    rent: {
      type: Number,
      required: [true, 'Rent Amount Is required']
    },

    name: {
      type: String,
      required: [true, 'name Is required']
    },

    address: {
      type: String,
      required: [true, 'address Is required']
    },

    lang: {
      type: String,
      default: null
    },

    long: {
      type: String,
      default: null
    },

    mapUrl: {
      type: String,
      default: null
    },
    image: {
      type: String,
      default: null
    },
    video: {
      type: String,
      default: null
    },
    images: {
      type: Array,
      default: null
    },
    ratings: {
      type: Number,
      default: 0
    },
    tags: {
      type: String,
      default: null,
      enum: {
        values: ['house', 'villa', 'apartment']
      }
    },
    available: {
      type: Boolean,
      default: false
    },
    additional: [
      {
        item: {
          type: String
        },
        value: {
          type: Number
        }
      }
    ]
  },
  {
    timestamps: true
  }
);
// Overright the map address
assetsSchema.pre('save', async function (next) {
  if (!this.isModified('lang') || !this.isModified('long')) {
    next();
  }

  const maps = `https://map.google.com/@${this.lang},${this.long}`;
  this.mapUrl = maps;
});

module.exports = mongoose.model('Assets', assetsSchema);
