const Fast2SMS = require('fast-two-sms');

async function sendDemoSMS(message) {
  try {
    await Fast2SMS.sendMessage({
      authorization: process.env.SMS_API_KEY,
      message: message,
      numbers: [process.env.OWNER_PHONE]
    });

    console.log('📩 SMS SENT TO PHONE (REAL)');
  } catch (error) {
    console.error('❌ SMS FAILED', error);
  }
}

module.exports = {
  sendDemoSMS
};
