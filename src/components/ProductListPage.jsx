"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  ListFilter,
  LayoutList,
  ArrowDownNarrowWide,
  Grid2x2,
  ShoppingCart,
  ArrowDownWideNarrow,
  ChevronsUpDown,
  SlidersHorizontal,
  PanelRight
} from "lucide-react";

import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Slider } from "./ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";

// Mock data with updated images
const mockProducts = [
  {
    id: 1,
    title: "Cashmere Blend Sweater",
    name: "Cashmere Blend Sweater",
    price: 189,
    originalPrice: 249,
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-an-e-36937f4d-20250904081005.jpg",
    fabric: "Cashmere",
    color: "Cream",
    occasion: ["Casual", "Work"],
    isNew: true,
    isLimited: false,
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: 2,
    title: "Silk Midi Dress",
    name: "Silk Midi Dress",
    price: 299,
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-an-e-8ec064f6-20250904080844.jpg",
    fabric: "Silk",
    color: "Navy",
    occasion: ["Evening", "Work"],
    isNew: false,
    isLimited: true,
    sizes: ["XS", "S", "M", "L"]
  },
  {
    id: 3,
    title: "Cotton Linen Blazer",
    name: "Cotton Linen Blazer",
    price: 225,
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-a-ha-3762c4ca-20250904080914.jpg",
    fabric: "Cotton",
    color: "Beige",
    occasion: ["Work", "Casual"],
    isNew: false,
    isLimited: false,
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 4,
    title: "Wool Turtleneck",
    name: "Wool Turtleneck",
    price: 149,
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-an-e-4eb72a2a-20250904080904.jpg",
    fabric: "Wool",
    color: "Black",
    occasion: ["Casual", "Work"],
    isNew: true,
    isLimited: false,
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: 5,
    title: "Linen Wide Leg Pants",
    name: "Linen Wide Leg Pants",
    price: 175,
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-an-e-9b3975cb-20250904080927.jpg",
    fabric: "Linen",
    color: "White",
    occasion: ["Casual", "Evening"],
    isNew: false,
    isLimited: false,
    sizes: ["XS", "S", "M", "L"]
  },
  {
    id: 6,
    title: "Merino Wool Cardigan",
    name: "Merino Wool Cardigan",
    price: 199,
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-a-st-22905886-20250904080855.jpg",
    fabric: "Wool",
    color: "Grey",
    occasion: ["Casual", "Work"],
    isNew: false,
    isLimited: true,
    sizes: ["S", "M", "L", "XL"]
  }
];

const colorMap = {
  Cream: "#F5F5DC",
  Navy: "#000080",
  Beige: "#F5F5DC",
  Black: "#000000",
  White: "#FFFFFF",
  Grey: "#808080"
};

const fabrics = ["Cotton", "Silk", "Wool", "Cashmere", "Linen"];
const occasions = ["Casual", "Work", "Evening", "Special"];
const colors = Object.keys(colorMap);

