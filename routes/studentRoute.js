const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController')
const isAuthStudent = require('../middlewares/is-auth-student')

router.get('/student/dashboard', studentController.dashboard)
router.get('/student/dang-ky', studentController.getAllRooms)

router.get('/detail-news/:id', studentController.detailNews)

module.exports = router;