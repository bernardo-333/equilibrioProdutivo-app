import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';

const firebaseConfig = {
  apiKey: "AIzaSyBIlCbxhxEucKdBNyMWEwRuFOpEo0dVQx8",
  authDomain: "equilibrioprodutivo-app.firebaseapp.com",
  databaseURL: "https://equilibrioprodutivo-app-default-rtdb.firebaseio.com",
  projectId: "equilibrioprodutivo-app",
  storageBucket: "equilibrioprodutivo-app.firebasestorage.app",
  messagingSenderId: "785521986199",
  appId: "1:785521986199:web:449d7fe7979e0aad8db7d2",
  measurementId: "G-2FZ69XYWZJ"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
