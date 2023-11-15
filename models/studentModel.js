const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studenModel = new Schema({
    id_user:{type: Schema.Types.ObjectId, ref:"User"},
    id_room: {type: Schema.Types.ObjectId, ref:"Room"},
})

module.exports = mongoose.model("Student", studenModel)