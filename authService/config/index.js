import admin from 'firebase-admin';
import serviceAccount from './firebase-adminsdk.json' with { type: "json" };;

// Initialize Firebase Admin with service account credentials
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'da2-db.firebasestorage.app',
});

const firestore = admin.firestore();
const bucket = admin.storage().bucket();

console.log('Firebase connected');

export { firestore, bucket };
