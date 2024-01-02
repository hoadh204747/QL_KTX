const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ratingSchema = new Schema({
    user: {
        fullname: String,
        email:String,
        userId:{type:Schema.Types.ObjectId, ref:'User'} 
    },
    topic:String,
    comment:String,
    createdAt:{type:Date, default:Date.now}
})

module.exports = mongoose.model('Rating', ratingSchema)