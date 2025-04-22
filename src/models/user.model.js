const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    img : {type : String},
    role: { type: String, default: "patient" ,enum:["patient","admin", "doctor"] },
    subscriptions: { type: Date,},
    ticket:{type:Number , default:0},
    subscriptionPlan: { type: String, default: "" , enum: ["basic", "premium", "family"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
