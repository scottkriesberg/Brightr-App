import firebase from 'firebase';
import 'firebase/firestore';

const config = {
    apiKey: 'AIzaSyDMxh7OITvNwXptgvB8OIvJAbPykF8pGeY',
    authDomain: 'lavalab-project.firebaseapp.com',
    databaseURL: 'https://lavalab-project.firebaseio.com',
    projectId: 'lavalab-project',
    storageBucket: 'lavalab-project.appspot.com',
    messagingSenderId: '812563850963',
    appId: '1:812563850963:web:d699b28966e62139b1d626',
    measurementId: 'G-SWV5KXFNW3',
};
const Firebase = firebase.initializeApp(config);
export const firestore = firebase.firestore();
export default Firebase;
