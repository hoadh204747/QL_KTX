const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsModel = new Schema({
    title:{type: String, require: true},
    content:{type: String, require: true},
    date_created:{type:Date,default: Date.now()},
})

module.exports = mongoose.model('News', newsModel);