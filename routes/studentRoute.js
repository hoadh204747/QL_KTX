const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController')
const isAuthStudent = require('../middlewares/is-auth-student')

router.get('/thong-tin-ca-nhan', studentController.getInfoUser)
router.put('/thong-tin-ca-nhan', studentController.updateInfoUser)

router.get('/student/dashboard', studentController.dashboard)
router.get('/student/dang-ky', studentController.getAllRooms)

router.get('/detail-news/:id', studentController.detailNews)

router.post('/dang-ky-phong/:id', studentController.dang_ky_phong)

router.get('/trang-thai', studentController.getTrang_thai)
router.post('/trang-thai', studentController.trang_thai)

router.get('/roomate', studentController.getRoomate)

router.get('/list-manager', studentController.getListManager)

router.get('/hoa-don-dien-nuoc', studentController.billDienNuoc)
router.get('/hoa-don-thanh-toan', studentController.billThanhToan)

router.get('/forum', studentController.forum)
router.post('/forum', studentController.postRating)
router.delete('/forum/:id', studentController.deleteCmt)

router.get('/forum/an-ninh-trat-tu', studentController.topicTTAN)
router.get('/forum/dien-nuoc-vesinh', studentController.topicDNWC)
router.get('/forum/other', studentController.topicOTHER)

module.exports = router;