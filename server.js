const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'mainpage')));
let portNumber = 6969;

app.listen(portNumber, () => console.log(`Server started on ${portNumber}`));

app.get('/', (req, res) =>{
    res.sendFile('mainpage/mainpage.html', {"root": __dirname});
});