import firebase from 'firebase'
import { firebaseConfig } from '../credentials/client';

function getFirebaseApp() {
    return !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
}

export {
    getFirebaseApp
};
