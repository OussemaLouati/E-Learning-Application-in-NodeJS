
const mongoose = require("mongoose");

const questionSchema = mongoose.Schema({
  idForum: {type : String},
  idBachelier: { type: String },
  question: {type : String},
  DateDeAjout: {
    type : Date,
    default : Date.now
   }
});

module.exports = mongoose.model("Question", questionSchema );



