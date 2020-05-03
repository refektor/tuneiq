import firebase from 'firebase'
import { firebaseConfig } from '../credentials/client';

default export const FirebaseApp = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
