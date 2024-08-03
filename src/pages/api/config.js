import admin from 'firebase-admin'
var serviceAccount = require("./firebase-adminsdk.json");
if (!admin.apps.length) {
    admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://bottak-15afa-default-rtdb.firebaseio.com"
});
}


let app = admin.apps[0]

// import { initializeApp, getApps,applicationDefault } from "firebase-admin/app";
// var serviceAccount = require("./firebase-adminsdk.json");
// let app
// if (!getApps().length) {
//     initializeApp({
//         credential: applicationDefault(serviceAccount),
//         databaseURL: 'https://bottak-15afa-default-rtdb.firebaseio.com'
//       });
// }
export { app }