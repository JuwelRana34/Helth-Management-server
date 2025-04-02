const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    tran_id: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String },
    paymentStatus: { type: String, required: true, enum: ['pending', 'paid',] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

module.exports = mongoose.model('Payment', paymentSchema)