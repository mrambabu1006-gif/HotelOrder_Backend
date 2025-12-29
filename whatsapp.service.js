const axios = require('axios');

async function sendWhatsApp(message) {
  try {
    const phone = process.env.OWNER_PHONE;
    const apiKey = process.env.WHATSAPP_API_KEY;

    const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(
      message
    )}&apikey=${apiKey}`;

    await axios.get(url);
    console.log('📲 WhatsApp message sent');
  } catch (error) {
    console.error('❌ WhatsApp failed', error.message);
  }
}

module.exports = { sendWhatsApp };
