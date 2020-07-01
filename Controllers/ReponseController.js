const express = require('express');
var router = express.Router();
const Reponse  = require('../Models/Reponse');




// Add a Response to a Question
router.post('/', (req, res) => {


var reponse = new Reponse({
    idBachelier: req.body.idBachelier,
    idFormateur : req.body.idFormateur,
    DateDeAjout: req.body.DateDeAjout,
    question:req.body.question,
    idForum: req.body.idForum
   
  }); 
  reponse.save().then(createdResponse => {
    res.status(201).json({
      message: "",
      Question: {
        ...createdResponse ,
        id: createdResponse ._id
      }
    });
  }); 
});


// UPDATE Response
router.put(
  "/:id",
  (req, res, next) => {
    
  
    const reponse = new Reponse({
      _id: req.params.id,
      DateDeAjout: req.body.DateDeAjout,
      reponse:req.body.reponse
    });
    Reponse.updateOne({ _id : req.params.id }, reponse ).then(result => {
      res.status(200).json({ message: "Mis à jour avec succés !" });
    });
  }
);

// GET ALL Responses
router.get("", (req, res, next) => {
  Reponse.find().then(documents => {
    res.status(200).json({
      message: "reponses récupérées avec succès!",
      reponses: documents
    });
  });
});

// GET responses By Question Id
router.get("/question/:idQuestion", (req, res, next) => {
  Reponse.find({idQuestion: req.params.idQuestion }).then(document => {
    res.status(200).json({
      message: "Reponses de Question récuperées avec succés!",
      reponses: document
    });
  });
});

// GET Response By Id
router.get("/:id", (req, res, next) => {
  Reponse.findById(req.params.id).then(reponse => {
    if (reponse) {
      res.status(200).json(reponse);
    } else {
      res.status(404).json({ message: "reponse non trouvée!" });
    }
  });
});



// DELETE Response
router.delete("/:id", (req, res, next) => {

   
    Reponse.remove({_id : req.params.id }).then( result => {
      res.status(200).json({ message: ` La reponse a été supprimée avec succés!` });
    
    })

});

module.exports = router;