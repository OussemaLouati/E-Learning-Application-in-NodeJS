const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Formateur = require('../Models/Formateur');
const config = require('../config/database');
const nodemailer = require('nodemailer');
const Group = require('../Models/groupe');
const GroupBachelier = require('../Models/groupeBachelier');


////http:localhost:/api/formateur/register


router.post('/register', (req, res) => {
    let newFormateur = new Formateur({
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        numTelephone: req.body.numTelephone,
        username: req.body.username,
        password: req.body.password,
        specialite: req.body.specialite,
    });
    Formateur.addFormateur(newFormateur, (err, user) => {
        if (err) {
            let message = "";
            if (err.errors.username) message = "Username is already taken. ";
            if (err.errors.email) message += "Email already exists.";
            return res.json({
                success: false,
                message
            });
        } else {

                var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                  user: 'tsunamiittest@gmail.com',
                  pass: "tsunami123*"
                }
              });
              var mailOptions = {
                from: 'tsunamiittest@gmail.com',
                to: req.body.email,
                subject: ' Mail De Bienvenue',
                html: "<p> Bonjour   "+ (req.body.username) + ",<br> <p> Bienvenue  <B> <br><p> Vos infomrations de Login sont : <br><p> Username :  " +" "+ req.body.username +"<br><p> Mot De Passe : "+" "+ req.body.password
              };
              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            return res.json({
                success: true,
                message: "Formateur registration is successful."
            });
        }
    });
});
//http:localhost:/api/formateur/login

router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    Formateur.getFormateurByUsername(username, (err, formateur) => {
        if (err) throw err;
        if (!formateur) {
            return res.json({
                success: false,
                message: "Formateur not found."
            });
        }
        Formateur.comparePassword(password, formateur.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const idformateur=formateur._id
                const nomformateur=formateur.nom
                const prenomformateur=formateur.prenom
                const specialiteformateur=formateur.specialite
                const emailformateur=formateur.email
                const numTelephoneformateur=formateur.numTelephone
                const usernameformateur=formateur.username
                const token = jwt.sign({
                    type: "formateur",
                    data: {
                        _id: formateur._id,
                        username: formateur.username,
                        nom: formateur.nom,
                        prenom: formateur.prenom,
                        email: formateur.email,
                        specialite: formateur.specialite,
                        numTelephone: formateur.numTelephone,
                    }
                }, config.secret, {
                    expiresIn: 604800 // for 1 week time in milliseconds
                });
                return res.json({
                    success: true,
                    idformateur,
                    nomformateur,
                    prenomformateur,
                    emailformateur,
                    specialiteformateur,
                    usernameformateur,
                    numTelephoneformateur,
                    token: "JWT " + token
                });
            } else {
                return res.json({
                    success: true,
                    message: "Wrong Password."
                });
            }
        });
    });
});
/*
app.post('/changepass' , function (req, res, next) {
     if (newpass !== newpassconfirm) {
        throw new Error('password and confirm password do not match');
     }

     var user = req.user;

     user.pass = newpass;

     user.save(function(err){
         if (err) { next(err) }
         else {
             res.redirect('/account');
         }
     })
});*/
//consulter formateur by id http:localhost:/api/formateur/login

router.get('/getById/:id', (req, res ) => {
    Formateur.find( { _id: req.params.id },{_id:0,password:0},(err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Erreur  :' + JSON.stringify(err, undefined, 2)); }
    });
});

//consulter tous les formateur http:localhost:/api/formateur/login

router.get('/getAll', ( req, res) => {
    Formateur.find({},{password:0} ,(err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Erreur :' + JSON.stringify(err, undefined, 2)); }
    });
});
//consulter tous les formateur active http:localhost:/api/formateur/getAllFormateurActive
router.get('/getAllFormateurActive', ( req, res) => {
    Formateur.find({statut:"Active"},{password:0} ,(err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Erreur :' + JSON.stringify(err, undefined, 2)); }
    });
});
//consulter tous les formateur desactiver http:localhost:/api/formateur/getAllFormateurDesactiver
router.get('/getAllFormateurDesactiver', ( req, res) => {
    Formateur.find({statut:"Desactiver"},{password:0} ,(err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Erreur :' + JSON.stringify(err, undefined, 2)); }
    });
});
//créer un groupe de formateur  http:localhost:/api/formateur/groupeFormateur
router.post('/groupeFormateur',async function(req, res) {

    body = req.body
    var j=0 ;
    var k = body["idFormateurs"].length ;
    for (var i =0; i < body["idFormateurs"].length;i++) {
        group= new GroupBachelier({
            idGroupe:body["idGroupe"],
            idFormateur:body["idFormateurs"][i]

        });
        var g= new GroupBachelier()
        g= await GroupBachelier.find({ $and : [
            {idFormateur:body["idFormateurs"][i] } , {idGroupe : body["idGroupe"] } ]
        });
        //console.log(g.length)
        if(!g.length )
            {group.save() ;
            j++ ;} 
        else if((g.length>0) && (body["idFormateurs"].length== 1))
            res.status(404).send(body["idFormateurs"][i] +" "+ "deja saved");

    };
    var n=k-j;
    //console.log(n)
    if(j==0)
    {
        res.status(520).send("Nothing was Saved Sadly")
    }
    else if(n==0)
    {
        res.status(200).send("All saved")
    }
    else
        res.send(j +" "+ "formateur saved and "+n +" formateur not saved")

});


//desactiver un formateur par son id http:localhost:/api/formateur/update/54815555555144
router.put('/update/:id', (req, res ) => {
    
    Formateur.updateOne({ _id: req.params.id },{$set:{"statut":"Desactiver"}} ,(err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in Retriving bachelier :' + JSON.stringify(err, undefined, 2)); }
    });
});
//consulter le nombre de formateur
router.get('/',(req,res) =>{
    Formateur.count({}).then((count) =>{
        res.status(201).json({
            message:"le nombre de formateur"+ " " +count
        });

    });
});


//modifier un formateur par son id http:localhost:/api/formateur/update/54815555555144
router.put('/:id',(req, res) =>{
    var _id = req.params.id;
 
    Formateur.findById(_id)
        .then(formateur => {

            formateur.nom =req.body.nom;
            formateur.prenom = req.body.prenom;
            formateur.email = req.body.email;
            formateur.numTelephone = req.body.numTelephone;
            formateur.username = req.body.username;
            formateur.password = req.body.password;
            formateur.specialite = req.body.specialite;

            Formateur.updateFormateur(formateur,(err, message) =>{
               if(!err) {res.send({message: 'Formateur et modifié avec succés '})}
                else{res.send({message:'un err'})}
            });
        }); 
        
 
});

// Get Authenticated user profile
 

router.get('/profile', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    // console.log(req.user);
    return res.json(
        req.user
    );
});

module.exports = router;