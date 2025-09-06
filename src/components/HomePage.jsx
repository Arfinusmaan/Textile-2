"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { House, Grid3x2, CreditCard, LayoutTemplate, PanelRight, Frame, Play, Pause, ChevronLeft, ChevronRight, Star, Heart, ShoppingBag, Sparkles } from 'lucide-react';

const HERO_THEMES = [
  {
    id: 'wedding',
    label: 'Wedding',
    title: 'Timeless Elegance',
    subtitle: 'Discover perfect wedding attire',
    description: 'From intimate ceremonies to grand celebrations',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-a-st-22905886-20250904080855.jpg',
    cta: 'Shop Wedding Collection',
    bgGradient: 'from-rose-50 via-pink-50 to-red-50',
    accentColor: 'text-rose-600',
    badge: 'Most Popular',
    features: ['Premium Fabrics', 'Custom Fitting', 'Designer Collection']
  },
  {
    id: 'festival',
    label: 'Festival',
    title: 'Vibrant Celebrations',
    subtitle: 'Embrace festive fashion',
    description: 'Bold colors and traditional designs',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-trad-14261b8a-20250904081016.jpg',
    cta: 'Explore Festival Wear',
    bgGradient: 'from-amber-50 via-orange-50 to-yellow-50',
    accentColor: 'text-amber-600',
    badge: 'New Collection',
    features: ['Traditional Designs', 'Vibrant Colors', 'Festive Specials']
  },
  {
    id: 'casual',
    label: 'Casual',
    title: 'Everyday Comfort',
    subtitle: 'Relaxed style, refined taste',
    description: 'Perfect for daily elegance',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-an-e-36937f4d-20250904081005.jpg',
    cta: 'Browse Casual Wear',
    bgGradient: 'from-blue-50 via-indigo-50 to-purple-50',
    accentColor: 'text-blue-600',
    badge: 'Comfort First',
    features: ['Everyday Comfort', 'Versatile Styles', 'Premium Cotton']
  }
];

const FEATURED_CATEGORIES = [
  {
    id: 'sarees',
    name: 'Sarees',
    description: 'Traditional elegance redefined',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-an-e-8ec064f6-20250904080844.jpg',
    count: '200+ styles'
  },
  {
    id: 'lehengas',
    name: 'Lehengas',
    description: 'Bridal & festive grandeur',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-a-st-22905886-20250904080855.jpg',
    count: '150+ designs'
  },
  {
    id: 'suits',
    name: 'Suits & Sets',
    description: 'Contemporary comfort',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-a-ha-3762c4ca-20250904080914.jpg',
    count: '180+ pieces'
  },
  {
    id: 'kurtis',
    name: 'Kurtis',
    description: 'Everyday sophistication',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-an-e-36937f4d-20250904081005.jpg',
    count: '300+ options'
  },
  {
    id: 'kids',
    name: 'Kids Wear',
    description: 'Little ones, big style',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-a-cu-657a3163-20250904080938.jpg',
    count: '120+ adorable pieces'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Complete your look',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-an-a-971faffc-20250904080947.jpg',
    count: '500+ items'
  }
];

const SEASONAL_PROMOTIONS = [
  {
    id: 'wedding-special',
    title: 'Wedding Specials',
    subtitle: 'Up to 40% Off',
    description: 'Bridal collection sale',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-a-st-22905886-20250904080855.jpg',
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    cta: 'Shop Wedding Sale'
  },
  {
    id: 'festival-sale',
    title: 'Festival Sale',
    subtitle: 'Buy 2 Get 1 Free',
    description: 'Festive wear collection',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-trad-14261b8a-20250904081016.jpg',
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    cta: 'Shop Festival Sale'
  }
];

const TRENDING_OUTFITS = [
  {
    id: 'trending-1',
    name: 'Silk Banarasi Saree',
    price: '₹12,999',
    originalPrice: '₹18,999',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-an-e-9b3975cb-20250904080927.jpg',
    isNew: true
  },
  {
    id: 'trending-2',
    name: 'Designer Lehenga Set',
    price: '₹25,999',
    originalPrice: '₹35,999',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-a-st-22905886-20250904080855.jpg',
    isBestseller: true
  },
  {
    id: 'trending-3',
    name: 'Embroidered Kurta Set',
    price: '₹4,999',
    originalPrice: '₹7,999',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-an-e-4eb72a2a-20250904080904.jpg',
    isNew: false
  },
  {
    id: 'trending-4',
    name: 'Kids Festive Dress',
    price: '₹2,999',
    originalPrice: '₹4,999',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-a-be-634942f5-20250904080956.jpg',
    isBestseller: false
  }
];

