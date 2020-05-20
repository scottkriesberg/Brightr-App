const functions = require("firebase-functions");
const app = require("express")();
const cors = require("cors");
const bodyParser = require("body-parser");
const { helloWorld, getTutors, login } = require("./handlers/user");

app.use(cors());
app.use(bodyParser.json());

//Routes for all functions
app.get("/helloWorld", helloWorld);
app.get("/liveTutors", getTutors); //Grab all tutors who are live
app.get("/login", login);

//Deploying all routes in the app to functions in firebase
exports.api = functions.https.onRequest(app);
