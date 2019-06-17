const mongoose = require('mongoose');

const PinSchema = new mongoose.Schema({
  title: String,
  title: String,
  content: String,
  image: String,
  latitude: Number,
  longitude: Number,
  eventDate: {
    type: Date,
    default: Date.now
  },
  link: String,
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  comments: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
        index: true,
        required: true,
      },
      text: String,
      createdAt: {
        type: Date,
        default: Date.now
      },
      author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      },
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Pin', PinSchema);