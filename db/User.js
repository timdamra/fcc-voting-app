const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  twitterId: String,
  twitterToken: String,
  polls: [
    {
      type: Schema.Types.ObjectId,
      ref: 'poll'
    }
  ]
});

module.exports = mongoose.model('user', UserSchema);
