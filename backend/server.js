const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { initIO } = require('./src/socket');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Init Socket.IO
initIO(server);

app.use(cors(
  {
    origin: ['https://puncher-app.vercel.app', 'http://localhost:3000'],
    credentials: true,

  }
));
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/puncher')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

const authRoutes = require('./src/routes/authRoutes');
const vendorRoutes = require('./src/routes/vendorRoutes');
const requestRoutes = require('./src/routes/requestRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);



app.get('/', (req, res) => {
  res.send('Puncher App Backend is running');
});

server.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}`);
});
