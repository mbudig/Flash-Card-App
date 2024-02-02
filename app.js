const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(morgan("dev"));

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function (req, res)
{
    console.log('GET / called');
    res.sendFile("/index.html", {root: __dirname});
})

app.use('/', require('./routes/flash_cards'));

module.exports = app;