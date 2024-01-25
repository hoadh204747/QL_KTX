const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const isAuthAdmin = require('../middlewares/is-auth-admin')



router.post('/', authController.postLogout)

router.get('/login', authController.getLogin)

router.post('/login', authController.postLogin)

router.get('/register', authController.getRegister)

router.post('/register', authController.postRegister)

router.get('/reset-password', authController.getResetPassword)
router.post('/reset-password', authController.postReset)
router.get('/set-new-password/:token', authController.getNewPassword)
router.post('/set-new-password', authController.postNewPassword)

module.exports = router;