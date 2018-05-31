const mongoose = require("mongoose");
var commentSchema = new mongoose.Schema({
    text: String,
    author: {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

var Comment = mongoose.model("Comment",commentSchema); // we created a model named Tourplaces
module.exports = Comment;