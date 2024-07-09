const { google } = require('googleapis');
const fs = require('fs');
const readline = require('readline');
const path = require('path');

const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const TOKEN_PATH = path.join(__dirname, 'token.json');

// Load client secrets from a local file.
fs.readFile(CREDENTIALS_PATH, (err, content) => {
  if (err) {
    console.log('Error loading client secret file:', err);
    return;
  }
  authorize(JSON.parse(content), getAccessToken);
});

/**
 * Create an OAuth2 client with the given credentials.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      return callback(oAuth2Client);
    } else {
      try {
        oAuth2Client.setCredentials(JSON.parse(token));
        console.log('Token already exists:', JSON.parse(token));
      } catch (error) {
        console.error('Error parsing token file:', error);
        callback(oAuth2Client);
      }
    }
  });
}

/**
 * Get and store new token after prompting for user authorization.
 */
function getAccessToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) {
        console.error('Error while trying to retrieve access token', err);
        return;
      }
      oAuth2Client.setCredentials(token);
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) {
          console.error('Error saving the token to file:', err);
          return;
        }
        console.log('Token stored to', TOKEN_PATH);
        console.log('Refresh token:', token.refresh_token);
      });
    });
  });
}