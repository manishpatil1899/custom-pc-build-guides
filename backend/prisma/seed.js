const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.buildComponent.deleteMany({});
  await prisma.build.deleteMany({});
  await prisma.compatibilityRule.deleteMany({});
  await prisma.component.deleteMany({});
  await prisma.componentCategory.deleteMany({});
  await prisma.buildGuide.deleteMany({});
  await prisma.user.deleteMany({});

  // Create component categories
  console.log('📂 Creating component categories...');
  const categories = await Promise.all([
    prisma.componentCategory.create({
      data: {
        name: 'CPU',
        displayName: 'Processor',
        description: 'Central Processing Unit - the brain of your computer',
        icon: 'cpu',
        sortOrder: 1,
      },
    }),
    prisma.componentCategory.create({
      data: {
        name: 'Motherboard',
        displayName: 'Motherboard',
        description: 'Main circuit board that connects all components',
        icon: 'motherboard',
        sortOrder: 2,
      },
    }),
    prisma.componentCategory.create({
      data: {
        name: 'RAM',
        displayName: 'Memory',
        description: 'Random Access Memory for temporary data storage',
        icon: 'memory',
        sortOrder: 3,
      },
    }),
    prisma.componentCategory.create({
      data: {
        name: 'GPU',
        displayName: 'Graphics Card',
        description: 'Graphics Processing Unit for rendering visuals',
        icon: 'gpu',
        sortOrder: 4,
      },
    }),
    prisma.componentCategory.create({
      data: {
        name: 'Storage',
        displayName: 'Storage',
        description: 'Solid State Drives and Hard Disk Drives',
        icon: 'storage',
        sortOrder: 5,
      },
    }),
    prisma.componentCategory.create({
      data: {
        name: 'PSU',
        displayName: 'Power Supply',
        description: 'Power Supply Unit to power all components',
        icon: 'power',
        sortOrder: 6,
      },
    }),
    prisma.componentCategory.create({
      data: {
        name: 'Case',
        displayName: 'PC Case',
        description: 'Housing for all your PC components',
        icon: 'case',
        sortOrder: 7,
      },
    }),
    prisma.componentCategory.create({
      data: {
        name: 'Cooling',
        displayName: 'Cooling',
        description: 'CPU coolers and case fans',
        icon: 'cooling',
        sortOrder: 8,
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} component categories`);

  // Create comprehensive components for each category
  console.log('💻 Creating comprehensive components...');

  // CPUs - 6 options
  const cpus = await Promise.all([
    prisma.component.create({
      data: {
        name: 'Intel Core i9-13900K',
        model: 'i9-13900K',
        brand: 'Intel',
        description: 'Flagship 13th Gen Intel processor with 24 cores',
        price: 589.99,
        categoryId: categories.find(c => c.name === 'CPU').id,
        specifications: {
          socket: 'LGA1700',
          cores: 24,
          threads: 32,
          baseClock: '3.0 GHz',
          boostClock: '5.8 GHz',
          tdp: '125W',
          architecture: 'Raptor Lake',
        },
      },
    }),
    prisma.component.create({
      data: {
        name: 'Intel Core i5-13600K',
        model: 'i5-13600K',
        brand: 'Intel',
        description: '13th Gen Intel Core processor with 14 cores',
        price: 289.99,
        categoryId: categories.find(c => c.name === 'CPU').id,
        specifications: {
          socket: 'LGA1700',
          cores: 14,
          threads: 20,
          baseClock: '3.5 GHz',
          boostClock: '5.1 GHz',
          tdp: '125W',
          architecture: 'Raptor Lake',
        },
      },
    }),
    prisma.component.create({
      data: {
        name: 'AMD Ryzen 9 7950X',
        model: '7950X',
        brand: 'AMD',
        description: 'High-end AMD Ryzen processor with 16 cores',
        price: 549.99,
        categoryId: categories.find(c => c.name === 'CPU').id,
        specifications: {
          socket: 'AM5',
          cores: 16,
          threads: 32,
          baseClock: '4.5 GHz',
          boostClock: '5.7 GHz',
          tdp: '170W',
          architecture: 'Zen 4',
        },
      },
    }),
    prisma.component.create({
      data: {
        name: 'AMD Ryzen 5 7600X',
        model: '7600X',
        brand: 'AMD',
        description: 'AMD Ryzen 7000 series 6-core processor',
        price: 299.99,
        categoryId: categories.find(c => c.name === 'CPU').id,
        specifications: {
          socket: 'AM5',
          cores: 6,
          threads: 12,
          baseClock: '4.7 GHz',
          boostClock: '5.3 GHz',
          tdp: '105W',
          architecture: 'Zen 4',
        },
      },
    }),
    prisma.component.create({
      data: {
        name: 'Intel Core i3-13100F',
        model: 'i3-13100F',
        brand: 'Intel',
        description: 'Budget-friendly 13th Gen Intel processor',
        price: 109.99,
        categoryId: categories.find(c => c.name === 'CPU').id,
        specifications: {
          socket: 'LGA1700',
          cores: 4,
          threads: 8,
          baseClock: '3.4 GHz',
          boostClock: '4.5 GHz',
          tdp: '58W',
          architecture: 'Raptor Lake',
        },
      },
    }),
    prisma.component.create({
      data: {
        name: 'AMD Ryzen 5 5600X',
        model: '5600X',
        brand: 'AMD',
        description: 'Popular mid-range AMD processor',
        price: 159.99,
        categoryId: categories.find(c => c.name === 'CPU').id,
        specifications: {
          socket: 'AM4',
          cores: 6,
          threads: 12,
          baseClock: '3.7 GHz',
          boostClock: '4.6 GHz',
          tdp: '65W',
          architecture: 'Zen 3',
        },
      },
    }),
  ]);

  // Motherboards - 6 options
  const motherboards = await Promise.all([
    prisma.component.create({
      data: {
        name: 'ASUS ROG STRIX Z790-F',
        model: 'ROG STRIX Z790-F',
        brand: 'ASUS',
        description: 'High-end Z790 motherboard with WiFi 6E',
        price: 389.99,
        categoryId: categories.find(c => c.name === 'Motherboard').id,
        specifications: {
          socket: 'LGA1700',
          chipset: 'Z790',
          formFactor: 'ATX',
          memorySlots: 4,
          maxMemory: '128GB',
          memoryType: 'DDR5',
          pciSlots: 3,
          sataConnectors: 6,
          m2Slots: 4,
          wifi: true,
          bluetooth: true,
        },
      },
    }),
    prisma.component.create({
      data: {
        name: 'MSI B650 TOMAHAWK WIFI',
        model: 'B650 TOMAHAWK WIFI',
        brand: 'MSI',
        description: 'Mid-range B650 motherboard with WiFi 6',
        price: 219.99,
        categoryId: categories.find(c => c.name === 'Motherboard').id,
        specifications: {
          socket: 'AM5',
          chipset: 'B650',
          formFactor: 'ATX',
          memorySlots: 4,
          maxMemory: '128GB',
          memoryType: 'DDR5',
          pciSlots: 2,
          sataConnectors: 4,
          m2Slots: 2,
          wifi: true,
          bluetooth: true,
        },
      },
    }),
    prisma.component.create({
      data: {
        name: 'ASUS TUF Gaming X570-PLUS',
        model: 'TUF Gaming X570-PLUS',
        brand: 'ASUS',
        description: 'Reliable X570 motherboard for AM4 processors',
        price: 179.99,
        categoryId: categories.find(c => c.name === 'Motherboard').id,
        specifications: {
          socket: 'AM4',
          chipset: 'X570',
          formFactor: 'ATX',
          memorySlots: 4,
          maxMemory: '128GB',
          memoryType: 'DDR4',
          pciSlots: 2,
          sataConnectors: 8,
          m2Slots: 2,
          wifi: false,
          bluetooth: false,
        },
      },
    }),
    prisma.component.create({
      data: {
        name: 'Gigabyte B660M DS3H',
        model: 'B660M DS3H',
        brand: 'Gigabyte',
        description: 'Budget-friendly micro-ATX motherboard',
        price: 89.99,
        categoryId: categories.find(c => c.name === 'Motherboard').id,
        specifications: {
          socket: 'LGA1700',
          chipset: 'B660',
          formFactor: 'micro-ATX',
          memorySlots: 2,
          maxMemory: '64GB',
          memoryType: 'DDR4',
          pciSlots: 1,
          sataConnectors: 4,
          m2Slots: 1,
          wifi: false,
          bluetooth: false,
        },
      },
    }),
    prisma.component.create({
      data: {
        name: 'MSI MAG X670E TOMAHAWK WIFI',
        model: 'MAG X670E TOMAHAWK WIFI',
        brand: 'MSI',
        description: 'Premium X670E motherboard with advanced features',
        price: 329.99,
        categoryId: categories.find(c => c.name === 'Motherboard').id,
        specifications: {
          socket: 'AM5',
          chipset: 'X670E',
          formFactor: 'ATX',
          memorySlots: 4,
          maxMemory: '128GB',
          memoryType: 'DDR5',
          pciSlots: 4,
          sataConnectors: 8,
          m2Slots: 4,
          wifi: true,
          bluetooth: true,
        },
      },
    }),
    prisma.component.create({
      data: {
        name: 'ASRock H610M-HVS',
        model: 'H610M-HVS',
        brand: 'ASRock',
        description: 'Entry-level micro-ATX motherboard',
        price: 59.99,
        categoryId: categories.find(c => c.name === 'Motherboard').id,
        specifications: {
          socket: 'LGA1700',
          chipset: 'H610',
          formFactor: 'micro-ATX',
          memorySlots: 2,
          maxMemory: '64GB',
          memoryType: 'DDR4',
          pciSlots: 1,
          sataConnectors: 4,
          m2Slots: 1,
          wifi: false,
          bluetooth: false,
        },
      },
    }),
  ]);

  // RAM - 5 options
  const ramModules = await Promise.all([
    prisma.component.create({
      data: {
        name: 'Corsair Vengeance LPX 32GB (2x16GB) DDR5-5600',
        model: 'CMK32GX5M2B5600C36',
        brand: 'Corsair',
        description: 'High-performance DDR5 memory kit',
        price: 179.99,
        categoryId: categories.find(c => c.name === 'RAM').id,
        specifications: {
          type: 'DDR5',
          speed: 5600,
          capacity: 32,
          modules: 2,
          moduleCapacity: 16,
          latency: '36-38-38-84',
          voltage: '1.25V',
          formFactor: 'DIMM',
        },
      },
    }),
    prisma.component.create({
      data: {
        name: 'G.Skill Trident Z5 RGB 16GB (2x8GB) DDR5-6000',
        model: 'F5-6000J3636F16GX2-TZ5RK',
        brand: 'G.Skill',
        description: 'Premium DDR5 memory with RGB lighting',
        price: 129.99,
        categoryId: categories.find(c => c.name === 'RAM').id,
        specifications: {
          type: 'DDR5',
          speed: 6000,
          capacity: 16,
          modules: 2,
          moduleCapacity: 8,
          latency: '36-36-36-76',
          voltage: '1.30V',
          formFactor: 'DIMM',
        },
      },
    }),
    prisma.component.create({
      data: {
        name: 'Corsair Vengeance LPX 16GB (2x8GB) DDR4-3200',
        model: 'CMK16GX4M2B3200C16',
        brand: 'Corsair',
        description: 'Reliable DDR4 memory for mainstream builds',
        price: 54.99,
        categoryId: categories.find(c => c.name === 'RAM').id,
        specifications: {
          type: 'DDR4',
          speed: 3200,
          capacity: 16,
          modules: 2,
          moduleCapacity: 8,
          latency: '16-18-18-36',
          voltage: '1.35V',
          formFactor: 'DIMM',
        },
      },
    }),
    prisma.component.create({
      data: {
        name: 'Kingston Fury Beast 64GB (2x32GB) DDR5-4800',
        model: 'KF548C38BBK2-64',
        brand: 'Kingston',
        description: 'High-capacity DDR5 memory for workstations',
        price: 289.99,
        categoryId: categories.find(c => c.name === 'RAM').id,
        specifications: {
          type: 'DDR5',
          speed: 4800,
          capacity: 64,
          modules: 2,
          moduleCapacity: 32,
          latency: '38-38-38-80',
          voltage: '1.10V',
          formFactor: 'DIMM',
        },
      },
    }),
    prisma.component.create({
      data: {
        name: 'Crucial Ballistix 32GB (2x16GB) DDR4-3600',
        model: 'BL2K16G36C16U4B',
        brand: 'Crucial',
        description: 'Performance DDR4 memory with excellent compatibility',
        price: 89.99,
        categoryId: categories.find(c => c.name === 'RAM').id,
        specifications: {
          type: 'DDR4',
          speed: 3600,
          capacity: 32,
          modules: 2,
          moduleCapacity: 16,
          latency: '16-18-18-38',
          voltage: '1.35V',
          formFactor: 'DIMM',
        },
      },
    }),
  ]);

  // GPUs - 6 options
  const gpus = await Promise.all([
    prisma.component.create({
      data: {
        name: 'NVIDIA GeForce RTX 4090',
        model: 'RTX 4090',
        brand: 'NVIDIA',
        description: 'Flagship graphics card for 4K gaming',
        price: 1599.99,
        categoryId: categories.find(c => c.name === 'GPU').id,
        specifications: {
          architecture: 'Ada Lovelace',
          vram: 24,
          vramType: 'GDDR6X',
          baseClock: 2230,
          boostClock: 2520,
          memoryBus: 384,
          powerConnectors: '1x 12VHPWR',
          recommendedPSU: 850,
          length: 336,
          height: 137,
          slots: 3,
        },
      },
    }),
    prisma.component.create({
      data: {
        name: 'NVIDIA GeForce RTX 4070 Ti',
        model: 'RTX 4070 Ti',
        brand: 'NVIDIA',
        description: 'High-end graphics card for 1440p gaming',
        price: 799.99,
        categoryId: categories.find(c => c.name === 'GPU').id,
        specifications: {
          architecture: 'Ada Lovelace',
          vram: 12,
          vramType: 'GDDR6X',
          baseClock: 2310,
          boostClock: 2610,
          memoryBus: 192,
          powerConnectors: '1x 12VHPWR',
          recommendedPSU: 700,
          length: 304,
          height: 137,
          slots: 2.5,
        },
      },
    }),
    prisma.component.create({
      data: {
        name: 'AMD Radeon RX 7800 XT',
        model: 'RX 7800 XT',
        brand: 'AMD',
        description: 'High-performance AMD graphics card',
        price: 499.99,
        categoryId: categories.find(c => c.name === 'GPU').id,
        specifications: {
          architecture: 'RDNA 3',
          vram: 16,
          vramType: 'GDDR6',
          baseClock: 1295,
          boostClock: 2430,
          memoryBus: 256,
          powerConnectors: '2x 8-pin',
          recommendedPSU: 700,
          length: 287,
          height: 120,
          slots: 2.5,
        },
      },
    }),
    prisma.component.create({
      data: {
        name: 'NVIDIA GeForce RTX 4060',
        model: 'RTX 4060',
        brand: 'NVIDIA',
        description: 'Mid-range graphics card for 1080p gaming',
        price: 299.99,
        categoryId: categories.find(c => c.name === 'GPU').id,
        specifications: {
          architecture: 'Ada Lovelace',
          vram: 8,
          vramType: 'GDDR6',
          baseClock: 1830,
          boostClock: 2460,
          memoryBus: 128,
          powerConnectors: '1x 8-pin',
          recommendedPSU: 550,
          length: 244,
          height: 112,
          slots: 2,
        },
      },
    }),
    prisma.component.create({
      data: {
        name: 'AMD Radeon RX 6600',
        model: 'RX 6600',
        brand: 'AMD',
        description: 'Budget-friendly 1080p gaming graphics card',
        price: 229.99,
        categoryId: categories.find(c => c.name === 'GPU').id,
        specifications: {
          architecture: 'RDNA 2',
          vram: 8,
          vramType: 'GDDR6',
          baseClock: 1968,
          boostClock: 2491,
          memoryBus: 128,
          powerConnectors: '1x 8-pin',
          recommendedPSU: 500,
          length: 237,
          height: 120,
          slots: 2,
        },
      },
    }),
    prisma.component.create({
      data: {
        name: 'NVIDIA GeForce GTX 1660 Super',
        model: 'GTX 1660 Super',
        brand: 'NVIDIA',
        description: 'Entry-level gaming graphics card',
        price: 179.99,
        categoryId: categories.find(c => c.name === 'GPU').id,
        specifications: {
          architecture: 'Turing',
          vram: 6,
          vramType: 'GDDR6',
          baseClock: 1530,
          boostClock: 1785,
          memoryBus: 192,
          powerConnectors: '1x 8-pin',
          recommendedPSU: 450,
          length: 229,
          height: 113,
          slots: 2,
        },
      },
    }),
  ]);

  // Storage - 6 options
  const storageDevices = await Promise.all([
    prisma.component.create({
      data: {
        name: 'Samsung 980 PRO 2TB NVMe SSD',
        model: 'MZ-V8P2T0B/AM',
        brand: 'Samsung',
        description: 'High-performance PCIe 4.0 NVMe SSD',
        price: 149.99,
        categoryId: categories.find(c => c.name === 'Storage').id,
        specifications: {
          type: 'NVMe SSD',
          interface: 'PCIe 4.0 x4',
          formFactor: 'M.2 2280',
          capacity: 2000,
          readSpeed: 7000,
          writeSpeed: 5100,
          tbw: 1200,
          warranty: 5,
        },
      },
    }),
    prisma.component.create({
      data: {
        name: 'WD Black SN850X 1TB NVMe SSD',
        model: 'WDS100T2X0E',
        brand: 'Western Digital',
        description: 'Gaming-focused PCIe 4.0 NVMe SSD',
        price: 89.99,
        categoryId: categories.find(c => c.name === 'Storage').id,
        specifications: {
          type: 'NVMe SSD',
          interface: 'PCIe 4.0 x4',
          formFactor: 'M.2 2280',
          capacity: 1000,
          readSpeed: 7300,
          writeSpeed: 6600,
          tbw: 600,
          warranty: 5,
        },
      },
    }),
    prisma.component.create({
      data: {
        name: 'Crucial MX4 1TB SATA SSD',
        model: 'CT1000MX4SSD1',
        brand: 'Crucial',
        description: 'Reliable SATA SSD for mainstream use',
        price: 64.99,
        categoryId: categories.find(c => c.name === 'Storage').id,
        specifications: {
          type: 'SATA SSD',
          interface: 'SATA III',
          formFactor: '2.5 inch',
          capacity: 1000,
          readSpeed: 560,
          writeSpeed: 510,
          tbw: 360,
          warranty: 5,
        },
      },
    }),
    prisma.component.create({
      data: {
        name: 'Seagate Barracuda 4TB HDD',
        model: 'ST4000DM004',
        brand: 'Seagate',
        description: 'High-capacity hard drive for bulk storage',
        price: 79.99,
        categoryId: categories.find(c => c.name === 'Storage').id,
        specifications: {
          type: 'HDD',
          interface: 'SATA III',
          formFactor: '3.5 inch',
          capacity: 4000,
          rpm: 5400,
          cache: 256,
          warranty: 2,
        },
      },
    }),
    prisma.component.create({
      data: {
        name: 'Kingston NV2 500GB NVMe SSD',
        model: 'SNV2S/500G',
        brand: 'Kingston',
        description: 'Budget-friendly NVMe SSD',
        price: 29.99,
        categoryId: categories.find(c => c.name === 'Storage').id,
        specifications: {
          type: 'NVMe SSD',
          interface: 'PCIe 3.0 x4',
          formFactor: 'M.2 2280',
          capacity: 500,
          readSpeed: 3500,
          writeSpeed: 2100,
          tbw: 160,
          warranty: 3,
        },
      },
    }),
    prisma.component.create({
      data: {
        name: 'WD Blue 2TB HDD',
        model: 'WD20EZAZ',
        brand: 'Western Digital',
        description: 'Reliable desktop hard drive',
        price: 49.99,
        categoryId: categories.find(c => c.name === 'Storage').id,
        specifications: {
          type: 'HDD',
          interface: 'SATA III',
          formFactor: '3.5 inch',
          capacity: 2000,
          rpm: 5400,
          cache: 256,
          warranty: 2,
        },
      },
    }),
  ]);

  // PSU - 5 options
  const psus = await Promise.all([
    prisma.component.create({
      data: {
        name: 'Corsair RM850x 850W 80+ Gold',
        model: 'CP-9020200-NA',
        brand: 'Corsair',
        description: 'Fully modular 80+ Gold power supply',
        price: 129.99,
        categoryId: categories.find(c => c.name === 'PSU').id,
        specifications: {
          wattage: 850,
          efficiency: '80+ Gold',
          modular: 'Fully Modular',
          formFactor: 'ATX',
          fanSize: 135,
          warranty: 10,
          rails: 'Single Rail',
          pciConnectors: 6,
        },
      },
    }),
    prisma.component.create({
      data: {
        name: 'Seasonic Focus GX-650 650W 80+ Gold',
        model: 'SSR-650FX',
        brand: 'Seasonic',
        description: 'High-quality fully modular power supply',
        price: 109.99,
        categoryId: categories.find(c => c.name === 'PSU').id,
        specifications: {
          wattage: 650,
          efficiency: '80+ Gold',
          modular: 'Fully Modular',
          formFactor: 'ATX',
          fanSize: 120,
          warranty: 10,
          rails: 'Single Rail',
          pciConnectors: 4,
        },
      },
    }),
    prisma.component.create({
      data: {
        name: 'EVGA SuperNOVA 1000 G5 1000W 80+ Gold',
        model: '220-G5-1000-X1',
        brand: 'EVGA',
        description: 'High-wattage power supply for enthusiast builds',
        price: 179.99,
        categoryId: categories.find(c => c.name === 'PSU').id,
        specifications: {
          wattage: 1000,
          efficiency: '80+ Gold',
          modular: 'Fully Modular',
          formFactor: 'ATX',
          fanSize: 135,
          warranty: 10,
          rails: 'Single Rail',
          pciConnectors: 8,
        },
      },
    }),
    prisma.component.create({
      data: {
        name: 'Cooler Master MWE Gold 750W 80+ Gold',
        model: 'MPY-7501-ACAAG-US',
        brand: 'Cooler Master',
        description: 'Semi-modular power supply with good value',
        price: 89.99,
        categoryId: categories.find(c => c.name === 'PSU').id,
        specifications: {
          wattage: 750,
          efficiency: '80+ Gold',
          modular: 'Semi Modular',
          formFactor: 'ATX',
          fanSize: 120,
          warranty: 5,
          rails: 'Single Rail',
          pciConnectors: 4,
        },
      },
    }),
    prisma.component.create({
      data: {
        name: 'be quiet! Pure Power 11 500W 80+ Gold',
        model: 'BN293',
        brand: 'be quiet!',
        description: 'Silent and efficient power supply for mid-range builds',
        price: 69.99,
        categoryId: categories.find(c => c.name === 'PSU').id,
        specifications: {
          wattage: 500,
          efficiency: '80+ Gold',
          modular: 'Non-Modular',
          formFactor: 'ATX',
          fanSize: 120,
          warranty: 3,
          rails: 'Single Rail',
          pciConnectors: 2,
        },
      },
    }),
  ]);

  // Cases - 6 options
  const cases = await Promise.all([
    prisma.component.create({
      data: {
        name: 'Fractal Design Define 7 Compact',
        model: 'FD-C-DEF7C-02',
        brand: 'Fractal Design',
        description: 'Silent and spacious mid-tower case',
        price: 139.99,
        categoryId: categories.find(c => c.name === 'Case').id,
        specifications: {
          formFactor: 'Mid Tower',
          motherboardSupport: ['ATX', 'micro-ATX', 'mini-ITX'],
          maxGpuLength: 315,
          maxCpuCoolerHeight: 169,
          driveBays25: 2,
          driveBays35: 6,
          usbPorts: 4,
          preInstalledFans: 2,
          windowPanel: false,
        },
      },
    }),
    prisma.component.create({
      data: {
        name: 'NZXT H7 Flow RGB',
        model: 'CM-H71FR-01',
        brand: 'NZXT',
        description: 'Modern mid-tower with RGB lighting and excellent airflow',
        price: 179.99,
        categoryId: categories.find(c => c.name === 'Case').id,
        specifications: {
          formFactor: 'Mid Tower',
          motherboardSupport: ['ATX', 'micro-ATX', 'mini-ITX'],
          maxGpuLength: 365,
          maxCpuCoolerHeight: 185,
          driveBays25: 2,
          driveBays35: 2,
          usbPorts: 4,
          preInstalledFans: 3,
          windowPanel: true,
        },
      },
    }),
    prisma.component.create({
      data: {
        name: 'Corsair 4000D Airflow',
        model: 'CC-9011200-WW',
        brand: 'Corsair',
        description: 'Popular mid-tower case with optimized airflow',
        price: 94.99,
        categoryId: categories.find(c => c.name === 'Case').id,
        specifications: {
          formFactor: 'Mid Tower',
          motherboardSupport: ['ATX', 'micro-ATX', 'mini-ITX'],
          maxGpuLength: 360,
          maxCpuCoolerHeight: 170,
          driveBays25: 2,
          driveBays35: 2,
          usbPorts: 4,
          preInstalledFans: 2,
          windowPanel: true,
        },
      },
    }),
    prisma.component.create({
      data: {
        name: 'Lian Li O11 Dynamic EVO',
        model: 'O11D EVO-W',
        brand: 'Lian Li',
        description: 'Premium showcase case with dual-chamber design',
        price: 179.99,
        categoryId: categories.find(c => c.name === 'Case').id,
        specifications: {
          formFactor: 'Mid Tower',
          motherboardSupport: ['ATX', 'micro-ATX', 'mini-ITX'],
          maxGpuLength: 420,
          maxCpuCoolerHeight: 155,
          driveBays25: 4,
          driveBays35: 0,
          usbPorts: 4,
          preInstalledFans: 0,
          windowPanel: true,
        },
      },
    }),
    prisma.component.create({
      data: {
        name: 'Cooler Master MasterBox Q300L',
        model: 'MCB-Q300L-KANN-S00',
        brand: 'Cooler Master',
        description: 'Compact mini-ITX case for small builds',
        price: 44.99,
        categoryId: categories.find(c => c.name === 'Case').id,
        specifications: {
          formFactor: 'Mini-ITX',
          motherboardSupport: ['mini-ITX'],
          maxGpuLength: 360,
          maxCpuCoolerHeight: 159,
          driveBays25: 2,
          driveBays35: 1,
          usbPorts: 2,
          preInstalledFans: 1,
          windowPanel: false,
        },
      },
    }),
    prisma.component.create({
      data: {
        name: 'Phanteks Eclipse P400A Digital RGB',
        model: 'PH-EC400ATG_DBK01',
        brand: 'Phanteks',
        description: 'Feature-rich mid-tower with RGB lighting',
        price: 99.99,
        categoryId: categories.find(c => c.name === 'Case').id,
        specifications: {
          formFactor: 'Mid Tower',
          motherboardSupport: ['ATX', 'micro-ATX', 'mini-ITX'],
          maxGpuLength: 420,
          maxCpuCoolerHeight: 160,
          driveBays25: 2,
          driveBays35: 2,
          usbPorts: 4,
          preInstalledFans: 3,
          windowPanel: true,
        },
      },
    }),
  ]);

  // Cooling - 5 options
  const coolers = await Promise.all([
    prisma.component.create({
      data: {
        name: 'Noctua NH-D15',
        model: 'NH-D15',
        brand: 'Noctua',
        description: 'Premium dual-tower air cooler with excellent performance',
        price: 109.99,
        categoryId: categories.find(c => c.name === 'Cooling').id,
        specifications: {
          type: 'Air Cooler',
          socketSupport: ['LGA1700', 'AM5', 'AM4', 'LGA1151'],
          fanSize: 140,
          fanCount: 2,
          height: 165,
          tdpRating: 250,
          noiseLevel: 24.6,
          pwm: true,
        },
      },
    }),
    prisma.component.create({
      data: {
        name: 'Corsair iCUE H150i Elite Capellix',
        model: 'CW-9060048-WW',
        brand: 'Corsair',
        description: '360mm AIO liquid cooler with RGB lighting',
        price: 189.99,
        categoryId: categories.find(c => c.name === 'Cooling').id,
        specifications: {
          type: 'AIO Liquid Cooler',
          socketSupport: ['LGA1700', 'AM5', 'AM4', 'LGA1151'],
          radiatorSize: 360,
          fanSize: 120,
          fanCount: 3,
          pumpSpeed: 2400,
          tdpRating: 300,
          noiseLevel: 25,
          rgb: true,
        },
      },
    }),
    prisma.component.create({
      data: {
        name: 'be quiet! Dark Rock 4',
        model: 'BK021',
        brand: 'be quiet!',
        description: 'Silent tower cooler with sleek black design',
        price: 74.99,
        categoryId: categories.find(c => c.name === 'Cooling').id,
        specifications: {
          type: 'Air Cooler',
          socketSupport: ['LGA1700', 'AM5', 'AM4', 'LGA1151'],
          fanSize: 135,
          fanCount: 1,
          height: 159,
          tdpRating: 200,
          noiseLevel: 21.4,
          pwm: true,
        },
      },
    }),
    prisma.component.create({
      data: {
        name: 'Arctic Liquid Freezer II 280',
        model: 'ACFRE00066A',
        brand: 'Arctic',
        description: 'High-performance 280mm AIO with excellent value',
        price: 79.99,
        categoryId: categories.find(c => c.name === 'Cooling').id,
        specifications: {
          type: 'AIO Liquid Cooler',
          socketSupport: ['LGA1700', 'AM5', 'AM4', 'LGA1151'],
          radiatorSize: 280,
          fanSize: 140,
          fanCount: 2,
          pumpSpeed: 2000,
          tdpRating: 300,
          noiseLevel: 22.5,
          rgb: false,
        },
      },
    }),
    prisma.component.create({
      data: {
        name: 'Cooler Master Hyper 212 Black Edition',
        model: 'RR-212S-20PK-R1',
        brand: 'Cooler Master',
        description: 'Budget-friendly tower cooler with solid performance',
        price: 39.99,
        categoryId: categories.find(c => c.name === 'Cooling').id,
        specifications: {
          type: 'Air Cooler',
          socketSupport: ['LGA1700', 'AM5', 'AM4', 'LGA1151'],
          fanSize: 120,
          fanCount: 1,
          height: 159,
          tdpRating: 180,
          noiseLevel: 26,
          pwm: true,
        },
      },
    }),
  ]);

  // Create sample user
  console.log('👤 Creating sample users...');
  const hashedPassword = await bcrypt.hash('password123', 12);
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'demo@example.com',
        username: 'demo_user',
        password: hashedPassword,
        firstName: 'Demo',
        lastName: 'User',
      },
    }),
  ]);

  // Create sample build
  console.log('🔧 Creating sample builds...');
  const sampleBuild = await prisma.build.create({
    data: {
      name: 'High-End Gaming Build',
      description: 'Perfect for 1440p gaming and content creation',
      useCase: 'Gaming',
      isPublic: true,
      totalPrice: 2000.00,
      userId: users[0].id,
    },
  });

  // Add components to build
  await prisma.buildComponent.createMany({
    data: [
      {
        buildId: sampleBuild.id,
        componentId: cpus[1].id, // Intel i5-13600K
        quantity: 1,
      },
      {
        buildId: sampleBuild.id,
        componentId: motherboards[0].id, // ASUS ROG STRIX Z790-F
        quantity: 1,
      },
      {
        buildId: sampleBuild.id,
        componentId: ramModules[0].id, // 32GB DDR5-5600
        quantity: 1,
      },
      {
        buildId: sampleBuild.id,
        componentId: gpus[1].id, // RTX 4070 Ti
        quantity: 1,
      },
      {
        buildId: sampleBuild.id,
        componentId: storageDevices[0].id, // Samsung 980 PRO 2TB
        quantity: 1,
      },
      {
        buildId: sampleBuild.id,
        componentId: psus[0].id, // Corsair RM850x
        quantity: 1,
      },
      {
        buildId: sampleBuild.id,
        componentId: cases[2].id, // Corsair 4000D Airflow
        quantity: 1,
      },
      {
        buildId: sampleBuild.id,
        componentId: coolers[0].id, // Noctua NH-D15
        quantity: 1,
      },
    ],
  });

  // Create build guides
  console.log('📖 Creating build guides...');
  await prisma.buildGuide.createMany({
    data: [
      {
        title: 'First-Time Builder Guide',
        description: 'Complete step-by-step guide for building your first PC',
        content: '# First-Time Builder Guide\n\nWelcome to PC building! This guide will walk you through...',
        difficulty: 'Beginner',
        useCase: 'General',
        isPublished: true,
        views: 1250,
      },
      {
        title: 'Gaming PC Build Guide',
        description: 'How to build the ultimate gaming machine',
        content: '# Gaming PC Build Guide\n\nBuilding a gaming PC requires careful consideration...',
        difficulty: 'Intermediate',
        useCase: 'Gaming',
        isPublished: true,
        views: 2100,
      },
      {
        title: 'Workstation Build Guide',
        description: 'Professional workstation for content creators',
        content: '# Workstation Build Guide\n\nContent creation demands powerful hardware...',
        difficulty: 'Advanced',
        useCase: 'Workstation',
        isPublished: true,
        views: 890,
      },
    ],
  });

  console.log('✅ Database seeding completed successfully!');
  console.log('📊 Summary:');
  console.log(` - ${categories.length} component categories`);
  console.log(` - ${cpus.length} CPUs`);
  console.log(` - ${motherboards.length} motherboards`);
  console.log(` - ${ramModules.length} RAM modules`);
  console.log(` - ${gpus.length} GPUs`);
  console.log(` - ${storageDevices.length} storage devices`);
  console.log(` - ${psus.length} power supplies`);
  console.log(` - ${cases.length} PC cases`);
  console.log(` - ${coolers.length} cooling solutions`);
  console.log(` - ${users.length} users`);
  console.log(` - 1 sample build`);
  console.log(` - 3 build guides`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
