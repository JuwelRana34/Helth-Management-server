const mongoose = require("mongoose");

const jwtSchema = new mongoose.Schema(
    {
        email: { type: String, required: true },
        
      }
);

const jwtModel = mongoose.model("JwtModel", jwtSchema);

module.exports = jwtModel;