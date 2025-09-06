"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { History, Frame, PanelRight, LayoutTemplate, GalleryVertical, Clapperboard } from "lucide-react";
import { toast } from "sonner";

export default function AboutPage() {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [email, setEmail] = useState("");
  const heroRef = useRef(null);
  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      toast.success("Thank you for subscribing to our heritage newsletter!");
      setEmail("");
    }, 1000);
  };

  const milestones = [
    {
      year: "1985",
      title: "Foundation",
      description: "Founded by master weaver Elena Rodriguez with a vision to preserve traditional textile craftsmanship.",
      image: "https://images.unsplash.com/photo-1485217988980-11786ced9454?w=200&h=150&fit=crop"
    },
    {
      year: "1992",
      title: "First Workshop",
      description: "Opened our flagship atelier in the heart of the textile district.",
      image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=200&h=150&fit=crop"
    },
    {
      year: "2001",
      title: "International Recognition",
      description: "Awarded the Heritage Craft Award for excellence in traditional weaving techniques.",
      image: "https://images.unsplash.com/photo-1604719312566-878b6f92b962?w=200&h=150&fit=crop"
    },
    {
      year: "2015",
      title: "Sustainable Initiative",
      description: "Launched our zero-waste production program and organic cotton sourcing.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop"
    },
    {
      year: "2023",
      title: "Digital Heritage",
      description: "Preserving traditional techniques through digital documentation and modern applications.",
      image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=200&h=150&fit=crop"
    }
  ];

  const craftStories = [
    {
      title: "Organic Cotton Sourcing",
      description: "Direct partnerships with certified organic farms ensuring the highest quality fibers.",
      media: "https://images.unsplash.com/photo-1445406819416-3b31623b8db7?w=800&h=600&fit=crop",
      type: "image"
    },
    {
      title: "Hand Weaving Process",
      description: "Traditional loom techniques passed down through generations of master artisans.",
      media: "https://images.unsplash.com/photo-1582735689369-4fe89db645e2?w=800&h=600&fit=crop",
      type: "image"
    },
    {
      title: "Natural Dyeing",
      description: "Plant-based dyes creating rich, lasting colors without environmental impact.",
      media: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      type: "image"
    }
  ];

  const teamMembers = [
    {
      name: "Elena Rodriguez",
      role: "Master Weaver & Founder",
      experience: "40+ years",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop"
    },
    {
      name: "Marcus Chen",
      role: "Textile Designer",
      experience: "15 years",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop"
    },
    {
      name: "Sofia Andersson",
      role: "Sustainability Director",
      experience: "12 years",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop"
    },
    {
      name: "James Thompson",
      role: "Master Craftsman",
      experience: "25 years",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden py-16 lg:py-24">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y }}
        >
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop"
            alt="Heritage textile workshop"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="hero-content text-white">
              <h1 className="text-4xl lg:text-6xl font-heading font-bold mb-6 leading-tight">
                Weaving Stories Since 1985
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-white/90 leading-relaxed">
                Started in a small workshop with a single loom and an unwavering commitment to preserving the art of traditional textile craftsmanship. Today, we continue Elena's vision of creating timeless pieces that honor both heritage and innovation.
              </p>
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Discover Our Story
              </Button>
            </div>
            <div className="hero-content">
              <Card className="bg-card/95 backdrop-blur-sm border-0 shadow-2xl">
                <CardContent className="p-8">
                  <img
                    src="https://images.unsplash.com/photo-1485217988980-11786ced9454?w=600&h=400&fit=crop"
                    alt="Elena Rodriguez at her loom"
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                  <blockquote className="text-lg italic text-muted-foreground">
                    "Every thread tells a story. Every pattern preserves a tradition. Every piece carries the soul of its maker."
                  </blockquote>
                  <cite className="block mt-4 text-sm font-medium">— Elena Rodriguez, Founder</cite>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Heritage Timeline */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <History className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">Our Heritage Timeline</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Four decades of innovation, craftsmanship, and dedication to preserving textile traditions.
            </p>
          </div>

          {/* Desktop Timeline */}
          <div className="hidden lg:block timeline-container">
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-0.5 w-1 h-full bg-border" />
              <div className="space-y-16">
                {milestones.map((milestone, index) => (
                  <div key={milestone.year} className={`timeline-entry flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                    <Card className={`w-80 ${index % 2 === 0 ? 'mr-8' : 'ml-8'} shadow-lg hover:shadow-xl transition-shadow duration-300`}>
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                            {milestone.year.slice(-2)}
                          </div>
                          <div className="ml-4">
                            <h3 className="font-heading font-semibold text-lg">{milestone.title}</h3>
                            <p className="text-sm text-muted-foreground">{milestone.year}</p>
                          </div>
                        </div>
                        <img
                          src={milestone.image}
                          alt={milestone.title}
                          className="w-full h-32 object-cover rounded-lg mb-4"
                        />
                        <p className="text-sm text-muted-foreground">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Accordion Timeline */}
          <div className="lg:hidden">
            <Accordion type="single" collapsible className="space-y-4">
              {milestones.map((milestone) => (
                <AccordionItem key={milestone.year} value={milestone.year} className="border rounded-lg">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                        {milestone.year.slice(-2)}
                      </div>
                      <div className="text-left">
                        <h3 className="font-heading font-semibold">{milestone.title}</h3>
                        <p className="text-sm text-muted-foreground">{milestone.year}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <img
                      src={milestone.image}
                      alt={milestone.title}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Textile Craftsmanship */}
      <section className="craftsmanship-section py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Frame className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">Artisan Craftsmanship</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Every piece begins with carefully sourced materials and traditional techniques refined over generations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {craftStories.map((story, index) => (
              <Card key={index} className="craft-card group cursor-pointer hover:shadow-xl transition-all duration-300">
                <Dialog>
                  <DialogTrigger asChild>
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={story.media}
                          alt={story.title}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                          <Clapperboard className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-heading font-semibold text-lg mb-3">{story.title}</h3>
                        <p className="text-muted-foreground">{story.description}</p>
                      </div>
                    </CardContent>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <div className="space-y-6">
                      <img
                        src={story.media}
                        alt={story.title}
                        className="w-full h-96 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="text-2xl font-heading font-bold mb-4">{story.title}</h3>
                        <p className="text-lg text-muted-foreground leading-relaxed">{story.description}</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Sustainability */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <PanelRight className="w-12 h-12 mb-6 text-primary" />
              <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">Our Mission</h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  We believe that true luxury lies not in excess, but in the careful selection of materials, 
                  the mastery of technique, and the respect for both artisan and environment.
                </p>
                <p>
                  Every thread in our workshop is sourced responsibly. Every technique we employ honors 
                  traditional methods while embracing innovations that reduce our environmental footprint.
                </p>
                <p>
                  Our commitment extends beyond creating beautiful textiles—we're preserving cultural 
                  heritage, supporting artisan communities, and building a more sustainable future for 
                  textile craftsmanship.
                </p>
              </div>
              <Button variant="outline" size="lg" className="mt-8">
                Learn More About Our Sourcing
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-accent-foreground">0%</span>
                  </div>
                  <h3 className="font-heading font-semibold mb-2">Waste Production</h3>
                  <p className="text-sm text-muted-foreground">Zero-waste manufacturing process</p>
                </Card>
                <Card className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-accent-foreground">50+</span>
                  </div>
                  <h3 className="font-heading font-semibold mb-2">Artisan Partners</h3>
                  <p className="text-sm text-muted-foreground">Supporting traditional craftspeople</p>
                </Card>
              </div>
              <div className="space-y-6 pt-8">
                <Card className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-accent-foreground">100%</span>
                  </div>
                  <h3 className="font-heading font-semibold mb-2">Organic Cotton</h3>
                  <p className="text-sm text-muted-foreground">Certified sustainable sourcing</p>
                </Card>
                <Card className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-accent-foreground">40</span>
                  </div>
                  <h3 className="font-heading font-semibold mb-2">Years Experience</h3>
                  <p className="text-sm text-muted-foreground">Preserving textile traditions</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team & Store History */}
      <section className="team-section py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <LayoutTemplate className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">Master Artisans</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Meet the passionate craftspeople who bring our vision to life through skill, dedication, and artistry.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {teamMembers.map((member, index) => (
              <Card key={index} className="team-profile text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="font-heading font-semibold text-lg mb-2">{member.name}</h3>
                  <p className="text-muted-foreground text-sm mb-2">{member.role}</p>
                  <p className="text-xs text-muted-foreground">{member.experience}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Workshop Gallery */}
          <div className="text-center mb-8">
            <GalleryVertical className="w-8 h-8 mx-auto mb-4 text-primary" />
            <h3 className="text-2xl font-heading font-bold mb-4">Workshop Gallery</h3>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1582735689369-4fe89db645e2?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1604719312566-878b6f92b962?w=400&h=300&fit=crop"
            ].map((image, index) => (
              <div key={index} className="aspect-square overflow-hidden rounded-lg">
                <img
                  src={image}
                  alt={`Workshop photo ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">
            Subscribe to Our Heritage Newsletter
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/80">
            Get exclusive insights into our craftsmanship process, artisan stories, and new collection previews.
          </p>
          
          {isSubscribed ? (
            <div className="bg-accent/20 rounded-lg p-8">
              <h3 className="text-2xl font-heading font-bold mb-4 text-accent">Thank You!</h3>
              <p className="text-primary-foreground/80">
                You've successfully subscribed to our heritage newsletter. 
                Expect beautiful stories and exclusive updates in your inbox.
              </p>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-primary-foreground text-primary placeholder:text-muted-foreground border-0 focus:ring-2 focus:ring-accent"
                required
              />
              <Button 
                type="submit" 
                size="lg" 
                className="bg-accent text-accent-foreground hover:bg-accent/90 whitespace-nowrap"
              >
                Subscribe
              </Button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}