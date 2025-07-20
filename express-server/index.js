// Main Sever Entry Point
const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
   
const PORT = process.env.PORT || 5555;
const { connectDB, sequelize } = require('./db/database');
const { checkAlerts } = require('./controllers/alertChecker');

setInterval(checkAlerts, 60000); // check every 60 seconds

// Middleware Setup
app.use(express.json());  // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());  // Enables reading cookies (used in auth)
app.use('/uploads', express.static('uploads'));  // Serves uploaded static files

// CORS Configuration (Allow Frontend Access)
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

// SERVER BOOTSTRAPPING Function
const startServer = async () => {
  try {
    await connectDB(); // Safely connect DB

    // Sync models only if not in production
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alert: true }); // Alter only for development
      console.log('✅ Database synced (ALTER applied)');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('❌ Server startup failed:', err);
    process.exit(1); // Exit so issues don't go unnoticed
  }
};

startServer();





