const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';
const gradesRoutes = require('./routes/grades.routes');

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'too many requests from this IP'
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);
if (isDev) {
app.use(morgan('tiny'));
}

// Static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.use('/api/v1/grades', gradesRoutes);

// 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'المسار غير موجود'
    });
});

// Error handler
app.use((err, req, res, next) => {
	 console.log(err.stack);
    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'development' 
            ? err.message 
            : 'حدث خطأ في السيرفر'
    });
});

module.exports = app;