
const mongoose = require("mongoose");

const paiementSchema = mongoose.Schema({
    montant: {
        type: Number,
     
        required: true
  
    },
    type: {
        type: String,
       
        required: true ,
        default: "First tranche"
    },
    facture: {
        type: Number,
     
    },
    dateDePaiement: {
        type: String ,
   
        required: true

       
    },
    idBachelier: {
         type: String ,

         required: true
         },
         
   status: {
        type: String
        },
        
    dateLimite: {
        type: String
        }

});

module.exports = mongoose.model("Paiement", paiementSchema);

