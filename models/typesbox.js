const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const typeModel = new Schema({
    name: { type: String},
    replies: {type: String}
});
module.exports = mongoose.model("typebox", typeModel);
