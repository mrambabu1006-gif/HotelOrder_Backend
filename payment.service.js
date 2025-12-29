const config = require('./config');

// DEMO payment
async function demoPayment(amount) {
  console.log(`💳 DEMO payment success for ₹${amount}`);
  return {
    status: 'SUCCESS',
    paymentId: 'DEMO_' + Date.now()
  };
}

// LIVE payment (Razorpay – disabled for now)
async function livePayment(amount) {
  throw new Error('LIVE payment not enabled');
}

// Main payment handler
async function processPayment(amount) {
  if (config.PAYMENT_MODE === 'DEMO') {
    return demoPayment(amount);
  } else {
    return livePayment(amount);
  }
}

module.exports = {
  processPayment
};
