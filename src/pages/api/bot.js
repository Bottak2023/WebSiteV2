

// --------------------- DATOS PRODUCCION

const TelegramBot = require('node-telegram-bot-api');

export default async function account(req, res) {
  console.log(req.body)
  console.log('-------------')

  const token = '6674000394:AAE5B5t7BpDI-RLD4C5zdbYyRqmG7h_1Uac';
  const bot = new TelegramBot(token, { polling: true });

  function sendMSG() {
    bot.sendMessage(6073170955, req.body.data);
    bot.sendPhoto(6073170955, req.body.url);
    bot.stopPolling()
    return res.json({ success: 'true' })
  }
  sendMSG()
}



// // --------------------- DATOS DESARROLLO

// const TelegramBot = require('node-telegram-bot-api');

// export default async function account(req, res) {
//   console.log(req.body)
//   console.log('-------------')

//   const token = '6674000394:AAE5B5t7BpDI-RLD4C5zdbYyRqmG7h_1Uac';
//   const bot = new TelegramBot(token, { polling: true });

//   function sendMSG() {
//     bot.sendMessage(6488746167, req.body.data);
//     bot.sendPhoto(6488746167, req.body.url);
//     bot.stopPolling()
//     return res.json({ success: 'true' })
//   }
//   sendMSG()
// }

