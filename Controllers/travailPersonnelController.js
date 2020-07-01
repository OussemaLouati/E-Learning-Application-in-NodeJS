const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;

const multer = require("multer");
var fs = require('fs');
const  Serie  = require('../Models/Serie');
const TravailPersonnel  = require('../Models/TravailPersonnel');



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
    cb(error, "./TravailPersonnel/");
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

// Add a TravailPersonnel 
router.post('/',  multer({ storage: storage , 
  limits: {
  fileSize: 1024 * 1024 * 100
},
}).single("fichier"), async function(req, res) {

  const url = req.protocol + "://" + req.get("host");


var travailPersonnel  = new TravailPersonnel({
    idBachelier: req.body.idBachelier,
    idSerie: req.body.idSerie,
    DateDeAjout: req.body.DateDeAjout,
    Fichier: url + "/TravailPersonnel/" + req.file.originalname
   
  }); 
  travailPersonnel.save().then(createdTravailPersonnel  => {
    res.status(201).json({
      message: "",
      serie: {
        ...createdTravailPersonnel ,
        id: createdTravailPersonnel._id
      }
    });
  }); 
});


// UPDATE TravailPersonnel 
router.put(
  "/:id",
  multer({ storage: storage }).single("fichier"),
  async function(req, res, next) {
    
   var OldTravailPersonnel  = new TravailPersonnel  ();
  
   OldTravailPersonnel  =  await TravailPersonnel.findById({_id:req.params.id}).exec();

  
  var str = OldTravailPersonnel["Fichier"];
  console.log(str);
  var nom = str.substring(36,str.lenght);
  var str2  = str.replace("http://localhost:3000",".");
  console.log("str2:  " , str2) ;

    fs.unlink(str2, (err) => {
      if (err) {
        console.error(err)
        return
      }
    });
   
// let fichier = req.body.serie;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      fichier = url + "/TravailPersonnel/" + req.file.originalname
    }
    const travailPersonnel  = new TravailPersonnel({
      _id: req.params.id,
      DateDeAjout: req.body.DateDeAjout,
      Fichier: fichier
    });
    TravailPersonnel.updateOne({ _id : req.params.id }, travailPersonnel  ).then(result => {
      res.status(200).json({ message: "Mis à jour avec succés !" });
    });
  }
);
// Download a travail personnel

router.get("/download/:id", async function(req, res, next)  {

    var OldTravailPersonnel  = new TravailPersonnel  ();
  
   OldTravailPersonnel  =  await TravailPersonnel.findById({_id:req.params.id}).exec();

  
  var str = OldTravailPersonnel["Fichier"];
  console.log(str);
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
// GET ALL TravailPersonnel 
router.get("", (req, res, next) => {
    TravailPersonnel.find().then(documents => {
    res.status(200).json({
      message: "TravailPersonnel  récupérés avec succès!",
      TravailPersonnel : documents
    });
  });
});

// GET TravailPersonnel  By Bachelier Id
router.get("/bach/:idBachelier", (req, res, next) => {
    TravailPersonnel.find({idBachelier: req.params.idBachelier }).then(document => {
    res.status(200).json({
      message: "TravailPersonnels  récuperés avec succés!",
      travailPersonnel : document
    });
  });
});

// GET TravailPersonnel  By Id
router.get("/:id", (req, res, next) => {
    TravailPersonnel.findById(req.params.id).then(travailPersonnel  => {
    if (travailPersonnel ) {
      res.status(200).json(travailPersonnel );
    } else {
      res.status(404).json({ message: "TravailPersonnel  récupéré avec succès!" });
    }
  });
});


// GET TravailPersonnel by Serie ID
router.get("/serie/:id", (req, res, next) => {
    TravailPersonnel.find({idSerie: req.params.idSerie }).then(document => {
        res.status(200).json({
          message: "TravailPersonnels  récuperés avec succés!",
          travailPersonnel : document
        });
      });
    });


// DELETE TravailPersonnel 
router.delete("/:id", async function(req, res, next)  {


  var OldTravailPersonnel  = new TravailPersonnel  ();
  OldTravailPersonnel  =  await TravailPersonnel.findById({_id:req.params.id}).exec();

 
 var str = OldTravailPersonnel ["Fichier"];
 var nom = str.substring(36,str.lenght);
 var str2  = str.replace("http://localhost:3000",".");

   fs.unlink(str2, (err) => {
     if (err) {
       console.error(err)
       return
     }
   });
  
    
TravailPersonnel.remove({_id:req.params.id}).then( result => {
  res.status(200).json({ message: ` TravailPersonnel  a été supprimé avec succés!` });

})
});

module.exports = router;