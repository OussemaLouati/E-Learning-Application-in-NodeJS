const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');

// Admin Schema
const FormateurSchema = mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    prenom: {
        type:String,
        required:true
    },
    email: {
        type: String,
        unique: true,
        index: true,
        required: true
    },
    numTelephone: {
        type: Number
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    specialite: {
        type:String
    },

    type: {
        type:String,
        default:"formateur"
    },
    statut: {
        type:String,
        default:"Active"
    },


});
/*FormateurSchema.pre('save', function(next){
    var user = this;

    //check if password is modified, else no need to do anything
    if (!user.isModified('pass')) {
       return next()
    }

    user.pass = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    next()
})*/

FormateurSchema.plugin(uniqueValidator);

const Formateur = module.exports = mongoose.model('Formateur', FormateurSchema);

// Find the Admin by ID
module.exports.getFormateurById = function (id, callback) {
    Formateur.findById(id, callback);
}

// Find the Admin by Its username
module.exports.getFormateurByUsername = function (username, callback) {
    const query = {
        username: username
    }
    Formateur.findOne(query, callback);
}

// to Register the 
module.exports.addFormateur = function (newFormateur, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newFormateur.password, salt, (err, hash) => {
            if (err) throw err;
            newFormateur.password = hash;
            newFormateur.save(callback);
        });
    });
}

module.exports.updateFormateur = function (formateur, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(formateur.password, salt, (err, hash) => {
            if (err) throw err;
            formateur.password = hash;
            formateur.save(callback);
        });
    });
}

// Compare Password
module.exports.comparePassword = function (password, hash, callback) {
    bcrypt.compare(password, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}