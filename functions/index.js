const functions = require('firebase-functions');
const admin = require('firebase-admin');

const app = require('express')();
admin.initializeApp();



 // For Firebase JS SDK v7.20.0 and later, measurementId is optional
 var firebaseConfig = {
    apiKey: "AIzaSyBgqJfRtx7LI3HmqGpJEYnZvzJ8ahsr4Kc",
    authDomain: "socialape-f6f64.firebaseapp.com",
    databaseURL: "https://socialape-f6f64.firebaseio.com",
    projectId: "socialape-f6f64",
    storageBucket: "socialape-f6f64.appspot.com",
    messagingSenderId: "197120470658",
    appId: "1:197120470658:web:537afcea92ba17d12d8e9b",
    measurementId: "G-1M8NHVELDM"
  };

const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);


app.get('/screams', (req, res) => {
    admin.firestore().collection('screams')
    .orderBy('createdAt', 'desc')
    .get()
        .then(data => {
            let screams = [];
            data.forEach(doc => {
                screams.push({
                    screamID: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt
                });
            });
            return res.json(screams);
        })
        .catch(err => console.error(err));
});

app.post('/scream', (req, res) => {
    const newScream = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString()
    }

    admin.firestore()
        .collection('screams')
        .add(newScream)
        .then(doc => {
            res.json({
                message: `document ${doc.id} is created)`
            })
        })
        .catch(err => {
            res.status(500).json({
                erroe: "Something went wrong"
            });
            console.error(err);
        })
});

// signup route

app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email, 
        password: req.body.password, 
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle 
    }

    // TODO: validate data

    firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then(data => {
        return res.status(201).json({message: `user ${data.user.uid} signed up successfully`});
    })
    .catch(err => {
        return res.status(500).json({error: err.code});
    })
});

exports.api = functions.https.onRequest(app);