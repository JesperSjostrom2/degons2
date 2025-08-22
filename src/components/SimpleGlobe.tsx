'use client';

import { useEffect, useRef, useState } from 'react';

const SimpleGlobe = ({ width = 96, height = 96 }: { width?: number; height?: number }) => {
  const globeRef = useRef<any>(null);
  const rootRef = useRef<any>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadGlobe = async () => {
      const Globe = (await import('react-globe.gl')).default;
      
      if (globeRef.current && typeof window !== 'undefined' && isMounted) {
        const React = await import('react');
        const { createRoot } = await import('react-dom/client');
        
        if (!rootRef.current) {
          rootRef.current = createRoot(globeRef.current);
        }
        
        const globeElement = React.createElement(Globe, {
          width,
          height,
          globeImageUrl: 'https://unpkg.com/three-globe/example/img/earth-dark.jpg',
          backgroundColor: 'rgba(0,0,0,0)',
          showGlobe: true,
          showAtmosphere: true,
          atmosphereColor: '#dac5a7',
          atmosphereAltitude: 0.15,
          enablePointerInteraction: true,
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
        // Delay unmounting to avoid synchronous unmount during render
        setTimeout(() => {
          try {
            if (rootRef.current) {
              rootRef.current.unmount();
              rootRef.current = null;
            }
          } catch (e) {
            
          }
        }, 0);
      }
    };
  }, [width, height, isHovered]);

  return (
    <div 
      ref={globeRef} 
      style={{ width, height }} 
      className="rounded-full overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    />
  );
};

export default SimpleGlobe;