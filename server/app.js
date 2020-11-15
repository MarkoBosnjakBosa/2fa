const express = require("express");
const app = express();
const cors = require("cors");
const bcryptjs = require("bcryptjs");
const speakeasy = require("speakeasy");
const qrCode = require("qrcode");
const mongoose = require("mongoose");
const models = require("./models/models.js")(mongoose);
const dontenv = require("dotenv").config();
const baseUrl = process.env.BASE_URL;
const port = process.env.PORT;
const databaseUrl = process.env.DATABASE_URL;
app.use(cors({origin: "*"}));
app.use(express.json());

const registration = require("./routes/registration.js")(app, bcryptjs, models);
const login = require("./routes/login.js")(app, bcryptjs, speakeasy, models);
const setup = require("./routes/setup.js")(app, speakeasy, qrCode, models);

mongoose.connect(databaseUrl, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
const database = mongoose.connection;
database.on("error", function(error) {
	console.log("Connection to the database has not been established!");
	console.log(error);
});
database.on("open", function() {
	console.log("Connection to the database has been successfully established!");
});

app.listen(port, function() {
	console.log("Tasks app listening on " + baseUrl + port + "!");
});