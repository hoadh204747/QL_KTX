const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const billSchema = new Schema({
    month:Number,
    year: Number,
    old_electric: Number,
    new_electric: Number,
    old_water: Number,
    new_water: Number,
    price_dien: {type: Number, default: 1500},
    price_nuoc: {type: Number, default: 30000},
    money: {type:Number}
})

module.exports = mongoose.model("Bill", billSchema);