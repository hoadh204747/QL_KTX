const Room = require('../models/roomModel')
const User = require('../models/userModel')
const News = require('../models/newsModel')

class StudentController{
    async getAllRooms(req,res){
        const rooms = await Room.find({});
        res.render('student/dang-ky', {rooms})
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
}

module.exports = new StudentController()