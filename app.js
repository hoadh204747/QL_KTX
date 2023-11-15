const express = require('express')
const expressLayout = require('express-ejs-layouts')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const userModel = require('./models/userModel')
const authRoute = require('./routes/authRoute')
const adminRoute = require('./routes/adminRoute')
const studentRoute = require('./routes/studentRoute')
const app = express()
const port = 3000

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())
app.use(methodOverride('_method'));
//app.use(expressLayout)

app.use(session({
    secret: 'hoahuy',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: 'mongodb://localhost:27017/quanly_ktx'
    }),
  }));

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