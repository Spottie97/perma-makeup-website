const express = require('express');
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const stripe = Stripe('your-secret-key-here');

app.use(cors());
app.use(bodyParser.json());
//Payment endpoint
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

//Booking endpoint
app.post('/book-appointment', (req, res) => {
  const { name, email, date, service, subService } = req.body;

  // Here you can add logic to save the booking to a database or send a confirmation email
  console.log(`Booking received: ${name}, ${email}, ${date}, ${service}, ${subService}`);

  res.json({ success: true });
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
