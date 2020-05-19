//This file serves as a place to implement all cloud functions
//The cloud functions are then exported and given a route in index.js
const { db, admin } = require("../util/admin");

exports.helloWorld = (req, res) => {
  res.send("Hello world!");
};

exports.getTutors = (req, res) => {
  db.collection("tutors")
    .get()
    .then((data) => {
      let tutors = [];
      data.forEach((doc) => {
        tutors.push({
          name: doc.data().name,
          year: doc.data().year,
        });
      });
      return res.json(tutors);
    })
    .catch((error) => {
      res.status(500).json({ error: `Error getting all tutors` });
      console.error("Error: " + error);
    });
};
