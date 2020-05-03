import firebase from 'firebase'
import { firebaseConfig } from '../credentials/client';

export const Firebase = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

export const FB = firebase;

export const database = () => { return Firebase }
