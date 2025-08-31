const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { body, query, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all builds with filtering
router.get('/', [
  query('userId').optional().isString(),
  query('useCase').optional().isString(),
  query('isPublic').optional().isBoolean(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('sortBy').optional().isIn(['created-desc', 'created-asc', 'price-desc', 'price-asc', 'name-asc']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Invalid query parameters',
        details: errors.array(),
      });
    }

    const {
      userId,
      useCase,
      isPublic,
      page = 1,
      limit = 20,
      sortBy = 'created-desc',
    } = req.query;

    // Build where clause
    const where = {};

    if (userId) {
      where.userId = userId;
    }

    if (useCase) {
      where.useCase = { equals: useCase, mode: 'insensitive' };
    }

    if (isPublic !== undefined) {
      where.isPublic = isPublic === 'true';
    } else {
      // If no specific public filter, default to public builds for non-authenticated users
      if (!req.headers.authorization) {
        where.isPublic = true;
      }
    }

    // Build orderBy clause
    let orderBy = {};
    switch (sortBy) {
      case 'created-asc':
        orderBy = { createdAt: 'asc' };
        break;
      case 'price-desc':
        orderBy = { totalPrice: 'desc' };
        break;
      case 'price-asc':
        orderBy = { totalPrice: 'asc' };
        break;
      case 'name-asc':
        orderBy = { name: 'asc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute queries
    const [builds, total] = await Promise.all([
      prisma.build.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          components: {
            include: {
              component: {
                include: {
                  category: {
                    select: {
                      id: true,
                      name: true,
                      displayName: true,
                      icon: true,
                    },
                  },
                },
              },
            },
          },
          _count: {
            select: { components: true },
          },
        },
      }),
      prisma.build.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: builds,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      },
    });
  } catch (error) {
    console.error('Get builds error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to fetch builds',
    });
  }
});

// Create new build (authentication required)
router.post('/', authMiddleware, [
  body('name').notEmpty().trim().isLength({ min: 1, max: 100 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('useCase').optional().isString(),
  body('isPublic').optional().isBoolean(),
  body('components').isArray({ min: 1 }),
  body('components.*.componentId').notEmpty().isString(),
  body('components.*.quantity').isInt({ min: 1, max: 10 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Invalid build data',
        details: errors.array(),
      });
    }

    const {
      name,
      description,
      useCase,
      isPublic = false,
      components,
    } = req.body;

    // Verify all components exist
    const componentIds = components.map(c => c.componentId);
    const existingComponents = await prisma.component.findMany({
      where: { id: { in: componentIds } },
      select: { id: true, price: true },
    });

    if (existingComponents.length !== componentIds.length) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Components',
        message: 'One or more components do not exist',
      });
    }

    // Calculate total price
    const totalPrice = components.reduce((sum, buildComponent) => {
      const component = existingComponents.find(c => c.id === buildComponent.componentId);
      return sum + (component?.price ? parseFloat(component.price) * buildComponent.quantity : 0);
    }, 0);

    // Create build
    const build = await prisma.build.create({
      data: {
        name,
        description,
        useCase,
        isPublic,
        totalPrice,
        userId: req.userId,
        components: {
          create: components.map(component => ({
            componentId: component.componentId,
            quantity: component.quantity,
          })),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        components: {
          include: {
            component: {
              include: {
                category: {
                  select: {
                    id: true,
                    name: true,
                    displayName: true,
                    icon: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: build,
      message: 'Build created successfully',
    });
  } catch (error) {
    console.error('Create build error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to create build',
    });
  }
});

module.exports = router;
