const mongoose = require("mongoose");
var mongoDB = process.env.MONGO_URL;
mongoose.set("debug", true);

mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

var db = mongoose.connection;

module.exports = db;
