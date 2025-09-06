"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, Search, User, X, MapPin } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Badge } from './components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './components/ui/sheet';
import { toast } from 'sonner';

// Page Components
import HomePage from './components/HomePage';
import CollectionsPage from './components/CollectionsPage';
import ProductListPage from './components/ProductListPage';
import ProductDetailPage from './components/ProductDetailPage';
import CartCheckout from './components/CartCheckout';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import AdminPanel from './components/AdminPanel';
import { WishlistPage } from './components/WishlistPage';
import { CollectionDetailPage } from './components/CollectionDetailPage';

const PAGES = {
  home: { component: HomePage, title: 'Home' },
  collections: { component: CollectionsPage, title: 'Collections' },
  products: { component: ProductListPage, title: 'Products' },
  product: { component: ProductDetailPage, title: 'Product Detail' },
  wishlist: { component: WishlistPage, title: 'Wishlist' },
  cart: { component: CartCheckout, title: 'Cart & Checkout' },
  about: { component: AboutPage, title: 'About Us' },
  contact: { component: ContactPage, title: 'Contact' },
  admin: { component: AdminPanel, title: 'Admin Panel' }
};

export default function Page() {
  const [currentPage, setCurrentPage] = useState('home');
  const [pageData, setPageData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global state for products and collections (updated by admin)
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);

  // Load cart and wishlist from localStorage on component mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }

      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        const wishlistIds = JSON.parse(savedWishlist);
        setWishlistItems(wishlistIds);
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }, []);

  // Handle page navigation with optional data
  const navigateTo = (page, data = null) => {
    setCurrentPage(page);
    setPageData(data);
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.success(`Searching for "${searchQuery}"`);
      navigateTo('products', { search: searchQuery });
      setSearchQuery('');
    }
  };

  // Add to cart functionality with localStorage persistence
  const handleAddToCart = (product) => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find(item => item.id === product?.id || item.id === product);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        const cartItem = typeof product === 'string' ? 
          { id: product, quantity: 1 } : 
          { ...product, quantity: 1 };
        cart.push(cartItem);
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      setCartItems(cart);
      toast.success('Item added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  // Remove from cart
  const handleRemoveFromCart = (productId) => {
    try {
      const updatedCart = cartItems.filter(item => item.id !== productId);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  // Update cart quantity
  const handleUpdateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    
    try {
      const updatedCart = cartItems.map(item => 
        item.id === productId 
          ? { ...item, quantity }
          : item
      );
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      toast.error('Failed to update cart');
    }
  };

  // Add to wishlist
  const handleAddToWishlist = (product) => {
    try {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const productId = typeof product === 'string' ? product : product?.id;
      
      if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        setWishlistItems(wishlist);
        toast.success('Added to wishlist!');
      } else {
        toast.info('Item already in wishlist');
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
    }
  };

  // Remove from wishlist
  const handleRemoveFromWishlist = (productId) => {
    try {
      const updatedWishlist = wishlistItems.filter(id => id !== productId);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setWishlistItems(updatedWishlist);
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  // Admin handlers to sync with frontend
  const handleProductsUpdate = (newProducts) => {
    setProducts(newProducts);
    toast.success('Products updated successfully!');
  };

  const handleCollectionsUpdate = (newCollections) => {
    setCollections(newCollections);
    toast.success('Collections updated successfully!');
  };

  const CurrentPageComponent = PAGES[currentPage]?.component || HomePage;
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const navigationItems = [
    { key: 'home', label: 'Home' },
    { key: 'collections', label: 'Collections' },
    { key: 'products', label: 'All Products' },
    { key: 'about', label: 'About Us' },
    { key: 'contact', label: 'Contact' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button 
              onClick={() => navigateTo('home')}
              className="flex items-center space-x-2 font-heading font-bold text-xl hover:text-primary transition-colors"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-bold">E</span>
              </div>
              <span>Elegance</span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => navigateTo(item.key)}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    currentPage === item.key ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Location */}
              <div className="hidden lg:flex items-center space-x-1 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Mumbai</span>
              </div>

              {/* Search */}
              <div className="hidden md:block">
                {isSearchOpen ? (
                  <motion.form
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    onSubmit={handleSearch}
                    className="flex items-center space-x-2"
                  >
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                      autoFocus
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsSearchOpen(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </motion.form>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSearchOpen(true)}
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Wishlist */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateTo('wishlist')}
                className="hidden md:flex relative"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlistItems.length > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs"
                  >
                    {wishlistItems.length}
                  </Badge>
                )}
              </Button>

              {/* Account */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateTo('admin')}
                className="hidden md:flex"
              >
                <User className="w-4 h-4" />
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateTo('cart')}
                className="relative"
              >
                <ShoppingCart className="w-4 h-4" />
                {cartCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>

              {/* Mobile Menu */}
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle className="text-left">Menu</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-6 mt-6">
                    {/* Mobile Search */}
                    <form onSubmit={handleSearch} className="flex space-x-2">
                      <Input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="submit" size="sm">
                        <Search className="w-4 h-4" />
                      </Button>
                    </form>

                    {/* Mobile Navigation */}
                    <nav className="space-y-4">
                      {navigationItems.map((item) => (
                        <button
                          key={item.key}
                          onClick={() => navigateTo(item.key)}
                          className={`block w-full text-left py-2 px-3 rounded-lg transition-colors ${
                            currentPage === item.key
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                      <button
                        onClick={() => navigateTo('wishlist')}
                        className="block w-full text-left py-2 px-3 rounded-lg transition-colors hover:bg-muted"
                      >
                        Wishlist ({wishlistItems.length})
                      </button>
                      <button
                        onClick={() => navigateTo('admin')}
                        className="block w-full text-left py-2 px-3 rounded-lg transition-colors hover:bg-muted"
                      >
                        Admin Panel
                      </button>
                    </nav>

                    {/* Mobile Location */}
                    <div className="flex items-center space-x-2 py-2 px-3 bg-muted rounded-lg">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Mumbai Store</span>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CurrentPageComponent 
                onNavigate={navigateTo}
                pageData={pageData}
                selectedProductId={pageData}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                onUpdateCartQuantity={handleUpdateCartQuantity}
                onAddToWishlist={handleAddToWishlist}
                onRemoveFromWishlist={handleRemoveFromWishlist}
                cartItems={cartItems}
                wishlistItems={wishlistItems}
                products={products}
                collections={collections}
                onProductsUpdate={handleProductsUpdate}
                onCollectionsUpdate={handleCollectionsUpdate}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-secondary/30 border-t mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground text-sm font-bold">E</span>
                </div>
                <span className="font-heading font-bold text-xl">Elegance</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Timeless fashion crafted with precision and care. Discover your perfect style.
              </p>
              <div className="flex space-x-4">
                <div className="w-6 h-6 bg-muted rounded flex items-center justify-center">
                  <span className="text-xs">f</span>
                </div>
                <div className="w-6 h-6 bg-muted rounded flex items-center justify-center">
                  <span className="text-xs">t</span>
                </div>
                <div className="w-6 h-6 bg-muted rounded flex items-center justify-center">
                  <span className="text-xs">i</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-heading font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => navigateTo(item.key)}
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={() => navigateTo('wishlist')}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Wishlist
                </button>
              </div>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="font-heading font-semibold mb-4">Customer Service</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Size Guide</p>
                <p>Shipping Info</p>
                <p>Returns</p>
                <p>FAQ</p>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="font-heading font-semibold mb-4">Stay Updated</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Subscribe to our newsletter for the latest collections and offers.
              </p>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  toast.success('Successfully subscribed to newsletter!');
                }}
                className="space-y-2"
              >
                <Input type="email" placeholder="Enter your email" className="bg-background" />
                <Button type="submit" className="w-full" size="sm">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Elegance Fashion. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}