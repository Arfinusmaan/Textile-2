"use client";

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { 
  LayoutDashboard, 
  Grid2x2, 
  User, 
  LogIn, 
  PanelTopOpen,
  LayoutPanelLeft,
  PanelsLeftBottom,
  CircleX,
  UserRoundCheck,
  Undo,
  Upload,
  Eye,
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  Settings,
  Save
} from 'lucide-react';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';

export default function AdminPanel({ 
  products = [], 
  collections = [], 
  onProductsUpdate = () => {}, 
  onCollectionsUpdate = () => {} 
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  
  // Login state
  const [loginForm, setLoginForm] = useState({ email: '', password: '', rememberMe: false });
  const [loginError, setLoginError] = useState('');
  
  // Collections UI state
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [collectionForm, setCollectionForm] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    imageFile: null,
    subCategories: []
  });
  
  // Products UI state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '',
    name: '',
    description: '',
    fabric: '',
    material: '',
    size: '',
    category: '',
    collection: '',
    price: '',
    stock: '',
    images: [],
    image: '',
    featured: false,
    inStock: true,
    colors: [],
    sizes: []
  });
  const [productStep, setProductStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Orders state
  const [orders, setOrders] = useState([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Settings state
  const [settingsForm, setSettingsForm] = useState({
    storeName: 'Elegance Fashion',
    storeDescription: 'Timeless fashion crafted with precision and care.',
    storeAddress: 'Mumbai, Maharashtra, India',
    storePhone: '+91 98765 43210',
    storeEmail: 'contact@elegancefashion.com',
    currency: 'INR',
    taxRate: '18',
    shippingFee: '50',
    freeShippingThreshold: '2000'
  });
  
  // Confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState({ type: '', item: null, callback: null });
  const [confirmText, setConfirmText] = useState('');
  
  // Dashboard stats
  const dashboardStats = {
    totalProducts: products.length,
    lowStockAlerts: products.filter(p => p.stock <= 5).length,
    totalCollections: collections.length,
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length
  };

  // Initialize with mock data if no data is provided
  useEffect(() => {
    // Initialize collections if empty
    if (collections.length === 0) {
      const mockCollections = [
        { 
          id: 1, 
          name: 'Sarees', 
          slug: 'sarees', 
          description: 'Timeless elegance in every drape', 
          image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-an-e-8ec064f6-20250904080844.jpg', 
          subCategories: ['Silk Sarees', 'Cotton Sarees', 'Designer Sarees'] 
        },
        { 
          id: 2, 
          name: 'Lehengas', 
          slug: 'lehengas', 
          description: 'Royal grandeur for special moments', 
          image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-a-st-22905886-20250904080855.jpg', 
          subCategories: ['Bridal Lehengas', 'Party Lehengas', 'Festival Wear'] 
        },
        { 
          id: 3, 
          name: 'Kurtis', 
          slug: 'kurtis', 
          description: 'Everyday sophistication', 
          image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-an-e-36937f4d-20250904081005.jpg', 
          subCategories: ['Casual Kurtis', 'Formal Kurtis', 'Embroidered Kurtis'] 
        }
      ];
      onCollectionsUpdate(mockCollections);
    }

    // Initialize products if empty
    if (products.length === 0) {
      const mockProducts = [
        { 
          id: 'saree-1', 
          title: 'Elegant Silk Saree',
          name: 'Elegant Silk Saree',
          description: 'Beautiful traditional silk saree perfect for special occasions', 
          fabric: 'Silk',
          material: 'Silk', 
          size: 'Free Size',
          sizes: ['Free Size'],
          category: 'Sarees',
          collection: '1', 
          price: 2499, 
          stock: 12, 
          images: ['https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-an-e-8ec064f6-20250904080844.jpg'],
          image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-an-e-8ec064f6-20250904080844.jpg',
          featured: true,
          inStock: true,
          colors: ['#E8B4B8', '#F4E4C1'],
          rating: 4.8,
          sale: true,
          originalPrice: 3999
        },
        { 
          id: 'lehenga-1', 
          title: 'Designer Lehenga Set',
          name: 'Designer Lehenga Set',
          description: 'Stunning designer lehenga perfect for weddings and celebrations', 
          fabric: 'Net with Embroidery',
          material: 'Net with Embroidery', 
          size: 'M',
          sizes: ['S', 'M', 'L', 'XL'],
          category: 'Lehengas',
          collection: '2', 
          price: 8999, 
          stock: 5, 
          images: ['https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-a-st-22905886-20250904080855.jpg'],
          image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-a-st-22905886-20250904080855.jpg',
          featured: true,
          inStock: true,
          colors: ['#FFB6C1', '#DDA0DD'],
          rating: 4.9,
          sale: true,
          originalPrice: 12999
        },
        { 
          id: 'kurti-1', 
          title: 'Cotton Printed Kurti',
          name: 'Cotton Printed Kurti',
          description: 'Comfortable cotton kurti for everyday wear', 
          fabric: 'Cotton',
          material: 'Cotton', 
          size: 'L',
          sizes: ['S', 'M', 'L', 'XL'],
          category: 'Kurtis',
          collection: '3', 
          price: 1299, 
          stock: 20, 
          images: ['https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-an-e-36937f4d-20250904081005.jpg'],
          image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fb724703-d833-44be-b56c-5edaa1ee2778/generated_images/professional-product-photography-of-an-e-36937f4d-20250904081005.jpg',
          featured: false,
          inStock: true,
          colors: ['#F5F5DC', '#FFE4E1'],
          rating: 4.4
        }
      ];
      onProductsUpdate(mockProducts);
    }

    // Initialize mock orders
    setOrders([
      { id: 1001, customerName: 'Priya Sharma', customerEmail: 'priya@example.com', total: 2499, status: 'pending', items: 2, date: '2024-12-17', address: 'Mumbai, Maharashtra' },
      { id: 1002, customerName: 'Rahul Gupta', customerEmail: 'rahul@example.com', total: 1850, status: 'processing', items: 1, date: '2024-12-16', address: 'Delhi, NCR' },
      { id: 1003, customerName: 'Anjali Patel', customerEmail: 'anjali@example.com', total: 3200, status: 'shipped', items: 3, date: '2024-12-15', address: 'Bangalore, Karnataka' },
      { id: 1004, customerName: 'Vikram Singh', customerEmail: 'vikram@example.com', total: 1200, status: 'delivered', items: 1, date: '2024-12-14', address: 'Chennai, Tamil Nadu' }
    ]);
  }, [collections.length, products.length, onCollectionsUpdate, onProductsUpdate]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeydown = (e) => {
      if (!isAuthenticated) return;
      
      if (e.key === 'n' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (currentTab === 'collections') {
          handleAddCollection();
        } else if (currentTab === 'products') {
          handleAddProduct();
        }
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [isAuthenticated, currentTab]);

  // Auth functions
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (loginForm.email === 'admin@example.com' && loginForm.password === 'admin123') {
        setIsAuthenticated(true);
        if (loginForm.rememberMe) {
          localStorage.setItem('adminToken', 'mock-token');
        }
        toast.success('Successfully logged in');
      } else {
        setLoginError('Invalid credentials');
        toast.error('Login failed');
      }
    } catch (error) {
      setLoginError('Login failed. Please try again.');
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentTab('dashboard');
    localStorage.removeItem('adminToken');
    toast.success('Logged out successfully');
  }, []);

  // Collection functions
  const handleAddCollection = useCallback(() => {
    setEditingCollection(null);
    setCollectionForm({ name: '', slug: '', description: '', image: '', imageFile: null, subCategories: [] });
    setShowCollectionModal(true);
  }, []);

  const handleEditCollection = useCallback((collection) => {
    setEditingCollection(collection);
    setCollectionForm({
      name: collection.name,
      slug: collection.slug,
      description: collection.description,
      image: collection.image,
      imageFile: collection.imageFile,
      subCategories: collection.subCategories
    });
    setShowCollectionModal(true);
  }, []);

  const handleSaveCollection = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (editingCollection) {
        onCollectionsUpdate(prev => prev.map(c => 
          c.id === editingCollection.id 
            ? { ...c, ...collectionForm, id: editingCollection.id }
            : c
        ));
        toast.success('Collection updated successfully');
      } else {
        const newCollection = {
          ...collectionForm,
          id: Date.now()
        };
        onCollectionsUpdate(prev => [...prev, newCollection]);
        toast.success('Collection created successfully');
      }
      
      setShowCollectionModal(false);
    } catch (error) {
      toast.error('Failed to save collection');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCollection = useCallback((collection) => {
    setConfirmAction({
      type: 'delete-collection',
      item: collection,
      callback: () => {
        onCollectionsUpdate(prev => prev.filter(c => c.id !== collection.id));
        toast.success('Collection deleted successfully');
        setShowConfirmModal(false);
      }
    });
    setConfirmText('');
    setShowConfirmModal(true);
  }, []);

  // Product functions
  const handleAddProduct = useCallback(() => {
    setEditingProduct(null);
    setProductForm({
      title: '',
      name: '',
      description: '',
      fabric: '',
      material: '',
      size: '',
      category: '',
      collection: '',
      price: '',
      stock: '',
      images: [],
      image: '',
      featured: false,
      inStock: true,
      colors: [],
      sizes: []
    });
    setProductStep(0);
    setShowProductModal(true);
  }, []);

  const handleEditProduct = useCallback((product) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title,
      name: product.name,
      description: product.description,
      fabric: product.fabric,
      material: product.material,
      size: product.size,
      category: product.category,
      collection: product.collection,
      price: product.price.toString(),
      stock: product.stock.toString(),
      images: product.images,
      image: product.image,
      featured: product.featured,
      inStock: product.inStock,
      colors: product.colors,
      sizes: product.sizes
    });
    setProductStep(0);
    setShowProductModal(true);
  }, []);

  const handleSaveProduct = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock)
      };
      
      if (editingProduct) {
        onProductsUpdate(prev => prev.map(p => 
          p.id === editingProduct.id 
            ? { ...p, ...productData, id: editingProduct.id }
            : p
        ));
        toast.success('Product updated successfully');
      } else {
        const newProduct = {
          ...productData,
          id: Date.now()
        };
        onProductsUpdate(prev => [...prev, newProduct]);
        toast.success('Product created successfully');
      }
      
      setShowProductModal(false);
    } catch (error) {
      toast.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = useCallback((product) => {
    setConfirmAction({
      type: 'delete-product',
      item: product,
      callback: () => {
        onProductsUpdate(prev => prev.filter(p => p.id !== product.id));
        toast.success('Product deleted successfully');
        setShowConfirmModal(false);
      }
    });
    setConfirmText('');
    setShowConfirmModal(true);
  }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // Mock image processing
    const imageUrls = files.map(() => `https://images.unsplash.com/photo-${Date.now()}?w=400`);
    setProductForm(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls]
    }));
  };

  const handleCollectionImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Mock image processing - in a real app, you'd upload to a server
      const imageUrl = `https://images.unsplash.com/photo-${Date.now()}?w=400`;
      setCollectionForm(prev => ({
        ...prev,
        image: imageUrl,
        imageFile: file
      }));
      toast.success('Image uploaded successfully');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'low-stock' && product.stock <= 5) ||
                         (statusFilter === 'in-stock' && product.stock > 5);
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Orders functions
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      toast.success('Order status updated successfully');
      setShowOrderModal(false);
    } catch (error) {
      toast.error('Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  // Settings functions
  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    return orderStatusFilter === 'all' || order.status === orderStatusFilter;
  });

  // Login View
  if (!isAuthenticated) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-background flex items-center justify-center p-4"
      >
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2 text-center">
            <LogIn className="w-8 h-8 mx-auto text-primary" />
            <CardTitle className="text-2xl font-heading">Admin Login</CardTitle>
            <p className="text-muted-foreground">Access the admin dashboard</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={loginForm.rememberMe}
                  onCheckedChange={(checked) => setLoginForm(prev => ({ ...prev, rememberMe: checked }))}
                />
                <Label htmlFor="remember" className="text-sm">Remember me</Label>
              </div>
              {loginError && (
                <p className="text-destructive text-sm">{loginError}</p>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Admin Dashboard View
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background"
    >
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-sidebar border-r border-sidebar-border p-4 min-h-screen">
          <div className="flex items-center gap-2 mb-8">
            <LayoutPanelLeft className="w-6 h-6 text-sidebar-primary" />
            <h1 className="font-heading font-bold text-lg text-sidebar-primary">Admin Panel</h1>
          </div>
          
          <nav className="space-y-2">
            <Button
              variant={currentTab === 'dashboard' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setCurrentTab('dashboard')}
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={currentTab === 'collections' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setCurrentTab('collections')}
            >
              <Grid2x2 className="w-4 h-4 mr-2" />
              Collections
            </Button>
            <Button
              variant={currentTab === 'products' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setCurrentTab('products')}
            >
              <PanelsLeftBottom className="w-4 h-4 mr-2" />
              Products
            </Button>
            <Button
              variant={currentTab === 'orders' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setCurrentTab('orders')}
            >
              <PanelTopOpen className="w-4 h-4 mr-2" />
              Orders
            </Button>
            <Button
              variant={currentTab === 'settings' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setCurrentTab('settings')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </nav>
          
          <div className="mt-auto pt-8">
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              <Undo className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentTab === 'dashboard' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-heading font-bold">Dashboard</h2>
                    <div className="flex gap-2">
                      <Button onClick={handleAddProduct}>Add Product</Button>
                      <Button variant="outline" onClick={handleAddCollection}>Add Collection</Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{dashboardStats.totalProducts}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-destructive">{dashboardStats.lowStockAlerts}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">Collections</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{dashboardStats.totalCollections}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{dashboardStats.totalOrders}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{dashboardStats.pendingOrders}</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {orders.slice(0, 3).map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <div>
                                <p className="font-medium">#{order.id}</p>
                                <p className="text-sm text-muted-foreground">{order.customerName}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">₹{order.total}</p>
                                <Badge variant={
                                  order.status === 'pending' ? 'destructive' :
                                  order.status === 'processing' ? 'default' :
                                  order.status === 'shipped' ? 'secondary' : 'outline'
                                }>
                                  {order.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Low Stock Products</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {products.filter(p => p.stock <= 5).map((product) => (
                            <div key={product.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <div className="flex items-center gap-3">
                                <img src={product.images[0]} alt={product.title} className="w-10 h-10 rounded object-cover" />
                                <div>
                                  <p className="font-medium">{product.title}</p>
                                  <p className="text-sm text-muted-foreground">{product.category}</p>
                                </div>
                              </div>
                              <Badge variant="destructive">{product.stock} left</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {currentTab === 'collections' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-heading font-bold">Collections</h2>
                    <Button onClick={handleAddCollection}>Add Collection</Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {collections.map((collection) => (
                      <Card key={collection.id} className="overflow-hidden">
                        <div className="aspect-video bg-muted">
                          {collection.image && (
                            <img
                              src={collection.image}
                              alt={collection.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold">{collection.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{collection.description}</p>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" onClick={() => handleEditCollection(collection)}>
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteCollection(collection)}
                            >
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {currentTab === 'products' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-heading font-bold">Products</h2>
                    <Button onClick={handleAddProduct}>Add Product</Button>
                  </div>
                  
                  <div className="flex gap-4 items-center">
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="max-w-sm"
                    />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="in-stock">In Stock</SelectItem>
                        <SelectItem value="low-stock">Low Stock</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {collections.map((collection) => (
                          <SelectItem key={collection.id} value={collection.name}>
                            {collection.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {product.images[0] && (
                                <img
                                  src={product.images[0]}
                                  alt={product.title}
                                  className="w-10 h-10 rounded object-cover"
                                />
                              )}
                              <div>
                                <div className="font-medium">{product.title}</div>
                                {product.featured && (
                                  <Badge variant="secondary" className="text-xs">Featured</Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>₹{product.price}</TableCell>
                          <TableCell>
                            <Badge variant={product.stock <= 5 ? 'destructive' : 'secondary'}>
                              {product.stock} left
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={product.stock > 5 ? 'default' : 'destructive'}>
                              {product.stock > 5 ? 'In Stock' : 'Low Stock'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleEditProduct(product)}>
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteProduct(product)}
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {currentTab === 'orders' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-heading font-bold">Orders Management</h2>
                    <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Orders</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Package className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-sm text-muted-foreground">Total Orders</p>
                            <p className="text-2xl font-bold">{orders.length}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-orange-600" />
                          <div>
                            <p className="text-sm text-muted-foreground">Pending</p>
                            <p className="text-2xl font-bold">{orders.filter(o => o.status === 'pending').length}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Truck className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-sm text-muted-foreground">Shipped</p>
                            <p className="text-2xl font-bold">{orders.filter(o => o.status === 'shipped').length}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-sm text-muted-foreground">Delivered</p>
                            <p className="text-2xl font-bold">{orders.filter(o => o.status === 'delivered').length}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">#{order.id}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{order.customerName}</p>
                              <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                            </div>
                          </TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>{order.items} items</TableCell>
                          <TableCell className="font-medium">₹{order.total}</TableCell>
                          <TableCell>
                            <Badge variant={
                              order.status === 'pending' ? 'destructive' :
                              order.status === 'processing' ? 'default' :
                              order.status === 'shipped' ? 'secondary' : 'outline'
                            }>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleViewOrder(order)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {currentTab === 'settings' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-heading font-bold">Store Settings</h2>
                    <Button onClick={handleSaveSettings} disabled={loading}>
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? 'Saving...' : 'Save Settings'}
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Store Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="store-name">Store Name</Label>
                          <Input
                            id="store-name"
                            value={settingsForm.storeName}
                            onChange={(e) => setSettingsForm(prev => ({ ...prev, storeName: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="store-description">Store Description</Label>
                          <Textarea
                            id="store-description"
                            value={settingsForm.storeDescription}
                            onChange={(e) => setSettingsForm(prev => ({ ...prev, storeDescription: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="store-address">Store Address</Label>
                          <Input
                            id="store-address"
                            value={settingsForm.storeAddress}
                            onChange={(e) => setSettingsForm(prev => ({ ...prev, storeAddress: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="store-phone">Phone Number</Label>
                          <Input
                            id="store-phone"
                            value={settingsForm.storePhone}
                            onChange={(e) => setSettingsForm(prev => ({ ...prev, storePhone: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="store-email">Email Address</Label>
                          <Input
                            id="store-email"
                            type="email"
                            value={settingsForm.storeEmail}
                            onChange={(e) => setSettingsForm(prev => ({ ...prev, storeEmail: e.target.value }))}
                          />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Business Settings</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="currency">Currency</Label>
                          <Select value={settingsForm.currency} onValueChange={(value) => setSettingsForm(prev => ({ ...prev, currency: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="INR">INR (₹)</SelectItem>
                              <SelectItem value="USD">USD ($)</SelectItem>
                              <SelectItem value="EUR">EUR (€)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                          <Input
                            id="tax-rate"
                            type="number"
                            value={settingsForm.taxRate}
                            onChange={(e) => setSettingsForm(prev => ({ ...prev, taxRate: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="shipping-fee">Shipping Fee (₹)</Label>
                          <Input
                            id="shipping-fee"
                            type="number"
                            value={settingsForm.shippingFee}
                            onChange={(e) => setSettingsForm(prev => ({ ...prev, shippingFee: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="free-shipping">Free Shipping Threshold (₹)</Label>
                          <Input
                            id="free-shipping"
                            type="number"
                            value={settingsForm.freeShippingThreshold}
                            onChange={(e) => setSettingsForm(prev => ({ ...prev, freeShippingThreshold: e.target.value }))}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Collection Modal */}
      <Dialog open={showCollectionModal} onOpenChange={setShowCollectionModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCollection ? 'Edit Collection' : 'Add Collection'}
            </DialogTitle>
            <DialogDescription>
              {editingCollection ? 'Update collection details' : 'Create a new collection'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="collection-name">Name</Label>
              <Input
                id="collection-name"
                value={collectionForm.name}
                onChange={(e) => setCollectionForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Collection name"
              />
            </div>
            <div>
              <Label htmlFor="collection-slug">Slug</Label>
              <Input
                id="collection-slug"
                value={collectionForm.slug}
                onChange={(e) => setCollectionForm(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="collection-slug"
              />
            </div>
            <div>
              <Label htmlFor="collection-description">Description</Label>
              <Textarea
                id="collection-description"
                value={collectionForm.description}
                onChange={(e) => setCollectionForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Collection description"
              />
            </div>
            <div>
              <Label htmlFor="collection-image">Collection Image</Label>
              <div className="mt-2">
                <input
                  id="collection-image"
                  type="file"
                  accept="image/*"
                  onChange={handleCollectionImageUpload}
                  className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                />
                {collectionForm.image && (
                  <div className="mt-4">
                    <img
                      src={collectionForm.image}
                      alt="Collection preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <Button variant="outline" onClick={() => setShowCollectionModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveCollection} disabled={loading}>
                {loading ? 'Saving...' : editingCollection ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Order Modal */}
      <Dialog open={showOrderModal} onOpenChange={setShowOrderModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details - #{selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Customer Name</Label>
                  <p className="font-medium">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="font-medium">{selectedOrder.customerEmail}</p>
                </div>
                <div>
                  <Label>Order Date</Label>
                  <p className="font-medium">{selectedOrder.date}</p>
                </div>
                <div>
                  <Label>Total Amount</Label>
                  <p className="font-medium">₹{selectedOrder.total}</p>
                </div>
              </div>
              <div>
                <Label>Shipping Address</Label>
                <p className="font-medium">{selectedOrder.address}</p>
              </div>
              <div>
                <Label>Current Status</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant={
                    selectedOrder.status === 'pending' ? 'destructive' :
                    selectedOrder.status === 'processing' ? 'default' :
                    selectedOrder.status === 'shipped' ? 'secondary' : 'outline'
                  }>
                    {selectedOrder.status}
                  </Badge>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(value) => handleUpdateOrderStatus(selectedOrder.id, value)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Product Modal */}
      <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </DialogTitle>
            <DialogDescription>
              Step {productStep + 1} of 3: {['Product Images', 'Product Details', 'Review & Save'][productStep]}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={productStep.toString()} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="0">Images</TabsTrigger>
              <TabsTrigger value="1">Details</TabsTrigger>
              <TabsTrigger value="2">Review</TabsTrigger>
            </TabsList>
            
            <TabsContent value="0" className="space-y-4">
              <div>
                <Label>Product Images</Label>
                <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mb-4"
                  />
                  <div className="grid grid-cols-3 gap-4">
                    {productForm.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-32 object-cover rounded"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2"
                          onClick={() => setProductForm(prev => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index)
                          }))}
                        >
                          <CircleX className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="1" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="product-title">Title</Label>
                  <Input
                    id="product-title"
                    value={productForm.title}
                    onChange={(e) => setProductForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Product title"
                  />
                </div>
                <div>
                  <Label htmlFor="product-category">Category</Label>
                  <Select
                    value={productForm.category}
                    onValueChange={(value) => setProductForm(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {collections.map((collection) => (
                        <SelectItem key={collection.id} value={collection.name}>
                          {collection.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="product-description">Description</Label>
                <Textarea
                  id="product-description"
                  value={productForm.description}
                  onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Product description"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="product-fabric">Fabric</Label>
                  <Input
                    id="product-fabric"
                    value={productForm.fabric}
                    onChange={(e) => setProductForm(prev => ({ ...prev, fabric: e.target.value }))}
                    placeholder="Fabric type"
                  />
                </div>
                <div>
                  <Label htmlFor="product-size">Size</Label>
                  <Input
                    id="product-size"
                    value={productForm.size}
                    onChange={(e) => setProductForm(prev => ({ ...prev, size: e.target.value }))}
                    placeholder="Size"
                  />
                </div>
                <div>
                  <Label htmlFor="product-price">Price</Label>
                  <Input
                    id="product-price"
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="product-stock">Stock</Label>
                  <Input
                    id="product-stock"
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm(prev => ({ ...prev, stock: e.target.value }))}
                    placeholder="Stock quantity"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox
                    id="product-featured"
                    checked={productForm.featured}
                    onCheckedChange={(checked) => setProductForm(prev => ({ ...prev, featured: checked }))}
                  />
                  <Label htmlFor="product-featured">Featured Product</Label>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="2" className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Product Images</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {productForm.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-24 object-cover rounded"
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Product Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Title:</strong> {productForm.title}</p>
                    <p><strong>Category:</strong> {productForm.category}</p>
                    <p><strong>Price:</strong> ₹{productForm.price}</p>
                    <p><strong>Stock:</strong> {productForm.stock}</p>
                    <p><strong>Fabric:</strong> {productForm.fabric}</p>
                    <p><strong>Size:</strong> {productForm.size}</p>
                    {productForm.featured && (
                      <Badge>Featured</Badge>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">{productForm.description}</p>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between pt-4">
            <div>
              {productStep > 0 && (
                <Button variant="outline" onClick={() => setProductStep(prev => prev - 1)}>
                  Previous
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowProductModal(false)}>
                Cancel
              </Button>
              {productStep < 2 ? (
                <Button onClick={() => setProductStep(prev => prev + 1)}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleSaveProduct} disabled={loading}>
                  {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Type "{confirmAction.item?.name || confirmAction.item?.title}" to confirm.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={`Type "${confirmAction.item?.name || confirmAction.item?.title}" to confirm`}
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmAction.callback}
                disabled={confirmText !== (confirmAction.item?.name || confirmAction.item?.title)}
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}