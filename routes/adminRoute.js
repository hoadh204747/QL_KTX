const express = require('express');
const router = express.Router();
const isAuthAdmin = require('../middlewares/is-auth-admin')
const adminController = require('../controllers/adminController');

router.get('/', adminController.page)

router.get('/admin/dashboard', adminController.home);

router.get('/admin/create-room',  adminController.getCreateRoom)
router.post('/admin/create-room',  adminController.createRoom)
router.get('/rooms', adminController.getAllRooms)
// router.get('/room/:id', adminController.findRoom)
router.get('/edit/room/:id', adminController.getUpdateRoom)
router.put('/edit/room/:id', adminController.updateRoom)
router.delete('/room/:id', adminController.deleteRoom)

router.get('/post-news', adminController.getPostNews)
router.post('/post-news', adminController.PostNews)
router.get('/admin/list-news', adminController.getListNews)
router.get('/edit-news/:id', adminController.getUpdateNews)
router.put('/edit-news/:id', adminController.updateNews)
router.delete('/admin/list-news/:id', adminController.deteleNews)
router.get('/detail-news/:id', adminController.detailNews)

router.post('/add-student-to-room', adminController.addStudent_toRRoom)

router.get('/xac-nhan-dang-ky', adminController.getXac_nhan_dang_ky)
router.post('/xac-nhan-dang-ky', adminController.xac_nhan_dang_ky)

router.get('/room/:id', adminController.quan_ly_phong)
router.post('/room/:id', adminController.delStudent_to_Room)

router.get('/create-bill', adminController.getCreateBill)
router.post('/create-bill', adminController.postBill)
router.get('/thongke-bill', adminController.thongkeBill)

module.exports = router;