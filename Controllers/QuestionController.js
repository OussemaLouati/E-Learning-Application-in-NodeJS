const express = require('express');
var router = express.Router();

const Question  = require('../Models/Question');



// Add a Question
router.post('/', (req, res) => {


var question = new Question({
    idBachelier: req.body.idBachelier,
    DateDeAjout: req.body.DateDeAjout,
    reponse:req.body.reponse,
    idQuestion: req.body.idQuestion,
   
  }); 
  question.save().then(createdQuestion => {
    res.status(201).json({
      message: "",
      Question: {
        ...createdQuestion ,
        id: createdQuestion ._id
      }
    });
  }); 
});


// UPDATE Question
router.put(
  "/:id",
  (req, res, next) => {
    
  
    const question = new Question({
      _id: req.params.id,
      DateDeAjout: req.body.DateDeAjout,
      question:req.body.question
    });
    Question.updateOne({ _id : req.params.id }, question ).then(result => {
      res.status(200).json({ message: "Mis à jour avec succés !" });
    });
  }
);

// GET ALL questions
router.get("", (req, res, next) => {
  Question.find().then(documents => {
    res.status(200).json({
      message: "questions récupérées avec succès!",
      questions: documents
    });
  });
});

// GET Questions By Forum Id
router.get("/forum/:idForum", (req, res, next) => {
  Question.find({idForum: req.params.idForum }).then(document => {
    res.status(200).json({
      message: "Questions de Forum récuperées avec succés!",
      questions: document
    });
  });
});

// GET Question By Id
router.get("/:id", (req, res, next) => {
  Question.findById(req.params.id).then(question => {
    if (question) {
      res.status(200).json(question);
    } else {
      res.status(404).json({ message: "question non trouvée!" });
    }
  });
});



// DELETE Question
router.delete("/:id", (req, res, next) => {

   
    Question.remove({_id : req.params.id }).then( result => {
      res.status(200).json({ message: ` question a été supprimée avec succés!` });
    
    })

});

module.exports = router;