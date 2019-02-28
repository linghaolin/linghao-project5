import firebase from 'firebase'; 

// Initialize Firebase
    var config = {
    apiKey: "AIzaSyDWHPZXT5PJUNe-7urGa64ZSLKyPQOpePQ",
    authDomain: "stackoverflow-flashcards.firebaseapp.com",
    databaseURL: "https://stackoverflow-flashcards.firebaseio.com",
    projectId: "stackoverflow-flashcards",
    storageBucket: "stackoverflow-flashcards.appspot.com",
    messagingSenderId: "543251906381"
      };
    firebase.initializeApp(config);

export default firebase;