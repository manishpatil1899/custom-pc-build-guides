const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { query, validationResult } = require('express-validator');

const router = express.Router();
const prisma = new PrismaClient();

// IMPORTANT: Order matters in Express routing!
// More specific routes MUST come before parameterized routes

// Get all component categories (MUST be before /:id route)
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

// Search components (MUST be before /:id route)
router.get('/search', [
  query('q').notEmpty().isString(),
  query('category').optional().isString(),
  query('limit').optional().isInt({ min: 1, max: 50 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Invalid search parameters',
        details: errors.array(),
      });
    }

    const { q, category, limit = 10 } = req.query;

    const where = {
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { brand: { contains: q, mode: 'insensitive' } },
        { model: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ],
    };

    if (category) {
      where.category = { name: { equals: category, mode: 'insensitive' } };
    }

    const components = await prisma.component.findMany({
      where,
      take: parseInt(limit),
      include: {
        category: true,
      },
      orderBy: { name: 'asc' },
    });

    res.json({
      success: true,
      data: components,
    });
  } catch (error) {
    console.error('Search components error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to search components',
    });
  }
});

// Get components by category (MUST be before /:id route)
router.get('/category/:categoryId', [
  query('search').optional().isString(),
  query('brand').optional().isString(),
  query('priceMin').optional().isNumeric(),
  query('priceMax').optional().isNumeric(),
  query('sortBy').optional().isIn(['price-asc', 'price-desc', 'name-asc', 'name-desc']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
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
    const {
      search,
      brand,
      priceMin,
      priceMax,
      sortBy = 'name-asc',
      page = 1,
      limit = 20,
    } = req.query;

    // Check if category exists
    const category = await prisma.componentCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Category not found',
      });
    }

    // Build where clause
    const where = { categoryId };
    
    if (brand) {
      where.brand = { contains: brand, mode: 'insensitive' };
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (priceMin !== undefined) {
      where.price = { ...where.price, gte: parseFloat(priceMin) };
    }
    
    if (priceMax !== undefined) {
      where.price = { ...where.price, lte: parseFloat(priceMax) };
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
          category: true,
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
    console.error('Get components by category error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to fetch components',
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
      data: {
        components,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1,
        },
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

// Get component by ID (MUST come AFTER specific routes)
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

module.exports = router;