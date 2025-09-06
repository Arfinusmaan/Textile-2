"use client";

import React, { useState, useEffect, useMemo } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Filter, Grid, List, ShoppingCart, Heart, Eye, Star, SlidersHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import { Skeleton } from './ui/skeleton';
import { toast } from 'sonner';



// Mock collection data
const mockCollectionData = {
  1: {
    id: 1,
    name: "Sarees",
    description: "Timeless elegance in every drape. Our saree collection features traditional and contemporary designs crafted from the finest fabrics.",
    banner: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-an-e-8ec064f6-20250904080844.jpg",
    totalProducts: 45,
    subcategories: ["Silk Sarees", "Cotton Sarees", "Designer Sarees", "Party Wear", "Casual Wear"]
  },
  2: {
    id: 2,
    name: "Lehengas",
    description: "Royal grandeur for special moments. Exquisite lehengas designed for weddings, festivals, and celebrations.",
    banner: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-a-st-22905886-20250904080855.jpg",
    totalProducts: 32,
    subcategories: ["Bridal Lehengas", "Party Lehengas", "Festival Wear", "Designer Collection", "Heavy Work"]
  },
  3: {
    id: 3,
    name: "Men's Wear",
    description: "Sophisticated style meets comfort. Premium menswear collection for every occasion.",
    banner: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-an-e-4eb72a2a-20250904080904.jpg",
    totalProducts: 58,
    subcategories: ["Kurta Sets", "Formal Suits", "Casual Shirts", "Ethnic Wear", "Accessories"]
  }
};

// Mock products for collections
const mockCollectionProducts = [
  {
    id: "saree-1",
    name: "Elegant Silk Saree",
    price: 2499,
    originalPrice: 3999,
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-an-e-8ec064f6-20250904080844.jpg",
    category: "Sarees",
    collection: "1",
    inStock: true,
    rating: 4.8,
    material: "Pure Silk",
    colors: ["#E8B4B8", "#F4E4C1", "#A8D8EA"],
    sale: true,
    sizes: ["Free Size"]
  },
  {
    id: "saree-2",
    name: "Designer Cotton Saree",
    price: 1899,
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-an-e-9b3975cb-20250904080927.jpg",
    category: "Sarees",
    collection: "1",
    inStock: true,
    rating: 4.6,
    material: "Cotton",
    colors: ["#F5F5DC", "#FFE4E1", "#E6E6FA"],
    sizes: ["Free Size"]
  },
  {
    id: "lehenga-1",
    name: "Bridal Lehenga Set",
    price: 8999,
    originalPrice: 12999,
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-a-st-22905886-20250904080855.jpg",
    category: "Lehengas",
    collection: "2",
    inStock: true,
    rating: 4.9,
    material: "Embroidered Net",
    colors: ["#FFB6C1", "#DDA0DD", "#98FB98"],
    sale: true,
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "mens-1",
    name: "Premium Kurta Set",
    price: 1899,
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-an-e-4eb72a2a-20250904080904.jpg",
    category: "Men's Wear",
    collection: "3",
    inStock: true,
    rating: 4.7,
    material: "Cotton",
    colors: ["#F5F5DC", "#FFE4E1", "#E6E6FA"],
    sizes: ["S", "M", "L", "XL", "XXL"]
  }
];

