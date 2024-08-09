import { app } from './config'
import { getDatabase, ref, onValue, set, child, get, remove, update, query, orderByChild, equalTo } from "firebase/database";

const db = getDatabase(app);
const dbRef = ref(getDatabase());

// -------------------------------Firebase Realtime Database------------------------------------

function getData(setUserData) {
  onValue(ref(db, '/'), (snapshot) => {
    if (snapshot.exists()) {
      setUserData(snapshot.val());
    }
  });
}

async function getSpecificData(query, setUserSpecificData, callback) {
  try {

    onValue(ref(db, query), (snapshot) => {
      if (snapshot.exists()) {
        setUserSpecificData(snapshot.val())
        callback && callback !== undefined ? callback() : ''
        return snapshot.val()
      }else{
        callback && callback !== undefined ? callback() : ''
        setUserSpecificData(null)
        return null
      }
    });

    // const snapshot = await get(child(dbRef, `${query}`))
    // console.log(query, snapshot.exists())
    // if (snapshot.exists()) {
    //   setUserSpecificData(snapshot.val())
    //   callback && callback !== undefined ? callback() : ''
    //   return snapshot.val()
    // } else {
    //   callback && callback !== undefined ? callback() : ''
    //   setUserSpecificData(null)
    //   return null
    // }
  } catch (error) {
    console.error(error);
  }
}

// async function getSpecificData(query, setUserSpecificData, callback) {
//   try {
//     const snapshot = await get(child(dbRef, `${query}`))
//     console.log(query, snapshot.exists())
//     if (snapshot.exists()) {
//       setUserSpecificData(snapshot.val())
//       callback && callback !== undefined ? callback() : ''
//       return snapshot.val()
//     } else {
//       callback && callback !== undefined ? callback() : ''
//       setUserSpecificData(null)
//       return null
//     }
//   } catch (error) {
//     console.error(error);
//   }
// }

function getSpecificDataEq(route, children, eq, setUserData, callback) {
  get(query(ref(db, route), orderByChild(children), equalTo(eq)))
    .then(async (snapshot) => {
      if (snapshot.exists()) {
        let snap = snapshot.val()
        console.log(snap)
        setUserData(snap)
        callback && callback()
      }
    })
}

function writeUserData(rute, object, setUserSuccess, callback) {
  console.log(rute)
  update(ref(db, rute), object)
    .then(() => {
      console.log('Success')
      setUserSuccess !== null ? setUserSuccess('save') : ''
      callback !== null ? callback(object) : ''
    })
    .catch((err) => {
      console.log('error')
      console.log(err)
    })
}

async function removeData(rute, setUserSuccess, callback) {
  await remove(ref(db, rute))
    .then(() => {
      setUserSuccess !== null ? setUserSuccess('save') : ''
      callback !== null ? callback() : ''
    })
    .catch(() =>
      setUserSuccess('repeat'));
}

export { getData, writeUserData, removeData, getSpecificData, getSpecificDataEq }