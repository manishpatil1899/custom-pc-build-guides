const cors = require('cors');

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from these origins
    const allowedOrigins = [
      'http://localhost:3000', // Next.js dev server
      'http://localhost:3001', // Alternative dev port
      'https://localhost:3000', // HTTPS dev
      'https://localhost:3001', // HTTPS dev alternative
    ];

    // Allow requests from Vercel preview deployments and production
    if (process.env.NODE_ENV === 'production') {
      allowedOrigins.push(
        /^https:\/\/.*\.vercel\.app$/, // Vercel deployments
        /^https:\/\/.*\.netlify\.app$/, // Netlify deployments  
        /^https:\/\/.*\.render\.com$/, // Render deployments
      );

      // Add your production frontend URL if you have a custom domain
      if (process.env.FRONTEND_URL) {
        allowedOrigins.push(process.env.FRONTEND_URL);
      }
    }

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    // Check if origin is allowed
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return origin === allowedOrigin;
      }
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`CORS: Blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS policy'));
    }
  },
  credentials: true, // Allow cookies and credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-HTTP-Method-Override',
  ],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400, // 24 hours
};

// Create and export the CORS middleware
const corsMiddleware = cors(corsOptions);

module.exports = corsMiddleware;
