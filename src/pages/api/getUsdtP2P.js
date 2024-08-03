import fetch from 'node-fetch';
import admin from 'firebase-admin'
import { getDatabase, onValue, set, child, get, remove, update, query, orderByChild, equalTo } from "firebase-admin/database";
// import { app } from './config'

var serviceAccount = require("./firebase-adminsdk.json");



if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://bottak-15afa-default-rtdb.firebaseio.com"
    });
}
const db = getDatabase(admin.apps[0]);
// const ref = db.ref('/div');

export default async function account(req, res) {

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

    async function getExchange(data) {
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
            ref.update({ compra: (promedio + 0.01).toFixed(2), venta: (promedio2 + 0.01).toFixed(2) });
            console.log({ [data.fiat]: { compra: (promedio + 0.01).toFixed(2), venta: (promedio2 + 0.01).toFixed(2) } })
        }

        //  console.log(jsonData)
    }


    var database = admin.database();
    var referene = database.ref('/divisas');



    referene.once('value', function (snapshot) {
        let data = snapshot.val()
        let res = Object.values(data).filter(i => i.habilitado && i.habilitado != undefined && i.habilitado === true)
        // console.log(res)

        res.map(i => {
            const data = {
                asset: 'USDT',
                fiat: i.code,
                transAmount: i.transAmount && i.transAmount !== undefined ? i.transAmount : 0,
                order: '',
                page: 1,
                rows: 5,
                filterType: 'all'
            };
            getExchange(data)
        })
    });

















    console.log('-------------')

}

















