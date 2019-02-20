const emailNotifier = require("./services/email-notifier");
var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require("path");
require('dotenv').config();

//emailNotifier.init();

var app = express();
var port = process.env.PORT || 5201;

app.use(bodyParser.json());
app.use(helmet());

const routes = require('./routes/index');
const baseRoute = process.env.ENDPOINT;
app.use(baseRoute, express.static(path.join(__dirname, "public")));
app.use(baseRoute, routes)

app.listen(port);
