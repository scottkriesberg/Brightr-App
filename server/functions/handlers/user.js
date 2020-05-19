//This file serves as a place to implement all cloud functions
//The cloud functions are then exported and given a route in index.js
const { db, admin } = require("../util/admin");
const config = require("../util/config");
const firebase = require("firebase");

firebase.initializeApp(config);

exports.helloWorld = (req, res) => {
    res.send("Hello world!!!!");
};

//Function to get all live tutors
exports.getTutors = (req, res) => {
    db.collection("tutors")
        .where("isLive", "==", true)
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

//Function to login user with email and password
exports.login = (req, res) => {
    //User data should just email, password, account type can be determined
    //TODO: Login in to specific accounts if both student and tutors
    console.log("Request body");
    console.log(req.body);
    //Credentials from the body of the request
    const creds = req.body;

    //TODO: Check for any invalid email/password syntax, and return accordingly

    //TODO: Jump into login flow
    firebase
        .auth()
        .signInWithEmailAndPassword(creds.email, creds.password)
        .then((user) => {
            const uid = user.user.uid;
            firebase
                .firestore()
                .collection("students")
                .doc(uid)
                .get()
                .then((doc) => {
                    if (doc.exists) {
                        userUid = uid;
                        //Return the user info to update redux on the client
                        const currUser = {
                            uid: user.user.uid,
                            email: user.user.email,
                            type: "student",
                            userData: doc.data(),
                        };
                        return res.status(200).json(currUser);
                    } else {
                        firebase
                            .firestore()
                            .collection("tutors")
                            .doc(uid)
                            .get()
                            .then((doc) => {
                                if (doc.exists) {
                                    userUid = uid;
                                    //Return the user info to update redux on the client
                                    const currUser = {
                                        uid: user.user.uid,
                                        email: user.user.email,
                                        type: "tutor",
                                        userData: doc.data(),
                                    };
                                    return res.status(200).json(currUser);
                                } else {
                                    console.log("Error");
                                }
                            });
                    }
                });
        })
        .catch((error) => {
            //Print the error code and just return to client
            //All logic of wrong email, bad password can be done on client
            console.log(error.code);
            return res.status(403).json(error);
        });
};
