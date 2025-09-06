"use client";

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Eye, Share2, Search, Filter, Star, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { toast } from "sonner";

const WishlistPage = ({
  wishlistItems = [],
  recommendedProducts = [],
  onRemoveFromWishlist = () => {},
  onAddToCart = () => {},
  onNavigate = () => {},
  onAddToWishlist = () => {},
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [filterCategory, setFilterCategory] = useState('all');
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [isGridView, setIsGridView] = useState(true);

  // Filter and search logic
  const filteredItems = wishlistItems.filter(item => {
    const name = item.name || '';
    const category = item.category || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort logic
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return (a.name || '').localeCompare(b.name || '');
      case 'recent':
      default:
        return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
    }
  });

  // Get unique categories for filter
  const categories = Array.from(new Set(wishlistItems.map(item => item.category).filter(Boolean)));

  const handleRemoveClick = useCallback((itemId) => {
    setItemToRemove(itemId);
    setRemoveDialogOpen(true);
  }, []);

  const confirmRemove = useCallback(() => {
    if (itemToRemove) {
      onRemoveFromWishlist(itemToRemove);
      toast.success("Item removed from wishlist");
    }
    setRemoveDialogOpen(false);
    setItemToRemove(null);
  }, [itemToRemove, onRemoveFromWishlist]);

  const handleAddToCart = useCallback((item) => {
    onAddToCart(item);
    toast.success("Added to cart");
  }, [onAddToCart]);

  const handleQuickView = useCallback((itemId) => {
    onNavigate(`/product/${itemId}`);
  }, [onNavigate]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: 'My Wishlist',
        text: 'Check out my wishlist!',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Wishlist link copied to clipboard");
    }
  }, []);

  const EmptyWishlistState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="w-48 h-48 mx-auto mb-8 bg-gradient-to-br from-secondary to-muted rounded-full flex items-center justify-center">
        <Heart className="w-24 h-24 text-muted-foreground" />
      </div>
      <h2 className="font-heading text-3xl mb-4">Your wishlist is empty</h2>
      <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
        Start adding products you love to create your personal collection of favorites.
      </p>
      <Button 
        onClick={() => onNavigate('/collections')}
        size="lg"
        className="bg-primary hover:bg-primary/90"
      >
        Browse Collections
      </Button>
    </motion.div>
  );

  const WishlistItemCard = ({ item, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      layout
    >
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="w-9 h-9 p-0 rounded-full bg-background/90 hover:bg-background shadow-md"
              onClick={() => handleRemoveClick(item.id)}
            >
              <Heart className="w-4 h-4 fill-destructive text-destructive" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="w-9 h-9 p-0 rounded-full bg-background/90 hover:bg-background shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleQuickView(item.id)}
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
          {item.originalPrice && (
            <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
              {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
            </Badge>
          )}
          {!item.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="secondary">Out of Stock</Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                {item.name}
              </h3>
              <p className="text-sm text-muted-foreground capitalize">{item.category}</p>
            </div>
            
            {item.rating && (
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(item.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  ({item.reviewCount})
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold">${item.price}</span>
                {item.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${item.originalPrice}
                  </span>
                )}
              </div>
              {item.colors && item.colors.length > 0 && (
                <div className="flex gap-1">
                  {item.colors.slice(0, 3).map((color, idx) => (
                    <div
                      key={idx}
                      className="w-4 h-4 rounded-full border border-border"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  {item.colors.length > 3 && (
                    <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-xs">+{item.colors.length - 3}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Button
              onClick={() => handleAddToCart(item)}
              disabled={!item.inStock}
              className="w-full"
              size="sm"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const RecommendedProductCard = ({ product }) => (
    <Card className="group overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Button
          size="sm"
          variant="secondary"
          className="absolute top-3 right-3 w-9 h-9 p-0 rounded-full bg-background/90 hover:bg-background shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onAddToWishlist(product)}
        >
          <Heart className="w-4 h-4" />
        </Button>
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <h4 className="font-medium line-clamp-2 text-sm group-hover:text-primary transition-colors">
            {product.name}
          </h4>
          <p className="text-xs text-muted-foreground capitalize">{product.category}</p>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">${product.price}</span>
            {product.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs">{product.rating}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyWishlistState />
        
        {recommendedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-16"
          >
            <div className="text-center mb-8">
              <h3 className="font-heading text-2xl mb-2">You might also like</h3>
              <p className="text-muted-foreground">Discover products you'll love</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recommendedProducts.slice(0, 8).map((product) => (
                <RecommendedProductCard key={product.id} product={product} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl mb-2">My Wishlist</h1>
            <p className="text-muted-foreground">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button
              onClick={() => onNavigate('/collections')}
              className="bg-primary hover:bg-primary/90"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search wishlist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recently Added</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Wishlist Items */}
      <AnimatePresence mode="wait">
        {sortedItems.length > 0 ? (
          <motion.div
            key="items"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16"
          >
            {sortedItems.map((item, index) => (
              <WishlistItemCard key={item.id} item={item} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <div className="w-32 h-32 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
              <Search className="w-16 h-16 text-muted-foreground" />
            </div>
            <h3 className="font-heading text-xl mb-2">No items found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('all');
              }}
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recommended Products */}
      {recommendedProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border-t pt-16"
        >
          <div className="text-center mb-8">
            <h3 className="font-heading text-2xl mb-2">You might also like</h3>
            <p className="text-muted-foreground">Discover more products you'll love</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {recommendedProducts.slice(0, 12).map((product) => (
              <RecommendedProductCard key={product.id} product={product} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Remove Confirmation Dialog */}
      <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from wishlist?</AlertDialogTitle>
            <AlertDialogDescription>
              This item will be removed from your wishlist. You can always add it back later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemove}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WishlistPage;