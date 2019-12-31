const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const msgSchema = new Schema({
    text: { type: String, required: true },
    type: { type: String, required: true }
});
module.exports = mongoose.model("mailbox", msgSchema);
