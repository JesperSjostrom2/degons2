'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface Country {
  type: string;
  geometry: any;
  properties: {
    ADMIN: string;
    ISO_A2: string;
    POP_EST: number;
  };
}

interface HexedGlobeProps {
  width?: number;
  height?: number;
  onCountrySelect?: (country: string) => void;
  selectedCountry?: string;
}

// Country coordinates for focusing
const COUNTRY_COORDINATES = {
  Finland: { lat: 64.9631, lng: 26.2695 },
  Sweden: { lat: 62.1944, lng: 14.9448 },
  UK: { lat: 54.7023545, lng: -3.2765753 }
};

const HexedGlobe = ({ 
  width = 280, 
  height = 280, 
  onCountrySelect,
  selectedCountry 
}: HexedGlobeProps) => {
  const globeRef = useRef<any>(null);
  const rootRef = useRef<any>(null);
  const globeInstanceRef = useRef<any>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch country data
  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson');
        const data = await response.json();
        setCountries(data.features || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch country data:', error);
        setIsLoading(false);
      }
    };

    fetchCountryData();
  }, []);

  // Handle country selection
  const focusOnCountry = useCallback((countryCode: string) => {
    if (globeInstanceRef.current && COUNTRY_COORDINATES[countryCode as keyof typeof COUNTRY_COORDINATES]) {
      const coords = COUNTRY_COORDINATES[countryCode as keyof typeof COUNTRY_COORDINATES];
      
      // Smooth rotation to country without changing altitude
      globeInstanceRef.current.pointOfView(
        {
          lat: coords.lat,
          lng: coords.lng,
          altitude: 2.0 // Keep same altitude to prevent disappearing
        },
        1000 // Animation duration
      );
    }
  }, []);

  // Handle country selection changes
  useEffect(() => {
    if (selectedCountry && Object.keys(COUNTRY_COORDINATES).includes(selectedCountry)) {
      focusOnCountry(selectedCountry);
    }
  }, [selectedCountry, focusOnCountry]);

  useEffect(() => {
    let isMounted = true;

    const loadGlobe = async () => {
      if (!countries.length || isLoading) return;

      const Globe = (await import('react-globe.gl')).default;
      
      if (globeRef.current && typeof window !== 'undefined' && isMounted) {
        const React = await import('react');
        const { createRoot } = await import('react-dom/client');
        
        if (!rootRef.current) {
          rootRef.current = createRoot(globeRef.current);
        }
        
        const globeElement = React.createElement(Globe, {
          ref: (globe: any) => {
            globeInstanceRef.current = globe;
          },
          width,
          height,
          backgroundColor: 'rgba(0,0,0,0)',
          
          // Globe appearance - light blue theme
          globeImageUrl: 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
          showGlobe: true,
          showAtmosphere: true,
          atmosphereColor: '#ADD8E6', // Light blue glow
          atmosphereAltitude: 0.15,
          
          // Hexagonal polygons - even lighter blue
          hexPolygonsData: countries,
          hexPolygonGeoJsonGeometry: (d: Country) => d.geometry,
          hexPolygonColor: () => '#B6E5FF', // Even lighter blue for countries
          hexPolygonResolution: 3,
          hexPolygonMargin: 0.15,
          hexPolygonUseDots: false,
          hexPolygonAltitude: 0.01,
          
          // Camera controls - restrict movement but allow rotation
          enablePointerInteraction: true,
          
          // Initial camera position for bottom-positioned globe showing top half
          onGlobeReady: () => {
            if (globeInstanceRef.current) {
              // Position camera to show more of the top hemisphere like reference
              globeInstanceRef.current.pointOfView({ 
                lat: 60, // Higher latitude to show more of the top
                lng: 15, // Centered around Europe 
                altitude: 2.0 // Lower altitude with smaller globe size
              });
              
              // Disable camera movement controls (zoom/pan) while keeping rotation
              const controls = globeInstanceRef.current.controls();
              if (controls) {
                controls.enableZoom = false;
                controls.enablePan = false;
                controls.minDistance = controls.maxDistance = 2.0 * globeInstanceRef.current.getGlobeRadius();
              }
            }
          },
          
          // Handle polygon clicks
          onHexPolygonClick: (polygon: Country) => {
            const countryName = polygon.properties?.ADMIN;
            if (countryName && onCountrySelect) {
              // Map country names to our country codes
              const countryMap: { [key: string]: string } = {
                'United Kingdom': 'UK',
                'Finland': 'Finland',
                'Sweden': 'Sweden'
              };
              
              const mappedCountry = countryMap[countryName];
              if (mappedCountry) {
                onCountrySelect(mappedCountry);
              }
            }
          }
        });
        
        if (rootRef.current && isMounted) {
          rootRef.current.render(globeElement);
        }
      }
    };

    loadGlobe().catch(console.error);

    return () => {
      isMounted = false;
      if (rootRef.current) {
        setTimeout(() => {
          try {
            if (rootRef.current) {
              rootRef.current.unmount();
              rootRef.current = null;
            }
          } catch (e) {
            // Ignore unmount errors
          }
        }, 0);
      }
    };
  }, [countries, isLoading, width, height, onCountrySelect]);

  if (isLoading) {
    return (
      <div 
        style={{ width, height }} 
        className="rounded-full bg-accent/10 animate-pulse flex items-center justify-center"
      >
        <div className="w-16 h-16 rounded-full border-2 border-accent/20 border-t-accent animate-spin"></div>
      </div>
    );
  }

  return (
    <div 
      style={{ 
        width: '100%', 
        height: '100%', // Fill the container completely
        position: 'absolute',
        top: 0,
        left: 0,
        overflow: 'hidden' // Hide overflow to contain the globe properly
      }} 
      className="cursor-pointer"
    >
      <div
        ref={globeRef} 
        style={{ 
          width, 
          height, 
          position: 'absolute',
          bottom: '-30%', // Adjust position for smaller globe
          left: '50%',
          transform: 'translateX(-50%)', // Center horizontally
        }} 
        className="transition-transform duration-300"
      />
    </div>
  );
};

export default HexedGlobe;