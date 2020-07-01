const express = require('express');
var router = express.Router();
const multer = require("multer");
var fs = require('fs');
const  Resume  = require('../Models/Resume');



const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "application/pdf": "pdf"
};
 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Extension de l\'image est Invalide");
    if (isValid) {
      error = null;
    }
    cb(error, "./ResumeDeCours/");
  },
 filename: (req,file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
 
    cb(null, name  );
  }
}); 

   

 


// Add a Resume 
router.post('/',  multer({ storage: storage , 
  limits: {
  fileSize: 1024 * 1024 * 100
},
}).single("fichier"), async function(req, res) {

  const url = req.protocol + "://" + req.get("host");

var resume = new Resume({
  matiere:req.body.matiere,
    idFormateur: req.body.idFormateur,
    DateDeAjout: req.body.DateDeAjout,
    idGroupe: req.body.idGroupe,
    Description: req.body.Description,
    Fichier: url + "/ResumeDeCours/" + req.file.originalname
   
  }); 
  resume.save().then(createdResume => {
    res.status(201).json({
      message: "",
      resumé: {
        ...createdResume,
        id: createdResume._id
      }
    });
  }); 
});


// UPDATE cheque  
router.put(
  "/:id",
  multer({ storage: storage }).single("fichier"),
  async function(req, res, next) {
    
   var OldResume = new Resume ();
  
   OldResume =  await Resume.findById({_id:req.params.id}).exec();

  
  var str = OldResume["Fichier"];
  var nom = str.substring(36,str.lenght);
  var str2  = str.replace("http://localhost:3000",".");

    fs.unlink(str2, (err) => {
      if (err) {
        console.error(err)
        return
      }
    });
   
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      fichier = url + "/ResumeDeCours/" + req.file.originalname
    }
 

    const resume = new Resume({
      _id: req.params.id,
      matiere:req.body.matiere,

      DateDeAjout: req.body.DateDeAjout,
      Fichier: fichier
    });
    Resume.updateOne({ _id : req.params.id }, resume ).then(result => {
      res.status(200).json({ message: "Mis à jour avec succés !" });
    });
  }
);

// GET ALL resumeS
router.get("", (req, res, next) => {
  Resume.find().then(documents => {
    res.status(200).json({
      message: "Resumés récupérés avec succès!",
      resumés: documents
    });
  });
});

// Download a resumé
router.get("/download/:id", async function(req, res, next)  {

  var OldResume = new Resume ();
  
   OldResume =  await Resume.findById({_id:req.params.id}).exec();

  
  var str = OldResume["Fichier"];
  var nom = str.substring(36,str.lenght);
  var str2  = str.replace("http://localhost:3000",".");
fs.readFile(str2, (err, data)=>{
if(err){
  return next(err);
}
res.setHeader('Content-Type','application/pdf');
res.setHeader('Content-Disposition', 'Inline; filename="'+ nom   +'"');
res.send(data);
});
});





// GET Resumé By Formateur Id
router.get("/formateur/:idFormateur", (req, res, next) => {
  Resume.find({idFormateur: req.params.idFormateur }).then(document => {
    res.status(200).json({
      message: "Resumés de Formateur récuperées avec succés!",
      resumés: document
    });
  });
});


// GET all resumés of a bachelier

router.get("/resumeBach/:idBachelier", async function(req, res, next) {

  rd = await Bachelier.findById({_id:req.params.idBachelier}).exec();
console.log(rd); 
  Resume.find({idGroupe: rd['idGroupe']}).then(document => {
    res.status(200).json({
      message: "Resumés de Bachelier récuperées avec succés!",
      resumés: document
    });
  });
});
// GET Resumé By Id
router.get("/:id", (req, res, next) => {
  Resume.findById(req.params.id).then(resumé => {
    if (resumé) {
      res.status(200).json(serie);
    } else {
      res.status(404).json({ message: "resumé récupérée avec succès!" });
    }
  });
});



// DELETE Resumés
router.delete("", async function(req, res, next)  {

   array = req.body;

for(var i=0; i< array['resumes'].length ; i++){
  var OldResume = new Resume ();
  OldResume =  await Resume.findById({_id:array['resumes'][i]}).exec();

 
 var str = OldResume["Fichier"];
 var nom = str.substring(36,str.lenght);
 var str2  = str.replace("http://localhost:3000",".");

   fs.unlink(str2, (err) => {
     if (err) {
       console.error(err)
       return
     }
   });
}
    Resume.remove({_id:{'$in':array['resumes']}}).then( result => {
      res.status(200).json({ message: ` Resumés ont été supprimées avec succés!` });
    
    })

});

module.exports = router;