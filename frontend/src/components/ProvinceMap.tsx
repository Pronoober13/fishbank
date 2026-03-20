'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { provinceCoordinates } from '@/lib/provinces';

interface ProvinceMapProps {
  provinces: string[];
}

export default function ProvinceMap({ provinces }: ProvinceMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Indonesia center
    const map = L.map(mapRef.current, {
      center: [-2.5, 118],
      zoom: 5,
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 10,
      minZoom: 4,
    }).addTo(map);

    // Add attribution manually (smaller)
    L.control.attribution({ prefix: false, position: 'bottomright' })
      .addAttribution('© <a href="https://carto.com">CARTO</a>')
      .addTo(map);

    // Add markers for highlighted provinces
    const bounds: L.LatLngExpression[] = [];

    provinces.forEach((prov) => {
      const coord = provinceCoordinates[prov];
      if (!coord) return;

      bounds.push(coord);

      const marker = L.circleMarker(coord, {
        radius: 8,
        fillColor: '#14b892',
        color: '#0d9478',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      }).addTo(map);

      marker.bindPopup(
        `<div style="font-family:system-ui;text-align:center;padding:2px 0">
          <strong style="color:#1a62d4">${prov}</strong>
        </div>`,
        { closeButton: false, offset: [0, -5] }
      );

      marker.on('mouseover', () => marker.openPopup());
      marker.on('mouseout', () => marker.closePopup());
    });

    // Add dimmed markers for non-highlighted provinces
    Object.entries(provinceCoordinates).forEach(([name, coord]) => {
      if (provinces.includes(name)) return;
      L.circleMarker(coord, {
        radius: 4,
        fillColor: '#cbd5e1',
        color: '#94a3b8',
        weight: 1,
        opacity: 0.5,
        fillOpacity: 0.3,
      }).addTo(map);
    });

    // Fit bounds if we have highlighted provinces
    if (bounds.length > 0) {
      map.fitBounds(L.latLngBounds(bounds).pad(0.5));
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [provinces]);

  return (
    <div
      ref={mapRef}
      className="w-full h-64 md:h-80 rounded-xl overflow-hidden border border-slate-200"
      style={{ background: '#f0f7ff' }}
    />
  );
}
