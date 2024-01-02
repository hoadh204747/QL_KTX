const Room = require('../models/roomModel')
const News = require('../models/newsModel')
const User = require('../models/userModel')
const Bill = require('../models/billModel')
const Rating = require('../models/ratingModel')

class AdminController {

    

    async home(req,res){
        const rooms = await Room.find()
        var a=0, b=0
        rooms.forEach(room => {
            a = a + (room.countMax - room.curr_count)
            b = b + room.curr_count
        });
        const c = await Rating.countDocuments({topic: 'Điện, nước, vệ sinh'})
        const d = await Rating.countDocuments({topic: 'Trật tự an ninh'})
        const e = await Rating.countDocuments({topic: 'Dịch vụ khác'})
        const sv = (await User.find({role: 'member'})).length
        const ad = (await User.find({role: 'admin'})).length
        const r = (await Room.find()).length
        const message = req.flash('message')[0]
        console.log(message)
        res.render('admin/dashboard', {a,b,c,d,e,sv,ad,r, message})
    }

    async getCreateRoom(req,res) {
        
        res.render('admin/create-room')
    }

    async createRoom(req,res){
        const {name, countMax, price, gender} = req.body;
        const room  = await Room.create({name, countMax, price, gender});
        res.redirect('/rooms')
    }
    async getAllRooms(req,res){
        const rooms = await Room.find({});
        res.render('admin/allRooms', {rooms})
    }
    async deleteRoom(req,res){
        await Room.deleteOne({_id:req.params.id})
        res.redirect('/rooms')
    }

    async getUpdateRoom(req,res){
        const room = await Room.findOne({ _id: req.params.id })
        res.render('admin/edit-room', {room})
    }

    async updateRoom(req,res){
        const room = await Room.updateOne({_id:req.params.id}, req.body);
        res.redirect('/rooms')
    }
    async findRoom(req,res){
        const room = await Room.findById(req.params.id);
        res.status(200).json(room)
    }

    async getPostNews(req, res){
        res.render('admin/post_news')
    }

    async PostNews(req, res){
        const {title, content} = req.body;
        const news = await News.create({title:title, content:content});
        res.redirect('/admin/list-news')
    }

    async page(req, res){
        const news = await News.find()
        res.render('guest/home', {news})
    }

    async getListNews(req,res){
        const news = await News.find();
        res.render('admin/list-news',{news})
    }
    async detailNews(req,res){
        const post = await News.find({})
        const news = await News.findOne({_id:req.params.id})
        res.render('detail-news', {news, post})
    }

    async getUpdateNews(req,res){
        const news = await News.findOne({_id:req.params.id});
        res.render('admin/edit-news', {news})
    }
    async updateNews(req,res){
        const news = await News.updateOne({_id:req.params.id}, req.body);
        res.redirect('/admin/list-news')
    }

    async deteleNews(req,res){
        await News.deleteOne({_id:req.params.id})
        res.redirect('/admin/list-news')
    }

    async addStudent_toRRoom(req,res){
        const studentId = req.body.id;
        User.findById(studentId)
            .then((user) => {
                return req.room.addStudent(user)
            })
            .then((result) => {
                req.session.room = req.room;
                return req.session.save(() => {
                    res.redirect('/rooms')
                })
            })
    }

    async getXac_nhan_dang_ky(req,res){
        const user = await User.find({bool:0}).populate('id_phong_dang_ky').exec();
        // user.forEach(u => {
        //     console.log(u.id_phong_dang_ky.name)
            
        // })
        // console.log(user)
        res.render('admin/dang-ky-phong', {user})
    }


//    [POST]
    async xac_nhan_dang_ky(req,res){
        try {
            // console.log(req.body)
            const idSinhVien = req.body.idSinhVien;
            const idPhong = req.body.idPhong;
    
            const phong = await Room.findById(idPhong);
    
            if (!phong) {
                return res.status(404).json({ message: 'Phòng không tồn tại' });
            }
    
            if (phong.curr_count < phong.countMax) {
                await Room.findByIdAndUpdate(idPhong, { $inc: { curr_count: 1 } });
                await User.findByIdAndUpdate(idSinhVien, { id_phong: idPhong, id_phong_dang_ky:null, bool: 1 });
                return res.redirect('back')
                // return res.status(200).json({ message: 'Đăng ký phòng thành công' });
            } else {
                // return res.status(400).json({ message: 'Phòng đã đầy, không thể đăng ký' });
                return res.redirect('back')
            }
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({ message: 'Đã xảy ra lỗi' });
        }
    }

    async quan_ly_phong(req,res){
        const room = await Room.findOne({_id:req.params.id});
        const student = await User.find({id_phong:req.params.id});
        res.render('admin/control-room', {room, student});
    }

    async delStudent_to_Room(req,res){
        const idSV = req.body.idSV;
        const idRoom = req.body.idRoom;
        await Room.findByIdAndUpdate(idRoom, {$inc:{curr_count: -1}})
        await User.findByIdAndUpdate(idSV, {id_phong: null, bool:2});
        return res.redirect('back')

    }

    async getCreateBill(req,res){
        const rooms = await Room.find()
        res.render('admin/create-bill', {rooms})
    }

    async postBill(req,res){
        const {month, year, old_electric, old_water, new_electric, new_water} = req.body
        const bill = new Bill({month, year, old_electric, old_water, new_electric, new_water})
        bill
            .save()
            .then(() => {
                console.log([bill._id])
                Room.updateOne({_id:req.body.idRoom}, {$push: {listBill: [{idBill: bill._id}]}})
                    .then(() => res.redirect('back'))
            })
    }

    async thongkeBill(req,res){
        const rooms = await Room.find({}).populate('listBill.idBill').exec()
        // rooms.forEach((room) => {
        //     console.log(room)
        //     room.listBill.forEach((bill) => {
        //         console.log(bill.idBill.month)
        //     })
        // })
        res.render('admin/thongke-bill', {rooms})
    }
 
}

module.exports = new AdminController()