export const CollectionDetailPage = ({
  pageData,
  products = [],
  collections = [],
  onNavigate = () => {},
  onAddToCart = () => {},
  onAddToWishlist = () => {},
  wishlistItems = []
}) => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Get collection details
  const collectionId = pageData?.collectionId?.toString() || '1';
  const collectionData = mockCollectionData[collectionId] || mockCollectionData[1];

  // Get products for this collection
  const allProducts = useMemo(() => {
    if (products.length > 0) {
      return products.filter(p => p.collection === collectionId || p.category === collectionData.name);
    }
    return mockCollectionProducts.filter(p => p.collection === collectionId);
  }, [products, collectionId, collectionData.name]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.material?.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    // Price range filter
    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Material filter
    if (selectedMaterials.length > 0) {
      filtered = filtered.filter(product =>
        product.material && selectedMaterials.includes(product.material)
      );
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => (b.sale ? 1 : 0) - (a.sale ? 1 : 0));
        break;
    }

    return filtered;
  }, [allProducts, searchQuery, priceRange, selectedMaterials, sortBy]);

  // Pagination
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Available materials
  const availableMaterials = useMemo(() => {
    const materials = new Set();
    allProducts.forEach(product => {
      if (product.material) materials.add(product.material);
    });
    return Array.from(materials);
  }, [allProducts]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleProductClick = (productId) => {
    onNavigate('product', productId);
  };

  const handleAddToCart = (product) => {
    onAddToCart(product);
  };

  const handleAddToWishlist = (productId) => {
    onAddToWishlist(productId);
  };

  const clearFilters = () => {
    setSelectedSubcategories([]);
    setPriceRange([0, 10000]);
    setSelectedMaterials([]);
    setSearchQuery('');
  };

  const formatPrice = (price) => `₹${price.toLocaleString()}`;

  const FilterSection = () => (
    <div className="space-y-6">
      {/* Subcategories */}
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {collectionData.subcategories.map((subcategory) => (
            <div key={subcategory} className="flex items-center space-x-2">
              <Checkbox
                id={subcategory}
                checked={selectedSubcategories.includes(subcategory)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedSubcategories([...selectedSubcategories, subcategory]);
                  } else {
                    setSelectedSubcategories(selectedSubcategories.filter(s => s !== subcategory));
                  }
                }}
              />
              <label htmlFor={subcategory} className="text-sm cursor-pointer">
                {subcategory}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={10000}
            min={0}
            step={100}
            className="mb-3"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div>

      {/* Materials */}
      {availableMaterials.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Material</h3>
          <div className="space-y-2">
            {availableMaterials.map((material) => (
              <div key={material} className="flex items-center space-x-2">
                <Checkbox
                  id={material}
                  checked={selectedMaterials.includes(material)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedMaterials([...selectedMaterials, material]);
                    } else {
                      setSelectedMaterials(selectedMaterials.filter(m => m !== material));
                    }
                  }}
                />
                <label htmlFor={material} className="text-sm cursor-pointer">
                  {material}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clear Filters */}
      <Button variant="outline" onClick={clearFilters} className="w-full">
        Clear All Filters
      </Button>
    </div>
  );

  const ProductCard = ({ product }) => {
    const isInWishlist = wishlistItems.includes(product.id);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="group"
      >
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden cursor-pointer" onClick={() => handleProductClick(product.id)}>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {product.sale && (
                <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
                  Sale
                </Badge>
              )}
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Badge variant="secondary" className="bg-primary text-black">
                    Out of Stock
                  </Badge>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleAddToWishlist(product.id)}
                className={`p-2 ${isInWishlist ? 'text-red-500' : ''}`}
              >
                <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleProductClick(product.id)}
                className="p-2"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <CardContent className="p-4">
            <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
            
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              {product.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm">{product.rating}</span>
                </div>
              )}
            </div>

            {product.material && (
              <p className="text-xs text-muted-foreground mb-3">{product.material}</p>
            )}

            <Button
              onClick={() => handleAddToCart(product)}
              disabled={!product.inStock}
              className="w-full"
              size="sm"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <Skeleton className="h-48 w-full rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="md:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="aspect-[4/3] w-full" />
                    <CardContent className="p-4">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-2" />
                      <Skeleton className="h-8 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => onNavigate('collections')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Collections
        </Button>

        {/* Collection Banner */}
        <div className="relative mb-6 rounded-lg overflow-hidden">
          <div className="aspect-[16/6] w-full">
            <img
              src={collectionData.banner}
              alt={collectionData.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center text-white text-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{collectionData.name}</h1>
                <p className="text-lg md:text-xl mb-2">{collectionData.description}</p>
                <p className="text-sm opacity-90">{collectionData.totalProducts} Products Available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="p-2"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="p-2"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card text-foreground rounded-md shadow-lg">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          {filteredProducts.length} products found
          {searchQuery && ` for "${searchQuery}"`}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Desktop Filters */}
        <div className="hidden md:block">
          <Card className="p-6 sticky top-4">
            <div className="flex items-center gap-2 mb-6">
              <SlidersHorizontal className="w-5 h-5" />
              <h2 className="font-semibold">Filters</h2>
            </div>
            <FilterSection />
          </Card>
        </div>

        {/* Mobile Filters */}
        <div className="md:hidden mb-4">
          <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterSection />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Products Grid */}
        <div className="md:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search terms.
              </p>
              <Button onClick={clearFilters}>Clear All Filters</Button>
            </div>
          ) : (
            <>
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1 md:grid-cols-2'
              }`}>
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = i + Math.max(1, currentPage - 2);
                    if (pageNum > totalPages) return null;
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === currentPage ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};