function CountdownTimer({ endDate }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 30000);
    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="flex gap-2 text-sm font-mono">
      <span className="bg-primary text-primary-foreground px-2 py-1 rounded">
        {String(timeLeft.days).padStart(2, '0')}d
      </span>
      <span className="bg-primary text-primary-foreground px-2 py-1 rounded">
        {String(timeLeft.hours).padStart(2, '0')}h
      </span>
      <span className="bg-primary text-primary-foreground px-2 py-1 rounded">
        {String(timeLeft.minutes).padStart(2, '0')}m
      </span>
    </div>
  );
}

function LoadingSkeleton({ className }) {
  return (
    <div className={`animate-pulse bg-muted rounded-lg ${className}`} />
  );
}

export default function HomePage({ onAddToCart, onNavigate }) {
  const [currentTheme, setCurrentTheme] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentTheme((prevTheme) => (prevTheme + 1) % HERO_THEMES.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleThemeChange = useCallback((themeIndex) => {
    setCurrentTheme(themeIndex);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  const handlePrevTheme = useCallback(() => {
    const prevIndex = currentTheme === 0 ? HERO_THEMES.length - 1 : currentTheme - 1;
    handleThemeChange(prevIndex);
  }, [currentTheme, handleThemeChange]);

  const handleNextTheme = useCallback(() => {
    const nextIndex = (currentTheme + 1) % HERO_THEMES.length;
    handleThemeChange(nextIndex);
  }, [currentTheme, handleThemeChange]);

  const handleNewsletterSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setNewsletterLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Successfully subscribed to newsletter!');
      setNewsletterEmail('');
    } catch (err) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setNewsletterLoading(false);
    }
  }, [newsletterEmail]);

  const handleQuickAdd = useCallback((productId) => {
    if (onAddToCart) {
      onAddToCart(productId);
    }
    toast.success('Added to cart successfully!');
  }, [onAddToCart]);

  const handleCategoryClick = useCallback((categoryId) => {
    if (onNavigate) {
      onNavigate('collections', { category: categoryId });
    }
    toast.success(`Browsing ${categoryId} collection`);
  }, [onNavigate]);

  const handleProductClick = useCallback((productId) => {
    if (onNavigate) {
      onNavigate('product', { id: productId });
    }
  }, [onNavigate]);

  const currentHeroTheme = useMemo(() => HERO_THEMES[currentTheme], [currentTheme]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className={`relative overflow-hidden bg-gradient-to-br ${currentHeroTheme.bgGradient}`}>
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full rounded-full bg-gradient-to-br from-white/5 to-transparent animate-pulse" />
        </div>

        <div className="container mx-auto px-6 py-20 lg:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <Badge variant="secondary" className={`${currentHeroTheme.accentColor} bg-background/80 backdrop-blur-sm px-4 py-2 text-sm font-semibold w-fit`}>
                <Sparkles className="w-4 h-4 mr-2" />
                {currentHeroTheme.badge}
              </Badge>

              <div className="space-y-6">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {currentHeroTheme.title}
                </h1>
                <h2 className={`text-xl lg:text-2xl font-semibold ${currentHeroTheme.accentColor}`}>
                  {currentHeroTheme.subtitle}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {currentHeroTheme.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {currentHeroTheme.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 bg-background/60 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="text-lg px-8 py-4 bg-secondary hover:bg-secondary/90 transition-colors"
                    onClick={() => handleCategoryClick(currentHeroTheme.id)}
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    {currentHeroTheme.cta}
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-lg px-8 py-4 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                    onClick={() => onNavigate && onNavigate('wishlist')}
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    View Wishlist
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">Choose Collection:</p>
                    <button
                      onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                      className="p-2 rounded-full bg-background/60 backdrop-blur-sm hover:bg-background/80 transition-colors"
                    >
                      {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={handlePrevTheme}
                      className="p-2 rounded-full bg-background/60 backdrop-blur-sm hover:bg-background/80 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <Tabs value={currentTheme.toString()} className="flex-1">
                      <TabsList className="grid w-full grid-cols-3 bg-background/60 backdrop-blur-sm">
                        {HERO_THEMES.map((theme, index) => (
                          <TabsTrigger
                            key={theme.id}
                            value={index.toString()}
                            onClick={() => handleThemeChange(index)}
                            className="text-sm font-medium"
                          >
                            {theme.label}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>

                    <button onClick={handleNextTheme} className="p-2 rounded-full bg-background/60 backdrop-blur-sm hover:bg-background/80 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex gap-2 justify-center">
                    {HERO_THEMES.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleThemeChange(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentTheme ? 'bg-primary' : 'bg-background/40'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-[500px] lg:h-[600px]">
              <div className="relative h-full rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-white/10 to-transparent backdrop-blur-sm border border-white/20">
                {loading ? (
                  <LoadingSkeleton className="w-full h-full" />
                ) : (
                  <>
                    <img
                      key={currentTheme}
                      src={currentHeroTheme.image}
                      alt={currentHeroTheme.title}
                      className="w-full h-full object-cover transition-opacity duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                    
                    <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="w-3 h-3 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <span className="text-sm font-semibold">4.9</span>
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-sm font-semibold">In Stock</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-8 border-t border-white/20">
            {[
              { number: '10K+', label: 'Happy Customers' },
              { number: '500+', label: 'Premium Designs' },
              { number: '4.9', label: 'Average Rating' },
              { number: '24/7', label: 'Support Available' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl lg:text-3xl font-bold mb-2">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Featured Categories</h2>
            <p className="text-lg text-muted-foreground">Discover our curated collections</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURED_CATEGORIES.map((category) => (
              <Card 
                key={category.id}
                className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-muted-foreground mb-2">{category.description}</p>
                  <p className="text-sm text-accent font-medium">{category.count}</p>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Explore Collection
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-secondary/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Special Offers</h2>
            <p className="text-lg text-muted-foreground">Limited time deals you can't miss</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {SEASONAL_PROMOTIONS.map((promotion) => (
              <Card key={promotion.id} className="group cursor-pointer overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={promotion.image}
                    alt={promotion.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-2xl font-bold mb-2">{promotion.title}</h3>
                    <p className="text-xl font-semibold text-accent mb-1">{promotion.subtitle}</p>
                    <p className="text-sm opacity-90 mb-4">{promotion.description}</p>
                    <div className="flex items-center justify-between">
                      <CountdownTimer endDate={promotion.endDate} />
                      <Button size="sm" variant="secondary">
                        {promotion.cta}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Trending Now</h2>
              <p className="text-lg text-muted-foreground">Most loved by our customers</p>
            </div>
            <Button 
              variant="outline"
              onClick={() => onNavigate && onNavigate('products')}
            >
              View All Trending
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {TRENDING_OUTFITS.map((outfit) => (
              <Card 
                key={outfit.id}
                className="group cursor-pointer hover:shadow-lg transition-shadow duration-300"
                onClick={() => handleProductClick(outfit.id)}
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={outfit.image}
                    alt={outfit.name}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {outfit.isNew && (
                    <span className="absolute top-2 left-2 bg-accent text-accent-foreground px-2 py-1 text-xs font-medium rounded">
                      New
                    </span>
                  )}
                  {outfit.isBestseller && (
                    <span className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 text-xs font-medium rounded">
                      Bestseller
                    </span>
                  )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickAdd(outfit.id);
                        }}
                        className="absolute bottom-2 right-2 bg-background/90 hover:bg-background p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                    <CreditCard className="h-4 w-4" />
                  </button>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{outfit.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">{outfit.price}</span>
                    {outfit.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {outfit.originalPrice}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-secondary/50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Stay Updated</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Get the latest fashion trends and exclusive offers delivered to your inbox
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
                <Button type="submit" disabled={newsletterLoading} className="px-8">
                  {newsletterLoading ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Quick Shop</h3>
                <p className="text-muted-foreground">
                  Need help choosing? Connect with our style experts
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <House className="h-4 w-4" />
                  Store Pickup
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Frame className="h-4 w-4" />
                  WhatsApp Shop
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}