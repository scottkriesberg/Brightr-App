//This file serves as a place to implement all cloud functions
//The cloud functions are then exported and given a route in index.js
const { db, admin } = require("../util/admin");

exports.helloWorld = (req, res) => {
  res.send("Hello world!");
};

exports.getStudents = (req, res) => {
  db.doc("/students")
    .get()
    .then((doc) => {
      res.send(doc);
    });
};
