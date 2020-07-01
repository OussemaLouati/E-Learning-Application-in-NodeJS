const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Admin = require('../Models/Admin');
const config = require('../config/database');
const nodemailer = require('nodemailer');

router.post('/register', (req, res) => {
    let newAdmin = new Admin({
        name: req.body.name,
        prenom: req.body.prenom,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        
    });
    Admin.addAdmin(newAdmin, (err, user) => {
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
                message: "Admin registration is successful."
            });
        }
    });
});

router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    Admin.getAdminByUsername(username, (err, admin) => {
        if (err) throw err;
        if (!admin) {
            return res.json({
                success: false,
                message: "Admin not found."
            });
        }
        Admin.comparePassword(password, admin.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const idadmin=admin._id
                const token = jwt.sign({
                    type: "admin",
                    data: {
                        _id: admin._id,
                        username: admin.username,
                        name: admin.name,
                        email: admin.email,
                    }
                }, config.secret, {
                    expiresIn: 604800 // for 1 week time in milliseconds
                });
                return res.json({
                    success: true,
                    idadmin,
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
//consulter le nombre des admin
router.get('/',(req,res) =>{
    Formateur.count({}).then((count) =>{
        res.status(201).json({
            message:"le nombre de formateur"+ " " +count
        });

    });
});



router.get('/getById/:id', (req, res ) => {
    Admin.find( { _id: req.params.id },{_id:0,password:0},(err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Erreur  :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.get('/getAll', ( req, res) => {
    Admin.find({},{password:0} ,(err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Erreur :' + JSON.stringify(err, undefined, 2)); }
    });
});
router.put('/update/:id',(req, res) =>{
    var _id = req.params.id;
 
    Admin.findById(_id)
        .then(admin => {

            admin.name =req.body.name;
            admin.prenom = req.body.prenom;
            admin.email = req.body.email;
            admin.numTelephone = req.body.numTelephone;
            admin.username = req.body.username;
            admin.password = req.body.password;

            Admin.updateAdmin(admin,(err, message) =>{
               if(!err) {res.send({message: 'Admin et modifié avec succés '})}
                else{res.send({message:'un err'})}
            });
        }) 
 
});

 //Get Authenticated user profile


router.get('/profile', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    // console.log(req.user);
    return res.json(
        req.user
    );
});





  







module.exports = router;