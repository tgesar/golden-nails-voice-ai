const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = path.join(__dirname, 'token.json');
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json'); // Place your Google creds here

function loadCredentials() {
  const content = fs.readFileSync(CREDENTIALS_PATH);
  return JSON.parse(content);
}

function authorize() {
  const { client_id, client_secret, redirect_uris } = loadCredentials().installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  const token = fs.readFileSync(TOKEN_PATH);
  oAuth2Client.setCredentials(JSON.parse(token));
  return oAuth2Client;
}

async function listEvents() {
  const auth = authorize();
  const calendar = google.calendar({ version: 'v3', auth });

  const res = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });

  const events = res.data.items;
  return events;
}

module.exports = { listEvents };
