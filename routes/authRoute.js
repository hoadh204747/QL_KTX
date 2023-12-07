 const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const isAuthAdmin = require('../middlewares/is-auth-admin')

router.get('/', authController.home)

router.post('/', authController.postLogout)

router.get('/login', authController.getLogin)

router.post('/login', authController.postLogin)

router.get('/register', authController.getRegister)

router.post('/register', authController.postRegister)

module.exports = router;