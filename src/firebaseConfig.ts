// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCVLDzvzlC8WvwaLQHH7EhB49Q0oz8htFg",
    authDomain: "vue-to-do-86986.firebaseapp.com",
    projectId: "vue-to-do-86986",
    storageBucket: "vue-to-do-86986.firebasestorage.app",
    messagingSenderId: "200873703587",
    appId: "1:200873703587:web:66523813024d736a116716"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };