
var async = require("async");
const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
const Seance = require('../Models/Seance');
const GroupeBachelier = require('../Models/groupeBachelier');
const Bachelier = require('../Models/Bachelier');
var nodemailer = require('nodemailer');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

var moment = require('moment');
moment.suppressDeprecationWarnings = true;
var cron = require('node-schedule');

//http://localhost:3000/api/seance/5d5542e9c5daaf288d7a9343 

router.post('/:idFormateur', async function (req, res) {

  var TableauEmails = []
  var idBacheliers = []
  var array = req.body;

  var seance = new Seance({

    dateDebut: req.body.dateDebut,
    dateFin: req.body.dateFin,
    idFormateur: req.params.idFormateur,
    idGroupe: req.body.idGroupes,
  });

  seance.save(async (err, doc) => {
    if (!err) {
      res.send(doc);

      console.log("here is idgroupe :" + array['idGroupes'])

      var idGroupeBachelier = array['idGroupes']
      var grou = Bachelier()

      grou = await Bachelier.find({ idgroupe: idGroupeBachelier });
      var n = grou.length;
      console.log(n)
      for (var j = 0; j < n; j++) {

        TableauEmails.push(grou[j]['email'])
      }
          console.log("tabEmails :" + TableauEmails)








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
        bcc: TableauEmails,
        subject: 'Tsunami IT: confirmation seance ',
        html: "<p> Dear  ,<br> <p> We would be delighted to welcome you for an interview on <B> </B>  <br> <p> Please login to your account to confirm your presence , Here is the link :  <A href=\"\https://www.google.com\"> Arrimer </A> </p> <br> Kind Regards"
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      //Avant 24H
      var dateBeforeOneDay = moment(req.body.dateDebut).subtract(1, 'day').format('llll')
      //BEFORE ONE DAY
      cron.scheduleJob(dateBeforeOneDay, function () {
        console.log(new Date(), " Reminder before 24 hours is ready to sent !");
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'tsunamiittest@gmail.com',
            pass: "tsunami123*"
          }
        });
        var mailOptions = {
          from: 'tsunamiittest@gmail.com',
          bcc: TableauEmails,
          subject: 'Tsunami IT: Rappel de paiement avant 24 heures ',
          html: "<p> Dear  ,<br> <p> We would be delighted to remind you for your second paiement <B> " + (req.body.dateDebut) + "</B> <br> <br> Kind Regards"

        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      });

    }
    else { console.log('Error in Seance Save :' + JSON.stringify(err, undefined, 2)); }
  });
});



// DELETE seance By Id
//http://localhost:3000/api/seance/5d57e1973e7603404c17b6ff 
router.delete("/:id", (req, res, next) => {
  Seance.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "Seance deleted!" });
  });
});

//Update date et heure de la seance   
//http://localhost:3000/api/seance/5d57f1f6a4defa0f908bbae8 
router.put('/:id', (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No record with given id : ${req.params.id}`);
  var t = {
    dateDebut: req.body.dateDebut,
    dateFin: req.body.dateFin
  };

  Seance.findByIdAndUpdate(req.params.id, { $set: t }, { new: true }, async (err, doc) => {
    
  var TableauEmails = []
  var idBacheliers = []
    if (!err) { res.send(doc);
      //mail when we update seance

      console.log("here is idGroupe : " + doc['idGroupe'])
      var idGroupeBachelier = doc['idGroupe']
      var grou = Bachelier()

      grou = await Bachelier.find({ idgroupe: idGroupeBachelier });
      var n = grou.length;
 
      console.log(n)
       for (var j = 0; j < n; j++) {

        TableauEmails.push(grou[j]['email'])
      }
          console.log("tabEmails :" + TableauEmails)


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
        bcc: TableauEmails,
        subject: 'Tsunami IT: Update seance ',
        html: "<p> Dear  ,<br> <p> We would be delighted to welcome you for an interview on <B> </B>  <br> <p> Please login to your account to confirm your presence , Here is the link :  <A href=\"\https://www.google.com\"> Arrimer </A> </p> <br> Kind Regards"
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });



    
    
    
    
    
    
    
    
    
    
    
    
    }
    else { console.log('Error in Status Seance Update :' + JSON.stringify(err, undefined, 2)); }
  });
});
// GET les seances de formateur
//http://localhost:3000/api/seance/calendrierFormateur/5d5542e9c5daaf288d7a9343 
router.get("/calendrierFormateur/:for", (req, res, next) => {
  Seance.find({ idFormateur: req.params.for }).then(document => {
    res.status(200).json({
      message: " calendrier Formateur fetched successfully!",
      Calendrier: document
    });
  });
});

// GET les seances de bachelier
//http://localhost:3000/api/seance/calendrierBachelier/5d5542e9c5daaf288d7a9343 
router.get("/calendrierBachelier/:gr", (req, res, next) => {
  Seance.find({ idGroupe: req.params.gr }).then(document => {
    res.status(200).json({
      message: " calendrier Groupe fetched successfully!",
      CalendrierGBachelier: document
    });
  });
});








module.exports = router;
