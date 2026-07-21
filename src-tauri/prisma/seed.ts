import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { DEFAULT_ROLES, DEFAULT_PERMISSIONS, DEFAULT_PAYMENT_METHODS } from '../src/shared/constants/constants';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ============================================
  // PERMISSIONS
  // ============================================
  console.log('Creating permissions...');
  
  const permissions = await Promise.all(
    DEFAULT_PERMISSIONS.map(async (permissionName) => {
      return await prisma.permission.upsert({
        where: { name: permissionName },
        update: {},
        create: {
          name: permissionName,
          description: `Permission for ${permissionName}`,
        },
      });
    })
  );

  console.log(`✅ Created ${permissions.length} permissions`);

  // ============================================
  // ROLES
  // ============================================
  console.log('Creating roles...');

  const adminRole = await prisma.role.upsert({
    where: { name: DEFAULT_ROLES[0].name },
    update: {},
    create: {
      name: DEFAULT_ROLES[0].name,
      description: DEFAULT_ROLES[0].description,
    },
  });

  const employeeRole = await prisma.role.upsert({
    where: { name: DEFAULT_ROLES[1].name },
    update: {},
    create: {
      name: DEFAULT_ROLES[1].name,
      description: DEFAULT_ROLES[1].description,
    },
  });

  // Connect all permissions to admin role
  for (const permission of permissions) {
    try {
      await prisma.rolePermission.create({
        data: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      });
    } catch (error) {
      // Ignore duplicate errors
    }
  }

  // Connect specific permissions to employee role
  const employeePermissions = permissions.filter(p =>
    p.name.startsWith('products.view') ||
    p.name.startsWith('inventory.view') ||
    p.name.startsWith('sales.view') ||
    p.name.startsWith('sales.create') ||
    p.name.startsWith('customers.view') ||
    p.name.startsWith('customers.create') ||
    p.name.startsWith('purchases.view') ||
    p.name.startsWith('purchases.create') ||
    p.name.startsWith('reports.view')
  );

  for (const permission of employeePermissions) {
    try {
      await prisma.rolePermission.create({
        data: {
          roleId: employeeRole.id,
          permissionId: permission.id,
        },
      });
    } catch (error) {
      // Ignore duplicate errors
    }
  }

  const adminRoleWithPermissions = await prisma.role.findUnique({
    where: { id: adminRole.id },
    include: { permissions: true },
  });

  const employeeRoleWithPermissions = await prisma.role.findUnique({
    where: { id: employeeRole.id },
    include: { permissions: true },
  });

  console.log(`✅ Created 2 roles (Admin: ${adminRoleWithPermissions?.permissions.length || 0} permissions, Employee: ${employeeRoleWithPermissions?.permissions.length || 0} permissions)`);

  // ============================================
  // USERS
  // ============================================
  console.log('Creating users...');

  const passwordHash = await bcrypt.hash('admin123', 10);

  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@moto-inventario.com',
      passwordHash,
      name: 'Administrador',
      roleId: adminRole.id,
      active: true,
    },
  });

  console.log(`✅ Created admin user (username: admin, password: admin123)`);

  // ============================================
  // PAYMENT METHODS
  // ============================================
  console.log('Creating payment methods...');

  const paymentMethods = await Promise.all(
    DEFAULT_PAYMENT_METHODS.map(async (name) => {
      return await prisma.paymentMethod.upsert({
        where: { name },
        update: {},
        create: { name },
      });
    })
  );

  console.log(`✅ Created ${paymentMethods.length} payment methods`);

  // ============================================
  // MOVEMENT TYPES
  // ============================================
  console.log('Creating movement types...');

  const movementTypes = [
    { name: 'ENTRADA', description: 'Entrada de mercancía (compra, devolución)', affectsStock: true },
    { name: 'SALIDA', description: 'Salida de mercancía (venta, merma)', affectsStock: true },
    { name: 'AJUSTE', description: 'Ajuste de inventario (conteo físico)', affectsStock: true },
    { name: 'TRANSFERENCIA', description: 'Transferencia entre sucursales', affectsStock: false },
  ];

  const createdMovementTypes = await Promise.all(
    movementTypes.map(async (mt) => {
      return await prisma.movementType.upsert({
        where: { name: mt.name },
        update: {},
        create: mt,
      });
    })
  );

  console.log(`✅ Created ${createdMovementTypes.length} movement types`);

  // ============================================
  // CATEGORIES
  // ============================================
  console.log('Creating categories...');

  const categories = [
    { name: 'Motor', description: 'Partes del motor' },
    { name: 'Transmisión', description: 'Partes de transmisión' },
    { name: 'Frenos', description: 'Sistema de frenos' },
    { name: 'Suspensión', description: 'Partes de suspensión' },
    { name: 'Ruedas y Neumáticos', description: 'Llantas y neumáticos' },
    { name: 'Eléctrico', description: 'Sistema eléctrico' },
    { name: 'Carrocería', description: 'Partes de carrocería' },
    { name: 'Accesorios', description: 'Accesorios y modificaciones' },
    { name: 'Herramientas', description: 'Herramientas y mantenimiento' },
    { name: 'Lubricantes', description: 'Aceites y lubricantes' },
  ];

  const createdCategories = await Promise.all(
    categories.map(async (cat) => {
      return await prisma.category.upsert({
        where: { name: cat.name },
        update: {},
        create: cat,
      });
    })
  );

  console.log(`✅ Created ${createdCategories.length} categories`);

  // ============================================
  // BRANDS
  // ============================================
  console.log('Creating brands...');

  const brands = [
    { name: 'Yamaha', description: 'Yamaha Motor Company', website: 'https://www.yamaha-motor.com' },
    { name: 'Honda', description: 'Honda Motor Co., Ltd.', website: 'https://www.honda.com' },
    { name: 'Suzuki', description: 'Suzuki Motor Corporation', website: 'https://www.suzuki.com' },
    { name: 'Kawasaki', description: 'Kawasaki Heavy Industries', website: 'https://www.kawasaki.com' },
    { name: 'Harley-Davidson', description: 'Harley-Davidson, Inc.', website: 'https://www.harley-davidson.com' },
    { name: 'Ducati', description: 'Ducati Motor Holding S.p.A.', website: 'https://www.ducati.com' },
    { name: 'KTM', description: 'KTM AG', website: 'https://www.ktm.com' },
    { name: 'BMW', description: 'BMW Motorrad', website: 'https://www.bmw-motorrad.com' },
    { name: 'Bajaj', description: 'Bajaj Auto Ltd.', website: 'https://www.bajajauto.com' },
    { name: 'TVS', description: 'TVS Motor Company', website: 'https://www.tvsmotor.com' },
  ];

  const createdBrands = await Promise.all(
    brands.map(async (brand) => {
      return await prisma.brand.upsert({
        where: { name: brand.name },
        update: {},
        create: brand,
      });
    })
  );

  console.log(`✅ Created ${createdBrands.length} brands`);

  // ============================================
  // SUPPLIERS
  // ============================================
  console.log('Creating suppliers...');

  const suppliers = [
    {
      name: 'Refacciones del Norte',
      contactName: 'Juan Pérez',
      email: 'juan.perez@rnorte.com',
      phone: '555-0101',
      address: 'Av. Insurgentes Norte 123, CDMX',
      taxId: 'RNO010101ABC',
    },
    {
      name: 'Motopartes Centroamérica',
      contactName: 'María García',
      email: 'maria.garcia@mcentro.com',
      phone: '555-0202',
      address: 'Calle 5ta Avenida 45, Guatemala',
      taxId: 'MCA020202DEF',
    },
    {
      name: 'Distribuidora MotoSport',
      contactName: 'Carlos Ruiz',
      email: 'carlos@mottosport.com',
      phone: '555-0303',
      address: 'Blvd. Las Américas 789, CDMX',
      taxId: 'DMS030303GHI',
    },
    {
      name: 'Repuestos y Servicios Moto',
      contactName: 'Ana López',
      email: 'ana@rsmoto.com',
      phone: '555-0404',
      address: 'Carrera Nacional 56, Monterrey',
      taxId: 'RSM040404JKL',
    },
    {
      name: 'Importadora de Motocicletas',
      contactName: 'Roberto Sánchez',
      email: 'roberto@importamoto.com',
      phone: '555-0505',
      address: 'Av. Juárez 100, Guadalajara',
      taxId: 'IMM050505MNO',
    },
  ];

  const createdSuppliers = await Promise.all(
    suppliers.map(async (supplier) => {
      return await prisma.supplier.upsert({
        where: { taxId: supplier.taxId },
        update: {},
        create: supplier,
      });
    })
  );

  console.log(`✅ Created ${createdSuppliers.length} suppliers`);

  // ============================================
  // CUSTOMERS
  // ============================================
  console.log('Creating customers...');

  const customers = [
    {
      name: 'Carlos Méndez',
      email: 'carlos.mendez@email.com',
      phone: '555-1001',
      address: 'Av. Revolución 123, CDMX',
      taxId: 'CM010101XYZ',
    },
    {
      name: 'Ana Fernández',
      email: 'ana.fernandez@email.com',
      phone: '555-1002',
      address: 'Calle Hidalgo 45, Guadalajara',
      taxId: 'AF020202XYZ',
    },
    {
      name: 'Luis Rodríguez',
      email: 'luis.rodriguez@email.com',
      phone: '555-1003',
      address: 'Blvd. Juárez 78, Monterrey',
      taxId: 'LR030303XYZ',
    },
    {
      name: 'María Torres',
      email: 'maria.torres@email.com',
      phone: '555-1004',
      address: 'Av. Las Américas 90, Puebla',
      taxId: 'MT040404XYZ',
    },
    {
      name: 'Pedro Gómez',
      email: 'pedro.gomez@email.com',
      phone: '555-1005',
      address: 'Calle 5 de Mayo 12, CDMX',
      taxId: 'PG050505XYZ',
    },
  ];

  const createdCustomers = await Promise.all(
    customers.map(async (customer) => {
      return await prisma.customer.upsert({
        where: { taxId: customer.taxId },
        update: {},
        create: customer,
      });
    })
  );

  console.log(`✅ Created ${createdCustomers.length} customers`);

  // ============================================
  // PRODUCTS
  // ============================================
  console.log('Creating products...');

  // Get reference data for products
  const motorCategory = await prisma.category.findUnique({ where: { name: 'Motor' } });
  const frenosCategory = await prisma.category.findUnique({ where: { name: 'Frenos' } });
  const ruedasCategory = await prisma.category.findUnique({ where: { name: 'Ruedas y Neumáticos' } });
  const electricoCategory = await prisma.category.findUnique({ where: { name: 'Eléctrico' } });
  const lubricantesCategory = await prisma.category.findUnique({ where: { name: 'Lubricantes' } });

  const yamahaBrand = await prisma.brand.findUnique({ where: { name: 'Yamaha' } });
  const hondaBrand = await prisma.brand.findUnique({ where: { name: 'Honda' } });
  const bajajBrand = await prisma.brand.findUnique({ where: { name: 'Bajaj' } });
  const ktmBrand = await prisma.brand.findUnique({ where: { name: 'KTM' } });

  const refaccionesNorte = await prisma.supplier.findUnique({ where: { taxId: 'RNO010101ABC' } });
  const motopartesCentro = await prisma.supplier.findUnique({ where: { taxId: 'MCA020202DEF' } });

  const products = [
    {
      internalCode: 'PROD-001',
      barcode: '7501234567890',
      sku: 'BD-YBR125',
      name: 'Bujía NGK CR7HSA',
      description: 'Bujía para motocicletas Yamaha YBR 125 y similares',
      brandId: yamahaBrand!.id,
      categoryId: motorCategory!.id,
      unit: 'pieza',
      stock: 50,
      minStock: 10,
      purchasePrice: 45.00,
      salePrice: 75.00,
      supplierId: refaccionesNorte!.id,
      observations: 'Compatible con Yamaha YBR125, Honda CGL125',
      compatibilities: [
        { brand: 'Yamaha', model: 'YBR 125', year: '2010-2023', notes: 'Reemplazo directo' },
        { brand: 'Honda', model: 'CGL 125', year: '2015-2023', notes: 'Verificar medida' },
      ],
    },
    {
      internalCode: 'PROD-002',
      barcode: '7501234567891',
      sku: 'PT-WAVE110',
      name: 'Pastillas de Freno Delanteras Honda Wave 110',
      description: 'Pastillas de freno delanteras para motocicleta Honda Wave 110',
      brandId: hondaBrand!.id,
      categoryId: frenosCategory!.id,
      unit: 'juego',
      stock: 30,
      minStock: 8,
      purchasePrice: 120.00,
      salePrice: 195.00,
      supplierId: refaccionesNorte!.id,
      observations: 'Juego completo incluye resortes',
      compatibilities: [
        { brand: 'Honda', model: 'Wave 110', year: '2010-2023', notes: 'Delanteras' },
      ],
    },
    {
      internalCode: 'PROD-003',
      barcode: '7501234567892',
      sku: 'CAD-AX4',
      name: 'Cadena de Transmisión 428H-118',
      description: 'Cadena de transmisión reforzada 428H con 118 eslabones',
      brandId: bajajBrand!.id,
      categoryId: motorCategory!.id,
      unit: 'pieza',
      stock: 20,
      minStock: 5,
      purchasePrice: 180.00,
      salePrice: 290.00,
      supplierId: motopartesCentro!.id,
      observations: 'Incluye seguro de cadena',
      compatibilities: [
        { brand: 'Bajaj', model: 'Boxer 150', year: '2015-2023', notes: 'Uso rudo' },
        { brand: 'Bajaj', model: 'Pulsar 135', year: '2010-2018', notes: 'OEM equivalente' },
      ],
    },
    {
      internalCode: 'PROD-004',
      barcode: '7501234567893',
      sku: 'FIL-ACEITE-10W40',
      name: 'Aceite 4T 10W-40 Semi-Sintético 1L',
      description: 'Aceite para motor 4 tiempos 10W-40 semi-sintético',
      brandId: yamahaBrand!.id,
      categoryId: lubricantesCategory!.id,
      unit: 'litro',
      stock: 100,
      minStock: 25,
      purchasePrice: 85.00,
      salePrice: 140.00,
      supplierId: refaccionesNorte!.id,
      observations: 'Apto para motores 4T de hasta 150cc',
      compatibilities: [
        { brand: 'Yamaha', model: 'FZ 2.0', year: '2018-2023', notes: 'Recomendado' },
        { brand: 'Honda', model: 'CB160F', year: '2020-2023', notes: 'Uso general' },
      ],
    },
    {
      internalCode: 'PROD-005',
      barcode: '7501234567894',
      sku: 'BAT-12V7A',
      name: 'Batería 12V 7Ah YTX7A-BS',
      description: 'Batería sellada 12V 7Ah para motocicleta',
      brandId: ktmBrand!.id,
      categoryId: electricoCategory!.id,
      unit: 'pieza',
      stock: 15,
      minStock: 4,
      purchasePrice: 650.00,
      salePrice: 950.00,
      supplierId: motopartesCentro!.id,
      observations: 'Sin mantenimiento, lista para usar',
      compatibilities: [
        { brand: 'Yamaha', model: 'FZ 2.0', year: '2018-2023', notes: 'OEM' },
        { brand: 'Honda', model: 'CB190R', year: '2015-2023', notes: 'Verificar polaridad' },
      ],
    },
    {
      internalCode: 'PROD-006',
      barcode: '7501234567895',
      sku: 'LLA-90/90-18',
      name: 'Llanta 90/90-18 Tubeless',
      description: 'Llanta delantera/tracera 90/90-18 sin cámara',
      brandId: bajajBrand!.id,
      categoryId: ruedasCategory!.id,
      unit: 'pieza',
      stock: 25,
      minStock: 6,
      purchasePrice: 450.00,
      salePrice: 695.00,
      supplierId: refaccionesNorte!.id,
      observations: 'Uso mixto, 6 capas',
      compatibilities: [
        { brand: 'Bajaj', model: 'Boxer 150', year: '2010-2023', notes: 'Delantera y trasera' },
        { brand: 'Honda', model: 'CGL 125', year: '2015-2023', notes: 'Trasera' },
      ],
    },
  ];

  const createdProducts = [];
  for (const product of products) {
    const { compatibilities, ...productData } = product;
    const createdProduct = await prisma.product.upsert({
      where: { internalCode: productData.internalCode },
      update: {},
      create: productData,
    });

    if (compatibilities && compatibilities.length > 0) {
      for (const compat of compatibilities) {
        await prisma.motorcycleCompatibility.upsert({
          where: {
            id: `${createdProduct.id}-${compat.brand}-${compat.model}`,
          },
          update: {},
          create: {
            productId: createdProduct.id,
            brand: compat.brand,
            model: compat.model,
            year: compat.year,
            notes: compat.notes,
          },
        });
      }
    }

    createdProducts.push(createdProduct);
  }

  console.log(`✅ Created ${createdProducts.length} products`);

  // ============================================
  // PURCHASES
  // ============================================
  console.log('Creating purchases...');

  const compra1 = await prisma.purchase.upsert({
    where: { folio: 'COMPRA-0001' },
    update: {},
    create: {
      folio: 'COMPRA-0001',
      supplier: { connect: { taxId: 'RNO010101ABC' } },
      user: { connect: { id: adminUser.id } },
      observations: 'Compra inicial de inventario - Refacciones Norte',
      subtotal: 1300.00,
      tax: 208.00,
      total: 1508.00,
      items: {
        create: [
          {
            product: { connect: { internalCode: 'PROD-001' } },
            quantity: 50,
            unitCost: 25.00,
            subtotal: 1250.00,
          },
          {
            product: { connect: { internalCode: 'PROD-002' } },
            quantity: 5,
            unitCost: 10.00,
            subtotal: 50.00,
          },
        ],
      },
    },
  });

  const compra2 = await prisma.purchase.upsert({
    where: { folio: 'COMPRA-0002' },
    update: {},
    create: {
      folio: 'COMPRA-0002',
      supplier: { connect: { taxId: 'MCA020202DEF' } },
      user: { connect: { id: adminUser!.id } },
      observations: 'Compra inicial - Motopartes Centro',
      subtotal: 830.00,
      tax: 132.80,
      total: 962.80,
      items: {
        create: [
          {
            product: { connect: { internalCode: 'PROD-003' } },
            quantity: 20,
            unitCost: 9.00,
            subtotal: 180.00,
          },
          {
            product: { connect: { internalCode: 'PROD-005' } },
            quantity: 10,
            unitCost: 65.00,
            subtotal: 650.00,
          },
        ],
      },
    },
  });

  console.log(`✅ Created 2 purchases (${compra1.folio}, ${compra2.folio})`);

  // ============================================
  // SALES
  // ============================================
  console.log('Creating sales...');

  const efectivoMethod = await prisma.paymentMethod.findUnique({ where: { name: 'EFECTIVO' } });
  const tarjetaMethod = await prisma.paymentMethod.findUnique({ where: { name: 'TARJETA_CREDITO' } });
  const clienteCarlos = await prisma.customer.findUnique({ where: { taxId: 'CM010101XYZ' } });

  const venta1 = await prisma.sale.upsert({
    where: { folio: 'VENTA-0001' },
    update: {},
    create: {
      folio: 'VENTA-0001',
      customer: { connect: { id: clienteCarlos!.id } },
      user: { connect: { id: adminUser.id } },
      paymentMethod: { connect: { id: efectivoMethod!.id } },
      observations: 'Venta de repuestos varios',
      subtotal: 350.00,
      discount: 0,
      tax: 56.00,
      total: 406.00,
      items: {
        create: [
          {
            product: { connect: { internalCode: 'PROD-001' } },
            quantity: 2,
            unitPrice: 75.00,
            discount: 0,
            subtotal: 150.00,
          },
          {
            product: { connect: { internalCode: 'PROD-002' } },
            quantity: 1,
            unitPrice: 195.00,
            discount: 0,
            subtotal: 195.00,
          },
        ],
      },
    },
  });

  const venta2 = await prisma.sale.upsert({
    where: { folio: 'VENTA-0002' },
    update: {},
    create: {
      folio: 'VENTA-0002',
      user: { connect: { id: adminUser.id } },
      paymentMethod: { connect: { id: tarjetaMethod!.id } },
      observations: 'Venta mostrador - sin cliente registrado',
      subtotal: 140.00,
      discount: 10.00,
      tax: 20.80,
      total: 150.80,
      items: {
        create: [
          {
            product: { connect: { internalCode: 'PROD-004' } },
            quantity: 1,
            unitPrice: 140.00,
            discount: 10.00,
            subtotal: 130.00,
          },
        ],
      },
    },
  });

  console.log(`✅ Created 2 sales (${venta1.folio}, ${venta2.folio})`);

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
