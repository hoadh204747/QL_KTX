const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    name: { type: String, required: true },
    curr_count:{type:Number, default:0},
    countMax: { type: Number, required: true },
    price: { type: Number, required: true },
    gender: { type: String, require: true },
    listBill:[
        {idBill:{
            type : Schema.Types.ObjectId,
            ref: 'Bill'
        }  }
    ]
})

module.exports = mongoose.model('Room', roomSchema)