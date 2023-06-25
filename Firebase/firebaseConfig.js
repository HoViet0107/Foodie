import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  //Paste Your firebase config here
  apiKey: "AIzaSyB3OsClFgB9NhgFKop1uSme1wEzkfO6ctc",
  authDomain: "deliveryapp-c937e.firebaseapp.com",
  databaseURL: "https://deliveryapp-c937e-default-rtdb.firebaseio.com",
  projectId: "deliveryapp-c937e",
  storageBucket: "deliveryapp-c937e.appspot.com",
  messagingSenderId: "450813897666",
  appId: "1:450813897666:web:9ee8be760c88c64aa9845b",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
