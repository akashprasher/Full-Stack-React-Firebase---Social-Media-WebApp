const { db } = require('../util/admin');

// const config = require('../util/config');
// const firebase = require(' firebase');
// firebase.initializeApp(config);

exports.getAllScreams = (req, res) => {
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
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code});
        });
} 

exports.postOneScream = (req, res) => {
    
    if (req.body.body.trim() === "") return res.status(400).json({body: 'Body must not be empty'});

    const newScream = {
        body: req.body.body,
        userHandle: req.user.handle,
        createdAt: new Date().toISOString()
    }

    db
        .collection('screams')
        .add(newScream)
        .then(doc => {
            res.json({
                message: `document ${doc.id} is created`
            })
        })
        .catch(err => {
            res.status(500).json({
                error: "Something went wrong"
            });
            console.error(err);
        })
}