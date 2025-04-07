const Doctor = require("../models/contact.model")

exports.Contact = async (req , res)=>{
    const {name, email , message} = req.body
    try {
     await Doctor.create({
        name,
        email,
        message
     })
    res.status(200).json({message:"successfully message sent"})
    } catch (error) {
     res.status(404).json({message: "message sent failed"})
    }
}
exports.GetContact = async (req , res)=>{
    try {
     const response =  await Doctor.find()
    res.status(200).json(response)
    } catch (error) {
     res.status(404).json({message: "messages not found something is wrong please try again."})
    }
}