 const express = require("express")
 const {Contact,GetContact, DeleteContact} = require("../controllers/contact.controller.js")

 const router = express.Router()

 router.post('/contact', Contact)
 router.get('/contact', GetContact)
 router.delete('/contactDelete/:id', DeleteContact)

 module.exports = router