
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAJoQx2wZon4EnSJTXBXZMnZ7f7K2aJQao",
  authDomain: "appfuncional-47d81.firebaseapp.com",
  databaseURL: "https://appfuncional-47d81-default-rtdb.firebaseio.com",
  projectId: "appfuncional-47d81",
  storageBucket: "appfuncional-47d81.appspot.com",
  messagingSenderId: "457133115242",
  appId: "1:457133115242:web:12d13f303afa05e8c18713"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
