const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { query, validationResult } = require('express-validator');

const router = express.Router();
const prisma = new PrismaClient();

// Get all component categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.componentCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { components: true },
        },
      },
    });

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to fetch categories',
    });
  }
});

// Get all components with filtering and pagination
router.get('/', [
  query('category').optional().isString(),
  query('brand').optional().isString(),
  query('search').optional().isString(),
  query('priceMin').optional().isFloat({ min: 0 }),
  query('priceMax').optional().isFloat({ min: 0 }),
  query('inStock').optional().isBoolean(),
  query('sortBy').optional().isIn(['price-asc', 'price-desc', 'name-asc', 'name-desc']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
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
      category,
      brand,
      search,
      priceMin,
      priceMax,
      inStock,
      sortBy = 'name-asc',
      page = 1,
      limit = 20,
    } = req.query;

    // Build where clause
    const where = {};

    if (category) {
      // Find category by name or ID
      const categoryRecord = await prisma.componentCategory.findFirst({
        where: {
          OR: [
            { id: category },
            { name: { equals: category, mode: 'insensitive' } },
          ],
        },
      });
      
      if (categoryRecord) {
        where.categoryId = categoryRecord.id;
      }
    }

    if (brand) {
      where.brand = { contains: brand, mode: 'insensitive' };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (priceMin !== undefined || priceMax !== undefined) {
      where.price = {};
      if (priceMin !== undefined) {
        where.price.gte = parseFloat(priceMin);
      }
      if (priceMax !== undefined) {
        where.price.lte = parseFloat(priceMax);
      }
    }

    if (inStock !== undefined) {
      where.inStock = inStock === 'true';
    }

    // Build orderBy clause
    let orderBy = {};
    switch (sortBy) {
      case 'price-asc':
        orderBy = { price: 'asc' };
        break;
      case 'price-desc':
        orderBy = { price: 'desc' };
        break;
      case 'name-desc':
        orderBy = { name: 'desc' };
        break;
      default:
        orderBy = { name: 'asc' };
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute queries
    const [components, total] = await Promise.all([
      prisma.component.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
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
      }),
      prisma.component.count({ where }),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: components,
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
    console.error('Get components error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to fetch components',
    });
  }
});

// Get component by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const component = await prisma.component.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            displayName: true,
            description: true,
            icon: true,
          },
        },
      },
    });

    if (!component) {
      return res.status(404).json({
        success: false,
        error: 'Component Not Found',
        message: 'Component with the specified ID does not exist',
      });
    }

    res.json({
      success: true,
      data: component,
    });
  } catch (error) {
    console.error('Get component error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to fetch component',
    });
  }
});

// Get components by category
router.get('/category/:categoryId', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('sortBy').optional().isIn(['price-asc', 'price-desc', 'name-asc', 'name-desc']),
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

    const { categoryId } = req.params;
    const { page = 1, limit = 20, sortBy = 'name-asc' } = req.query;

    // Check if category exists
    const category = await prisma.componentCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category Not Found',
        message: 'Component category does not exist',
      });
    }

    // Build orderBy clause
    let orderBy = {};
    switch (sortBy) {
      case 'price-asc':
        orderBy = { price: 'asc' };
        break;
      case 'price-desc':
        orderBy = { price: 'desc' };
        break;
      case 'name-desc':
        orderBy = { name: 'desc' };
        break;
      default:
        orderBy = { name: 'asc' };
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where = { categoryId };

    // Execute queries
    const [components, total] = await Promise.all([
      prisma.component.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
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
      }),
      prisma.component.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        category,
        components,
      },
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
    console.error('Get category components error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to fetch category components',
    });
  }
});

module.exports = router;
