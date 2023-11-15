const express = require('express');
const router = express.Router();
const isAuthAdmin = require('../middlewares/is-auth-admin')
const adminController = require('../controllers/adminController');

router.get('/admin/dashboard',  (req, res) => {
    res.render('admin/dashboard')
})

router.get('/admin/create-room',  adminController.getCreateRoom)
router.post('/admin/create-room',  adminController.createRoom)
router.get('/rooms', adminController.getAllRooms)
router.get('/room/:id', adminController.findRoom)
router.get('/edit/room/:id', adminController.getUpdateRoom)
router.put('/edit/room/:id', adminController.updateRoom)
router.delete('/room/:id', adminController.deleteRoom)

router.get('/post-news', adminController.getPostNews)
router.post('/post-news', adminController.PostNews)
router.get('/admin/list-news', adminController.getListNews)
router.get('/edit-news/:id', adminController.getUpdateNews)
router.put('/edit-news/:id', adminController.updateNews)
router.delete('/admin/list-news/:id', adminController.deteleNews)

module.exports = router;