"use client";

import React, { useState, lazy, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import {
  MapPin,
  Phone,
  Clock,
  MessageCircle,
  Send,
  Loader2,
  Mail,
  Store,
  HelpCircle,
} from 'lucide-react';

// Lazy load Google Maps component
const GoogleMap = lazy(() => import('./GoogleMap').then(module => ({ default: module.GoogleMap })));

// Form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  orderNumber: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const storeInfo = {
  name: 'Atelier Boutique',
  address: '123 Madison Avenue, New York, NY 10016',
  phone: '+1 (212) 555-0123',
  email: 'hello@atelierboutique.com',
  hours: {
    weekdays: '10:00 AM - 8:00 PM',
    saturday: '10:00 AM - 9:00 PM',
    sunday: '12:00 PM - 6:00 PM',
  },
  coordinates: {
    lat: 40.7505,
    lng: -73.9934,
  },
};

const faqItems = [
  {
    id: 'shipping',
    question: 'What are your shipping options and timeframes?',
    answer: 'We offer free standard shipping (5-7 business days) on orders over $150. Express shipping (2-3 business days) is available for $15, and overnight shipping for $25. International shipping is available to select countries.',
  },
  {
    id: 'returns',
    question: 'What is your return and exchange policy?',
    answer: 'We accept returns within 30 days of purchase for items in original condition with tags attached. Exchanges can be made in-store or by mail. Sale items are final sale unless defective.',
  },
  {
    id: 'sizing',
    question: 'How do I find the right size?',
    answer: 'Each product page includes detailed size charts and measurements. We recommend checking the specific measurements for each brand as sizing can vary. Our stylists are also available for personal consultations.',
  },
  {
    id: 'care',
    question: 'How should I care for my garments?',
    answer: 'Care instructions are provided on each garment label and product page. We recommend professional cleaning for delicate items and offer a partnership with a trusted dry cleaner for special garment care.',
  },
  {
    id: 'appointments',
    question: 'Can I schedule a personal styling appointment?',
    answer: 'Yes! We offer complimentary personal styling sessions by appointment. Our experienced stylists can help curate looks for special occasions or refresh your wardrobe. Book online or call us directly.',
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      orderNumber: '',
      message: '',
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
      form.reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Hi! I need help with my order or have a question about your products.');
    const whatsappUrl = `https://wa.me/+12125550123?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-gradient-start to-bg-gradient-end">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're here to help with any questions about our collections, orders, or styling services.
            Reach out and let's create something beautiful together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Send us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll respond within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your name" 
                                {...field} 
                                className="bg-background/50"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="your@email.com" 
                                type="email"
                                {...field}
                                className="bg-background/50"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="orderNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Order Number (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., #ATL-12345" 
                              {...field}
                              className="bg-background/50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="How can we help you today?"
                              className="min-h-[120px] bg-background/50 resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <AnimatePresence mode="wait">
                        {isSubmitting ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                          >
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sending...
                          </motion.div>
                        ) : (
                          <motion.div
                            key="send"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                          >
                            <Send className="h-4 w-4" />
                            Send Message
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Store Information & WhatsApp CTA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Store Info Card */}
            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Visit Our Store
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{storeInfo.name}</p>
                    <p className="text-sm text-muted-foreground">{storeInfo.address}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <a 
                    href={`tel:${storeInfo.phone}`}
                    className="text-sm hover:text-primary transition-colors"
                  >
                    {storeInfo.phone}
                  </a>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <a 
                    href={`mailto:${storeInfo.email}`}
                    className="text-sm hover:text-primary transition-colors"
                  >
                    {storeInfo.email}
                  </a>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p><span className="font-medium">Mon-Fri:</span> {storeInfo.hours.weekdays}</p>
                    <p><span className="font-medium">Saturday:</span> {storeInfo.hours.saturday}</p>
                    <p><span className="font-medium">Sunday:</span> {storeInfo.hours.sunday}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp Quick Help */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <MessageCircle className="h-12 w-12 text-accent mx-auto" />
                  <div>
                    <h3 className="font-heading font-semibold mb-2">Need Quick Help?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Chat with us on WhatsApp for instant support
                    </p>
                  </div>
                  <Button 
                    onClick={handleWhatsAppClick}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat on WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Google Maps Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16"
        >
          <Card className="shadow-lg border-0 overflow-hidden bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Find Us</CardTitle>
              <CardDescription>
                Located in the heart of Madison Avenue, New York
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-96 bg-muted relative">
                <Suspense fallback={
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Loading map...
                    </div>
                  </div>
                }>
                  <GoogleMap
                    lat={storeInfo.coordinates.lat}
                    lng={storeInfo.coordinates.lng}
                    storeName={storeInfo.name}
                    address={storeInfo.address}
                    onLoad={() => setMapLoaded(true)}
                  />
                </Suspense>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-heading font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find quick answers to common questions about our products, services, and policies.
            </p>
          </div>

          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm max-w-4xl mx-auto">
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={item.id} value={item.id}>
                    <AccordionTrigger className="text-left hover:text-primary transition-colors">
                      <div className="flex items-center gap-3">
                        <HelpCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        {item.question}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pl-7">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}