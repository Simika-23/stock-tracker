// Main Sever Entry Point
const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');


const PORT = process.env.PORT;
const { connectDB, sequelize } = require('./db/database');

// Middleware
app.use(express.json()); 
app.use('/uploads', express.static('uploads'));  

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));

// IMPORT ROUTES
const homeRoutes = require('./routes/home');
const userRoutes = require('./routes/user');

// USE ROUTES
app.use('/', homeRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/user', userRoutes);


// SERVER BOOTSTRAPPING
const startServer = async () => {
    await connectDB();
    await sequelize.sync();
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};

startServer();




