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

app.listen(portNumber, () => console.log(`Server started on ${portNumber}...`));

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.sendFile('loginpage/loginpage.html', { "root": __dirname });
});

// TODO fix this, this is probably the wrong way to send assests
app.get('/assets/TPartyLogo.png', (req, res) => {
    res.sendFile('assets/TPartyLogo.png', { "root": __dirname });
});

app.get('/assets/background.png', (req, res) => {
    res.sendFile('assets/background.png', { "root": __dirname });
});

app.post('/new_user', function (req, res) {

    let queryString;

    db.init(function (err, conn) {
        if (err) {
            console.error('Init Error:' + err);
            res.send({ status: 'INVALID' });
            return false;
        }

        queryString = "SELECT * FROM tparty_scores WHERE username='" + req.body.username + "'";
        db.query(conn, queryString, function (ierr, ires) {
            if (ierr) {
                console.log('Query Error: ' + ierr)
                res.send({ status: 'INVALID' });
                return false;
            }

            if (ires.length != 0) {
                res.send({ status: 'INVALID' });
                return;
            }

            queryString = "INSERT INTO tparty_scores SET username='" + req.body.username + "', password='" + req.body.password + "', score=0";
            db.query(conn, queryString, function (qerr, qres) {
                if (err) {
                    console.log('Query Error: ' + err);
                    res.send({ status: 'INVALID' });
                    return false;
                }
                res.send({ status: 'VALID' });
            });
        });
    });
});

app.post('/verify_user', function (req, res) {
    db.init(function (err, conn) {
        if (err) {
            console.error('Init Error:' + err);
            res.send({ status: 'Error/INVALID!' });
            return false;
        }

        console.log(req.body)
        let queryString = "SELECT username, password FROM tparty_scores WHERE username='" + req.body.username + "'";
        db.query(conn, queryString, function (ierr, ires) {
            if (ierr) {
                console.log('Query Error: ' + ierr)
                res.send({ status: 'Error/INVALID!' });
                return false;
            }

            if (ires.length == 0) {
                res.send({ status: 'Error/INVALID' });
                return false;
            }

            if (ires[0].username == req.body.username && ires[0].password == req.body.password) {
                res.send({ status: 'VALID' });
                return true;
            }
            res.send({ status: 'INVALID' });

        });
    });
});

// TODO: Add authorization after signup or login

app.get('/get_langs', (req, res) => {

    authorize(req, function(data) {
        if(data == 401)
            return res.status(401).send("Authorization Required");

        var names = languages.getLanguageNames();
        res.send(names);
    });
});

app.get('/translate_score', (req, res) => {

    console.log(req.query)

    authorize(req, function(data) {
        if(data == 401)
            return res.status(401).send("Authorization Required");

        if(!req.query.languages || !req.query.sentence)
            return res.status(400).send("Bad Request!");

        var translate_list = req.query.languages.split(",");
        var sentence = req.query.sentence;
        var lang_codes = [];
        var response = {};

        for (var i = 0; i < translate_list.length; i++) {
            lang_codes.push(languages.getCode(translate_list[i]));
        }

        translateAsync(sentence, lang_codes).then(function(result) {
            console.log(result)

            // TODO: Add language weights to this calculation
            var score = Math.round(levenDistance(sentence, result) * 100 * 2 / sentence.length)

            response['sentence'] = result;
            response['score'] = score;

            res.send(response);
        })
    });
});

function translate(sentence, from, lang) {
    return new Promise(function (resolve) {
        if (from == lang) {
            resolve(sentence);
        }
        else {
            googleTranslate.translate(sentence, from, lang, function (err, translations) {
                resolve(translations.translatedText);
            });
        }
    })
}

async function translateAsync(sentence, lang_codes) {
    var from = "en";

    for (var i = 0; i < lang_codes.length; i++) {
        if (i > 0) {
            from = lang_codes[i - 1];
        }

        sentence = await translate(sentence, from, lang_codes[i]);
    }
    return sentence;
}

function levenDistance(x, y) {
    let dp = Array.matrix(x.length + 1, y.length + 1, 0);

    for (var i = 0; i <= x.length; i++) {
        for (var j = 0; j <= y.length; j++) {
            if (i == 0) {
                dp[i][j] = j;
            }
            else if (j == 0) {
                dp[i][j] = i
            }
            else {
                dp[i][j] = Math.min(dp[i - 1][j - 1] + costOfSubstitution(x.charAt(i - 1), y.charAt(j - 1)), dp[i - 1][j] + 1, dp[i][j - 1] + 1);
            }
        }
    }
    //console.log(dp);
    return dp[x.length][y.length]
}

function costOfSubstitution(a, b) {
    return a == b ? 0 : 1;
}

Array.matrix = function (numrows, numcols, initial) {
    var arr = [];
    for (var i = 0; i < numrows; ++i) {
        var columns = [];
        for (var j = 0; j < numcols; ++j) {
            columns[j] = initial;
        }
        arr[i] = columns;
    }
    return arr;
}

app.get('/leaderboarddata', function (req, res) {

    authorize(req, function(data) {
        if(data == 401)
            return res.status(401).send("Authorization Required");

        db.init(function (err, conn) {
            if (err) {
                console.error('Init Error:' + err);
                return false;
            }

            let queryString = "SELECT username, score FROM tparty_scores ORDER BY score DESC";
            db.query(conn, queryString, function (ierr, ires) {
                if (ierr) {
                    console.log('Query Error: ' + ierr)
                    res.send({ status: 'Error/INVALID!' });
                    return false;
                }

                res.send(ires);
            });
        });
    });
});

app.get('/play', (req, res) => {

    authorize(req, function(data) {
        if(data == 401)
            return res.status(401).send("Authorization Required");

        return res.sendFile('mainpage/mainpage.html', { "root": __dirname });
    });
});

app.get('/leaderboard', (req, res) => {

    authorize(req, function(data) {

        if(data == 401)
            return res.status(401).send("Authorization Required");

        return res.sendFile('leaderboardpage/leaderboard.html', { "root": __dirname });
    });
});

let authorize = function(request, callback) {
    var auth = request.get("authorization");

    if(!auth)
        callback(401);

    // Get credentails
    var credentials = Buffer.from(auth.split(" ").pop(), "base64").toString("ascii").split(":");

    db.init(function (err, conn) {
        if (err) {
            console.error('Init Error:' + err);
            return false;
        }

        let queryString = "SELECT password FROM tparty_scores WHERE username='" + credentials[0] + "'";
        db.query(conn, queryString, function (ierr, ires) {
            if (ierr) {
                console.log('Query Error: ' + ierr)
                return false;
            }

            if(ires[0].password == credentials[1])
                callback(200);
            else
                callback(401);
        });
    });
};