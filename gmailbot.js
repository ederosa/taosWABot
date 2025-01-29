// Referencia
// https://developers.google.com/gmail/api/quickstart/nodejs?hl=es-419

require('dotenv').config();

// Chatbot
const { createBot, createProvider, createFlow } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
// Flow de gastos
const { flowMails } = require("./plugins/flowMails.js");

const esperarConexion = async (provider) => {
  return new Promise((resolve) => {
    const checkReady = () => {
      //console.log("🔍 Revisando si provider.vendor está disponible...");
      if (provider.vendor) {
        //console.log("✅ Conexión establecida con WhatsApp.");
        resolve();
      } else {
        //console.log("⏳ Provider aún no está listo, esperando...");
        setTimeout(checkReady, 2000);
      }
    };
    checkReady();
  });
};

const enviarMensaje = async (provider, userID, message) => {
  try {
    console.log(message)
    if (!provider.vendor) {
      throw new Error("❌ El proveedor aún no está completamente inicializado.");
    }
    await provider.sendText(userID, message);
    console.log("✅ Mensaje enviado con éxito!");
  } catch (error) {
    console.error("❌ Error al enviar mensaje:", error);
  }
};

const main = async (messages, userID) => {
  const BOTNAME = "botMails";
  const adapterDB = new MockAdapter()
  const adapterFlow = createFlow([flowMails])
  const adapterProvider = createProvider(BaileysProvider, { name: BOTNAME });

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  })
  await esperarConexion(adapterProvider);
  for (const value of messages) {
    await enviarMensaje(adapterProvider, userID, value[0].summary_text)
  }
  QRPortalWeb()
}
// Chatbot - Fin


const { convert } = require('html-to-text');
const options = {
  wordwrap: 130,
};
const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');
const { auth } = require('googleapis/build/src/apis/gkehub');
const condition = process.env.CONDITION;

const userID = process.env.WHATSAPPUSERID;
// Token para acceder a la api de resumen
// Es una variable de entorno que no està en el .env para que 
// no suba a github.
const huggingface_facebook = process.env.HUGGINGFACE_FACEBOOK

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listLabels(auth) {
  const gmail = google.gmail({ version: 'v1', auth });
  const res = await gmail.users.labels.list({
    userId: 'me',
  });
  const labels = res.data.labels;
  if (!labels || labels.length === 0) {
    console.log('No labels found.');
    return;
  }
  //console.log('Labels:');
  labels.forEach((label) => {
    console.log(`- ${label.name}`);
  });
}

/**
 * Lists the messages in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listMessages(auth, condition) {
  const gmail = google.gmail({ version: 'v1', auth });
  const res = await gmail.users.messages.list({
    userId: 'me',
    maxResults: 100,
    pageToken: '',
    q: condition
  });
  return res.data.messages;
}

async function processMessages(auth, messages) {
  // console.log(messages);
  let mensajesProcesados = []
  for (const message of messages) {
    let summarizedMessage = await getMessage(auth, message.id)
    mensajesProcesados.push(summarizedMessage)
    // console.log(summarizedMessage)
  }
  return mensajesProcesados
}

async function getMessage(auth, messageId) {
  // console.log(messageId)
  const gmail = google.gmail({ version: 'v1', auth });
  const res = await gmail.users.messages.get({
    userId: 'me',
    id: messageId
  });
  //  console.log(res.data.payload.mimeType)
  let mensaje = "";
  if (res.data.payload.mimeType == 'text/html')
    mensaje = convert(Buffer.from(res.data.payload.body.data, 'base64').toString());
  else if (res.data.payload.mimeType == 'text/plain')
    mensaje = convert(Buffer.from(res.data.payload, 'base64').toString());
  else if (res.data.payload.mimeType == 'multipart/alternative'
    || res.data.payload.mimeType == 'multipart/alternaitve')
    mensaje = Buffer.from(res.data.payload.parts[0].body.data, 'base64').toString();
  else if (res.data.payload.mimeType == 'multipart/mixed')
    mensaje = Buffer.from(res.data.payload.parts[0].parts[0].body.data, 'base64').toString();

  const text = await query({ "inputs": mensaje })
  //  console.log(text)
  return text
}

async function query(data) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
    {
      headers: {
        Authorization: huggingface_facebook,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}

async function initiate(condition) {
  const client = await authorize();
  const messages = await listMessages(client, condition)
  if (messages) {
    const mensajesProcesados = await processMessages(client, messages)
    //  console.log(mensajesProcesados)
    await main(mensajesProcesados, userID)
  } else {
    console.log("No hay mensajes que enviar")
  }
  process.exit(0)
}

//authorize().then(listLabels).catch(console.error);

initiate(condition)
