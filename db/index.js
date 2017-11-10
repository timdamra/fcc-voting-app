const mongoose = require('mongoose');
const mongoKey =
  process.env.MONGO_URI || require('../config/appConfig').MONGO_URI;

mongoose.Promise = global.Promise;
mongoose.connect(mongoKey);

module.exports = mongoose;
