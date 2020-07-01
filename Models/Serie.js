
const mongoose = require("mongoose");

const SerieSchema = mongoose.Schema({
  matiere : {
    type : String
  },
  Description : {
    type : String
  },
  idFormateur: {
     type: String
    },
 idGroupe : {
   type : String
 },
  Fichier: {
    type :String},

  DateDeAjout: {
    type : Date,
    default : Date.now
   }

});

module.exports = mongoose.model("Serie", SerieSchema);



