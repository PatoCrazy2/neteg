"use client";

import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, Autocomplete, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import { MapPin, Globe, ExternalLink, Video, Plus, Check, Map as MapIcon, X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Definir fuera del componente para mantener una referencia estable
const LIBRARIES: any = ["places"];

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  isLight?: boolean;
}

export function LocationInput({ value, onChange, isLight }: LocationInputProps) {
  const [mode, setMode] = useState<'physical' | 'virtual'>('physical');
  const [showOptions, setShowOptions] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      console.error("CRITICAL: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not defined in environment variables.");
    }
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: LIBRARIES,
  });

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      if (place.formatted_address) {
        onChange(place.formatted_address);
      }
      if (place.geometry && place.geometry.location) {
        setCoordinates({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
    }
  };

  const handleFocus = () => {
    setShowOptions(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-4 w-full relative" ref={containerRef}>
      {/* Estilos globales para el dropdown de Google Maps (PAC container) */}
      <style jsx global>{`
        .pac-container {
          background-color: ${isLight ? '#ffffff' : '#0B0B0E'} !important;
          border: 1px solid ${isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'} !important;
          border-radius: 12px !important;
          margin-top: 8px !important;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5) !important;
          font-family: inherit !important;
          z-index: 1000 !important;
        }
        .pac-item {
          border-top: 1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'} !important;
          padding: 8px 12px !important;
          color: ${isLight ? '#000000' : '#ffffff'} !important;
          cursor: pointer !important;
        }
        .pac-item:hover {
          background-color: ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'} !important;
        }
        .pac-item-query {
          color: ${isLight ? '#000000' : '#ffffff'} !important;
          font-size: 13px !important;
        }
        .pac-matched {
          color: #B9B4FF !important;
        }
        .pac-icon {
          filter: ${isLight ? 'none' : 'invert(1) brightness(2)'} !important;
        }
        .hdpi .pac-logo:after {
          filter: ${isLight ? 'none' : 'invert(1) grayscale(1) opacity(0.5)'} !important;
        }
      `}</style>

      <label className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${
        isLight ? 'text-black/20' : 'text-white/20'
      }`}>
        <MapPin size={12} /> Ubicación
      </label>

      <div className="relative group">
        {isLoaded && mode === 'physical' ? (
          <Autocomplete
            onLoad={onLoad}
            onPlaceChanged={onPlaceChanged}
          >
            <input 
              type="text"
              placeholder="Busca una dirección..."
              className={`w-full bg-transparent border-none p-0 text-[15px] font-medium focus:outline-none transition-all pr-8 ${
                isLight ? 'text-black/80 placeholder:text-black/10' : 'text-white/80 placeholder:text-white/10'
              }`}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={handleFocus}
            />
          </Autocomplete>
        ) : (
          <input 
            type="text"
            placeholder={mode === 'virtual' ? "Pega tu enlace de Meet, Zoom, etc..." : "Cargando mapas..."}
            className={`w-full bg-transparent border-none p-0 text-[15px] font-medium focus:outline-none transition-all pr-8 ${
              isLight ? 'text-black/80 placeholder:text-black/10' : 'text-white/80 placeholder:text-white/10'
            }`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleFocus}
          />
        )}

        {value && (
          <button 
            type="button"
            onClick={() => {
              onChange("");
              setCoordinates(null);
            }}
            className={`absolute right-0 top-1/2 -translate-y-1/2 p-1 rounded-full transition-all ${
              isLight ? 'hover:bg-black/5 text-black/20 hover:text-black' : 'hover:bg-white/5 text-white/20 hover:text-white'
            }`}
          >
            <X size={14} />
          </button>
        )}

        {/* Options Popover */}
        <AnimatePresence>
          {showOptions && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={`absolute top-full left-0 mt-4 w-full md:w-[320px] p-2 border rounded-2xl shadow-2xl backdrop-blur-2xl z-[60] ${
                isLight ? 'bg-white border-black/10' : 'bg-[#0B0B0E] border-white/10'
              }`}
            >
              <div className="flex gap-1 mb-2">
                <button 
                  onClick={() => setMode('physical')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${
                    mode === 'physical' 
                      ? (isLight ? 'bg-black text-white' : 'bg-white text-black')
                      : (isLight ? 'hover:bg-black/5 text-black/40' : 'hover:bg-white/5 text-white/40')
                  }`}
                >
                  <MapIcon size={14} /> Presencial
                </button>
                <button 
                  onClick={() => setMode('virtual')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${
                    mode === 'virtual' 
                      ? (isLight ? 'bg-black text-white' : 'bg-white text-black')
                      : (isLight ? 'hover:bg-black/5 text-black/40' : 'hover:bg-white/5 text-white/40')
                  }`}
                >
                  <Video size={14} /> Virtual
                </button>
              </div>

              {mode === 'virtual' && (
                <div className="space-y-1 p-1">
                  <p className={`text-[10px] uppercase tracking-widest font-bold mb-2 ml-1 ${isLight ? 'text-black/20' : 'text-white/20'}`}>Accesos Directos</p>
                  <a 
                    href="https://meet.google.com/new" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between w-full p-3 rounded-xl transition-all group ${
                      isLight ? 'hover:bg-black/5' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <Globe size={16} className="text-green-500" />
                      </div>
                      <div className="text-left">
                        <span className={`block text-xs font-bold ${isLight ? 'text-black' : 'text-white'}`}>Google Meet</span>
                        <span className={`block text-[10px] ${isLight ? 'text-black/40' : 'text-white/40'}`}>Crear reunión ahora</span>
                      </div>
                    </div>
                    <ExternalLink size={14} className={isLight ? 'text-black/20 group-hover:text-black/60' : 'text-white/20 group-hover:text-white/60'} />
                  </a>

                  <a 
                    href="https://zoom.us/meeting/schedule" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between w-full p-3 rounded-xl transition-all group ${
                      isLight ? 'hover:bg-black/5' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Video size={16} className="text-blue-500" />
                      </div>
                      <div className="text-left">
                        <span className={`block text-xs font-bold ${isLight ? 'text-black' : 'text-white'}`}>Zoom</span>
                        <span className={`block text-[10px] ${isLight ? 'text-black/40' : 'text-white/40'}`}>Programar en Zoom</span>
                      </div>
                    </div>
                    <ExternalLink size={14} className={isLight ? 'text-black/20 group-hover:text-black/60' : 'text-white/20 group-hover:text-white/60'} />
                  </a>
                </div>
              )}

              {mode === 'physical' && (
                <div className={`p-4 text-center space-y-2`}>
                   <div className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center ${isLight ? 'bg-black/5' : 'bg-white/5'}`}>
                      <MapPin size={20} className={isLight ? 'text-black/20' : 'text-white/20'} />
                   </div>
                   <p className={`text-[10px] font-medium leading-relaxed ${isLight ? 'text-black/40' : 'text-white/40'}`}>
                      Escribe una dirección para que tus asistentes puedan llegar fácilmente.
                   </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Map Display */}
      {mode === 'physical' && coordinates && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 300 }}
          className={`w-full rounded-2xl overflow-hidden border transition-all duration-500 ${
            isLight ? 'border-black/5' : 'border-white/5'
          }`}
        >
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={coordinates}
            zoom={15}
            options={{
              disableDefaultUI: true,
              styles: isLight ? [] : [
                { elementType: "geometry", stylers: [{ color: "#212121" }] },
                { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
                { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
                { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
                { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#757575" }] },
                { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
                { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#2c2c2c" }] },
                { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
              ]
            }}
          >
            <MarkerF position={coordinates} />
          </GoogleMap>
        </motion.div>
      )}
    </div>
  );
}
