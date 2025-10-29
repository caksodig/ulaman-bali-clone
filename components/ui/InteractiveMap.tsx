"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface Hotspot {
  id: string;
  name: string;
  description?: string;
  icon: string;
  position: {
    x: number;
    y: number;
  };
  link?: string;
  image?: string;
}

interface InteractiveMapProps {
  title: string;
  instruction?: string;
  mapImage: string;
  hotspots: Hotspot[];
  onHotspotClick?: (hotspot: Hotspot) => void;
  backgroundColor?: string;
  accentColor?: string;
}

export default function InteractiveMap({
  title,
  instruction = "Tap on an icon",
  mapImage,
  hotspots,
  onHotspotClick,
  backgroundColor = "#E8E4DC",
  accentColor = "#C69C4D",
}: InteractiveMapProps) {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Handle hotspot click
  const handleHotspotClick = (hotspot: Hotspot) => {
    setActiveHotspot(activeHotspot === hotspot.id ? null : hotspot.id);

    if (onHotspotClick) {
      onHotspotClick(hotspot);
    }

    // If has link, navigate
    if (hotspot.link && activeHotspot === hotspot.id) {
      window.location.href = hotspot.link;
    }
  };

  // Pan handlers
  const handlePanStart = (clientX: number, clientY: number) => {
    setIsPanning(true);
    setPanStart({
      x: clientX - panOffset.x,
      y: clientY - panOffset.y,
    });
  };

  const handlePanMove = (clientX: number, clientY: number) => {
    if (!isPanning) return;

    const newX = clientX - panStart.x;
    const newY = clientY - panStart.y;

    // Limit panning
    const maxOffset = 200;
    const constrainedX = Math.max(-maxOffset, Math.min(maxOffset, newX));
    const constrainedY = Math.max(-maxOffset, Math.min(maxOffset, newY));

    setPanOffset({ x: constrainedX, y: constrainedY });
  };

  const handlePanEnd = () => {
    setIsPanning(false);
  };

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => {
    handlePanStart(e.clientX, e.clientY);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    handlePanMove(e.clientX, e.clientY);
  };

  const onMouseUp = () => {
    handlePanEnd();
  };

  const onMouseLeave = () => {
    handlePanEnd();
  };

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handlePanStart(touch.clientX, touch.clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handlePanMove(touch.clientX, touch.clientY);
  };

  const onTouchEnd = () => {
    handlePanEnd();
  };

  // Zoom handlers
  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.8));
  };

  const handleResetView = () => {
    setScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Get icon component
  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ReactElement> = {
      villa: (
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      pool: (
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 17h2c1.657 0 3 1.343 3 3s-1.343 3-3 3H3m6-6h2c1.657 0 3 1.343 3 3s-1.343 3-3 3H9m6-6h2c1.657 0 3 1.343 3 3s-1.343 3-3 3h-2M4 6l4-2v7M20 6l-4-2v7" />
        </svg>
      ),
      restaurant: (
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      spa: (
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      yoga: (
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      info: (
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    };

    return icons[iconName] || icons.info;
  };

  return (
    <div
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor }}
    >
      {/* Header */}
      <div className="relative z-20 pt-20 md:pt-32 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto px-6 space-y-4 lg:px-12">
          <h1
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light mb-6"
            style={{ color: accentColor }}
          >
            {title}
          </h1>
          <div className="flex">
            <div
              className="inline-flex gap-2 px-6 py-2 rounded-full"
              style={{ backgroundColor: accentColor, color: "white" }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                />
              </svg>
              <span className="text-sm font-light tracking-wider">
                {instruction}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div
        ref={containerRef}
        className="relative flex-1 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          touchAction: "none",
        }}
      >
        <div
          ref={mapRef}
          className="relative w-full h-full overflow-x-auto hide-scrollbar lg:show-scrollbar"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${scale})`,
          }}
        >
          {/* Map Image */}
          <div className="whitespace-nowrap aspect-[14.8/10]">
            <Image
              src={mapImage}
              alt={title}
              fill
              className="object-cover w-full h-full pointer-events-none select-none"
              draggable={false}
              quality={95}
              priority
            />

            {/* Hotspots */}
            {hotspots.map((hotspot) => (
              <button
                key={hotspot.id}
                onClick={() => handleHotspotClick(hotspot)}
                className="absolute group"
                style={{
                  left: `${hotspot.position.x}%`,
                  top: `${hotspot.position.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {/* Hotspot Icon */}
                <div
                  className={`relative w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                    activeHotspot === hotspot.id
                      ? "scale-125 shadow-2xl"
                      : "scale-100 shadow-lg hover:scale-110"
                  }`}
                  style={{
                    backgroundColor:
                      activeHotspot === hotspot.id ? accentColor : "white",
                    color: activeHotspot === hotspot.id ? "white" : accentColor,
                  }}
                >
                  <div className="w-6 h-6 md:w-7 md:h-7">
                    {getIcon(hotspot.icon)}
                  </div>

                  {/* Pulse animation */}
                  <div
                    className={`absolute inset-0 rounded-full animate-ping ${
                      activeHotspot === hotspot.id ? "block" : "hidden"
                    }`}
                    style={{
                      backgroundColor: accentColor,
                      opacity: 0.3,
                    }}
                  />
                </div>

                {/* Tooltip */}
                {activeHotspot === hotspot.id && (
                  <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-48 p-4 bg-white rounded-lg shadow-xl z-10 animate-fade-in-up">
                    <h4 className="text-sm font-medium text-stone-900 mb-2">
                      {hotspot.name}
                    </h4>
                    {hotspot.description && (
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {hotspot.description}
                      </p>
                    )}
                    {hotspot.link && (
                      <div
                        className="mt-3 text-xs font-medium"
                        style={{ color: accentColor }}
                      >
                        Click to explore →
                      </div>
                    )}
                    {/* Arrow */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-8 border-transparent border-b-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Zoom Controls */}
      {/* <div className="absolute bottom-8 right-8 flex flex-col gap-2 z-20">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          style={{ color: accentColor }}
          aria-label="Zoom in"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          style={{ color: accentColor }}
          aria-label="Zoom out"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 12H4"
            />
          </svg>
        </button>
        <button
          onClick={handleResetView}
          className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          style={{ color: accentColor }}
          aria-label="Reset view"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div> */}
    </div>
  );
}
