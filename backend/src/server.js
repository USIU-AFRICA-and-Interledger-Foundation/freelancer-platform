const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Freelancer Payment Platform API');
});

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Import routes
const authRoutes = require('./routes/auth.routes');
const paymentRoutes = require('./routes/payment.routes');
const userRoutes = require('./routes/user.routes');

app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);

// Database connection check
const db = require('./db');
db.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error connecting to database', err.stack);
    } else {
        console.log('Connected to database at:', res.rows[0].now);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
