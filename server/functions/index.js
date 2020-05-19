const functions = require("firebase-functions");
const express = require("express");
const config = require("./util/config"); //Config for firebase
const firebase = require("firebase");
const app = express();
const cors = require("cors")({ origin: true });

const { helloWorld, getStudents } = require("./handlers/user");

app.use(cors());

//Setting up access to db
firebase.initializeApp(config);

//Routes for all functions
app.get("/helloWorld", helloWorld);
app.get("/getStudents", getStudents);

//Deploying all routes in the app to functions in firebase
exports.api = functions.https.onRequest(app);
