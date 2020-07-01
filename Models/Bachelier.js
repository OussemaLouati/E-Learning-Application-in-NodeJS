const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');

const BachelierSchema = mongoose.Schema({

    nom: {
        type: String,
        required: true
    },
    prenom: {
        type: String,
        required:true
    },
    email: {
        type: String,
        unique: true,
        index: true,
        required: true
    },
    emailParent: {
        type:String,
        unique: true,
        index: true,
        required: true
    },
    numTelephone:{
        type:Number,
        required:true
    },
    numTelephoneParent:{
        type:Number,
        required:true
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
    statut: {
        type:String,
        default:"payer"
    },
    idgroupe: {
        type:String
    },
    type: {
        type:String,
        default:"bachelier"
    },
    dateDeNaissance:{
        type:Date
    },

});



BachelierSchema.plugin(uniqueValidator);

const Bachelier = module.exports = mongoose.model('Bachelier', BachelierSchema);


// Find the Bachelier by ID
module.exports.getBachelierById = function (id, callback) {
    Bachelier.findById(id, callback);
}

// Find the Bachelier by Its username
module.exports.getBachelierByUsername = function (username, callback) {
    const query = {
        username: username
    }
    Bachelier.findOne(query, callback);
}
module.exports.getBachelierByEmail = function (email, callback) {
    const query = {
        email: email
    }
    Bachelier.findOne(query, callback);
}
// to Register the Bachelier
module.exports.addBachelier = function (newBachelier, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newBachelier.password, salt, (err, hash) => {
            if (err) throw err;
            newBachelier.password = hash;
            newBachelier.save(callback);
        });
    });
}

module.exports.updateBachelier = function (bachelier, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(bachelier.password, salt, (err, hash) => {
            if (err) throw err;
            bachelier.password = hash;
            bachelier.save(callback);
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