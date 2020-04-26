import firebase from 'firebase'
import { firebaseConfig } from '../credentials/client';

export const database = () => { return !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app(); }

export const Firebase = firebase;
