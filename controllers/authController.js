const userModel = require('../models/userModel')
const bcrypt = require("bcrypt");
const crypto = require('crypto')
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer')
const dotenv = require('dotenv');
dotenv.config()

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port:465,
    secure: true,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS
    }
})


function home(req, res){
        res.render('guest/home')
}

function postLogout(req, res){
    req.session.destroy(() =>{
        res.redirect('/');
    })
}

//getSignup
function getRegister(req, res){
    const register = req.flash('register')[0]
    res.render('guest/register', {register})

}

//postSignup
async function postRegister(req, res){
    const {email, fullname, password, phone, mssv} = req.body;

    const u = await userModel.findOne({email: email})
    if(u){
        req.flash('register', 'Email này đã được đăng ký')
        res.redirect('back')
    } else {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({email, fullname, password: hashedPassword, phone, mssv, role:'member'})
            .then( result => {
                res.redirect('/login')
                return transporter.sendMail({
                    from: '"Hello" <dohuyhoa12012001@gmail.com>',
                    to: email,
                    subject:'Đăng ký thành công',
                    html: '<h1>Bạn đã đăng ký thành công!</h1>'
                })
            })
    }
}

//getLogin
function getLogin(req,res){
    const error = req.flash('error')[0]
    res.render('guest/login', {error});
}

//postLogin
async function postLogin(req, res, next){

    const { email, password } = req.body;
    // userModel.findOne({email: email})
    //     .then((user) => {
    //         if (!user) {
    //             req.flash('error','Email hoặc mật khẩu chưa chính xác')
    //             return res.redirect('back')
    //         }
    //         bcrypt
    //             .compare(password, user.password)
    //             .then((doMatch) => {
    //                 if(doMatch) {
    //                     req.session.user = user;
    //                     req.session.authorized = true;
    //                     return req.session.save(() => {
    //                         if(req.session.user.role === "member" ){
    //                             res.redirect('/student/dashboard')
    //                         }
    //                         if(req.session.user.role === "admin"){
    //                             req.flash('message', 'Welcome Admin comeback')
    //                             res.redirect('/admin/dashboard')
    //                         }
    //                     })
    //                 }
    //             })
    //             .catch(() => {
    //                 res.redirect('/login')
    //             })
    //     })
    //     .catch(next)

    const user = await userModel.findOne({email: email})
    if(!user){
        req.flash('error','Email hoặc mật khẩu chưa chính xác')
        res.redirect('back')
    } else {
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (isValidPassword) {
            req.session.user = user;
            req.session.authorized = true;
            return req.session.save(() => {
                if(req.session.user.role === "member" ){
                    res.redirect('/student/dashboard')
                }
                if(req.session.user.role === "admin"){
                    req.flash('message', 'Welcome Admin comeback')
                    res.redirect('/admin/dashboard')
                }
            })
        } else {
            req.flash('error','Email hoặc mật khẩu chưa chính xác')
            res.redirect('back')
        }
    }
}
    
    async function getResetPassword(req,res){
        res.render('auth/reset-pw')
      }
    
    async function  postReset(req, res, next) {
        crypto.randomBytes(32, (err, buffer) => {
            if (err) {
                console.log(err)
                return res.redirect('/dat-lai-mat-khau')
            }
            const token = buffer.toString('hex')
            userModel.findOne({ email: req.body.email })
                .then(user => {
                    user.resetToken = token
                    user.resetTokenExpiration = Date.now() + 360000
                    return user.save()
                })
                .then(result => {
                    res.redirect('/login')
                    transporter.sendMail({
                        from: '"Hello" <dohuyhoa12012001@gmail.com>',
                        to: req.body.email,
                        subject: 'Đặt lại mật khẩu',
                        html: `
                        <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu của bạn</p>
                        <p>Click vào <a href="http://localhost:3000/set-new-password/${token}">Đây</a> để đặt mật khẩu mới</p>
                        `
                    })
                })
                .catch(err => {
                    console.log(err)
                })
        })
    }
    
    async function getNewPassword(req, res, next) {
            const token = req.params.token
            userModel.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
                .then(user => {
                    res.render('auth/set-new-pw', {
                        userId: user._id.toString(),
                        passwordToken: token
                    })
                })
                .catch(err =>
                    console.log(err))
        }
    
        async function postNewPassword(req, res, next) {
            const newPassword = req.body.password
            const userId = req.body.userId
            const passwordToken = req.body.passwordToken
            let resetUser
            userModel.findOne({
                resetToken: passwordToken,
                resetTokenExpiration: { $gt: Date.now() },
                _id: userId
            })
                .then(user => {
                    resetUser = user
                    return bcrypt.hash(newPassword, 12)
                })
                .then(hashedPassword => {
                    resetUser.password = hashedPassword
                    resetUser.resetToken = undefined
                    resetUser.resetTokenExpiration = undefined
                    return resetUser.save()
                })
                .then(result => {
                    res.redirect('/login')
                })
                .catch(next)
        }
    

module.exports = {home, getLogin, postLogin, getRegister, postRegister, postLogout, getResetPassword, postNewPassword, getNewPassword, postReset}