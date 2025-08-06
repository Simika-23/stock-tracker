// Main Server Entry Point
const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 5555;
const { connectDB, sequelize } = require('./db/database');
const { checkAlerts } = require('./controllers/alertChecker');

setInterval(checkAlerts, 60000);

// Middleware Setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// CORS
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));

// IMPORT ROUTES
const homeRoutes = require('./routes/home');
const userRoutes = require('./routes/user');
const portfolioRoutes = require('./routes/portfolio');
const stockRoutes = require('./routes/stock');
const watchlistRoutes = require('./routes/watchlist');
const alertRoutes = require('./routes/alert');
const notificationRoutes = require('./routes/notification');
const sentimentRoutes = require('./routes/news.js');

// USE ROUTES
app.use('/', homeRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/user', userRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/news', sentimentRoutes);

// Start server only if this file is run directly
if (require.main === module) {
    const startServer = async () => {
        try {
            await connectDB();
            app.listen(PORT, () => {
                console.log(`🚀 Server is running on http://localhost:${PORT}`);
            });
        } catch (err) {
            console.error('❌ Server startup failed:', err);
            process.exit(1);
        }
    };
    startServer();
}

// Export app for testing
module.exports = app;
