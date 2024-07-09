const express = require('express');
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');

// Load configuration
const config = JSON.parse(fs.readFileSync('appsettings.json', 'utf8'));

const app = express();
const stripe = Stripe(config.stripe.secretKey);

app.use(cors());
app.use(bodyParser.json());

const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];
const TOKEN_PATH = path.join(__dirname, 'token.json');

// Nodemailer transport setup with app-specific password
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.email.address,
    pass: config.email.app_specific_pass,
  },
});

// Google OAuth2 setup
const oAuth2Client = new google.auth.OAuth2(
  config.google.client_id,
  config.google.client_secret,
  config.google.redirect_uris[0]
);

// Function to set up calendar
async function setupCalendar() {
  try {
    const tokenResponse = await oAuth2Client.getAccessToken();
    const accessToken = tokenResponse.token;

    oAuth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    app.post('/book-appointment', async (req, res) => {
      const { name, email, date, service, subService } = req.body;

      try {
        // Log the received date for debugging
        console.log('Received date:', date);

        // Convert the received date to a Date object using moment-timezone
        const bookingDate = moment.tz(date, 'MM/DD/YYYY', 'Africa/Johannesburg');
        console.log('Converted bookingDate:', bookingDate.format());

        // Set the time portion to a specific time during business hours
        bookingDate.set({ hour: 10, minute: 0, second: 0, millisecond: 0 });
        const eventStart = bookingDate.clone();
        const eventEnd = bookingDate.clone().add(1, 'hour'); // 1 hour duration
        console.log('Event start:', eventStart.format());
        console.log('Event end:', eventEnd.format());

        // Send confirmation email to the client
        const clientMailOptions = {
          from: config.email.address,
          to: email,
          subject: 'Booking Confirmation',
          text: `Dear ${name},\n\nYour booking for ${service} - ${subService} on ${eventStart.format('LLLL')} has been confirmed.\n\nThank you!`,
        };

        await emailTransporter.sendMail(clientMailOptions);

        // Send notification email to the salon owner
        const ownerMailOptions = {
          from: config.email.address,
          to: config.email.ownerEmail,
          subject: 'New Booking Notification',
          text: `Dear Owner,\n\nA new booking has been made by ${name} for ${service} - ${subService} on ${eventStart.format('LLLL')}.\n\nClient Email: ${email}\n\nThank you!`,
        };

        await emailTransporter.sendMail(ownerMailOptions);

        // Create event object to be used for both client and owner calendar
        const event = {
          summary: `${service} - ${subService}`,
          description: `Appointment for ${service} - ${subService}`,
          start: {
            dateTime: eventStart.toISOString(),
            timeZone: 'Africa/Johannesburg', // Valid time zone for South Africa
          },
          end: {
            dateTime: eventEnd.toISOString(),
            timeZone: 'Africa/Johannesburg', // Valid time zone for South Africa
          },
        };

        // Insert event into the client's calendar
        await calendar.events.insert({
          calendarId: 'primary',
          resource: event,
        });

        // Insert event into the salon owner's calendar
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
    console.error('Error setting up calendar:', error);
  }
}

// Initialize OAuth2 client with stored token or refresh token
fs.readFile(TOKEN_PATH, async (err, token) => {
  if (err) {
    // No stored token, use refresh token
    oAuth2Client.setCredentials({ refresh_token: config.google.refresh_token });
    try {
      await setupCalendar();
    } catch (error) {
      console.error('Error setting up calendar with refresh token:', error);
    }
  } else {
    // Use stored token
    try {
      const storedToken = JSON.parse(token);
      oAuth2Client.setCredentials(storedToken);
      await setupCalendar();
    } catch (error) {
      console.error('Error parsing the token file:', error);
      // Fallback to refresh token
      oAuth2Client.setCredentials({ refresh_token: config.google.refresh_token });
      try {
        await setupCalendar();
      } catch (tokenError) {
        console.error('Error retrieving access token with refresh token:', tokenError);
      }
    }
  }
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});