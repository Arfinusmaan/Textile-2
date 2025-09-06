"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Share2,
  ZoomIn,
  Package2,
  Star,
  Plus,
  Minus,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Filter,
  ChevronDown,
  Camera,
  CheckCircle,
  AlertCircle,
  Truck,
  RefreshCw,
  Phone,
  Shield
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";

// Mock product data with comprehensive information
const mockProductData = {
  id: "kurti-001",
  name: "Ethereal Silk Kurti",
  price: 2850,
  originalPrice: 3200,
  rating: 4.7,
  reviewCount: 248,
  images: [
    "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-an-e-8ec064f6-20250904080844.jpg",
    "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-a-st-22905886-20250904080855.jpg",
    "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-an-e-4eb72a2a-20250904080904.jpg",
    "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-a-ha-3762c4ca-20250904080914.jpg",
  ],
  sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  colors: [
    { name: "Ivory", value: "#f8f6f0" },
    { name: "Blush", value: "#f7d4d3" },
    { name: "Sage", value: "#a8b5a0" }
  ],
  fabric: "Pure Silk",
  care: "Dry clean only",
  inStock: true,
  stockCount: 12,
  category: "Kurtis",
  brand: "Elegance",
  sku: "ELG-KUR-001",
  description: "Crafted from luxurious pure silk, this ethereal kurti features delicate hand-embroidered details and a flattering A-line silhouette. Perfect for special occasions or elevated everyday wear.",
  features: [
    "Hand-embroidered neckline with gold thread",
    "3/4 sleeve design with button cuffs",
    "A-line silhouette for flattering fit",
    "Side slits for comfort and movement",
    "Premium silk lining for comfort",
    "Traditional motifs with contemporary styling"
  ],
  specifications: {
    material: "100% Pure Silk",
    work: "Hand Embroidery",
    pattern: "Traditional Motifs",
    occasion: "Festive, Party, Wedding",
    season: "All Season",
    neckline: "Round Neck",
    sleeves: "3/4 Sleeves",
    length: "Knee Length"
  }
};

const mockReviews = [
  {
    id: "rev-001",
    userId: "user-001",
    userName: "Priya Sharma",
    userAvatar: "PS",
    rating: 5,
    title: "Absolutely gorgeous!",
    comment: "The quality is exceptional and the embroidery work is beautiful. Perfect for festivals and special occasions. The silk is premium quality and the fit is exactly as described.",
    date: "2024-01-15",
    verified: true,
    helpful: 24,
    images: []
  },
  {
    id: "rev-002",
    userId: "user-002",
    userName: "Anita Gupta",
    userAvatar: "AG",
    rating: 4,
    title: "Great quality, runs slightly large",
    comment: "Beautiful kurti with excellent embroidery. The silk is soft and comfortable. I ordered Medium but it's a bit loose, so I'd recommend going one size smaller. Overall very happy with the purchase.",
    date: "2024-01-10",
    verified: true,
    helpful: 18,
    images: []
  },
  {
    id: "rev-003",
    userId: "user-003",
    userName: "Meera Patel",
    userAvatar: "MP",
    rating: 5,
    title: "Perfect for wedding functions",
    comment: "Wore this to multiple wedding functions and received so many compliments! The color is exactly as shown in pictures and the quality is top-notch. Will definitely order more from this brand.",
    date: "2024-01-08",
    verified: true,
    helpful: 31,
    images: []
  },
  {
    id: "rev-004",
    userId: "user-004",
    userName: "Kavya Singh",
    userAvatar: "KS",
    rating: 4,
    title: "Good purchase",
    comment: "Nice kurti but the embroidery could be more detailed for the price. Still a good purchase overall and the delivery was fast.",
    date: "2024-01-05",
    verified: false,
    helpful: 8,
    images: []
  }
];

