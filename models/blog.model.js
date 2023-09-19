const mongoose = require('mongoose');

const blogSchema = mongoose.Schema(
  {
    image: {
      type: String,
      default: null
    },
    author: {
      type: String,
      default: null
    },
    body: {
      type: String,
      default: null
    },
    read: {
      type: Number
    },
    title: {
      type: String,
      trim: true,
      lowercase: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Blogs', blogSchema);
