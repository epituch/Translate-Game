let express = require('express');
let path = require('path');
let app = express();
let db = require('./database.js');

app.use(express.static(path.join(__dirname, 'mainpage')));
app.use(express.static(path.join(__dirname, 'loginpage')));
app.use(express.static(path.join(__dirname, 'leaderboardpage')));
app.use(express.static(path.join(__dirname, 'createuserpage')));
let portNumber = 6969;

app.listen(portNumber, () => console.log(`Server started on ${portNumber}`));

app.get('/', (req, res) => {
    res.sendFile('mainpage/mainpage.html', { "root": __dirname });
    db.init(function(err, res) {
        if(err)
        {
            console.error('Init Error:' + err);
            return false;
        }
        let queryString = "SELECT * FROM tparty_scores";
        db.query(res, queryString, function(error, q_res) {
            if(error)
            {
                console.log('Query Error: ' + error);
                return false;
            }
            console.log(q_res);
        });
    });
});

app.get('/login', (req, res) => {
    res.sendFile('loginpage/loginpage.html', { "root": __dirname });
});

app.get('/leaderboard', (req, res) => {
    res.sendFile('leaderboardpage/leaderboard.html', { "root": __dirname });
});

app.get('/createuser', (req, res) => {
    res.sendFile('createuserpage/createuser.html', { "root": __dirname });
});