const relatedProducts = [
  {
    id: "dupatta-001",
    name: "Matching Silk Dupatta",
    price: 1200,
    originalPrice: 1500,
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-an-e-9b3975cb-20250904080927.jpg",
    rating: 4.6,
    category: "Dupatta"
  },
  {
    id: "palazzo-001", 
    name: "Flowing Palazzo Pants",
    price: 1800,
    originalPrice: 2200,
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-an-e-36937f4d-20250904081005.jpg",
    rating: 4.5,
    category: "Bottoms"
  },
  {
    id: "earrings-001",
    name: "Traditional Gold Earrings",
    price: 2400,
    originalPrice: 2800,
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-an-a-971faffc-20250904080947.jpg",
    rating: 4.8,
    category: "Jewelry"
  },
  {
    id: "kurti-002",
    name: "Similar Style Kurti",
    price: 2650,
    originalPrice: 3100,
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-a-be-634942f5-20250904080956.jpg",
    rating: 4.4,
    category: "Kurtis"
  }
];

export default function ProductDetailPage({ 
  selectedProductId, 
  onNavigate, 
  onAddToCart, 
  onAddToWishlist, 
  onRemoveFromWishlist,
  wishlistItems = [],
  products = [],
  collections = []
}) {
  // Get product data from props or use mock data
  const productData = useMemo(() => {
    if (selectedProductId && products.length > 0) {
      const foundProduct = products.find(p => p.id === selectedProductId);
      if (foundProduct) return foundProduct;
    }
    return mockProductData;
  }, [selectedProductId, products]);

  // Component state
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(productData.colors?.[0]?.name || productData.colors?.[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  
  // Review states
  const [reviews, setReviews] = useState(mockReviews);
  const [reviewFilter, setReviewFilter] = useState("all");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    comment: ""
  });

  // Check if item is in wishlist
  const isWishlisted = useMemo(() => {
    return wishlistItems.includes(productData.id);
  }, [wishlistItems, productData.id]);

  // Calculate rating distribution
  const ratingDistribution = useMemo(() => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      dist[review.rating] += 1;
    });
    return dist;
  }, [reviews]);

  // Filter reviews
  const filteredReviews = useMemo(() => {
    if (reviewFilter === "all") return reviews;
    if (reviewFilter === "verified") return reviews.filter(r => r.verified);
    if (reviewFilter === "photos") return reviews.filter(r => r.images?.length > 0);
    return reviews.filter(r => r.rating === parseInt(reviewFilter));
  }, [reviews, reviewFilter]);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error("Please select a size before adding to cart");
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const cartItem = {
        id: productData.id,
        name: productData.name,
        price: productData.price,
        image: productData.images?.[0] || productData.image,
        size: selectedSize,
        color: selectedColor,
        quantity: quantity
      };

      if (onAddToCart) {
        onAddToCart(cartItem);
      }
      
      toast.success(`Added ${productData.name} to cart!`, {
        description: `Size: ${selectedSize}, Color: ${selectedColor}, Quantity: ${quantity}`
      });
    } catch (error) {
      toast.error("Failed to add to cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      onRemoveFromWishlist?.(productData.id);
      toast.success("Removed from wishlist");
    } else {
      onAddToWishlist?.(productData.id);
      toast.success("Added to wishlist");
    }
  };

  const handleQuickAdd = async (product) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      if (onAddToCart) {
        onAddToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        });
      }
      toast.success(`Added ${product.name} to cart!`);
    } catch (error) {
      toast.error("Failed to add item to cart");
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: productData.name,
          text: productData.description,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Product link copied to clipboard!");
      }
    } catch (error) {
      toast.error("Failed to share product");
    }
  };

  const handleSubmitReview = async () => {
    if (!newReview.title.trim() || !newReview.comment.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const review = {
        id: `rev-${Date.now()}`,
        userId: "current-user",
        userName: "You",
        userAvatar: "YU",
        rating: newReview.rating,
        title: newReview.title,
        comment: newReview.comment,
        date: new Date().toISOString().split('T')[0],
        verified: false,
        helpful: 0,
        images: []
      };

      setReviews(prev => [review, ...prev]);
      setNewReview({ rating: 5, title: "", comment: "" });
      setShowReviewForm(false);
      toast.success("Review submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit review");
    }
  };

  const handleHelpfulReview = (reviewId) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: review.helpful + 1 }
        : review
    ));
    toast.success("Thank you for your feedback!");
  };

  return (
    <div className="bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => onNavigate?.('home')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </button>
            <span className="text-muted-foreground">/</span>
            <button
              onClick={() => onNavigate?.('products')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Products
            </button>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{productData.category || 'Product'}</span>
          </div>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div 
              className="relative aspect-[4/5] bg-muted rounded-lg overflow-hidden group cursor-zoom-in"
              onClick={() => setIsZoomOpen(true)}
            >
              <img
                src={productData.images?.[selectedImage] || productData.image}
                alt={productData.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              
              {/* Sale badge */}
              {productData.originalPrice && productData.originalPrice > productData.price && (
                <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground">
                  {Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100)}% OFF
                </Badge>
              )}
            </div>

            {/* Thumbnails */}
            {productData.images && productData.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {productData.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 aspect-[4/5] w-20 rounded-md overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? "border-primary" : "border-transparent hover:border-border"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {productData.brand && (
                    <span className="text-sm text-muted-foreground">{productData.brand}</span>
                  )}
                  {productData.sku && (
                    <Badge variant="outline" className="text-xs">{productData.sku}</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleWishlistToggle}
                    className={isWishlisted ? "text-red-500" : ""}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleShare}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <h1 className="text-3xl font-heading font-bold mb-4">{productData.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">₹{productData.price?.toLocaleString() || 'N/A'}</span>
                  {productData.originalPrice && productData.originalPrice > productData.price && (
                    <span className="text-lg text-muted-foreground line-through">
                      ₹{productData.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                {productData.originalPrice && productData.originalPrice > productData.price && (
                  <Badge variant="secondary" className="bg-accent text-accent-foreground">
                    Save ₹{(productData.originalPrice - productData.price).toLocaleString()}
                  </Badge>
                )}
              </div>
              
              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.floor(productData.rating || 0)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{productData.rating || 0}</span>
                  <span className="text-muted-foreground">
                    ({productData.reviewCount || reviews.length} reviews)
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className="text-primary hover:text-primary/80 text-sm font-medium"
                >
                  Read Reviews
                </button>
              </div>
            </div>

            {/* Size Selector */}
            {productData.sizes && productData.sizes.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Size</label>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowSizeGuide(true)}
                    className="text-xs text-primary hover:text-primary/80"
                  >
                    Size Guide
                  </Button>
                </div>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent className="bg-card text-foreground rounded-md shadow-lg">
                      {productData.sizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
              </div>
            )}

            {/* Color Selector */}
            {productData.colors && productData.colors.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Color: {selectedColor}
                </label>
                <div className="flex gap-2">
                  {productData.colors.map((color) => {
                    const colorName = typeof color === 'string' ? color : color.name;
                    const colorValue = typeof color === 'string' ? 
                      (color === "Ivory" ? "#f8f6f0" : 
                       color === "Blush" ? "#f7d4d3" : 
                       color === "Sage" ? "#a8b5a0" : color) : 
                      color.value;
                    
                    return (
                      <button
                        key={colorName}
                        onClick={() => setSelectedColor(colorName)}
                        className={`w-8 h-8 rounded-full border-2 transition-colors ${
                          selectedColor === colorName ? "border-primary" : "border-border hover:border-border/60"
                        }`}
                        style={{ backgroundColor: colorValue }}
                        title={colorName}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Material & Care */}
            <div className="flex gap-2 flex-wrap">
              {productData.fabric && <Badge variant="outline">{productData.fabric}</Badge>}
              {productData.care && <Badge variant="outline">{productData.care}</Badge>}
              {productData.category && <Badge variant="outline">{productData.category}</Badge>}
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Quantity</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= (productData.stockCount || 10)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 text-sm">
              {productData.inStock !== false ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">
                    In stock {productData.stockCount && `(${productData.stockCount} available)`}
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  <span className="text-destructive">Out of stock</span>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={productData.inStock === false || isLoading || !selectedSize}
                  className="flex-1"
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {isLoading ? "Adding..." : "Add to Cart"}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleWishlistToggle}
                  className={isWishlisted ? "bg-accent text-accent-foreground" : ""}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </Button>
              </div>
              
              <Button
                variant="outline"
                onClick={() => onNavigate?.('cart')}
                className="w-full"
                size="lg"
              >
                <Package2 className="w-5 h-5 mr-2" />
                Buy Now
              </Button>
            </div>

            {/* Delivery & Service Info */}
            <div className="space-y-3 p-4 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="w-4 h-4 text-green-600" />
                <span>Free delivery on orders above ₹2000</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RefreshCw className="w-4 h-4 text-blue-600" />
                <span>30-day easy returns & exchanges</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-purple-600" />
                <span>24/7 customer support available</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="w-4 h-4 text-orange-600" />
                <span>1 year quality guarantee</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Information Tabs */}
        <div className="mt-16">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Details</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="care">Care Guide</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                    {productData.description}
                  </p>
                  
                  {productData.features && (
                    <div>
                      <h3 className="font-semibold mb-4">Key Features:</h3>
                      <ul className="space-y-2">
                        {productData.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {productData.specifications ? Object.entries(productData.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between border-b border-border pb-2">
                        <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                    )) : (
                      <div className="space-y-3">
                        <div className="flex justify-between border-b border-border pb-2">
                          <span className="font-medium">Material:</span>
                          <span className="text-muted-foreground">{productData.fabric || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between border-b border-border pb-2">
                          <span className="font-medium">Care Instructions:</span>
                          <span className="text-muted-foreground">{productData.care || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between border-b border-border pb-2">
                          <span className="font-medium">Category:</span>
                          <span className="text-muted-foreground">{productData.category || 'N/A'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="care" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3">Washing Instructions</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• Dry clean only to preserve fabric quality and embroidery</li>
                        <li>• Do not machine wash or hand wash</li>
                        <li>• Avoid bleaching or harsh chemicals</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-3">Storage</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• Store in a cool, dry place away from direct sunlight</li>
                        <li>• Use padded hangers to maintain shape</li>
                        <li>• Keep in breathable garment bags for long-term storage</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-3">Ironing</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• Iron on low heat with a protective cloth</li>
                        <li>• Avoid direct contact with embroidered areas</li>
                        <li>• Steam from a distance for best results</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {/* Review Summary */}
                <Card>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="text-center">
                        <div className="text-4xl font-bold mb-2">{productData.rating || 4.7}</div>
                        <div className="flex items-center justify-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${
                                star <= Math.floor(productData.rating || 4.7)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-muted-foreground">
                          Based on {reviews.length} reviews
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center gap-3">
                            <span className="text-sm w-8">{rating}★</span>
                            <Progress 
                              value={(ratingDistribution[rating] / reviews.length) * 100} 
                              className="flex-1 h-2"
                            />
                            <span className="text-sm text-muted-foreground w-8">
                              {ratingDistribution[rating]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Review Filters */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Select value={reviewFilter} onValueChange={setReviewFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card text-foreground rounded-md shadow-lg">
                        <SelectItem value="all">All Reviews</SelectItem>
                        <SelectItem value="5">5 Stars</SelectItem>
                        <SelectItem value="4">4 Stars</SelectItem>
                        <SelectItem value="3">3 Stars</SelectItem>
                        <SelectItem value="2">2 Stars</SelectItem>
                        <SelectItem value="1">1 Star</SelectItem>
                        <SelectItem value="verified">Verified Only</SelectItem>
                        <SelectItem value="photos">With Photos</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <span className="text-sm text-muted-foreground">
                      {filteredReviews.length} of {reviews.length} reviews
                    </span>
                  </div>
                  
                  <Button onClick={() => setShowReviewForm(true)} variant="outline">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Write Review
                  </Button>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {filteredReviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{review.userAvatar}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{review.userName}</span>
                                {review.verified && (
                                  <Badge variant="secondary" className="text-xs">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-3 h-3 ${
                                        star <= review.rating
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-muted-foreground">{review.date}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">{review.title}</h4>
                          <p className="text-muted-foreground">{review.comment}</p>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <button
                            onClick={() => handleHelpfulReview(review.id)}
                            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <ThumbsUp className="w-3 h-3" />
                            Helpful ({review.helpful})
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Related Products */}
      <div className="border-t bg-secondary/30 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-heading font-bold">You might also like</h2>
            <Button 
              onClick={() => onNavigate?.('products')}
              variant="outline"
            >
              View All Products
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardContent className="p-0">
                    <div 
                      className="aspect-[4/5] bg-muted rounded-t-lg overflow-hidden"
                      onClick={() => onNavigate?.('product', product.id)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium mb-2 line-clamp-2">{product.name}</h3>
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= Math.floor(product.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">
                          ({product.rating})
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">₹{product.price.toLocaleString()}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              ₹{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickAdd(product);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
        <DialogContent className="max-w-4xl w-full h-[90vh] p-0 overflow-hidden">
          <div className="relative w-full h-full bg-black">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-4 right-4 z-10 text-white hover:bg-primary/20"
            >
              ✕
            </Button>
            
            <div className="w-full h-full flex items-center justify-center p-4">
              <img
                src={productData.images?.[selectedImage] || productData.image}
                alt={productData.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Navigation */}
            {productData.images && productData.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {productData.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      selectedImage === index ? "bg-primary" : "bg-primary/50 hover:bg-primary/75"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Review Form Modal */}
      <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
        <DialogContent className="max-w-2xl bg-background text-foreground rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                    className="p-1"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= newReview.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300 hover:text-yellow-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Review Title</label>
              <Input
                placeholder="Summarize your review in one line"
                value={newReview.title}
                onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Your Review</label>
              <Textarea
                placeholder="Share your experience with this product..."
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                rows={4}
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSubmitReview} className="flex-1">
                Submit Review
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowReviewForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Size Guide Modal */}
      <Dialog open={showSizeGuide} onOpenChange={setShowSizeGuide}>
        <DialogContent className="max-w-2xl bg-background text-foreground rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle>Size Guide</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <p className="text-foreground">
              Our kurtas are designed for a comfortable, relaxed fit. For the best fit, measure yourself and compare with our size chart below.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border px-4 py-2 text-left">Size</th>
                    <th className="border border-border px-4 py-2 text-left">Bust (inches)</th>
                    <th className="border border-border px-4 py-2 text-left">Waist (inches)</th>
                    <th className="border border-border px-4 py-2 text-left">Length (inches)</th>
                  </tr>
                </thead>
                <tbody>
                  {[ 
                    ["XS", "32", "26", "42"],
                    ["S", "34", "28", "42"], 
                    ["M", "36", "30", "43"],
                    ["L", "38", "32", "43"],
                    ["XL", "40", "34", "44"],
                    ["XXL", "42", "36", "44"]
                  ].map(([size, bust, waist, length]) => (
                    <tr key={size}>
                      <td className="border border-border px-4 py-2 font-medium">{size}</td>
                      <td className="border border-border px-4 py-2">{bust}</td>
                      <td className="border border-border px-4 py-2">{waist}</td>
                      <td className="border border-border px-4 py-2">{length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-accent/10 p-4 rounded-lg">
              <h4 className="font-medium mb-2">How to Measure:</h4>
              <ul className="space-y-1 text-sm text-foreground">
                <li>• <strong>Bust:</strong> Measure around the fullest part of your chest</li>
                <li>• <strong>Waist:</strong> Measure at your natural waistline</li>
                <li>• <strong>Length:</strong> Measured from shoulder to hem</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}