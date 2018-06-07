const mongoose = require("mongoose");
const Comment = require('./comment');
var tourplaceSchema = new mongoose.Schema({
    name: String,
    image: String,
    desc: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
}, { usePushEach: true });

var Tourplaces = mongoose.model("Tourplaces",tourplaceSchema); // we created a model named Tourplaces
module.exports = Tourplaces;
