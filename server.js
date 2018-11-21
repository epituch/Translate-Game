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
    res.sendFile('mainpage/mainpage.html', { "root": __dirname });
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

app.get('/assets/TPartyLogo.png', (req, res) => {
    res.sendFile('assets/TPartyLogo.png', {"root": __dirname});
});