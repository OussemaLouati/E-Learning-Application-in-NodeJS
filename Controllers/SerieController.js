const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;

const multer = require("multer");
var fs = require('fs');
const  Serie  = require('../Models/Serie');



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
    cb(error, "./SerieD\'Exercices/");
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

// Add a serie 
router.post('/',  multer({ storage: storage , 
  limits: {
  fileSize: 1024 * 1024 * 100
},
}).single("serie"), async function(req, res) {

  const url = req.protocol + "://" + req.get("host");


var serie = new Serie({
    matiere: req.body.matiere,
    Description : req.body.Description,
    idFormateur: req.body.idFormateur,
    DateDeAjout: req.body.DateDeAjout,
    Fichier: url + "/SerieD\'Exercices/" + req.file.originalname
   
  }); 
  serie.save().then(createdSerie => {
    res.status(201).json({
      message: "",
      serie: {
        ...createdSerie,
        id: createdSerie._id
      }
    });
  }); 
});


// UPDATE serie
router.put(
  "/:id",
  multer({ storage: storage }).single("serie"),
  async function(req, res, next) {
    
   var OldSerie = new Serie ();
  
   OldSerie =  await Serie.findById({_id:req.params.id}).exec();

  
  var str = OldSerie["Fichier"];
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
   
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      fichier = url + "/SerieD\'Exercices/" + req.file.originalname
    }
 
    const serie = new Serie({
      _id: req.params.id,
      matiere: req.body.matiere,
    Description : req.body.Description,
      DateDeAjout: req.body.DateDeAjout,
      Fichier: fichier
    });
    Serie.updateOne({ _id : req.params.id }, serie ).then(result => {
      res.status(200).json({ message: "Mis à jour avec succés !" });
    });
  }
);

// Download a  serie

router.get("/download/:id", async function(req, res, next)  {

  var OldSerie = new Serie ();
  
  OldSerie =  await Serie.findById({_id:req.params.id}).exec();

 
 var str = OldSerie["Fichier"];
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


// GET ALL series 
router.get("", (req, res, next) => {
  Serie.find().then(documents => {
    res.status(200).json({
      message: "series récupérés avec succès!",
      series: documents
    });
  });
});

// GET Series By Formateur Id
router.get("/serieForm/:idFormateur", (req, res, next) => {
  Serie.find({idFormateur: req.params.idFormateur }).then(document => {
    res.status(200).json({
      message: "Series de Formateur récuperées avec succés!",
      series: document
    });
  });
});

// GET all series of a bachelier

router.get("/serieBach/:idBachelier", async function(req, res, next) {

  rd = await Bachelier.findById({_id:req.params.idBachelier}).exec();

  Serie.find({idGroupe: rd['idGroupe']}).then(document => {
    res.status(200).json({
      message: "Series de Bachelier récuperées avec succés!",
      series: document
    });
  });
});

// GET Serie By Id
router.get("/:id", (req, res, next) => {
  Serie.findById(req.params.id).then(serie => {
    if (serie) {
      res.status(200).json(serie);
    } else {
      res.status(404).json({ message: "serie récupérée avec succès!" });
    }
  });
});



// DELETE Series 
router.delete("", async function(req, res, next)  {

   array = req.body;
console.log(array['series'].length )

console.log(array['series'][0])
console.log(array['series'][1])

for(var i=0; i< array['series'].length ; i++){
  var OldSerie = new Serie ();
  OldSerie =  await Serie.findById({_id:array['series'][i]}).exec();

 
 var str = OldSerie["Fichier"];
 var nom = str.substring(36,str.lenght);
 var str2  = str.replace("http://localhost:3000",".");

   fs.unlink(str2, (err) => {
     if (err) {
       console.error(err)
       return
     }
   });
  
    
}
Serie.remove({_id:{'$in':array['series']}}).then( result => {
  res.status(200).json({ message: ` Series ont été supprimées avec succés!` });

})
});

module.exports = router;