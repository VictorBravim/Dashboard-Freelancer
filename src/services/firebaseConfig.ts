import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "Your apiKey",
    authDomain: "Your authDomain",
    projectId: "Your projectId",
    storageBucket: "Your storageBucket",
    messagingSenderId: "Your messagingSenderId",
    appId: "Your appId"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); 
export const db = getFirestore(app);