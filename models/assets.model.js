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

    country: {
      type: String,
      required: [true, 'Country Is required']
    },

    state: {
      type: String,
      required: [true, 'state Is required']
    },

    local: {
      type: String,
      required: [true, 'local government Is required']
    },

    lang: {
      type: String,
      required: [true, 'Longitute Is required']
    },

    long: {
      type: String,
      required: [true, 'Langitute Is required']
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
    tag: {
      type: String,
      default: null,
      enum: {
        values: ['house', 'villa', 'apartment']
      }
    },
    bedrooms: {
      type: Number,
      default: 0
    },
    toilet: {
      type: Number,
      default: 0
    },
    dinning: {
      type: Number,
      default: 0
    },
    bathroom: {
      type: Number,
      default: 0
    },
    pool: {
      type: Number,
      default: 0
    },
    available: {
      type: Boolean,
      default: false
    },
    gym: {
      type: Boolean,
      default: false
    },
    vehicle: {
      type: Boolean,
      default: false
    },
    dryclean: {
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
