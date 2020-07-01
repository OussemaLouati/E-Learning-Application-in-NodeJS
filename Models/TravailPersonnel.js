
const mongoose = require("mongoose");

const travailPersonnelSchema = mongoose.Schema({
  idSerie:{
    type: String
  },
  
    idBachelier: {
     type: String
    },

  Fichier: {
    type :String},

  DateDeAjout: {
    type : Date,
    default : Date.now
   }

});

module.exports = mongoose.model("TravailPersonnel", travailPersonnelSchema);



