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

roomSchema.methods.addStudent = function (room) {
    const index = this.listSV.findIndex((i) => {
        return i.id.toString() === room._id.toString();
    })

    const updateListSV = [...this.listSV];

    if(index >= 0){

    }
    else{
        updateListSV.push({
            id: room._id
        });
    }
    this.listSV = updateListSV;
}

module.exports = mongoose.model('Room', roomSchema)