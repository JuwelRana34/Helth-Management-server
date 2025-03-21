const express = require('express');
const {postNofication, getNotifications ,deleteNotification}= require('../controllers/notification.controller');

const router = express.Router();

router.post('/notification', postNofication);
router.get('/notifications', getNotifications);
router.delete('/notification', deleteNotification);

module.exports = router;