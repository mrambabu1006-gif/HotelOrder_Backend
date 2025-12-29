require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { sendDemoSMS } = require('./sms.service');
const { processPayment } = require('./payment.service');
const { sendWhatsApp } = require('./whatsapp.service');

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 File path
const ORDERS_FILE = path.join(__dirname, 'orders.json');

// 🔹 Helper: read orders
function readOrders() {
    if (!fs.existsSync(ORDERS_FILE)) {
        fs.writeFileSync(ORDERS_FILE, JSON.stringify([]));
    }
    const data = fs.readFileSync(ORDERS_FILE);
    return JSON.parse(data);
}

// 🔹 Helper: write orders
function writeOrders(orders) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

// 🔹 Place Order API (Demo)
app.post('/place-order', async (req, res) => {
    try {
        const { room, items, total } = req.body;

        // 🔹 PAYMENT FIRST
        const payment = await processPayment(total);

        if (payment.status !== 'SUCCESS') {
            return res.status(400).json({ success: false });
        }

        const orders = readOrders();

        const order = {
            id: Date.now(),
            room,
            items,
            total,
            paymentStatus: payment.status,
            paymentId: payment.paymentId,
            createdAt: new Date().toISOString()
        };

        orders.push(order);
        writeOrders(orders);

        sendDemoSMS(`
        New Order Received
        Room/Table: ${room}
        Total: ₹${total}
        Payment: ${payment.status}
    `);

        const message = `
        🍽️ New Hotel Order
        Room/Table: ${order.room}
        Total: ₹${order.total}
        Items:
        ${order.items.map(i => `• ${i.name} x ${i.quantity}`).join('\n')}
        Payment: ${order.paymentStatus}`;
        sendWhatsApp(message);
        res.json({ success: true, orderId: order.id });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});



// 🔹 Get All Orders (Admin)
app.get('/orders', (req, res) => {
    const orders = readOrders();
    res.json(orders);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});