// Incluimos archivos .env con la librería dotenv
require('dotenv').config();

const { google } = require('googleapis');

// Initializes the Google APIs client library and sets up the authentication using service account credentials.
const auth = new google.auth.GoogleAuth({
  keyFile: './googleapis.json',
  scopes: 'https://www.googleapis.com/auth/spreadsheets',
});

const googleSheetsClient = google.sheets({ version: 'v4', auth });

module.exports = { googleSheetsClient };
