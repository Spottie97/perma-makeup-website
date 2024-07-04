const express = require('express');
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Load configuration
const config = JSON.parse(fs.readFileSync('appsettings.json', 'utf8'));

const app = express();
const stripe = Stripe(config.stripe.secretKey);

app.use(cors());
app.use(bodyParser.json());

const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];
const TOKEN_PATH = path.join(__dirname, 'token.json');

// Google OAuth2 setup
const oAuth2Client = new google.auth.OAuth2(
  config.google.client_id,
  config.google.client_secret,
  config.google.redirect_uris[0]
);

// Function to get access token
function getAccessToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);

  // Wait for the user to authorize the app and provide the authorization code
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Enter the authorization code: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) {
        console.error('Error retrieving access token', err);
        return;
      }
      oAuth2Client.setCredentials(token);

      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error('Failed to write token to file:', err);
        console.log('Token stored successfully to', TOKEN_PATH);
        setupTransporterAndCalendar(); // Setup after successful authentication
      });
    });
  });
}

// Function to setup transporter and calendar
async function setupTransporterAndCalendar() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: config.email.address,
      clientId: config.google.client_id,
      clientSecret: config.google.client_secret,
      refreshToken: oAuth2Client.credentials.refresh_token,
      accessToken: await oAuth2Client.getAccessToken(),  // Now correctly inside an async function
    },
  });

  

  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

  app.post('/book-appointment', async (req, res) => {
    const { name, email, date, service, subService } = req.body;

    try {
      // Send confirmation email
      const mailOptions = {
        from: config.email.address,
        to: email,
        subject: 'Booking Confirmation',
        text: `Dear ${name},\n\nYour booking for ${service} - ${subService} on ${date} has been confirmed.\n\nThank you!`,
      };

      await transporter.sendMail(mailOptions);

      // Add event to user's Google Calendar
      const event = {
        summary: `${service} - ${subService}`,
        description: `Appointment for ${service} - ${subService}`,
        start: {
          dateTime: new Date(date).toISOString(),
          timeZone: 'your-time-zone',
        },
        end: {
          dateTime: new Date(new Date(date).getTime() + 60 * 60 * 1000).toISOString(), // 1 hour duration
          timeZone: 'your-time-zone',
        },
      };

      await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });

      // Add event to salon owner's Google Calendar
      await calendar.events.insert({
        calendarId: config.email.ownerEmail,
        resource: event,
      });

      res.json({ success: true });
    } catch (error) {
      console.error('Error processing booking:', error);
      res.status(500).json({ error: 'Failed to process booking' });
    }
  });
}

// Load or request tokens
fs.readFile(TOKEN_PATH, (err, token) => {
  if (err || !token) {
    console.log('Token not found or invalid, generating auth URL');
    getAccessToken(oAuth2Client);
  } else {
    try {
      const storedToken = JSON.parse(token);
      oAuth2Client.setCredentials(storedToken);

      // Use the stored refresh token to obtain a new access token
      oAuth2Client.getAccessToken().then((tokenResponse) => {
        if (tokenResponse.token) {
          oAuth2Client.setCredentials(tokenResponse.token);
          setupTransporterAndCalendar(); // Setup after successful authentication
        } else {
          console.error('Error refreshing access token', tokenResponse.res);
        }
      }).catch((err) => {
        console.error('Error refreshing access token', err);
      });
    } catch (error) {
      console.error('Error parsing the token file:', error);
      // If there's an error parsing the token file, assume it's invalid and get a new one
      getAccessToken(oAuth2Client);
    }
  }
});

// Start the server
app.listen(3001, () => {
  console.log('Server running on port 3001');
});
