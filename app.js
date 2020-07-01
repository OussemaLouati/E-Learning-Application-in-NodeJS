const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
const session = require('express-session');
const config = require('./config/database');
const LocalStrategy = require('passport-local');
mongoose.set('useCreateIndex', true);

mongoose.connect(config.database, {
        useNewUrlParser: true
    })
    .then(() => {
        console.log('Databse connected successfully ' + config.database);
    }).catch(err => {
        console.log(err);
    });
const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));
app.use(require("express-session")({
    secret: "hello",
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());


const PaiementController = require("./Controllers/PaiementController");
const SeanceController = require("./Controllers/SeanceController");
app.get('/', (req, res) => {
    return res.json({
        message: " authentication system"
    });
});

const checkUserType = function (req, res, next) {
    const userType = req.originalUrl.split('/')[2];
    
    require('./config/passport')(userType, passport);
    next();
};

app.use('/api/paiement', PaiementController);
app.use('/api/seance', SeanceController);
app.use(checkUserType);

const bachelier = require('./Controllers/bachelier');
app.use('/api/bachelier', bachelier);

const formateur = require('./Controllers/formateur');
app.use('/api/formateur', formateur);
const admin = require('./Controllers/admin');
app.use('/api/admin', admin);
const SerieController = require("./Controllers/SerieController");

app.use("/SerieD\'Exercices", express.static("SerieD\'Exercices"));
app.use('/api/Serie', SerieController);
const ResumeController = require("./Controllers/ResumeController");

app.use("/ResumeDeCours", express.static("ResumeDeCours"));
app.use('/api/resume', ResumeController);

const travailPersonnelController = require("./Controllers/travailPersonnelController");

app.use("/TravailPersonnel", express.static("TravailPersonnel"));
app.use('/api/travail',travailPersonnelController);

const ForumController = require("./Controllers/forumController");

app.use('/api/forum', ForumController);

const QuestionController = require("./Controllers/QuestionController");

app.use('/api/question', QuestionController);

const ReponseController = require("./Controllers/ReponseController");

app.use('/api/reponse', ReponseController);


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});