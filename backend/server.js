const express = require('express');
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const fs = require('fs');

// Load configuration
const config = JSON.parse(fs.readFileSync('appsettings.json', 'utf8'));

const app = express();
const stripe = Stripe(config.stripe.secretKey);

app.use(cors());
app.use(bodyParser.json());

// Google OAuth2 setup
const oAuth2Client = new google.auth.OAuth2(
  config.google.clientId,
  config.google.clientSecret,
  config.google.redirectUri
);
oAuth2Client.setCredentials({
  refresh_token: config.google.refreshToken
});

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: config.email.address,
    clientId: config.google.clientId,
    clientSecret: config.google.clientSecret,
    refreshToken: config.google.refreshToken,
    accessToken: oAuth2Client.getAccessToken(),
  },
});

// Payment endpoint
app.post('/create-payment-intent', async (req, res) => {
  const { paymentMethodId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // Amount in cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirmation_method: 'manual',
      confirm: true,
    });

    res.send({ client_secret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Booking endpoint
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
        timeZone: 'Africa/Johannesburg',
      },
      end: {
        dateTime: new Date(new Date(date).getTime() + 60 * 60 * 1000).toISOString(), // 1 hour duration
        timeZone: 'Africa/Johannesburg',
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

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
