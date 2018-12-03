'use strict'

let express = require('express');
var bodyParser = require('body-parser');
let path = require('path');
let app = express();
let db = require('./database.js');
let languages = require("./languages.js")
let googleTranslate = require('google-translate')('AIzaSyD253F7dYqiZbuSBAGl7DJYOLgMYUz1G4U');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'mainpage')));
app.use(express.static(path.join(__dirname, 'loginpage')));
app.use(express.static(path.join(__dirname, 'leaderboardpage')));
app.use(express.static(path.join(__dirname, 'createuserpage')));
app.use(express.static(path.join(__dirname, 'assets')));
let portNumber = 6969;

app.listen(portNumber, () => console.log(`Server started on ${portNumber}`));

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.sendFile('loginpage/loginpage.html', { "root": __dirname });
});

app.get('/play', (req, res) => {
    res.sendFile('mainpage/mainpage.html', { "root": __dirname });
});

app.get('/leaderboard', (req, res) => {
    res.sendFile('leaderboardpage/leaderboard.html', { "root": __dirname });
});

// TODO fix this, this is probably the wrong way to send assests
app.get('/assets/TPartyLogo.png', (req, res) => {
    res.sendFile('assets/TPartyLogo.png', {"root": __dirname});
});

app.get('/assets/background.png', (req, res) => {
    res.sendFile('assets/background.png', {"root": __dirname});
});

app.post('/new_user', function(req, res) {

    let queryString;

    db.init(function(err, conn) {
        if(err)
        {
            console.error('Init Error:' + err);
            return false;
        }

        queryString = "SELECT * FROM tparty_scores WHERE username='" + req.body.username + "'";
        db.query(conn, queryString, function(ierr, ires) {
            if(ierr)
            {
                console.log('Query Error: ' + ierr)
                res.send({status: 'Error/INVALID!'});
                return false;
            }

            if(ires.length != 0)
            {
                res.send({status: 'Error/INVALID'});
                return;
            }

            queryString = "INSERT INTO tparty_scores SET username='" + req.body.username + "', password='" + req.body.password + "', score=1";
            db.query(conn, queryString, function(qerr, qres) {
                if(err)
                {
                    console.log('Query Error: ' + err);
                    res.send({status: 'Error/INVALID!'});
                    return false;
                }
                res.send({status: 'VALID'});
            });
        });
    });
});