const mongoose = require('mongoose');

const { Schema } = mongoose;

const bot = new Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    status: {
      type: String,
      enum: ['Free', 'Engaged'],
      default: ['Free'],
    },
    expertise: {
      type: [String],
    },
    answer: {
      type: String,
    },
    contactDetails: {
      type: String,
    },
    token: {
      type: String,
    },
  },
  { collection: 'bots_b' },
);

module.exports = mongoose.model('bots', bot);