export default function ProductListPage({ 
  products: propProducts = [], 
  onNavigate = () => {}, 
  onAddToCart = () => {},
  onAddToWishlist = () => {},
  pageData = null
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // Filter states
  const [selectedFabrics, setSelectedFabrics] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  
  // UI states
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [viewMode, setViewMode] = useState("grid");

  // Initialize products - use props if available, otherwise use mock data
  useEffect(() => {
    const productsToUse = propProducts.length > 0 ? propProducts : mockProducts;
    setAllProducts(productsToUse);
    setFilteredProducts(productsToUse);
  }, [propProducts]);

  // Handle search from pageData
  useEffect(() => {
    if (pageData?.search) {
      // Apply search filter if search query is provided
      const searchTerm = pageData.search.toLowerCase();
      const searchFiltered = allProducts.filter(product => 
        (product.title || product.name || "").toLowerCase().includes(searchTerm) ||
        (product.fabric || "").toLowerCase().includes(searchTerm) ||
        (product.color || "").toLowerCase().includes(searchTerm)
      );
      setFilteredProducts(searchFiltered);
    }
  }, [pageData, allProducts]);

  // Debounced filtering
  const debouncedFilter = useCallback(() => {
    const timer = setTimeout(() => {
      let filtered = [...allProducts];

      if (selectedFabrics.length > 0) {
        filtered = filtered.filter(p => p.fabric && selectedFabrics.includes(p.fabric));
      }

      if (selectedColors.length > 0) {
        filtered = filtered.filter(p => p.color && selectedColors.includes(p.color));
      }

      if (selectedOccasions.length > 0) {
        filtered = filtered.filter(p => 
          p.occasion && Array.isArray(p.occasion) && p.occasion.some(occ => selectedOccasions.includes(occ))
        );
      }

      filtered = filtered.filter(p => 
        p.price && p.price >= priceRange[0] && p.price <= priceRange[1]
      );

      // Apply sorting
      switch (sortBy) {
        case "price-low":
          filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
          break;
        case "price-high":
          filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
          break;
        case "newest":
        default:
          filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
          break;
      }

      setFilteredProducts(filtered);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedFabrics, selectedColors, selectedOccasions, priceRange, sortBy, allProducts]);

  useEffect(() => {
    debouncedFilter();
  }, [debouncedFilter]);

  const clearAllFilters = () => {
    setSelectedFabrics([]);
    setSelectedColors([]);
    setSelectedOccasions([]);
    setPriceRange([0, 500]);
  };

  const handleAddToCart = async (product, size) => {
    if (!size) {
      toast.error("Please select a size");
      return;
    }

    try {
      setIsLoading(true);
      // Use the parent's addToCart handler
      onAddToCart(product);
      setQuickViewProduct(null);
      setSelectedSize("");
    } catch (err) {
      toast.error("Failed to add to cart");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductClick = (productId) => {
    onNavigate('product', productId);
  };

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Fabric Filter */}
      <div>
        <h3 className="font-heading text-sm font-semibold mb-3">Fabric</h3>
        <div className="space-y-2">
          {fabrics.map((fabric) => (
            <div key={fabric} className="flex items-center space-x-2">
              <Checkbox
                id={`fabric-${fabric}`}
                checked={selectedFabrics.includes(fabric)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedFabrics([...selectedFabrics, fabric]);
                  } else {
                    setSelectedFabrics(selectedFabrics.filter(f => f !== fabric));
                  }
                }}
              />
              <label htmlFor={`fabric-${fabric}`} className="text-sm cursor-pointer">
                {fabric}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-heading text-sm font-semibold mb-3">Price Range</h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={500}
            min={0}
            step={10}
            className="mb-3"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Color Filter */}
      <div>
        <h3 className="font-heading text-sm font-semibold mb-3">Color</h3>
        <div className="grid grid-cols-4 gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => {
                if (selectedColors.includes(color)) {
                  setSelectedColors(selectedColors.filter(c => c !== color));
                } else {
                  setSelectedColors([...selectedColors, color]);
                }
              }}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                selectedColors.includes(color)
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50"
              }`}
              style={{ backgroundColor: colorMap[color] }}
              aria-label={color}
            />
          ))}
        </div>
      </div>

      {/* Occasion Filter */}
      <div>
        <h3 className="font-heading text-sm font-semibold mb-3">Occasion</h3>
        <div className="space-y-2">
          {occasions.map((occasion) => (
            <div key={occasion} className="flex items-center space-x-2">
              <Checkbox
                id={`occasion-${occasion}`}
                checked={selectedOccasions.includes(occasion)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedOccasions([...selectedOccasions, occasion]);
                  } else {
                    setSelectedOccasions(selectedOccasions.filter(o => o !== occasion));
                  }
                }}
              />
              <label htmlFor={`occasion-${occasion}`} className="text-sm cursor-pointer">
                {occasion}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear All */}
      <Button
        variant="outline"
        size="sm"
        onClick={clearAllFilters}
        className="w-full"
      >
        Clear All
      </Button>
    </div>
  );

  const ProductCard = ({ product }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="product-card group"
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
        <div className="relative overflow-hidden" onClick={() => handleProductClick(product.id)}>
          <img
            src={product.image}
            alt={product.title || product.name}
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {product.isNew && (
            <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">
              New
            </Badge>
          )}
          {product.isLimited && (
            <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground">
              Limited
            </Badge>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setQuickViewProduct(product);
              }}
              className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
            >
              Quick View
            </Button>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-heading text-base font-semibold mb-2 line-clamp-2">
            {product.title || product.name}
          </h3>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {product.color && colorMap[product.color] && (
                <>
                  <div
                    className="w-3 h-3 rounded-full border"
                    style={{ backgroundColor: colorMap[product.color] }}
                  />
                  <span className="text-xs text-muted-foreground">{product.color}</span>
                </>
              )}
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                setQuickViewProduct(product);
              }}
              className="p-1"
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-heading font-bold mb-4">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">We couldn't load the products.</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb & Header */}
      <div className="mb-8">
        <nav className="text-sm text-muted-foreground mb-4">
          <button onClick={() => onNavigate('home')} className="hover:text-foreground">Home</button>
          {" / "}
          <button onClick={() => onNavigate('collections')} className="hover:text-foreground">Collections</button>
          {" / "}
          <span>All Products</span>
        </nav>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2">All Products</h1>
            <p className="text-muted-foreground" aria-live="polite">
              {filteredProducts.length} products
              {pageData?.search && ` for "${pageData.search}"`}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex border rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="p-2"
              >
                <Grid2x2 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="p-2"
              >
                <LayoutList className="w-4 h-4" />
              </Button>
            </div>

            {/* Sort Control */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Filters */}
        <div className="hidden lg:block w-64 shrink-0">
          <Card className="p-6 sticky top-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-lg font-semibold flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </h2>
            </div>
            <FilterContent />
          </Card>
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <ListFilter className="w-4 h-4 mr-2" />
                Filters & Sort
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:w-80">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Narrow down your search
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="w-full h-64" />
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-1/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-heading font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or browse our featured items.
              </p>
              <Button onClick={clearAllFilters}>Clear All Filters</Button>
            </div>
          ) : (
            <>
              {/* Product Grid */}
              <div className={`grid gap-6 ${
                viewMode === "grid" 
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
                  : "grid-cols-1"
              }`}>
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Items per page:</span>
                    <Select 
                      value={itemsPerPage.toString()} 
                      onValueChange={(value) => {
                        setItemsPerPage(Number(value));
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12</SelectItem>
                        <SelectItem value="24">24</SelectItem>
                        <SelectItem value="48">48</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
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
                          variant={pageNum === currentPage ? "default" : "outline"}
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
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Quick View Dialog */}
      <Dialog open={!!quickViewProduct} onOpenChange={() => setQuickViewProduct(null)}>
        <DialogContent className="max-w-2xl">
          {quickViewProduct && (
            <>
              <DialogHeader>
                <DialogTitle>{quickViewProduct.title || quickViewProduct.name}</DialogTitle>
                <DialogDescription>
                  Quick preview and add to cart
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="aspect-square overflow-hidden rounded-lg">
                  <img
                    src={quickViewProduct.image}
                    alt={quickViewProduct.title || quickViewProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold">₹{quickViewProduct.price}</span>
                      {quickViewProduct.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through">
                          ₹{quickViewProduct.originalPrice}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {quickViewProduct.isNew && (
                        <Badge className="bg-accent text-accent-foreground">New</Badge>
                      )}
                      {quickViewProduct.isLimited && (
                        <Badge className="bg-destructive text-destructive-foreground">Limited</Badge>
                      )}
                    </div>
                  </div>

                  {quickViewProduct.sizes && quickViewProduct.sizes.length > 0 && (
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Size</label>
                      <Select value={selectedSize} onValueChange={setSelectedSize}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a size" />
                        </SelectTrigger>
                        <SelectContent>
                          {quickViewProduct.sizes.map((size) => (
                            <SelectItem key={size} value={size}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    {quickViewProduct.fabric && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Fabric:</span>
                        <span className="text-sm text-muted-foreground">{quickViewProduct.fabric}</span>
                      </div>
                    )}
                    {quickViewProduct.color && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Color:</span>
                        <div className="flex items-center gap-2">
                          {colorMap[quickViewProduct.color] && (
                            <div
                              className="w-4 h-4 rounded-full border"
                              style={{ backgroundColor: colorMap[quickViewProduct.color] }}
                            />
                          )}
                          <span className="text-sm text-muted-foreground">{quickViewProduct.color}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => handleAddToCart(quickViewProduct, selectedSize || 'M')}
                    disabled={isLoading}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {isLoading ? "Adding..." : "Add to Cart"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}