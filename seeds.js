const mongoose = require('mongoose');
const Tourplaces = require('./models/tourplaces');
const Comment = require('./models/comment');

const data = [
    {
        name:"Mount Fuji",
        image:"https://www.planetware.com/photos-large/JPN/japan-attractions-mount-fuji.jpg",
        desc:"A view of the beautiful mount suji, breathtakingly beautiful!!"
    },
    {
        name:" Imperial Tokyo",
        image:"https://www.planetware.com/photos-large/JPN/japan-attractions-imperial-palace.jpg",
        desc:"A look into how old age Tokyo used to look, a place that hasn't changed in years."
    },
    {
        name:"Hiroshima Peace Memorial Park",
        image:"https://www.planetware.com/photos-large/JPN/japan-attractions-hiroshima-peace-memorial-park.jpg",
        desc:"A memorial park for the people who died in the Kioshima nuclear bombing."
    }
];

function seedDB() {
    Tourplaces.remove({}, (err) => {  //clearing up our database off previous data
        if(err)
            console.log(err);
        console.log("All Tourplaces removed");
        data.forEach((seed) => {  //initializing database with seeded data stored in 'data' array
           Tourplaces.create(seed, (err, tourplace) => {
                if(err)
                    console.log(err);
                else {
                    console.log("Added a tourplace");
                    //create a comment for each tourplace
                    Comment.create({
                       text: "This is one of the best placese on Earth!",
                       author: "Kryptokinght"
                    }, (err, comment) => {
                        if(err)
                            console.log(err);
                        else {
                            tourplace.comments.push(comment);
                            tourplace.save();
                            console.log("Comment Added");
                        }
                    });
                }
           });
        });
    });
}

module.exports = seedDB;