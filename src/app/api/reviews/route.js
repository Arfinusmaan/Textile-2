import { NextRequest, NextResponse } from 'next/server';
import { db } from './db';
import { reviews, products } from './db/schema';
import { eq, like, and, or, desc, asc, gte, lte } from 'drizzle-orm';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // Single review by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const review = await db.select({
        id: reviews.id,
        productId: reviews.productId,
        reviewerName: reviews.reviewerName,
        rating: reviews.rating,
        comment: reviews.comment,
        helpfulCount: reviews.helpfulCount,
        createdAt: reviews.createdAt,
        product: {
          id: products.id,
          name: products.name,
          price: products.price,
          category: products.category,
          subcategory: products.subcategory
        }
      })
      .from(reviews)
      .leftJoin(products, eq(reviews.productId, products.id))
      .where(eq(reviews.id, parseInt(id)))
      .limit(1);

      if (review.length === 0) {
        return NextResponse.json({ error: 'Review not found' }, { status: 404 });
      }

      return NextResponse.json(review[0]);
    }

    // List reviews with filtering and pagination
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const productId = searchParams.get('productId');
    const rating = searchParams.get('rating');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    const search = searchParams.get('search');

    let query = db.select({
      id: reviews.id,
      productId: reviews.productId,
      reviewerName: reviews.reviewerName,
      rating: reviews.rating,
      comment: reviews.comment,
      helpfulCount: reviews.helpfulCount,
      createdAt: reviews.createdAt,
      product: {
        id: products.id,
        name: products.name,
        price: products.price,
        category: products.category,
        subcategory: products.subcategory
      }
    })
    .from(reviews)
    .leftJoin(products, eq(reviews.productId, products.id));

    // Build where conditions
    const whereConditions = [];

    if (productId) {
      if (isNaN(parseInt(productId))) {
        return NextResponse.json({ 
          error: "Valid product ID is required",
          code: "INVALID_PRODUCT_ID" 
        }, { status: 400 });
      }
      whereConditions.push(eq(reviews.productId, parseInt(productId)));
    }

    if (rating) {
      const ratingNum = parseInt(rating);
      if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return NextResponse.json({ 
          error: "Rating must be between 1-5",
          code: "INVALID_RATING" 
        }, { status: 400 });
      }
      whereConditions.push(eq(reviews.rating, ratingNum));
    }

    if (search) {
      whereConditions.push(
        or(
          like(reviews.reviewerName, `%${search}%`),
          like(reviews.comment, `%${search}%`)
        )
      );
    }

    if (whereConditions.length > 0) {
      query = query.where(and(...whereConditions));
    }

    // Apply sorting
    const sortColumn = sort === 'rating' ? reviews.rating : 
                      sort === 'helpfulCount' ? reviews.helpfulCount :
                      reviews.createdAt;
    
    query = query.orderBy(order === 'asc' ? asc(sortColumn) : desc(sortColumn));

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
    const body = await request.json();
    const { productId, reviewerName, rating, comment, helpfulCount } = body;

    // Validate required fields
    if (!productId) {
      return NextResponse.json({ 
        error: "Product ID is required",
        code: "MISSING_PRODUCT_ID" 
      }, { status: 400 });
    }

    if (!reviewerName) {
      return NextResponse.json({ 
        error: "Reviewer name is required",
        code: "MISSING_REVIEWER_NAME" 
      }, { status: 400 });
    }

    if (!rating) {
      return NextResponse.json({ 
        error: "Rating is required",
        code: "MISSING_RATING" 
      }, { status: 400 });
    }

    // Validate field formats
    if (isNaN(parseInt(productId)) || parseInt(productId) <= 0) {
      return NextResponse.json({ 
        error: "Product ID must be a positive integer",
        code: "INVALID_PRODUCT_ID" 
      }, { status: 400 });
    }

    if (typeof reviewerName !== 'string' || reviewerName.trim().length < 2 || reviewerName.trim().length > 100) {
      return NextResponse.json({ 
        error: "Reviewer name must be between 2-100 characters",
        code: "INVALID_REVIEWER_NAME" 
      }, { status: 400 });
    }

    if (isNaN(parseInt(rating)) || parseInt(rating) < 1 || parseInt(rating) > 5) {
      return NextResponse.json({ 
        error: "Rating must be an integer between 1-5",
        code: "INVALID_RATING" 
      }, { status: 400 });
    }

    if (comment && typeof comment !== 'string') {
      return NextResponse.json({ 
        error: "Comment must be a string",
        code: "INVALID_COMMENT" 
      }, { status: 400 });
    }

    if (comment && comment.length > 1000) {
      return NextResponse.json({ 
        error: "Comment must not exceed 1000 characters",
        code: "COMMENT_TOO_LONG" 
      }, { status: 400 });
    }

    if (helpfulCount !== undefined && (isNaN(parseInt(helpfulCount)) || parseInt(helpfulCount) < 0)) {
      return NextResponse.json({ 
        error: "Helpful count must be a non-negative integer",
        code: "INVALID_HELPFUL_COUNT" 
      }, { status: 400 });
    }

    // Verify product exists
    const product = await db.select()
      .from(products)
      .where(eq(products.id, parseInt(productId)))
      .limit(1);

    if (product.length === 0) {
      return NextResponse.json({ 
        error: "Product not found",
        code: "PRODUCT_NOT_FOUND" 
      }, { status: 400 });
    }

    // Prepare insert data
    const insertData = {
      productId: parseInt(productId),
      reviewerName: reviewerName.trim(),
      rating: parseInt(rating),
      comment: comment ? comment.trim() : null,
      helpfulCount: helpfulCount !== undefined ? parseInt(helpfulCount) : 0,
      createdAt: new Date().toISOString()
    };

    const newReview = await db.insert(reviews)
      .values(insertData)
      .returning();

    return NextResponse.json(newReview[0], { status: 201 });
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

    const body = await request.json();
    const { rating, comment, helpfulCount } = body;

    // Check if review exists
    const existingReview = await db.select()
      .from(reviews)
      .where(eq(reviews.id, parseInt(id)))
      .limit(1);

    if (existingReview.length === 0) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Validate fields if provided
    const updates = {};

    if (rating !== undefined) {
      if (isNaN(parseInt(rating)) || parseInt(rating) < 1 || parseInt(rating) > 5) {
        return NextResponse.json({ 
          error: "Rating must be an integer between 1-5",
          code: "INVALID_RATING" 
        }, { status: 400 });
      }
      updates.rating = parseInt(rating);
    }

    if (comment !== undefined) {
      if (comment !== null && typeof comment !== 'string') {
        return NextResponse.json({ 
          error: "Comment must be a string",
          code: "INVALID_COMMENT" 
        }, { status: 400 });
      }
      if (comment && comment.length > 1000) {
        return NextResponse.json({ 
          error: "Comment must not exceed 1000 characters",
          code: "COMMENT_TOO_LONG" 
        }, { status: 400 });
      }
      updates.comment = comment ? comment.trim() : null;
    }

    if (helpfulCount !== undefined) {
      if (isNaN(parseInt(helpfulCount)) || parseInt(helpfulCount) < 0) {
        return NextResponse.json({ 
          error: "Helpful count must be a non-negative integer",
          code: "INVALID_HELPFUL_COUNT" 
        }, { status: 400 });
      }
      updates.helpfulCount = parseInt(helpfulCount);
    }

    // If no updates provided
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ 
        error: "No valid fields to update",
        code: "NO_UPDATES" 
      }, { status: 400 });
    }

    const updated = await db.update(reviews)
      .set(updates)
      .where(eq(reviews.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0]);
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

    // Check if review exists
    const existingReview = await db.select()
      .from(reviews)
      .where(eq(reviews.id, parseInt(id)))
      .limit(1);

    if (existingReview.length === 0) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    const deleted = await db.delete(reviews)
      .where(eq(reviews.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Review deleted successfully',
      review: deleted[0]
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}