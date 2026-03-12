const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./configs/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routers/auth.router'));
app.use('/api/admin/users', require('./routers/admin/user.router'));
app.use('/api/admin/courses', require('./routers/admin/course.router'));
app.use('/api/admin/classes', require('./routers/admin/class.router'));
app.use('/api/admin/pathways', require('./routers/admin/pathway.router'));
app.use('/api/admin/rewards', require('./routers/admin/reward.router'));
app.use('/api/admin/dashboard', require('./routers/admin/dashboard.router'));

app.use('/api/learner', require('./routers/learner/learner.router'));

// Error Handler Middleware
app.use((err, req, res, next) => {
    console.error('--- Global Error Debug ---');
    console.error('Method:', req.method);
    console.error('URL:', req.url);
    console.error('Error Stack:', err.stack);
    console.error('---------------------------');
    
    res.status(err.status || 500).json({
        message: err.message,
        details: err.errors || undefined
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
