const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

const config = require('../util/config');
const firebase = require('firebase');
firebase.initializeApp(config);


module.exports = {admin, db};