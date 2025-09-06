"use client";

import React, { useState, useCallback } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

export const GoogleMap = ({
  lat,
  lng,
  storeName,
  address,
  onLoad,
  className = ""
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleMapLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleMapError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  // Generate Google Maps embed URL
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&q=${encodeURIComponent(address)}&center=${lat},${lng}&zoom=15&maptype=roadmap`;

  return (
    <div className={`relative w-full h-96 rounded-lg overflow-hidden bg-card border shadow-sm ${className}`}>
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground font-medium">Loading map...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
          <div className="flex flex-col items-center gap-3 text-center p-6">
            <MapPin className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Map unavailable</p>
              <p className="text-xs text-muted-foreground">{address}</p>
            </div>
          </div>
        </div>
      )}

      {/* Google Maps Iframe */}
      <iframe
        src={mapSrc}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={handleMapLoad}
        onError={handleMapError}
        title={`Map showing location of ${storeName}`}
        aria-label={`Interactive map displaying ${storeName} at ${address}`}
        className="transition-opacity duration-300"
      />

      {/* Store Info Overlay */}
      <div className="absolute bottom-4 left-4 right-4 bg-card/95 backdrop-blur-sm rounded-md p-3 shadow-lg border">
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <h3 className="font-semibold text-sm text-foreground truncate">{storeName}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{address}</p>
          </div>
        </div>
      </div>
    </div>
  );
};