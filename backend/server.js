const express = require('express');
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const app = express();
const stripe = Stripe('your-secret-key-here');

app.use(cors());
app.use(bodyParser.json());

// Google OAuth2 setup
const oAuth2Client = new google.auth.OAuth2(
  'your-client-id',
  'your-client-secret',
  'your-redirect-uri'
);
oAuth2Client.setCredentials({
  refresh_token: 'your-refresh-token'
});

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: 'your-email@gmail.com',
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
    refreshToken: 'your-refresh-token',
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
      from: 'your-email@gmail.com',
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
      calendarId: 'owner-email@gmail.com',
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
