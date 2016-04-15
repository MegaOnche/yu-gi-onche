var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var cardSchema = mongoose.Schema({
    name: String,
    url: String,
    cardtype: Number,
    level: Number,
    group: String,
    id: Number,
    atk: Number,
    def: Number,
    rarety: Number,
    effect: Boolean
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Card', cardSchema);
