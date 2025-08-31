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

  // Create sample components
  console.log('💻 Creating sample components...');

  // CPUs
  const cpus = await Promise.all([
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
  ]);

  // Motherboards
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
  ]);

  // RAM
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
  ]);

  // GPUs
  const gpus = await Promise.all([
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
        componentId: cpus[0].id,
        quantity: 1,
      },
      {
        buildId: sampleBuild.id,
        componentId: motherboards[0].id,
        quantity: 1,
      },
      {
        buildId: sampleBuild.id,
        componentId: ramModules[0].id,
        quantity: 1,
      },
      {
        buildId: sampleBuild.id,
        componentId: gpus[0].id,
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
  console.log(`   - ${categories.length} component categories`);
  console.log(`   - ${cpus.length + motherboards.length + ramModules.length + gpus.length} components`);
  console.log(`   - ${users.length} users`);
  console.log(`   - 1 sample build`);
  console.log(`   - 3 build guides`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
