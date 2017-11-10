const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OptionsSchema = new Schema({
  option: String,
  votes: {
    type: Number,
    default: 0,
    min: 0
  }
});

const PollSchema = new Schema({
  title: String,
  options: [OptionsSchema],
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  }
});

module.exports = mongoose.model('poll', PollSchema);
