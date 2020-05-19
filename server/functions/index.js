const functions = require("firebase-functions");
const express = require("express");
const app = express();
const cors = require("cors")({ origin: true });

const { helloWorld, getTutors } = require("./handlers/user");

app.use(cors);

//Routes for all functions
app.get("/helloWorld", helloWorld);
app.get("/liveTutors", getTutors); //Grab all tutors who are live

//Deploying all routes in the app to functions in firebase
exports.api = functions.https.onRequest(app);
