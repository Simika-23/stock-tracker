// Main Sever Entry Point
const express = require('express');
const app = express();

require('dotenv').config();

const PORT = process.env.PORT;


const { connectDB, sequelize } = require('./db/database');

// Middleware
app.use(express.json()); 


// IMPORT ROUTES
const homeRoutes = require('./routes/home');


// USE ROUTES
app.use('/', homeRoutes);
app.use('/api/home', homeRoutes);



const startServer = async () => {
    await connectDB();
    await sequelize.sync();
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};

startServer();




