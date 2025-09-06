"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { 
  ShoppingCart, 
  Undo, 
  Check, 
  CreditCard, 
  ShoppingBag, 
  Receipt, 
  CheckCheck,
  PackageOpen,
  ArrowDownUp,
  CircleCheckBig,
  PackageCheck
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from './ui/form';

const MOCK_CART_ITEMS = [
  {
    id: 1,
    name: "Merino Wool Sweater",
    price: 189.00,
    quantity: 2,
    variant: "Charcoal",
    size: "M",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=400&fit=crop"
  },
  {
    id: 2,
    name: "Organic Cotton Tee",
    price: 45.00,
    quantity: 1,
    variant: "Natural White",
    size: "L",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop"
  },
  {
    id: 3,
    name: "Linen Blend Trousers",
    price: 125.00,
    quantity: 1,
    variant: "Stone",
    size: "32",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&h=400&fit=crop"
  }
];

export default function CartCheckout() {
  const [view, setView] = useState('cart'); // 'cart' | 'checkout' | 'confirmation'
  const [cartItems, setCartItems] = useState(MOCK_CART_ITEMS);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [isGuest, setIsGuest] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [orderNumber, setOrderNumber] = useState('');
  
  // Form states
  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    nameOnCard: ''
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [updatingItems, setUpdatingItems] = useState(new Set());

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const shippingCost = shippingMethod === 'pickup' ? 0 : (shippingMethod === 'express' ? 15.00 : 8.99);
  const total = subtotal + tax + shippingCost;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.15 } }
  };

  // Update quantity with optimistic UI
  const updateQuantity = useCallback(async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => new Set(prev).add(itemId));
    
    // Optimistic update
    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Quantity updated');
    } catch (error) {
      // Revert on error
      setCartItems(prev => 
        prev.map(item => 
          item.id === itemId ? { ...item, quantity: item.quantity } : item
        )
      );
      toast.error('Failed to update quantity');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  }, []);

  // Remove item with undo functionality
  const removeItem = useCallback((itemId) => {
    const itemToRemove = cartItems.find(item => item.id === itemId);
    if (!itemToRemove) return;

    setCartItems(prev => prev.filter(item => item.id !== itemId));

    toast.success(
      `${itemToRemove.name} removed from cart`,
      {
        action: {
          label: 'Undo',
          onClick: () => {
            setCartItems(prev => [...prev, itemToRemove].sort((a, b) => a.id - b.id));
            toast.success('Item restored to cart');
          }
        },
        duration: 6000
      }
    );
  }, [cartItems]);

  // Validate form fields
  const validateField = (field, value) => {
    const errors = { ...fieldErrors };
    
    switch (field) {
      case 'email':
        if (!value || !/\S+@\S+\.\S+/.test(value)) {
          errors.email = 'Valid email is required';
        } else {
          delete errors.email;
        }
        break;
      case 'firstName':
      case 'lastName':
        if (!value || value.trim().length < 2) {
          errors[field] = 'Name must be at least 2 characters';
        } else {
          delete errors[field];
        }
        break;
      case 'phone':
        if (!value || !/^\+?[\d\s\-\(\)]+$/.test(value)) {
          errors.phone = 'Valid phone number is required';
        } else {
          delete errors.phone;
        }
        break;
      case 'address':
        if (!value || value.trim().length < 5) {
          errors.address = 'Address must be at least 5 characters';
        } else {
          delete errors.address;
        }
        break;
      case 'city':
        if (!value || value.trim().length < 2) {
          errors.city = 'City is required';
        } else {
          delete errors.city;
        }
        break;
      case 'zipCode':
        if (!value || !/^\d{5}(-\d{4})?$/.test(value)) {
          errors.zipCode = 'Valid ZIP code is required';
        } else {
          delete errors.zipCode;
        }
        break;
      case 'cardNumber':
        if (!value || value.replace(/\s/g, '').length !== 16) {
          errors.cardNumber = 'Valid 16-digit card number is required';
        } else {
          delete errors.cardNumber;
        }
        break;
      case 'expiry':
        if (!value || !/^\d{2}\/\d{2}$/.test(value)) {
          errors.expiry = 'Valid expiry date (MM/YY) is required';
        } else {
          delete errors.expiry;
        }
        break;
      case 'cvv':
        if (!value || !/^\d{3,4}$/.test(value)) {
          errors.cvv = 'Valid CVV is required';
        } else {
          delete errors.cvv;
        }
        break;
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Proceed to next checkout step
  const proceedToNextStep = () => {
    let isValid = true;
    
    if (checkoutStep === 1) {
      // Validate billing info
      Object.keys(billingInfo).forEach(field => {
        if (!validateField(field, billingInfo[field])) {
          isValid = false;
        }
      });
    } else if (checkoutStep === 2) {
      // Validate shipping info
      ['address', 'city', 'zipCode'].forEach(field => {
        if (!validateField(field, shippingInfo[field])) {
          isValid = false;
        }
      });
    } else if (checkoutStep === 3) {
      // Validate payment info
      Object.keys(paymentInfo).forEach(field => {
        if (!validateField(field, paymentInfo[field])) {
          isValid = false;
        }
      });
    }
    
    if (isValid) {
      if (checkoutStep < 4) {
        setCheckoutStep(prev => prev + 1);
      } else {
        processOrder();
      }
    }
  };

  // Process order
  const processOrder = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const orderNum = `ORD-${Date.now().toString().slice(-6)}`;
      setOrderNumber(orderNum);
      setView('confirmation');
      
      toast.success('Order placed successfully!');
      
      // Clear cart
      setCartItems([]);
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Format card number input
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Empty cart view
  if (cartItems.length === 0 && view === 'cart') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bg-gradient-start to-bg-gradient-end py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <ShoppingCart className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
            <h2 className="text-2xl font-heading font-semibold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Discover our beautiful collection of sustainable fashion and add items to your cart.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Continue Shopping
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-gradient-start to-bg-gradient-end py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <AnimatePresence mode="wait">
          {view === 'cart' && (
            <motion.div
              key="cart"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid lg:grid-cols-3 gap-8"
            >
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5" />
                      Shopping Cart ({cartItems.length} items)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cartItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-4 p-4 border border-border rounded-lg"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-md"
                        />
                        <div className="flex-1 space-y-2">
                          <h3 className="font-medium">{item.name}</h3>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>Color: {item.variant}</span>
                            <span>Size: {item.size}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Label htmlFor={`quantity-${item.id}`} className="sr-only">
                              Quantity
                            </Label>
                            <Select
                              value={item.quantity.toString()}
                              onValueChange={(value) => updateQuantity(item.id, parseInt(value))}
                            >
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                  <SelectItem key={num} value={num.toString()}>
                                    {num}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {updatingItems.has(item.id) && (
                              <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            )}
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            Remove
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                <Card className="bg-card border-border sticky top-8">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>${shippingCost.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <Button
                      className="w-full bg-primary hover:bg-primary/90"
                      size="lg"
                      onClick={() => setView('checkout')}
                    >
                      Proceed to Checkout
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Free shipping on orders over $150
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* ... rest of code ... */}

        </AnimatePresence>
      </div>
    </div>
  );
}