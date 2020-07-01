const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Bachelier = require('../Models/Bachelier');
const config = require('../config/database');
const nodemailer = require('nodemailer');
const Group = require('../Models/groupe');
const GroupBachelier = require('../Models/groupeBachelier');

//http:localhost:/api/bachelier/register

router.post('/register', (req, res) => {
    let newBachelier = new Bachelier({
        nom: req.body.nom,
        prenom: req.body.prenom,
        username: req.body.username,
        email: req.body.email,
        emailParent: req.body.emailParent,
        numTelephone: req.body.numTelephone,
        password: req.body.password,
        numTelephoneParent: req.body.numTelephoneParent,
        dateDeNaissance: req.body.dateDeNaissance,
        idgroupe: req.body.idgroupe
        
    });
    Bachelier.addBachelier(newBachelier, (err, user) => {
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
                message: "Bachelier registration is successful."
            });
        }
    });
});
//http:localhost:/api/bachelier/login

router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    Bachelier.getBachelierByUsername(username, (err, bachelier) => {
        if (err) throw err;
        if (!Bachelier) {
            return res.json({
                success: false,
                message: "Bachelier not found."
            });
        }
        Bachelier.comparePassword(password, bachelier.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const idbachelier=bachelier._id
                const token = jwt.sign({
                    type: "bachelier",
                    data: {
                        _id: bachelier._id,
                        username: bachelier.username,
                        email: bachelier.email,
                    }
                }, config.secret, {
                    expiresIn: 604800 // for 1 week time in milliseconds
                });
                return res.json({
                    success: true,
                    idbachelier,
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
//créer un groupe     http:localhost:/api/bachelier/groupe

router.post('/groupe', (req, res) => {
    var bach = new Group({
        name: req.body.name,
    });
    bach.save((err, doc) => {
        if (!err) { res.send(doc); }
        else { res.send('Error in groupe Save :' + JSON.stringify(err, undefined, 2)); }
    });
});
//consulter un groupe par son id    http:localhost:/api/bachelier/54877157796974497/group

router.get('/:id/group', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Group.findById(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retriving bachelier :' + JSON.stringify(err, undefined, 2)); }
    });
 
});
//get all groupe
router.get('/allgroupe', (req, res) => {
    Group.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in Retriving Group :' + JSON.stringify(err, undefined, 2)); }
    });
});
/*router.post('/groupeBachelier',async function(req, res) {

    body = req.body
    var j=0 ;
    var k = body["idBacheliers"].length ;
    for (var i =0; i < body["idBacheliers"].length;i++) {
        group= new GroupBachelier({
            idGroupe:body["idGroupe"],
            idBachelier:body["idBacheliers"][i]

        });
        var g= new GroupBachelier()
        g= await GroupBachelier.find({ $and : [
            {idBachelier:body["idBacheliers"][i] } , {idGroupe : body["idGroupe"] } ]
        });
        //console.log(g.length)
        if(!g.length )
            {group.save() ;
            j++ ;} 
        else if((g.length>0) && (body["idBacheliers"].length== 1))
            res.status(404).send(body["idBacheliers"][i] +" "+ "deja saved");

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
        res.send(j +" "+ "bachelier saved and "+n +" bacheliers not saved")

});
*/

//desavtiver un bachelier   http:localhost:/api/bachelier/update/6548896176171784

router.put('/update/:id', (req, res ) => {
    
    Bachelier.updateOne({ _id: req.params.id },{$set:{"statut":"nonPayer"}} ,(err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in Retriving bachelier :' + JSON.stringify(err, undefined, 2)); }
    });
});

//consulter un bachelier par son id   http:localhost:/api/bachelier/getById/663689414818787

router.get('/getById/:id', (req, res ) => {
    Bachelier.find( { _id: req.params.id },{_id:0,password:0},(err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Erreur  :' + JSON.stringify(err, undefined, 2)); }
    });
});
// consulter tous les bacheliers http:localhost:/api/bachelier/getAll

router.get('/getAll', ( req, res) => {
    Bachelier.find({},{password:0} ,(err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Erreur :' + JSON.stringify(err, undefined, 2)); }
    });
});
//consulter tous les bachelier qui son payer http:localhost:/api/bachelier/getAllBachelierPayer
router.get('/getAllBachelierPayer', ( req, res) => {
    Bachelier.find({statut:"payer"},{password:0} ,(err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Erreur :' + JSON.stringify(err, undefined, 2)); }
    });
});
//consulter le nombre de bachelier
router.get('/nbBachelierTotale',(req,res) =>{
    Bachelier.count({}).then((count) =>{
        res.status(200).json({
            message: "le nombre de bachelier sont",
            nombre:count
        });
    });
});

//consulter le nombre de bachelier qui sont paye
router.get('/nbBachelierpayer',(req,res) =>{
    Bachelier.count({"statut":"payer"}).then((count)=> {
        res.status(200).json({
                               message: "les bachelier qui sont payer sont",
                               nombre:count
        });
    });
})



router.get('/nbBacheliernonPayer',(req,res) =>{
    Bachelier.count({"statut":"nonPayer"}).then((count)=> {
        res.status(200).json({
                               message: "les bachelier qui sont payer sont"+" " + count ,
                               nobre:count
                        });

    });
})

router.get('/getAllBachelierPayer', ( req, res) => {
    Bachelier.find({statut:"payer"},{password:0} ,(err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Erreur :' + JSON.stringify(err, undefined, 2)); }
    });
});

//consulter tous les bachelier non payer http:localhost:/api/bachelier/getAllBachelierNonPayer
router.get('/getAllBachelierNonPayer', (req,res) =>{
    Bachelier.find({statut:"nonPayer"},{password:0},(err,docs) =>{
        if(!err){res.send(docs); }
        else{console.log('Erreur :' + JSON.stringify(err, undefined, 2));}
    });
});
//modifer le profile de bachelier http:localhost:/api/bachelier/541787718748

router.put('/:id',(req, res) =>{
    var _id = req.params.id;
 
    Bachelier.findById(_id)
        .then(bachelier => {

            bachelier.nom =req.body.nom;
            bachelier.prenom = req.body.prenom;
            bachelier.email = req.body.email;
            bachelier.emailParent = req.body.emailParent;
            bachelier.numTelephone = req.body.numTelephone;
            bachelier.username = req.body.username;
            bachelier.dateDeNaissance = req.body.dateDeNaissance;
            bachelier.numTelephoneParent = req.body.numTelephoneParent;
            bachelier.password = req.body.password;

            Bachelier.updateBachelier(bachelier,(err, message) =>{
               if(!err) {res.send({message: 'Bachelier et modifié avec succés '})}
                else{res.send({message:'un err'})}
            });
        }) 
 
});



router.get('/profile', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    // console.log(req.user);
    return res.json(
        req.user
    );
});

//Reclamation au parent 
//http://localhost:3000/api/bachelier/Reclamation/:idBachelier
router.post('/Reclamation/:id', (req, res ) => {
    Bachelier.find( { _id: req.params.id },{_id:0, emailParent:1},(err, docs) => {
        if (!err) { res.send(docs); 
        console.log(docs[0]['emailParent'])
        
    //Send  Mail
      var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {

          user: 'tsunamiittest@gmail.com',
          pass: "tsunami123*"
        }
      });
      var mailOptions = {
        from: 'tsunamiittest@gmail.com',
        to: docs[0]['emailParent'] ,
        subject: 'Tsunami IT: Reclamation  ',
        html:req.body.reclamationtxt
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
        
        }
        else { console.log('Erreur  :' + JSON.stringify(err, undefined, 2)); }
    });
});





module.exports = router;