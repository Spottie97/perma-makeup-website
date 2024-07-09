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

// Function to set up transporter and calendar
async function setupTransporterAndCalendar() {
  try {
    const tokenResponse = await oAuth2Client.refreshAccessToken();
    const accessToken = tokenResponse.credentials.access_token;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: config.email.address,
        clientId: config.google.client_id,
        clientSecret: config.google.client_secret,
        refreshToken: config.google.refresh_token,
        accessToken,
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
  } catch (error) {
    console.error('Error setting up transporter and calendar:', error);
  }
}

// Initialize OAuth2 client with stored token or refresh token
fs.readFile(TOKEN_PATH, async (err, token) => {
  if (err) {
    // No stored token, use refresh token
    oAuth2Client.setCredentials({ refresh_token: config.google.refresh_token });
    try {
      await setupTransporterAndCalendar();
    } catch (error) {
      console.error('Error setting up transporter and calendar with refresh token:', error);
    }
  } else {
    // Use stored token
    try {
      const storedToken = JSON.parse(token);
      oAuth2Client.setCredentials(storedToken);
      await setupTransporterAndCalendar();
    } catch (error) {
      console.error('Error parsing the token file:', error);
      // Fallback to refresh token
      oAuth2Client.setCredentials({ refresh_token: config.google.refresh_token });
      try {
        await setupTransporterAndCalendar();
      } catch (tokenError) {
        console.error('Error retrieving access token with refresh token:', tokenError);
      }
    }
  }
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});