// db/schema.js
import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  price: real('price').notNull(),
  category: text('category').notNull(), // men, women, kids
  subcategory: text('subcategory').notNull(), // sarees, churidars, lehengas, etc
  fabric: text('fabric').notNull(),
  sizes: text('sizes', { mode: 'json' }).notNull(), // array of sizes
  colors: text('colors', { mode: 'json' }).notNull(), // array of colors
  images: text('images', { mode: 'json' }).notNull(), // array of image URLs
  stockQuantity: integer('stock_quantity').notNull().default(0),
  featured: integer('featured', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const reviews = sqliteTable('reviews', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productId: integer('product_id').references(() => products.id).notNull(),
  reviewerName: text('reviewer_name').notNull(),
  rating: integer('rating').notNull(), // 1-5
  comment: text('comment'),
  helpfulCount: integer('helpful_count').default(0),
  createdAt: text('created_at').notNull(),
});
