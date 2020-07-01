const express = require('express');
var router = express.Router();

const Forum  = require('../Models/Forum');


const Bachelier = require ('../Models/Bachelier');

// Add a FOrum
router.post('/', (req, res) => {


var forum = new Forum({
    idSerier: req.body.idSerie,
    idGroupe: req.body.idGroupe,
    DateDeAjout: req.body.DateDeAjout,
    idFormateur: req.body.idFormateur,
   
  }); 
  forum.save().then(createdForum => {
    res.status(201).json({
      message: "",
      Question: {
        ...createdForum ,
        id: createdForum ._id
      }
    });
  }); 
});

// GET ALL forums
router.get("", (req, res, next) => {
  Forum.find().then(documents => {
    res.status(200).json({
      message: "forums récupérés avec succès!",
      forums: documents
    });
  });
});

// GET forums By Formateur Id
router.get("/forumForm/:idFormateur", (req, res, next) => {
  Forum.find({idFormateur: req.params.idFormateur }).then(document => {
    res.status(200).json({
      message: "forums récuperés avec succés!",
      forums: document
    });
  });
});

// Get forums by Bachelier Id
router.get("/forumBach/:idBachelier",async function (req, res, next) {

  rd = await Bachelier.findById({_id:req.params.idBachelier}).exec();
  
console.log(rd['idGroupe']);
  Forum.find({idGroupe: rd['idGroupe'] }).then(document => {
    res.status(200).json({
      message: "forums récuperés avec succés!",
      forums: document
    });
  });
});

// GET Forum By Id
router.get("/:id", (req, res, next) => {
  Forum.findById(req.params.id).then(forum => {
    if (forum) {
      res.status(200).json(forum);
    } else {
      res.status(404).json({ message: "forum non trouvé!" });
    }
  });
});



// DELETE forum
router.delete("/:id", (req, res, next) => {

   
    Forum.remove({_id : req.params.id }).then( result => {
      res.status(200).json({ message: ` forum a été supprimé avec succés!` });
    
    })

});

module.exports = router;