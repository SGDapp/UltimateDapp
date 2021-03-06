var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
 
var routes = require("./routes.js")(app);
 
var server = app.listen(3344, function () {
    console.log("Listening on port %s...", server.address().port);
});
