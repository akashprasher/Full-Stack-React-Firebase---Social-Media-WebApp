const functions = require('firebase-functions');

const app = require('express')();

const FBAuth = require('./util/fbAuth');

const db = require('./util/admin');

const {
    getAllScreams,
    postOneScream,
    getScreams,
    commentOnScream,
    likeScream,
    unlikeScream,
    deleteScream
} = require('./handlers/screams');

const {
    signup,
    login,
    uploadImage,
    addUserDetails,
    getAuthenticatedUser
} = require('./handlers/users');

// Scream routes
app.get('/screams', getAllScreams);
app.post('/scream', FBAuth, postOneScream);
app.get('/screams/:screamId', getScreams);
app.delete('/scream/:screamId', FBAuth, deleteScream);
app.get('/scream/:screamId/like', FBAuth, likeScream);
app.get('/scream/:screamId/unlike', FBAuth, unlikeScream);
app.post('/scream/:screamId/comment', FBAuth, commentOnScream);


// User routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);

exports.api = functions.https.onRequest(app);

// Likes Notification
exports.createNotificationOnLike = functions.firestore.document('likes/{id}')
    .onCreate((snapshor) => {
        db.document('/screams/${snapshot.data().screamId').get()
            .then((doc) => {
                if (doc.exists) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type: 'like',
                        read: false,
                        screamId: doc.id
                    });
                }
            })
            .then(() => {
                return;
            })
            .catch((err) => {
                console.error(err);
                return;
            })
    })

// Delete Notification on Dislike
exports.deleteNotificationOnUnlike = functions.firestore.document('likes/{id}')
.onDelete((snapshot) => {
    db.doc(`/notifications/${snapshot.id}`).delete()
    .then(() => {
        return;
    })
    .catch((err) => {
        console.error(err);
        return;
    })
})

// Comment Notification
exports.createNotificationOnComment = functions.firestore.document('comments/{id}')
    .onCreate((snapshot) => {
        db.document('/screams/${snapshot.data().screamId').get()
            .then((doc) => {
                if (doc.exists) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type: 'comment',
                        read: false,
                        screamId: doc.id
                    });
                }
            })
            .then(() => {
                return;
            })
            .catch((err) => {
                console.error(err);
                return;
            })
    })