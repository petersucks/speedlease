import random from 'randomstring';

import Search from '../data/models/Search';
import stripeKey from './stripeKey.json';

const stripe = require('stripe')(stripeKey.secret);

async function createNewSearch(email, criteria) {      
  let taken, newID;

  do {
    newID = random.generate(32);
    taken = await Search.findOne({ where: { id: newID } });
  } while (taken);

  return Search.create({
    id: newID,
    email: email,
    criteria: JSON.stringify(criteria)
  });
}

function handleCharge(req, res) {
  const { criteria, stripeToken, stripeToken: { email }} = req.body;

  stripe.charges.create({
    amount: 799,
    currency: "usd",
    source: stripeToken.id,
    description: "SpeedLease - 15 Days"
  }, (err, charge) => {
    if (err && err.type === 'StripeCardError') {
      res.status(400).send('Card declined');
    }
    else {
      createNewSearch(email, criteria)
      .then(search => res.json({ id: search.dataValues.id }))
      .catch(err => res.status(503).send('Unable to create search'));
    }
  });
}

export default handleCharge;