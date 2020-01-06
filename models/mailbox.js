const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mailModel = new Schema({
    text: { type: String},
    type: { type: String}
});
module.exports = mongoose.model("mailbox", mailModel);
