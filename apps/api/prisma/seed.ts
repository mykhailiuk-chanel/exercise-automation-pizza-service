import { PrismaClient, ToppingCategory } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

// Matches AuthService's BCRYPT_ROUNDS (apps/api/src/auth/auth.service.ts) so
// this hash is interchangeable with one produced by a real registration.
const BCRYPT_ROUNDS = 10;
const DEMO_ADMIN_EMAIL = 'admin@pizzapalace.test';
const DEMO_ADMIN_PASSWORD = 'Admin123!';
const DEMO_CUSTOMER_EMAIL = 'customer@pizzapalace.test';
const DEMO_CUSTOMER_PASSWORD = 'Customer123!';

export async function seedDemoUsers(prisma: PrismaClient): Promise<void> {
  const adminPasswordHash = await bcrypt.hash(DEMO_ADMIN_PASSWORD, BCRYPT_ROUNDS);
  await prisma.user.upsert({
    where: { email: DEMO_ADMIN_EMAIL },
    update: { role: 'ADMIN', passwordHash: adminPasswordHash },
    create: {
      email: DEMO_ADMIN_EMAIL,
      passwordHash: adminPasswordHash,
      firstName: 'Demo',
      lastName: 'Admin',
      role: 'ADMIN',
    },
  });

  const customerPasswordHash = await bcrypt.hash(
    DEMO_CUSTOMER_PASSWORD,
    BCRYPT_ROUNDS,
  );
  await prisma.user.upsert({
    where: { email: DEMO_CUSTOMER_EMAIL },
    update: { role: 'CUSTOMER', passwordHash: customerPasswordHash },
    create: {
      email: DEMO_CUSTOMER_EMAIL,
      passwordHash: customerPasswordHash,
      firstName: 'Demo',
      lastName: 'Customer',
      role: 'CUSTOMER',
    },
  });

  console.log(`Demo admin account: ${DEMO_ADMIN_EMAIL} / ${DEMO_ADMIN_PASSWORD}`);
  console.log(
    `Demo customer account: ${DEMO_CUSTOMER_EMAIL} / ${DEMO_CUSTOMER_PASSWORD}`,
  );
}

