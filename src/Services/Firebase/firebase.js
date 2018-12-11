// Import the Firebase modules that you need in your app.
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
// import 'firebase/datastore';
import environnement from "../../.env/env";
// Initalize and export Firebase.
const config = {
  apiKey: environnement.Firebase.apiKey,
//   authDomain: '<YOUR-AUTH-DOMAIN>',
  databaseURL: environnement.Firebase.databaseURL,
  projectId:  environnement.Firebase.projectId,
  storageBucket: environnement.Firebase.storageBucket,
//   messagingSenderId: ''
};
export default firebase.initializeApp(config);
