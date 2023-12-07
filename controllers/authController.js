const userModel = require('../models/userModel')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//  create jwt
const createToken = (id) => {
    return jwt.sign({
        id
    },
    "secret",
    {expiresIn: "1h"},
    )
}

//
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
    res.render('guest/register')

}

//postSignup
async function postRegister(req, res){
    const {email, fullname, password, phone, mssv} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try{
        const user = await userModel.create({email, fullname, password: hashedPassword, phone, mssv, role:'member'})
        
    }
    catch(err){
        console.log(err)
    }
    res.redirect('/login')
}

//getLogin
function getLogin(req,res){
    res.render('guest/login');
}

//postLogin
async function postLogin(req, res, next){

    const { email, password } = req.body;
    userModel.findOne({email: email})
        .then((user) => {
            if (!user) {
                return res.status(422).render('login', {
                    errorMessage: 'Email hoặc mật khẩu không hợp lệ!',
                });
            }
            bcrypt
                .compare(password, user.password)
                .then((doMatch) => {
                    if(doMatch) {
                        req.session.user = user;
                        req.session.authorized = true;
                        return req.session.save(() => {
                            if(req.session.user.role === "member" ){
                                res.redirect('/student/dashboard')
                            }
                            if(req.session.user.role === "admin"){
                                res.redirect('/admin/dashboard')
                            }
                        })
                    }
                })
                .catch(() => {
                    res.redirect('/login')
                })
        })
        .catch(next)
    }
    

module.exports = {home, getLogin, postLogin, getRegister, postRegister, postLogout}