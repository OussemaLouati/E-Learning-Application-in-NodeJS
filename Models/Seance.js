
const mongoose = require("mongoose");

const seanceSchema = mongoose.Schema({
    dateDebut: {
        type: String
  },
    dateFin: {
        type: String
       
    },
    idFormateur: {
        type: String
    },
    idGroupe: {
        type: String
    }
});

module.exports = mongoose.model("Seance", seanceSchema);

