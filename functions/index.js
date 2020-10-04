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

const db = admin.firestore();

app.get('/screams', (req, res) => {
    db.collection('screams')
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

    db
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

const isEmail = (email) => {
    const regEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(email.match(regEx)) return true;
    else return false;
}

const isEmpty = (string) => {
    if(string.trim() === '') return true;
    else return false;
}

// signup route

app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email, 
        password: req.body.password, 
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle 
    }

    let errors = {};

    if(isEmpty(newUser.email)) {
        errors.email = 'Email must not be Empty'
    } else if(!isEmail(newUser.email)){
        errors.email = "Must be a valid Email";
    } 

    if(isEmpty(newUser.password)) errors.password = 'Must not be empty';
    
    if(newUser.password !== newUser.confirmPassword) errors.password = 'Password not matched';

    if(isEmpty(newUser.handle)) errors.handle = 'Must not be empty';

    if(Object.keys(errors).length > 0) {
        return res.status(400).json({errors});
    }


// TODO: validate data

    let token, userId;
    db.doc(`/users/${newUser.handle}`).get()
    .then((doc) => {
        if(doc.exists) {
            return res.status(400).json({
                handle: 'This handle is already taken'
            });
        } else {
            return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
        }
    })
    .then((data) => {
        userId = data.user.uid;
        return data.user.getIdToken();
    })
    .then((idToken) => {
        token = idToken;
        const userCredentials = {
            handle: newUser.handle,
            email: newUser.email,
            createdAt: new Date().toISOString(),
            userId
        };
        return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then((data) => {
        return res.status(201).json({ token });
    })
    .catch((err) => {
        console.error(err);
        if(err.code === 'auth/email-already-in-use') {
            return res.status(400).json({email: "Email already registered!"})
        } else {
            return res.status(500).json({error: err.code});
        }
    })

});

// login route

app.post('/login', (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };

    let errors = {};

    if(isEmpty(user.email)) errors = 'Must not be empty';
    if(isEmpty(user.password)) errors = 'Must not be empty';

    if(Object.keys(errors).length > 0) res.status(400).json({errors});

    firebase.auth().signInWithEmailAndPassword(user.email, user.password) 
    .then((data) => {
        return data.user.getIdToken();
    })
    .then((token => {
        return res.json({token});
    }))
    .catch((err) => {
        return  res.status(500).json({error: err.code});
    })

})

exports.api = functions.https.onRequest(app);