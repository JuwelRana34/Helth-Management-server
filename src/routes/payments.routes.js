const express = require('express')
const { postPayment,getPaymentSuccess,verifyPayment, payments}= require('../controllers/Payments.controller')

const router = express.Router()
router.post('/payment', postPayment)
router.post('/payment-success', getPaymentSuccess)
router.get('/verify-payment/:tran_id/:userID', verifyPayment)
router.get('/payments', payments)

module.exports = router