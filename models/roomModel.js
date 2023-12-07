const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    name: { type: String, required: true },
    countMax: { type: Number, required: true },
    price: { type: Number, required: true },
    gender: { type: String, require: true },
    listSV: {
        items: [
            {
                studentId: {type: Schema.Types.ObjectId, ref:'User', required: true},
            }
        ]
    }
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