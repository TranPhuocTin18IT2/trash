var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var msgSchema = new Schema({
  text: { type: String, required: true },
  type: { type: String, required: true }
});
module.exports = mongoose.model("mailbox", msgSchema);
