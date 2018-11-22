const express = require('express');
const path = require('path');
const app = express();
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