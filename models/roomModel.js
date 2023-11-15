const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    name: {type: String, required: true},
    countMax: {type: Number, required: true},
    price: {type: Number, required: true},
    gender:{type: String, require: true},
    id_student: {type: Schema.Types.ObjectId, ref: "Student"}
})

module.exports = mongoose.model('Room', roomSchema)