const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    img : {type : String, required : true},
    role: { type: String, default: "patient" },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
