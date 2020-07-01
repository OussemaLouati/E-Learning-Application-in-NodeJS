const mongoose = require("mongoose");

const forumSchema = mongoose.Schema({
  idSerie: {type : String},
  idFormateur:{type : String}, 
  idGroupe : { type : String},
  DateDeAjout: {
    type : Date,
    default : Date.now
   }
});

module.exports = mongoose.model("Forum", forumSchema );