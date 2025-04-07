 const express = require("express")
 const {Contact,GetContact} = require("../controllers/contact.controller.js")

 const router = express.Router()

 router.post('/contact', Contact)
 router.get('/contact', GetContact)

 module.exports = router