'use client';

import { type CSSProperties, useMemo } from 'react';

import { GlobePulse, type PulseMarker } from '@/components/ui/cobe-globe-pulse';

interface CountryLocation {
  lat: number;
  lng: number;
  label: string;
}

interface HexedGlobeProps {
  width?: number;
  height?: number;
  onCountrySelect?: (country: string) => void;
  selectedCountry?: string;
}

const COUNTRY_LOCATIONS: Record<string, CountryLocation> = {
  Finland: { lat: 60.1698557, lng: 24.9383791, label: 'Helsinki' },
  Sweden: { lat: 59.3293235, lng: 18.0685808, label: 'Stockholm' },
  UK: { lat: 51.5072178, lng: -0.1275862, label: 'London' },
};

const COUNTRY_IDS: Record<string, string> = {
  Finland: 'finland',
  Sweden: 'sweden',
  UK: 'uk',
};

const HexedGlobe = ({ selectedCountry }: HexedGlobeProps) => {
  const activeCountry = selectedCountry && COUNTRY_LOCATIONS[selectedCountry] ? selectedCountry : undefined;
  const isSpinning = !activeCountry;

  const markers = useMemo<PulseMarker[]>(() => {
    return Object.entries(COUNTRY_LOCATIONS).map(([country, location], index) => ({
      id: COUNTRY_IDS[country],
      location: [location.lat, location.lng] as [number, number],
      delay: country === activeCountry ? 0 : (index + 1) * 0.45,
      size: country === activeCountry ? 0.06 : 0.035,
      color: country === activeCountry ? [0.96, 0.84, 0.66] : [0.2, 0.8, 0.9],
    }));
  }, [activeCountry]);

  const activeLocation = activeCountry ? COUNTRY_LOCATIONS[activeCountry] : undefined;
  const activeMarkerId = activeCountry ? COUNTRY_IDS[activeCountry] : undefined;
  const labelStyle = activeMarkerId
    ? ({
        position: 'absolute',
        positionAnchor: `--cobe-${activeMarkerId}`,
        bottom: 'anchor(top)',
        left: 'anchor(center)',
        transform: 'translate(-50%, -10px)',
        padding: '3px 8px',
        borderRadius: '999px',
        background: 'rgba(5, 5, 5, 0.88)',
        border: '1px solid rgba(218, 197, 167, 0.45)',
        color: '#f8fafc',
        fontSize: '10px',
        fontWeight: 600,
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        backdropFilter: 'blur(8px)',
        filter: `blur(calc((1 - var(--cobe-visible-${activeMarkerId}, 0)) * 8px)) drop-shadow(0 6px 10px rgba(0, 0, 0, 0.45))`,
        opacity: `var(--cobe-visible-${activeMarkerId}, 0)`,
        transition: 'opacity 0.4s, filter 0.4s',
      } as CSSProperties & { positionAnchor: string })
    : undefined;

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-visible">
      <GlobePulse
        markers={markers}
        className="w-full"
        speed={isSpinning ? 0.002 : 0}
        scale={1.12}
        focusLocation={activeLocation ? [activeLocation.lat, activeLocation.lng] : undefined}
      />
      {activeLocation && labelStyle ? <div style={labelStyle}>{activeLocation.label}</div> : null}
    </div>
  );
};

export default HexedGlobe;
