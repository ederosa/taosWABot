// Cargamos las variables de entorno del archivo .env gracias a la librerìa dotenv.
require('dotenv').config();

const { createBot, createProvider, createFlow } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const { flowGastos } = require("./plugins/flowGastos.js");

const main = async () => {
  const adapterDB = new MockAdapter()
  const adapterFlow = createFlow([flowGastos])
  const adapterProvider = createProvider(BaileysProvider)

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  })

  QRPortalWeb()
}

main()
