import fetch from 'node-fetch';
import admin from 'firebase-admin'
import { getDatabase, onValue, set, child, get, remove, update, query, orderByChild, equalTo } from "firebase-admin/database";

var serviceAccount = require("./firebase-adminsdk.json");



if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://bottak-15afa-default-rtdb.firebaseio.com"
    });
}
const db = getDatabase(admin.apps[0]);




function getDayMonthYear() {

    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    let dateDB = new Date();
    let options = { timeZone: 'America/La_Paz' };
    let date =  new Date(dateDB.toLocaleString('en-US', options))

    return {
        actualizacion: `${date.getHours() > 9 ? date.getHours() : '0' + date.getHours()}:${date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()} ${date.getDate().toString().length === 1 ? '0' + date.getDate().toString() : date.getDate()}-${months[date.getMonth()]}-${date.getFullYear()}`,
        time_stamp: date.getTime()
}
}



export default async function account(req, res) {
    let acc = {}
    const headers = {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Content-Length": "123",
        "content-type": "application/json",
        "Host": "p2p.binance.com",
        "Origin": "https://p2p.binance.com",
        "Pragma": "no-cache",
        "TE": "Trailers",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0"
    };

    async function getExchange(data, pila) {
        const responseData = await fetch(
            'https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search',
            {
                headers,
                method: 'POST',
                body: JSON.stringify({ ...data, tradeType: 'SELL', }),
            }
        );
        const responseData2 = await fetch(
            'https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search',
            {
                headers,
                method: 'POST',
                body: JSON.stringify({ ...data, tradeType: 'BUY', }),
            }
        );
        if (!responseData.ok) throw 'bad response';
        if (!responseData2.ok) throw 'bad response';

        const jsonData = await responseData.json();
        const jsonData2 = await responseData2.json();


        if (jsonData.data.length !== 0 && jsonData2.data.length !== 0) {
            let tempMaxima = Math.max(...jsonData.data.map((i) => i.adv.price));
            let tempMinima = Math.min(...jsonData.data.map((i) => i.adv.price));
            let promedio = (tempMaxima + tempMinima) / 2;

            let tempMaxima2 = Math.max(...jsonData2.data.map((i) => i.adv.price));
            let tempMinima2 = Math.min(...jsonData2.data.map((i) => i.adv.price));
            let promedio2 = (tempMaxima2 + tempMinima2) / 2;

            const ref = db.ref(`divisas/${data.fiat}`);
            await ref.update({ compra: (promedio + 0.01).toFixed(2), venta: (promedio2 + 0.01).toFixed(2),  ...getDayMonthYear() })

            // console.log({ [data.fiat]: { compra: (promedio + 0.01).toFixed(2), venta: (promedio2 + 0.01).toFixed(2) } })
            acc = { ...acc, [data.fiat]: { compra: (promedio + 0.01).toFixed(2), venta: (promedio2 + 0.01).toFixed(2) } }

        }

        return pila === true && res.json({ data: acc })


    }


    var database = admin.database();
    var referene = database.ref('/divisas');


    function getFirebaseDB() {
        let db
        referene.once('value', async function (snapshot) {
            let data = snapshot.val()
            let resData = Object.values(data).filter(i => i.habilitado && i.habilitado != undefined && i.habilitado === true)
            // console.log(resData)

            resData.map((i, index) => {
                const data = {
                    asset: 'USDT',
                    fiat: i.code,
                    transAmount: i.transAmount && i.transAmount !== undefined ? i.transAmount : 0,
                    order: '',
                    page: 1,
                    rows: 5,
                    filterType: 'all'
                };
                // console.log(index * 1 + 1)
                // console.log(resData.length * 1)
                // console.log(index * 1 + 1 == resData.length * 1)
                getExchange(data, index * 1 + 1 == resData.length * 1)
            })


        });



    }
    getFirebaseDB()













}

















