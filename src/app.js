const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const { ZodError} = require('zod')
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

// error handler
app.use(function (err, req, res, next) {
     if (isDev) {
      console.error(err.stack)
     }

    let statusCode = err.status || 500;
    let message = err.message || 'Something broke!';
    
    // validation errors
    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: 'validation errors',
            data: null,
            errors: err.issues.map(e=> ({
                field: e.path.join('.'),
                message: e.message
            })),
            time: new Date().toISOString() 
        })
    }

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        data: null,
        errors: null,
        time: new Date().toISOString()
    });
});


module.exports = app;