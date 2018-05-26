const mongoose = require("mongoose");
var tourplaceSchema = new mongoose.Schema({
    name: String,
    image: String,
    desc: String
});

var Tourplaces = mongoose.model("Tourplaces",tourplaceSchema); // we created a model named Tourplaces
module.exports = Tourplaces;