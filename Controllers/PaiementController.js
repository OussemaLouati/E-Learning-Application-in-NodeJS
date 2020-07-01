const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
const  Paiement  = require('../Models/Paiement');
var nodemailer = require('nodemailer');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

var moment = require('moment');
moment.suppressDeprecationWarnings = true;
var cron = require('node-schedule');

// CREATE Paiement  to a bachelier
//5d555356a125d82d6b4f8148
//status : paid or unpaid
router.post('/:idBachelier', (req, res) => {

    var pay = new Paiement({
      montant: req.body.montant,
      type: req.body.type,
      facture: req.body.facture,
      idBachelier:req.params.idBachelier, 
      DateDePaiement:req.body.DateDePaiement,
      status:req.body.status,
      dateLimite:req.body.dateLimite 
    });
    pay.save((err, doc) => {
      if (!err) {
        res.send(doc);
  
        var dateBeforeOneDay = moment(req.body.dateLimite).subtract(1, 'day').format('llll')
        var dateBeforeTwoDay = moment(req.body.dateLimite).subtract(2, 'day').format('llll')
        var dateBeforeSevenDay = moment(req.body.dateLimite).subtract(7, 'day').format('llll')
       console.log(dateBeforeSevenDay);
  
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
            to: req.body.email,
            subject: 'Tsunami IT: Rappel de paiement avant 24 heures ',
            html: "<p> Dear  ,<br> <p> We would be delighted to remind you for your second paiement <B> " + (req.body.dateLimite) + "</B> <br> <br> Kind Regards"
  
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          }); });
  
  
        //BEFORE TWO DAY
        cron.scheduleJob(dateBeforeTwoDay, function () {
          console.log(new Date(), " Reminder before 2 Days is ready to sent !" );
          var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'tsunamiittest@gmail.com',
              pass: "tsunami123*"
            }
          });
          var mailOptions = {
            from: 'tsunamiittest@gmail.com',
            to: req.body.email,
            subject: 'Tsunami IT: Rappel de paiement avant 2 jours ',
            html: "<p> Dear  ,<br> <p> We would be delighted to remind you for your second paiement <B> " + (req.body.dateLimite) + "</B> <br> <br> Kind Regards"
  
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        }
        
        );
         //BEFORE SEVEN DAY
         cron.scheduleJob(dateBeforeSevenDay, function () {
          console.log(new Date(), " Reminder before 7 jours is ready to sent !");
          var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'tsunamiittest@gmail.com',
              pass: "tsunami123*"
            }
          });
          var mailOptions = {
            from: 'tsunamiittest@gmail.com',
            to: req.body.email,
            subject:  'Tsunami IT: Rappel de paiement avant 7 jours ',
            html: "<p> Dear  ,<br> <p> We would be delighted to remind you for your second paiement <B> " + (req.body.dateLimite) + "</B> <br> <br> Kind Regards"
  
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          }); });}
      else { console.log('Error in rendezVous Save :' + JSON.stringify(err, undefined, 2)); }
    });
  });

  // GET ALL Paiements
router.get("", (req, res, next) => {
    Paiement.find().then(documents => {
      res.status(200).json({
        message: "Paiements récupérés avec succès!!",
        Paiements: documents
      });
    });
  });


// GET ALL Paiements By Bachelier Id
router.get("/:idBachelier/Paiements", (req, res, next) => {
    Paiement.find({idBachelier: req.params.idBachelier }).then(documents => {
      res.status(200).json({
        message: "Paiements récupérés avec succès!!",
        Paiements: documents
      });
    });
  });


//Update Paiement
router.put('/:id', (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No record with given id : ${req.params.id}`);
  var t = {
    montant: req.body.montant,
    type: req.body.type,
    facture: req.body.facture,
    DateDePaiement:req.body.DateDePaiement,
    status:req.body.status,
    dateLimite:req.body.dateLimite 
 };

  Paiement.findByIdAndUpdate(req.params.id, { $set: t }, { new: true }, (err, doc) => {
    if (!err) { res.send(doc); }
    else { console.log('Error in Status RendezVous Update :' + JSON.stringify(err, undefined, 2)); }
  });
});



module.exports = router;