const express = require('express');
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

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

// Function to setup transporter and calendar
async function setupTransporterAndCalendar() {
  const accessToken = await oAuth2Client.getAccessToken();
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: config.email.address,
      clientId: config.google.client_id,
      clientSecret: config.google.client_secret,
      refreshToken: oAuth2Client.credentials.refresh_token,
      accessToken: accessToken.token,
    },
  });

  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

  app.post('/book-appointment', async (req, res) => {
    const { name, email, date, service, subService } = req.body;

    try {
      const mailOptions = {
        from: config.email.address,
        to: email,
        subject: 'Booking Confirmation',
        text: `Dear ${name},\n\nYour booking for ${service} - ${subService} on ${date} has been confirmed.\n\nThank you!`,
      };

      await transporter.sendMail(mailOptions);

      const event = {
        summary: `${service} - ${subService}`,
        description: `Appointment for ${service} - ${subService}`,
        start: {
          dateTime: new Date(date).toISOString(),
          timeZone: 'your-time-zone',
        },
        end: {
          dateTime: new Date(new Date(date).getTime() + 60 * 60 * 1000).toISOString(),
          timeZone: 'your-time-zone',
        },
      };

      await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });

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
fs.readFile(TOKEN_PATH, async (err, token) => {
  if (err || !token) {
    // Token not found or invalid, initialize with refresh token from config
    oAuth2Client.setCredentials({
      refresh_token: config.google.refresh_token,
    });

    // Get a new access token and store it
    try {
      const tokenResponse = await oAuth2Client.getAccessToken();
      oAuth2Client.setCredentials(tokenResponse.token);
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(oAuth2Client.credentials));
      setupTransporterAndCalendar();
    } catch (error) {
      console.error('Error retrieving access token', error);
    }
  } else {
    try {
      const storedToken = JSON.parse(token);
      oAuth2Client.setCredentials(storedToken);

      const tokenResponse = await oAuth2Client.getAccessToken();
      oAuth2Client.setCredentials(tokenResponse.token);
      setupTransporterAndCalendar();
    } catch (error) {
      console.error('Error parsing the token file:', error);
      // If there's an error parsing the token file, use the refresh token from config
      oAuth2Client.setCredentials({
        refresh_token: config.google.refresh_token,
      });

      try {
        const tokenResponse = await oAuth2Client.getAccessToken();
        oAuth2Client.setCredentials(tokenResponse.token);
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(oAuth2Client.credentials));
        setupTransporterAndCalendar();
      } catch (tokenError) {
        console.error('Error retrieving access token', tokenError);
      }
    }
  }
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});