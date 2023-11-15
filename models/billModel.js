const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const billSchema = new Schema({
    id_room: {type: Schema.Types.ObjectId, ref:"Room"},
    ngay_thu:{type: Date},
    money:{type:Number, require: true},
    month: {type: Number},
    year: {type: Number},
    warter_consume: {type: Number, require: true},
    electric_consume: {type: Number, require: true}
})

module.exports = mongoose.model("Bill", billSchema);