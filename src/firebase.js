import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDb7dFPWJ3WP4_9EpXKo_iuNkioEPwPBl8",
  authDomain: "vue-chat-hyl.firebaseapp.com",
  projectId: "vue-chat-hyl",
  storageBucket: "vue-chat-hyl.appspot.com",
  messagingSenderId: "1071544862283",
  appId: "1:1071544862283:web:3394314381ab5a7811efce",
  measurementId: "G-JWV7ZXRVBE"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar los servicios que se usaran 
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);


export{ db, auth, analytics }