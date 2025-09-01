const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const authMiddleware = async (req, res, next) => {
  try {
    // DEVELOPMENT BYPASS - Remove this in production!
    if (process.env.NODE_ENV === 'development') {
      const authHeader = req.headers.authorization;
      
      // If no auth header in development, create a mock user
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('🔧 Development mode: Using mock authentication');
        
        // Try to find the demo user from seed data
        const demoUser = await prisma.user.findUnique({
          where: { email: 'demo@example.com' },
          select: {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        });
        
        if (demoUser) {
          req.userId = demoUser.id;
          req.user = demoUser;
          console.log(`🔧 Using demo user: ${demoUser.username}`);
          return next();
        } else {
          console.warn('⚠️ Demo user not found in development mode');
        }
      }
    }
    
    // Normal authentication flow
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Access token required',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Access token required',
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'User not found',
      });
    }

    // Add user info to request
    req.userId = user.id;
    req.user = user;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid access token',
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Access token expired',
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Authentication failed',
    });
  }
};

// Optional auth middleware (doesn't fail if no token)
const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);
    
    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
      },
    });

    if (user) {
      req.userId = user.id;
      req.user = user;
    }
    
    next();
  } catch (error) {
    // Ignore auth errors in optional middleware
    next();
  }
};

module.exports = authMiddleware;
module.exports.optional = optionalAuthMiddleware;