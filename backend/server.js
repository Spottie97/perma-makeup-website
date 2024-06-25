const express = require('express');
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const stripe = Stripe('your-secret-key-here');

app.use(cors());
app.use(bodyParser.json());

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

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
