const express = require('express')
const {Allpayments, postPayment,getPaymentSuccess,verifyPayment, payments}= require('../controllers/Payments.controller')


const router = express.Router()
router.post('/payment', postPayment)
router.post('/payment-success', getPaymentSuccess)
router.get('/verify-payment/:tran_id/:userID', verifyPayment)
router.get('/payments/:userid', payments)
router.get('/payments', Allpayments)

module.exports = router