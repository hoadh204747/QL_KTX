const express = require('express')
const flash = require('connect-flash')
const path = require('path')
const env = require('dotenv')
const expressLayout = require('express-ejs-layouts')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
// const cookieParser = require('cookie-parser')
const methodOverride = require('method-override');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session)
const authRoute = require('./routes/authRoute')
const adminRoute = require('./routes/adminRoute')
const studentRoute = require('./routes/studentRoute')
const User = require('./models/userModel')
const app = express()
const port = 3000

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
// app.use(cookieParser())
app.use(methodOverride('_method'));
//app.use(expressLayout)

const store = new MongoDBStore({
  uri: 'mongodb://127.0.0.1:27017/quanly_ktx',
  collection: 'sessions'
})

app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store }))



app.use((req, res, next) => {
  if (!req.session.user) {
    return next()
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next()
    })
    .catch()
})

app.use((req,res,next) => {
  if (!req.session.user) {
    return next()
  }
  res.locals.username = req.user.fullname
  next()
})

app.use((req,res,next) => {
  User
    .countDocuments({bool:0})
    .then(resual => {
      res.locals.notifice = resual;
      next();
    })
    .catch()
})

app.use(flash())


app.use(authRoute)
app.use(adminRoute)
app.use(studentRoute)
//set view engine
app.set('view engine', 'ejs')
//app.set('layout', './layouts/main')


//connect to MongoDB
const uri = 'mongodb://localhost:27017/quanly_ktx'
async function connect(){
    try {
        await mongoose.connect(uri)
        console.log("Connect to Mongoodb")
    } catch (err) {
        console.error(err)
    }
}
connect()



app.listen(port, () => console.log(`Server running on http://localhost:${port}`))