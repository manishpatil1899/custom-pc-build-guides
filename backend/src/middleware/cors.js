const cors = require('cors');

const createCorsMiddleware = () => {
  const NODE_ENV = process.env.NODE_ENV || 'development';
  const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

  const corsOptions = {
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (NODE_ENV === 'development') {
        // In development, allow localhost and 127.0.0.1 on any port
        if (
          origin.includes('localhost') || 
          origin.includes('127.0.0.1') ||
          origin === FRONTEND_URL
        ) {
          return callback(null, true);
        }
      } else {
        // In production, only allow specified frontend URL
        if (origin === FRONTEND_URL) {
          return callback(null, true);
        }
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
    ],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
    maxAge: 86400, // 24 hours
  };

  return cors(corsOptions);
};

module.exports = {
  createCorsMiddleware,
};
