const mongoose = require("mongoose");

const reponseSchema = mongoose.Schema({
  idQuestion: {type : String},
  idBachelier: { type: String , default : null  },
  idFormateur: { type: String, default : null },
  reponse: {type : String},
  DateDeAjout: {
    type : Date,
    default : Date.now
   }
});

module.exports = mongoose.model("Reponse", reponseSchema );