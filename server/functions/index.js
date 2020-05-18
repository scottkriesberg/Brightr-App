const functions = require("firebase-functions");
const express = require("express");

const app = express();

app.get("/helloWorld", (req, res) => {
  res.send("Hello from the backend");
});

exports.app = functions.https.onRequest(app);