export async function seedDatabase(prisma: PrismaClient): Promise<void> {
  await prisma.cartItem.deleteMany();
  await prisma.productToppingDefault.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.size.deleteMany();
  await prisma.crust.deleteMany();
  await prisma.topping.deleteMany();

  const categories = await Promise.all(
    [
      { name: 'Classic', slug: 'classic', sortOrder: 0 },
      { name: 'Specialty', slug: 'specialty', sortOrder: 1 },
      { name: 'Vegan', slug: 'vegan', sortOrder: 2 },
      { name: 'Sides', slug: 'sides', sortOrder: 3 },
      { name: 'Drinks', slug: 'drinks', sortOrder: 4 },
    ].map((c) => prisma.category.create({ data: c })),
  );
  const categoryBySlug = Object.fromEntries(
    categories.map((c) => [c.slug, c]),
  );

  await Promise.all(
    [
      { name: 'Small (10")', priceModifierCents: 0, sortOrder: 0 },
      { name: 'Medium (12")', priceModifierCents: 300, sortOrder: 1 },
      { name: 'Large (14")', priceModifierCents: 600, sortOrder: 2 },
      { name: 'XL (16")', priceModifierCents: 900, sortOrder: 3 },
    ].map((s) => prisma.size.create({ data: s })),
  );

  await Promise.all(
    [
      { name: 'Thin Crust', priceModifierCents: 0, sortOrder: 0 },
      { name: 'Regular Crust', priceModifierCents: 0, sortOrder: 1 },
      { name: 'Stuffed Crust', priceModifierCents: 250, sortOrder: 2 },
      { name: 'Gluten-Free Crust', priceModifierCents: 350, sortOrder: 3 },
    ].map((c) => prisma.crust.create({ data: c })),
  );

  const toppingSeeds: {
    name: string;
    category: ToppingCategory;
    priceModifierCents: number;
  }[] = [
    { name: 'Pepperoni', category: 'MEAT', priceModifierCents: 150 },
    { name: 'Italian Sausage', category: 'MEAT', priceModifierCents: 150 },
    { name: 'Bacon', category: 'MEAT', priceModifierCents: 175 },
    { name: 'Ham', category: 'MEAT', priceModifierCents: 150 },
    { name: 'Grilled Chicken', category: 'MEAT', priceModifierCents: 175 },
    { name: 'Mushrooms', category: 'VEGGIE', priceModifierCents: 100 },
    { name: 'Bell Peppers', category: 'VEGGIE', priceModifierCents: 100 },
    { name: 'Red Onions', category: 'VEGGIE', priceModifierCents: 75 },
    { name: 'Black Olives', category: 'VEGGIE', priceModifierCents: 100 },
    { name: 'Jalapenos', category: 'VEGGIE', priceModifierCents: 75 },
    { name: 'Fresh Basil', category: 'VEGGIE', priceModifierCents: 100 },
    { name: 'Spinach', category: 'VEGGIE', priceModifierCents: 100 },
    { name: 'Cherry Tomatoes', category: 'VEGGIE', priceModifierCents: 100 },
    { name: 'Pineapple', category: 'VEGGIE', priceModifierCents: 100 },
    { name: 'Extra Mozzarella', category: 'CHEESE', priceModifierCents: 150 },
    { name: 'Vegan Cheese', category: 'CHEESE', priceModifierCents: 175 },
    { name: 'Parmesan', category: 'CHEESE', priceModifierCents: 125 },
    { name: 'Tomato Sauce', category: 'SAUCE', priceModifierCents: 0 },
    { name: 'BBQ Sauce', category: 'SAUCE', priceModifierCents: 75 },
    { name: 'Pesto', category: 'SAUCE', priceModifierCents: 100 },
    { name: 'White Garlic Sauce', category: 'SAUCE', priceModifierCents: 75 },
  ];
  const toppings = await Promise.all(
    toppingSeeds.map((t) => prisma.topping.create({ data: t })),
  );
  const toppingByName = Object.fromEntries(toppings.map((t) => [t.name, t]));

  const products: {
    slug: string;
    name: string;
    description: string;
    basePriceCents: number;
    categorySlug: string;
    imageUrl: string;
    isBuildYourOwnBase?: boolean;
    defaultToppingNames?: string[];
  }[] = [
    {
      slug: 'margherita-classic',
      name: 'Margherita Classic',
      description:
        'Tomato sauce, fresh mozzarella, basil, and a drizzle of olive oil.',
      basePriceCents: 1099,
      categorySlug: 'classic',
      imageUrl: '/images/pizzas/margherita-classic.jpg',
      defaultToppingNames: ['Tomato Sauce', 'Fresh Basil'],
    },
    {
      slug: 'pepperoni-classic',
      name: 'Pepperoni Classic',
      description: 'Tomato sauce, mozzarella, and a generous layer of pepperoni.',
      basePriceCents: 1199,
      categorySlug: 'classic',
      imageUrl: '/images/pizzas/pepperoni-classic.jpg',
      defaultToppingNames: ['Tomato Sauce', 'Pepperoni'],
    },
    {
      slug: 'four-cheese',
      name: 'Four Cheese',
      description: 'Mozzarella, parmesan, and a rich blend of Italian cheeses.',
      basePriceCents: 1249,
      categorySlug: 'classic',
      imageUrl: '/images/pizzas/four-cheese.jpg',
      defaultToppingNames: ['Tomato Sauce', 'Extra Mozzarella', 'Parmesan'],
    },
    {
      slug: 'hawaiian',
      name: 'Hawaiian',
      description: 'Tomato sauce, mozzarella, ham, and pineapple.',
      basePriceCents: 1249,
      categorySlug: 'classic',
      imageUrl: '/images/pizzas/hawaiian.jpg',
      defaultToppingNames: ['Tomato Sauce', 'Ham', 'Pineapple'],
    },
    {
      slug: 'meat-lovers',
      name: "Meat Lover's",
      description: 'Pepperoni, Italian sausage, bacon, and ham piled high.',
      basePriceCents: 1499,
      categorySlug: 'specialty',
      imageUrl: '/images/pizzas/meat-lovers.jpg',
      defaultToppingNames: ['Tomato Sauce', 'Pepperoni', 'Italian Sausage', 'Bacon', 'Ham'],
    },
    {
      slug: 'bbq-chicken',
      name: 'BBQ Chicken',
      description: 'BBQ sauce, grilled chicken, red onions, and mozzarella.',
      basePriceCents: 1399,
      categorySlug: 'specialty',
      imageUrl: '/images/pizzas/bbq-chicken.jpg',
      defaultToppingNames: ['BBQ Sauce', 'Grilled Chicken', 'Red Onions'],
    },
    {
      slug: 'supreme',
      name: 'Supreme',
      description:
        'Pepperoni, sausage, bell peppers, red onions, mushrooms, and black olives.',
      basePriceCents: 1499,
      categorySlug: 'specialty',
      imageUrl: '/images/pizzas/supreme.jpg',
      defaultToppingNames: [
        'Tomato Sauce',
        'Pepperoni',
        'Italian Sausage',
        'Bell Peppers',
        'Red Onions',
        'Mushrooms',
        'Black Olives',
      ],
    },
    {
      slug: 'pesto-caprese',
      name: 'Pesto Caprese',
      description: 'Pesto base, cherry tomatoes, mozzarella, and fresh basil.',
      basePriceCents: 1349,
      categorySlug: 'specialty',
      imageUrl: '/images/pizzas/pesto-caprese.jpg',
      defaultToppingNames: ['Pesto', 'Cherry Tomatoes', 'Fresh Basil'],
    },
    {
      slug: 'garden-veggie-vegan',
      name: 'Garden Veggie (Vegan)',
      description:
        'Vegan cheese, bell peppers, red onions, mushrooms, and spinach.',
      basePriceCents: 1299,
      categorySlug: 'vegan',
      imageUrl: '/images/pizzas/garden-veggie-vegan.jpg',
      defaultToppingNames: [
        'Tomato Sauce',
        'Vegan Cheese',
        'Bell Peppers',
        'Red Onions',
        'Mushrooms',
        'Spinach',
      ],
    },
    {
      slug: 'vegan-margherita',
      name: 'Vegan Margherita',
      description: 'Tomato sauce, vegan cheese, cherry tomatoes, and basil.',
      basePriceCents: 1199,
      categorySlug: 'vegan',
      imageUrl: '/images/pizzas/vegan-margherita.jpg',
      defaultToppingNames: ['Tomato Sauce', 'Vegan Cheese', 'Cherry Tomatoes', 'Fresh Basil'],
    },
    {
      slug: 'build-your-own',
      name: 'Build Your Own',
      description: 'Start from a plain base and add exactly what you want.',
      basePriceCents: 899,
      categorySlug: 'classic',
      imageUrl: '/images/pizzas/build-your-own.jpg',
      isBuildYourOwnBase: true,
      defaultToppingNames: ['Tomato Sauce'],
    },
    {
      slug: 'garlic-breadsticks',
      name: 'Garlic Breadsticks',
      description: 'Baked fresh with garlic butter and a side of marinara.',
      basePriceCents: 599,
      categorySlug: 'sides',
      imageUrl: '/images/sides/garlic-breadsticks.jpg',
    },
    {
      slug: 'caesar-salad',
      name: 'Caesar Salad',
      description: 'Crisp romaine, parmesan, croutons, and Caesar dressing.',
      basePriceCents: 699,
      categorySlug: 'sides',
      imageUrl: '/images/sides/caesar-salad.jpg',
    },
    {
      slug: 'mozzarella-sticks',
      name: 'Mozzarella Sticks',
      description: 'Golden-fried mozzarella sticks with marinara sauce.',
      basePriceCents: 649,
      categorySlug: 'sides',
      imageUrl: '/images/sides/mozzarella-sticks.jpg',
    },
    {
      slug: 'cola',
      name: 'Cola (500ml)',
      description: 'Classic ice-cold cola.',
      basePriceCents: 299,
      categorySlug: 'drinks',
      imageUrl: '/images/drinks/cola.jpg',
    },
    {
      slug: 'sparkling-water',
      name: 'Sparkling Water (500ml)',
      description: 'Refreshing sparkling water.',
      basePriceCents: 249,
      categorySlug: 'drinks',
      imageUrl: '/images/drinks/sparkling-water.jpg',
    },
  ];

  for (const p of products) {
    const { categorySlug, defaultToppingNames, ...data } = p;
    await prisma.product.create({
      data: {
        ...data,
        categoryId: categoryBySlug[categorySlug].id,
        defaultToppings: defaultToppingNames
          ? {
              create: defaultToppingNames.map((name) => ({
                toppingId: toppingByName[name].id,
              })),
            }
          : undefined,
      },
    });
  }

  await prisma.coupon.deleteMany();
  const coupons = await Promise.all(
    [
      {
        code: 'WELCOME10',
        type: 'PERCENT' as const,
        value: 10,
        minOrderAmountCents: 0,
        maxUses: null,
        active: true,
      },
      {
        code: 'SAVE5',
        type: 'FIXED' as const,
        value: 500,
        minOrderAmountCents: 2000,
        maxUses: null,
        active: true,
      },
      {
        code: 'EXPIRED10',
        type: 'PERCENT' as const,
        value: 10,
        minOrderAmountCents: 0,
        maxUses: null,
        active: true,
        expiresAt: new Date('2020-01-01'),
      },
      {
        code: 'MAXEDOUT',
        type: 'FIXED' as const,
        value: 500,
        minOrderAmountCents: 0,
        maxUses: 1,
        usesCount: 1,
        active: true,
      },
    ].map((c) => prisma.coupon.create({ data: c })),
  );

  await seedDemoUsers(prisma);

  console.log(
    `Seeded ${categories.length} categories, ${toppings.length} toppings, ${products.length} products, and ${coupons.length} coupons.`,
  );
}

async function main() {
  const prisma = new PrismaClient();
  try {
    await seedDatabase(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
