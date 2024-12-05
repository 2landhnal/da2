// config/index.js
const admin = require('firebase-admin');

const serviceAccount = require('./qtda-documentservice-firebase-adminsdk.json');

// Initialize Firebase Admin with service account credentials
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount), // or use `admin.credential.cert(<path to serviceAccountKey.json>)`
    storageBucket: 'qtda-documentservice.firebasestorage.app',
});

const firestore = admin.firestore();
const bucket = admin.storage().bucket();

console.log('Firebase connected');

module.exports = { firestore, bucket };
