const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullname:{ type: String, require: true},
    email:{ type:String, require: true},
    password:{ type:String, require: true},
    resetToken: String,
    resetTokenExpiration: Date,
    phone:{type: String,},
    mssv:{ type: Number},
    role:{ type: String},
    id_phong:{
        type: Schema.Types.ObjectId,
        ref:'Room'
    },
    id_phong_dang_ky:{
        type: Schema.Types.ObjectId,
        ref:'Room',
    },
    bool: { type: Number}
})

module.exports = mongoose.model('User', userSchema);