
const mongoose = require("mongoose");

const resumeSchema = mongoose.Schema({
  matiere:{type : String , required : true},
  Fichier: {type : String},
  idFormateur: { type: String },
  idGroupe: {type : String},
  DateDeAjout: {
    type : Date,
    default : Date.now
   },
   Description:{
   	type:String
   },
});

module.exports = mongoose.model("Resume", resumeSchema );



