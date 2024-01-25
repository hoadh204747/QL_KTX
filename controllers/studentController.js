const Room = require('../models/roomModel')
const User = require('../models/userModel')
const News = require('../models/newsModel')
const Rating = require('../models/ratingModel')

class StudentController{

    async getInfoUser(req,res){
        const infoUser = await User.findById(req.user._id)
        const update = req.flash('update')[0]
        res.render('student/info', {infoUser, update})
    }

    async updateInfoUser(req,res){
        const newUser = await User.updateOne({_id:req.user._id}, req.body)
        req.flash('update', 'Cập nhật thành công')
        res.redirect('back')
    }

    async getAllRooms(req,res){
        const rooms = await Room.find({});
        const user = await User.findById(req.user._id);
        const message1 = req.flash('message1')[0]
        const message2 = req.flash('message2')[0]
        res.render('student/dang-ky', {rooms, user,message1, message2})
    }

    async dashboard(req,res){
        const news = await News.find({})
        const user = await User.countDocuments({role: 'member'})
        const manager = await User.countDocuments({role: 'admin'})
        res.render('student/dashboard', {user, manager, news})
    }

    async detailNews(req,res){
        const post = await News.find({})
        const news = await News.findOne({_id:req.params.id})
        res.render('detail-news', {news, post})
    }
    async dang_ky_phong(req,res){
        const id_phong_dang_ky = req.params.id;
        const idSinhVien = req.user._id;
        const {bool} = req.body;
        try {
            if (!idSinhVien) {
                return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập trước khi đăng ký phòng' });
            }
    
            const sinhVien = await User.findById(idSinhVien);

            if (sinhVien.id_phong_dang_ky) {
                // return res.status(400).json({ success: false, message: 'Đã gửi yêu cầu đăng ký, vui lòng chờ xác nhận' });
                req.flash('message1', "Không thành công vì bạn đang có một yêu cầu đang chờ xủ lý")
                return res.redirect('back')
            }
    
            if (sinhVien.id_phong) {
                // return res.status(400).json({ success: false, message: 'Không thể đăng ký thêm được vì sinh viên đã đăng ký thành công' });
                req.flash('message2', "Không thể đăng ký thêm được vì sinh viên đã đăng ký thành công")
                return res.redirect('back')
            }

            if(!sinhVien.id_phong && !sinhVien.id_phong_dang_ky){
                
                const updatedSinhVien = await User.findByIdAndUpdate(
                    idSinhVien,
                    { $set: { id_phong_dang_ky, bool } },
                    { new: true },
                )
                    .then((result) => {
                        res.redirect('/trang-thai');
                    })
            }
    
            
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async getTrang_thai(req, res){
        const u = await User.findById(req.user._id)
        const room = await Room.findById(req.user.id_phong_dang_ky)
        const roomOld = await Room.findById(req.user.id_phong)
        const huydangky = req.flash('huydangky')[0]
        res.render('student/trang-thai', {u, room, roomOld, huydangky})
    }

    async trang_thai(req, res){
        const idPhong = req.body.idPhong;
        const idSinhVien = req.user._id;

        const room = await Room.findById(idPhong)

        await User.findByIdAndUpdate(idSinhVien, {id_phong_dang_ky:null})
        // return res.status(200).json({message: 'Đã hủy đăng ký thành công'})
        req.flash('huydangky', 'Đã hủy đăng ký thành công')
        return res.redirect('back')
    }

    async getRoomate(req,res){
        const student = await User.find({id_phong: req.user.id_phong});
        const room = await Room.findById(req.user.id_phong)
        res.render('student/roomate', {student, room})
    }

    async getListManager(req,res){
        const user = await User.find({role: 'admin'})
        res.render('student/list-manager', {user})
    }

    async billDienNuoc(req,res){
        const bill = await User.findOne({id_phong: req.user.id_phong}).populate({
            path:'id_phong',
            populate: {path: 'listBill.idBill'}
        }).exec()
        // console.log(bill.id_phong.listBill)
        // bill.id_phong.listBill.forEach(b => {
        //     console.log(b.idBill)
        // })
        res.render('student/bill-diennuoc', {bill})
    }

    async billThanhToan(req,res){
        const bill = await User.findOne({id_phong: req.user.id_phong}).populate({
            path:'id_phong',
            populate: {path: 'listBill.idBill'}
        }).exec()
        res.render('student/bill-thanhtoan', {bill})
    }
    async forum(req,res){
        const user = await User.findOne({role:req.session.user.role})
        const ratings = await Rating.find().sort({createdAt : -1})
        res.render('forum', {ratings, user})
    }

    async topicTTAN(req,res){
        const user = await User.findOne({role:req.session.user.role})
        const rating1 = await Rating.find({topic: 'Trật tự an ninh'}).sort({createdAt: -1})
        res.render('site/ttan', {rating1, user})
    }
    async topicDNWC(req,res){
        const user = await User.findOne({role:req.session.user.role})
        const rating2 = await Rating.find({topic: 'Điện, nước, vệ sinh'}).sort({createdAt: -1})
        res.render('site/dnwc', {rating2, user})
    }
    async topicOTHER(req,res){
        const user = await User.findOne({role:req.session.user.role})
        const rating3 = await Rating.find({topic: 'Dịch vụ khác'}).sort({createdAt: -1})
        res.render('site/other', {rating3, user})
    }

    async postRating(req,res,next){
        
        const rating = new Rating({
            user:{
                fullname: req.user.fullname,
                email: req.user.email,
                userId: req.user._id
            },
            topic: req.body.topic,
            comment: req.body.comment
        })
        rating
            .save()
            .then(() => {
                return res.redirect('back')
            })
            .catch(next)
    }
    async deleteCmt(req,res){
        await Rating.deleteOne({_id:req.params.id})
        res.redirect('back')
    }
}

module.exports = new StudentController()