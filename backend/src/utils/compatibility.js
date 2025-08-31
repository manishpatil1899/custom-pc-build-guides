// Compatibility checking utilities

/**
 * Check if CPU and motherboard sockets are compatible
 */
function checkSocketCompatibility(cpu, motherboard) {
  if (!cpu.specifications?.socket || !motherboard.specifications?.socket) {
    return { compatible: null, message: 'Socket information missing' };
  }

  const cpuSocket = cpu.specifications.socket;
  const motherboardSocket = motherboard.specifications.socket;

  if (cpuSocket === motherboardSocket) {
    return { compatible: true, message: `Compatible sockets (${cpuSocket})` };
  }

  return {
    compatible: false,
    message: `Incompatible sockets: CPU (${cpuSocket}) vs Motherboard (${motherboardSocket})`
  };
}

/**
 * Check memory compatibility
 */
function checkMemoryCompatibility(ram, motherboard) {
  const issues = [];
  
  if (!ram.specifications?.type || !motherboard.specifications?.memoryType) {
    return { compatible: null, issues: ['Memory type information missing'] };
  }

  // Check memory type (DDR4, DDR5, etc.)
  const ramType = ram.specifications.type;
  const motherboardMemoryType = motherboard.specifications.memoryType;

  if (ramType !== motherboardMemoryType) {
    return {
      compatible: false,
      issues: [`Memory type mismatch: RAM (${ramType}) vs Motherboard (${motherboardMemoryType})`]
    };
  }

  // Check memory speed
  const ramSpeed = ram.specifications?.speed;
  const motherboardMaxSpeed = motherboard.specifications?.maxMemorySpeed;

  if (ramSpeed && motherboardMaxSpeed && ramSpeed > motherboardMaxSpeed) {
    issues.push(`RAM speed (${ramSpeed} MHz) exceeds motherboard maximum (${motherboardMaxSpeed} MHz)`);
  }

  // Check memory capacity
  const ramCapacity = ram.specifications?.capacity;
  const motherboardMaxCapacity = motherboard.specifications?.maxMemory;

  if (ramCapacity && motherboardMaxCapacity) {
    const maxCapacityGB = parseInt(motherboardMaxCapacity.replace('GB', ''));
    if (ramCapacity > maxCapacityGB) {
      issues.push(`RAM capacity (${ramCapacity}GB) exceeds motherboard maximum (${maxCapacityGB}GB)`);
    }
  }

  return {
    compatible: issues.length === 0,
    issues
  };
}

/**
 * Check power supply requirements
 */
function checkPowerSupplyCompatibility(components, psu) {
  const issues = [];
  let totalPowerDraw = 0;

  // Calculate estimated power consumption
  components.forEach(component => {
    switch (component.category.name) {
      case 'CPU':
        totalPowerDraw += component.specifications?.tdp || 65;
        break;
      case 'GPU':
        totalPowerDraw += component.specifications?.powerConsumption || 
                         component.specifications?.recommendedPSU * 0.7 || 150;
        break;
      case 'Motherboard':
        totalPowerDraw += 50; // Estimated motherboard power
        break;
      case 'RAM':
        totalPowerDraw += 10; // Per module
        break;
      case 'Storage':
        totalPowerDraw += component.specifications?.type === 'SSD' ? 5 : 10;
        break;
      default:
        totalPowerDraw += 10; // Other components
    }
  });

  // Add system overhead (fans, USB devices, etc.)
  totalPowerDraw += 50;

  const recommendedWattage = Math.ceil(totalPowerDraw * 1.2); // 20% headroom
  const psuWattage = psu.specifications?.wattage;

  if (!psuWattage) {
    return { compatible: null, issues: ['PSU wattage information missing'] };
  }

  if (psuWattage < totalPowerDraw) {
    issues.push(`PSU wattage (${psuWattage}W) insufficient for estimated power draw (${totalPowerDraw}W)`);
  } else if (psuWattage < recommendedWattage) {
    issues.push(`PSU wattage (${psuWattage}W) below recommended (${recommendedWattage}W for 20% headroom)`);
  }

  return {
    compatible: issues.length === 0,
    issues,
    totalPowerDraw,
    recommendedWattage
  };
}

/**
 * Comprehensive build compatibility check
 */
function checkBuildCompatibility(components) {
  const results = {
    isCompatible: true,
    errors: [],
    warnings: [],
    recommendations: []
  };

  // Group components by category
  const componentsByCategory = {};
  components.forEach(component => {
    componentsByCategory[component.category.name] = component;
  });

  const cpu = componentsByCategory['CPU'];
  const motherboard = componentsByCategory['Motherboard'];
  const ram = componentsByCategory['RAM'];
  const gpu = componentsByCategory['GPU'];
  const psu = componentsByCategory['PSU'];
  const pcCase = componentsByCategory['Case'];
  const cooler = componentsByCategory['Cooling'];
  const storage = componentsByCategory['Storage'];

  // CPU + Motherboard compatibility
  if (cpu && motherboard) {
    const socketCheck = checkSocketCompatibility(cpu, motherboard);
    if (socketCheck.compatible === false) {
      results.errors.push(socketCheck.message);
      results.isCompatible = false;
    }
  }

  // RAM + Motherboard compatibility
  if (ram && motherboard) {
    const memoryCheck = checkMemoryCompatibility(ram, motherboard);
    if (memoryCheck.compatible === false) {
      results.errors.push(...memoryCheck.issues);
      results.isCompatible = false;
    } else if (memoryCheck.issues.length > 0) {
      results.warnings.push(...memoryCheck.issues);
    }
  }

  // Power supply compatibility
  if (psu) {
    const powerCheck = checkPowerSupplyCompatibility(components, psu);
    if (powerCheck.compatible === false) {
      results.errors.push(...powerCheck.issues);
      results.isCompatible = false;
    } else if (powerCheck.issues.length > 0) {
      results.warnings.push(...powerCheck.issues);
    }
  }

  // Add recommendations for missing components
  if (!storage) {
    results.recommendations.push('Add storage (SSD/HDD) to complete your build');
  }

  if (!pcCase) {
    results.recommendations.push('Select a PC case to house your components');
  }

  if (!psu) {
    results.recommendations.push('Add a power supply unit (PSU) to power your system');
  }

  if (cpu && !cooler) {
    results.recommendations.push('Add a CPU cooler for proper thermal management');
  }

  return results;
}

module.exports = {
  checkSocketCompatibility,
  checkMemoryCompatibility,
  checkPowerSupplyCompatibility,
  checkBuildCompatibility
};
