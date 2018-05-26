const mongoose = require("mongoose");
var commentSchema = new mongoose.Schema({
    text: String,
    author: String
});

var Comment = mongoose.model("Comment",commentSchema); // we created a model named Tourplaces
module.exports = Comment;