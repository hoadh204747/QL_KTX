const Room = require('../models/roomModel')
const News = require('../models/newsModel')
const User = require('../models/userModel')

class AdminController {

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

    async getListNews(req,res){
        const news = await News.find();
        res.render('admin/list-news',{news})
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

}

module.exports = new AdminController()