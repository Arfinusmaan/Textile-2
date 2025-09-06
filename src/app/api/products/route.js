import { NextRequest, NextResponse } from 'next/server';
import { db } from './db';
import { products } from './db/schema';
import { eq, like, and, or, desc, asc, gte, lte } from 'drizzle-orm';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single product by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const product = await db.select()
        .from(products)
        .where(eq(products.id, parseInt(id)))
        .limit(1);

      if (product.length === 0) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      return NextResponse.json(product[0]);
    }

    // List products with filtering and pagination
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    let query = db.select().from(products);
    const conditions = [];

    // Search condition
    if (search) {
      conditions.push(or(
        like(products.name, `%${search}%`),
        like(products.category, `%${search}%`),
        like(products.subcategory, `%${search}%`),
        like(products.fabric, `%${search}%`)
      ));
    }

    // Category filter
    if (category) {
      conditions.push(eq(products.category, category));
    }

    // Subcategory filter
    if (subcategory) {
      conditions.push(eq(products.subcategory, subcategory));
    }

    // Price range filters
    if (minPrice && !isNaN(parseFloat(minPrice))) {
      conditions.push(gte(products.price, parseFloat(minPrice)));
    }

    if (maxPrice && !isNaN(parseFloat(maxPrice))) {
      conditions.push(lte(products.price, parseFloat(maxPrice)));
    }

    // Apply conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const orderBy = order === 'asc' ? asc : desc;
    if (sort === 'name') {
      query = query.orderBy(orderBy(products.name));
    } else if (sort === 'price') {
      query = query.orderBy(orderBy(products.price));
    } else if (sort === 'category') {
      query = query.orderBy(orderBy(products.category));
    } else {
      query = query.orderBy(orderBy(products.createdAt));
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results);

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const requestBody = await request.json();
    const { 
      name, 
      description, 
      price, 
      category, 
      subcategory, 
      fabric, 
      sizes, 
      colors, 
      images, 
      stockQuantity = 0, 
      featured = false 
    } = requestBody;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 3) {
      return NextResponse.json({ 
        error: "Name is required and must be at least 3 characters",
        code: "INVALID_NAME" 
      }, { status: 400 });
    }

    if (!price || typeof price !== 'number' || price <= 0) {
      return NextResponse.json({ 
        error: "Price is required and must be a positive number",
        code: "INVALID_PRICE" 
      }, { status: 400 });
    }

    const validCategories = ['men', 'women', 'kids'];
    if (!category || !validCategories.includes(category)) {
      return NextResponse.json({ 
        error: "Category is required and must be one of: men, women, kids",
        code: "INVALID_CATEGORY" 
      }, { status: 400 });
    }

    if (!subcategory || typeof subcategory !== 'string' || subcategory.trim().length === 0) {
      return NextResponse.json({ 
        error: "Subcategory is required and cannot be empty",
        code: "INVALID_SUBCATEGORY" 
      }, { status: 400 });
    }

    if (!fabric || typeof fabric !== 'string' || fabric.trim().length === 0) {
      return NextResponse.json({ 
        error: "Fabric is required and cannot be empty",
        code: "INVALID_FABRIC" 
      }, { status: 400 });
    }

    if (!Array.isArray(sizes) || sizes.length === 0) {
      return NextResponse.json({ 
        error: "Sizes must be an array with at least 1 item",
        code: "INVALID_SIZES" 
      }, { status: 400 });
    }

    if (!Array.isArray(colors) || colors.length === 0) {
      return NextResponse.json({ 
        error: "Colors must be an array with at least 1 item",
        code: "INVALID_COLORS" 
      }, { status: 400 });
    }

    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ 
        error: "Images must be an array with at least 1 item",
        code: "INVALID_IMAGES" 
      }, { status: 400 });
    }

    if (typeof stockQuantity !== 'number' || stockQuantity < 0 || !Number.isInteger(stockQuantity)) {
      return NextResponse.json({ 
        error: "Stock quantity must be a non-negative integer",
        code: "INVALID_STOCK_QUANTITY" 
      }, { status: 400 });
    }

    if (typeof featured !== 'boolean') {
      return NextResponse.json({ 
        error: "Featured must be a boolean",
        code: "INVALID_FEATURED" 
      }, { status: 400 });
    }

    // Create product
    const now = new Date().toISOString();
    const newProduct = await db.insert(products)
      .values({
        name: name.trim(),
        description: description?.trim() || null,
        price,
        category,
        subcategory: subcategory.trim(),
        fabric: fabric.trim(),
        sizes,
        colors,
        images,
        stockQuantity,
        featured,
        createdAt: now,
        updatedAt: now
      })
      .returning();

    return NextResponse.json(newProduct[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if product exists
    const existingProduct = await db.select()
      .from(products)
      .where(eq(products.id, parseInt(id)))
      .limit(1);

    if (existingProduct.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const requestBody = await request.json();
    const updates = {};

    // Validate and prepare updates
    if (requestBody.name !== undefined) {
      if (typeof requestBody.name !== 'string' || requestBody.name.trim().length < 3) {
        return NextResponse.json({ 
          error: "Name must be at least 3 characters",
          code: "INVALID_NAME" 
        }, { status: 400 });
      }
      updates.name = requestBody.name.trim();
    }

    if (requestBody.description !== undefined) {
      updates.description = requestBody.description?.trim() || null;
    }

    if (requestBody.price !== undefined) {
      if (typeof requestBody.price !== 'number' || requestBody.price <= 0) {
        return NextResponse.json({ 
          error: "Price must be a positive number",
          code: "INVALID_PRICE" 
        }, { status: 400 });
      }
      updates.price = requestBody.price;
    }

    if (requestBody.category !== undefined) {
      const validCategories = ['men', 'women', 'kids'];
      if (!validCategories.includes(requestBody.category)) {
        return NextResponse.json({ 
          error: "Category must be one of: men, women, kids",
          code: "INVALID_CATEGORY" 
        }, { status: 400 });
      }
      updates.category = requestBody.category;
    }

    if (requestBody.subcategory !== undefined) {
      if (typeof requestBody.subcategory !== 'string' || requestBody.subcategory.trim().length === 0) {
        return NextResponse.json({ 
          error: "Subcategory cannot be empty",
          code: "INVALID_SUBCATEGORY" 
        }, { status: 400 });
      }
      updates.subcategory = requestBody.subcategory.trim();
    }

    if (requestBody.fabric !== undefined) {
      if (typeof requestBody.fabric !== 'string' || requestBody.fabric.trim().length === 0) {
        return NextResponse.json({ 
          error: "Fabric cannot be empty",
          code: "INVALID_FABRIC" 
        }, { status: 400 });
      }
      updates.fabric = requestBody.fabric.trim();
    }

    if (requestBody.sizes !== undefined) {
      if (!Array.isArray(requestBody.sizes) || requestBody.sizes.length === 0) {
        return NextResponse.json({ 
          error: "Sizes must be an array with at least 1 item",
          code: "INVALID_SIZES" 
        }, { status: 400 });
      }
      updates.sizes = requestBody.sizes;
    }

    if (requestBody.colors !== undefined) {
      if (!Array.isArray(requestBody.colors) || requestBody.colors.length === 0) {
        return NextResponse.json({ 
          error: "Colors must be an array with at least 1 item",
          code: "INVALID_COLORS" 
        }, { status: 400 });
      }
      updates.colors = requestBody.colors;
    }

    if (requestBody.images !== undefined) {
      if (!Array.isArray(requestBody.images) || requestBody.images.length === 0) {
        return NextResponse.json({ 
          error: "Images must be an array with at least 1 item",
          code: "INVALID_IMAGES" 
        }, { status: 400 });
      }
      updates.images = requestBody.images;
    }

    if (requestBody.stockQuantity !== undefined) {
      if (typeof requestBody.stockQuantity !== 'number' || requestBody.stockQuantity < 0 || !Number.isInteger(requestBody.stockQuantity)) {
        return NextResponse.json({ 
          error: "Stock quantity must be a non-negative integer",
          code: "INVALID_STOCK_QUANTITY" 
        }, { status: 400 });
      }
      updates.stockQuantity = requestBody.stockQuantity;
    }

    if (requestBody.featured !== undefined) {
      if (typeof requestBody.featured !== 'boolean') {
        return NextResponse.json({ 
          error: "Featured must be a boolean",
          code: "INVALID_FEATURED" 
        }, { status: 400 });
      }
      updates.featured = requestBody.featured;
    }

    // Always update timestamp
    updates.updatedAt = new Date().toISOString();

    const updatedProduct = await db.update(products)
      .set(updates)
      .where(eq(products.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedProduct[0]);

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if product exists
    const existingProduct = await db.select()
      .from(products)
      .where(eq(products.id, parseInt(id)))
      .limit(1);

    if (existingProduct.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const deletedProduct = await db.delete(products)
      .where(eq(products.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Product deleted successfully',
      product: deletedProduct[0]
    });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}