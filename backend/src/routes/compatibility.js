const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');

const router = express.Router();
const prisma = new PrismaClient();

// Check build compatibility
router.post('/check', [
  body('components').isArray({ min: 1 }),
  body('components.*.componentId').notEmpty().isString(),
  body('components.*.quantity').isInt({ min: 1 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Invalid components data',
        details: errors.array(),
      });
    }

    const { components } = req.body;

    // Get component details with compatibility rules
    const componentIds = components.map(c => c.componentId);
    const componentData = await prisma.component.findMany({
      where: { id: { in: componentIds } },
      include: {
        category: true,
        compatibilityRules: true,
      },
    });

    // Check if all components exist
    if (componentData.length !== componentIds.length) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Components',
        message: 'One or more components do not exist',
      });
    }

    // Perform compatibility checks
    const compatibilityResult = await checkBuildCompatibility(componentData, components);

    res.json({
      success: true,
      data: compatibilityResult,
    });
  } catch (error) {
    console.error('Compatibility check error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to check compatibility',
    });
  }
});

// Compatibility checking logic
async function checkBuildCompatibility(componentData, buildComponents) {
  const warnings = [];
  const errors = [];
  const recommendations = [];

  // Group components by category
  const componentsByCategory = {};
  componentData.forEach(component => {
    const categoryName = component.category.name;
    componentsByCategory[categoryName] = component;
  });

  // Check CPU and Motherboard socket compatibility
  const cpu = componentsByCategory['CPU'];
  const motherboard = componentsByCategory['Motherboard'];

  if (cpu && motherboard) {
    const cpuSocket = cpu.specifications?.socket;
    const motherboardSocket = motherboard.specifications?.socket;

    if (cpuSocket && motherboardSocket && cpuSocket !== motherboardSocket) {
      errors.push(`CPU socket (${cpuSocket}) is not compatible with motherboard socket (${motherboardSocket})`);
    }
  }

  // Check RAM and Motherboard memory compatibility
  const ram = componentsByCategory['RAM'];
  
  if (ram && motherboard) {
    const ramType = ram.specifications?.type;
    const motherboardMemoryType = motherboard.specifications?.memoryType;

    if (ramType && motherboardMemoryType && ramType !== motherboardMemoryType) {
      errors.push(`RAM type (${ramType}) is not compatible with motherboard memory type (${motherboardMemoryType})`);
    }
  }

  // Add recommendations for missing components
  if (!componentsByCategory['Storage']) {
    recommendations.push('Add storage (SSD/HDD) to complete your build');
  }

  if (!componentsByCategory['Case']) {
    recommendations.push('Select a PC case to house your components');
  }

  // Determine overall compatibility
  const isCompatible = errors.length === 0;

  return {
    isCompatible,
    errors,
    warnings,
    recommendations,
    componentCount: componentData.length,
    checkedAt: new Date().toISOString(),
  };
}

module.exports = router;
