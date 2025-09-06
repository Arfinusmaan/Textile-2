"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";
import { Grid3x3, SwatchBook, GalleryThumbnails } from "lucide-react";
import { toast } from "sonner";

// Mock data for collections with updated images
const mockCollections = [
  {
    id: 1,
    name: "Sarees",
    tagline: "Timeless elegance in every drape",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-an-e-8ec064f6-20250904080844.jpg",
    subCategoriesCount: 12,
    colors: ["#8B4513", "#DAA520", "#CD853F", "#F4A460"],
    sampleProducts: [
      { id: 1, image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-an-e-8ec064f6-20250904080844.jpg", name: "Silk Saree" },
      { id: 2, image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-an-e-9b3975cb-20250904080927.jpg", name: "Cotton Saree" },
      { id: 3, image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-trad-14261b8a-20250904081016.jpg", name: "Designer Saree" }
    ]
  },
  {
    id: 2,
    name: "Lehengas", 
    tagline: "Royal grandeur for special moments",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-a-st-22905886-20250904080855.jpg",
    subCategoriesCount: 8,
    colors: ["#800080", "#FF1493", "#DC143C", "#FFD700"],
    sampleProducts: [
      { id: 4, image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-a-st-22905886-20250904080855.jpg", name: "Bridal Lehenga" },
      { id: 5, image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-trad-14261b8a-20250904081016.jpg", name: "Party Lehenga" },
      { id: 6, image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-an-e-9b3975cb-20250904080927.jpg", name: "Designer Lehenga" }
    ]
  },
  {
    id: 3,
    name: "Men's Wear",
    tagline: "Sophisticated style meets comfort",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-an-e-4eb72a2a-20250904080904.jpg",
    subCategoriesCount: 15,
    colors: ["#2F4F4F", "#8B4513", "#000080", "#696969"],
    sampleProducts: [
      { id: 7, image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-an-e-4eb72a2a-20250904080904.jpg", name: "Kurta Set" },
      { id: 8, image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-a-ha-3762c4ca-20250904080914.jpg", name: "Formal Suit" },
      { id: 9, image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-an-e-36937f4d-20250904081005.jpg", name: "Casual Shirt" }
    ]
  },
  {
    id: 4,
    name: "Kids Wear",
    tagline: "Playful fashion for little ones",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-a-cu-657a3163-20250904080938.jpg",
    subCategoriesCount: 10,
    colors: ["#FF69B4", "#87CEEB", "#98FB98", "#FFB6C1"],
    sampleProducts: [
      { id: 10, image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-a-cu-657a3163-20250904080938.jpg", name: "Kids Lehenga" },
      { id: 11, image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-a-be-634942f5-20250904080956.jpg", name: "Boys Kurta" },
      { id: 12, image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-a-cu-657a3163-20250904080938.jpg", name: "Kids Dress" }
    ]
  },
  {
    id: 5,
    name: "Wedding Specials",
    tagline: "Make your big day unforgettable",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-a-st-22905886-20250904080855.jpg",
    subCategoriesCount: 6,
    colors: ["#FFD700", "#DC143C", "#8B0000", "#FF4500"],
    sampleProducts: [
      { id: 13, image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-a-st-22905886-20250904080855.jpg", name: "Bridal Wear" },
      { id: 14, image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-a-ha-3762c4ca-20250904080914.jpg", name: "Groom Wear" },
      { id: 15, image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-trad-14261b8a-20250904081016.jpg", name: "Family Set" }
    ]
  },
  {
    id: 6,
    name: "Accessories",
    tagline: "Complete your look with perfect details",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-an-a-971faffc-20250904080947.jpg",
    subCategoriesCount: 20,
    colors: ["#FFD700", "#C0C0C0", "#FF6347", "#4169E1"],
    sampleProducts: [
      { id: 16, image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-an-a-971faffc-20250904080947.jpg", name: "Jewelry Set" },
      { id: 17, image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-an-a-971faffc-20250904080947.jpg", name: "Handbag" },
      { id: 18, image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-an-a-971faffc-20250904080947.jpg", name: "Footwear" }
    ]
  }
];

const occasions = [
  { id: 1, name: "Wedding", color: "#FFD700" },
  { id: 2, name: "Festival", color: "#FF6347" },
  { id: 3, name: "Casual", color: "#87CEEB" },
  { id: 4, name: "Office", color: "#696969" }
];

export default function CollectionsPage({ 
  collections: propCollections = [], 
  onNavigate = () => {}, 
  onAddToCart = () => {},
  pageData = null 
}) {
  const [collections, setCollections] = useState([]);
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Fetch collections data
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        // Use props if available, otherwise use mock data
        const collectionsToUse = propCollections.length > 0 ? propCollections : mockCollections;
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCollections(collectionsToUse);
        setFilteredCollections(collectionsToUse);
      } catch (err) {
        setError("Failed to load collections");
        toast.error("Failed to load collections. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [propCollections]);

  // Handle search filtering
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCollections(collections);
    } else {
      const filtered = collections.filter(collection =>
        collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collection.tagline.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCollections(filtered);
    }
  }, [searchQuery, collections]);

  const handleCollectionClick = (collection) => {
    setSelectedCollection(collection);
    setIsPreviewOpen(true);
  };

  const handleBrowseCollection = (collectionId) => {
    // Navigate to collection detail or filtered product list
    const collection = collections.find(c => c.id === collectionId);
    onNavigate('collection-detail', { collectionId, collectionName: collection?.name });
    setIsPreviewOpen(false);
  };

  const handleOccasionClick = (occasionName) => {
    // Navigate to products filtered by occasion
    onNavigate('products', { category: occasionName });
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Retry logic would go here
    setTimeout(() => {
      const collectionsToUse = propCollections.length > 0 ? propCollections : mockCollections;
      setCollections(collectionsToUse);
      setFilteredCollections(collectionsToUse);
      setLoading(false);
    }, 1000);
  };

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-heading">Something went wrong</h2>
          <p className="text-muted-foreground">We couldn't load the collections. Please try again.</p>
        </div>
        <Button onClick={handleRetry} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl md:text-5xl font-heading">Our Collections</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover our curated selection of premium fashion collections, each crafted with attention to detail and timeless elegance.
        </p>
        
        {/* Search */}
        <div className="max-w-md mx-auto">
          <Input
            type="text"
            placeholder="Search collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-card"
          />
        </div>
      </motion.div>

      {/* Collections Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array(6).fill(0).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="aspect-[4/3] w-full" />
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredCollections.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <GalleryThumbnails className="w-16 h-16 mx-auto text-muted-foreground" />
          <h3 className="text-xl font-heading">No collections found</h3>
          <p className="text-muted-foreground">
            {searchQuery ? "Try adjusting your search terms." : "Collections will appear here once available."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCollections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className="group overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-card"
                onClick={() => handleCollectionClick(collection)}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  {/* Color swatches */}
                  <div className="absolute top-4 right-4 flex space-x-1">
                    {collection.colors.slice(0, 4).map((color, colorIndex) => (
                      <div
                        key={colorIndex}
                        className="w-3 h-3 rounded-full border border-white/50 shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  
                  {/* Overlay content */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-heading mb-1">{collection.name}</h3>
                    <p className="text-sm opacity-90">{collection.tagline}</p>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Grid3x3 className="w-4 h-4" />
                      <span>{collection.subCategoriesCount} categories</span>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBrowseCollection(collection.id);
                      }}
                    >
                      Browse Collection
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Shop by Occasion */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-6"
      >
        <div className="text-center">
          <h2 className="text-3xl font-heading mb-2">Shop by Occasion</h2>
          <p className="text-muted-foreground">Find the perfect outfit for every special moment</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          {occasions.map((occasion) => (
            <Badge
              key={occasion.id}
              variant="outline"
              className="px-6 py-3 text-base cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md bg-card"
              style={{ borderColor: occasion.color }}
              onClick={() => handleOccasionClick(occasion.name)}
            >
              <SwatchBook className="w-4 h-4 mr-2" style={{ color: occasion.color }} />
              {occasion.name}
            </Badge>
          ))}
        </div>
      </motion.div>

      {/* Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-card">
          {selectedCollection && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-heading">
                  {selectedCollection.name}
                </DialogTitle>
                <p className="text-muted-foreground">{selectedCollection.tagline}</p>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Hero Image */}
                <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
                  <img
                    src={selectedCollection.image}
                    alt={selectedCollection.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                
                {/* Sample Products */}
                <div>
                  <h3 className="text-lg font-heading mb-4">Featured Products</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {selectedCollection.sampleProducts.map((product) => (
                      <div 
                        key={product.id} 
                        className="space-y-2 cursor-pointer"
                        onClick={() => {
                          onNavigate('product', product.id);
                          setIsPreviewOpen(false);
                        }}
                      >
                        <div className="aspect-[3/4] rounded-lg overflow-hidden bg-muted hover:opacity-80 transition-opacity">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-sm text-center font-medium">{product.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Collection Stats and CTA */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    {selectedCollection.subCategoriesCount} categories available
                  </div>
                  <Button
                    onClick={() => handleBrowseCollection(selectedCollection.id)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    View Full Collection
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