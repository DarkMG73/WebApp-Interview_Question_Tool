// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjcUYjzGRWxlPHq0Cf4S3suCb6emXl8j4",
  authDomain: "program-planner-48e32.firebaseapp.com",
  databaseURL: "https://program-planner-48e32.firebaseio.com",
  projectId: "program-planner-48e32",
  storageBucket: "program-planner-48e32.appspot.com",
  messagingSenderId: "103146158602",
  appId: "1:103146158602:web:def5b42dbbed3fa413bdf3",
  measurementId: "G-YXCVF55B0G",
};

// Initialize Firebase
const db = initializeApp(firebaseConfig);
const analytics = getAnalytics(db);

export default db;
