const mongoose = require('mongoose');
const groupFormateurSchema = mongoose.Schema({
idGroupe:{
	type:String
},
idFormateur:{
	type:String
}
});

module.exports = mongoose.model("GroupFormateur", groupFormateurSchema);
