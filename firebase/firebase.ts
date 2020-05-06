import firebase from 'firebase'
import { firebaseConfig } from '../credentials/client';

const FirebaseApp = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

export {FirebaseApp as default};
