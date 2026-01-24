import { useState } from 'react';

function HotspotImage({ image, onHotspotClick }) {
  const [hoveredHotspot, setHoveredHotspot] = useState(null);

  return (
    <div className="relative w-full" data-testid="hotspot-image">
      <img
        src={image.url}
        alt="Project"
        className="w-full h-auto"
      />
      
      {image.hotspots && image.hotspots.map((hotspot) => (
        <div
          key={hotspot.id}
          className="hotspot"
          style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
          onClick={() => onHotspotClick(hotspot)}
          onMouseEnter={() => setHoveredHotspot(hotspot.id)}
          onMouseLeave={() => setHoveredHotspot(null)}
          data-testid={`hotspot-${hotspot.id}`}
        >
          <div className="hotspot-ring" />
          <div className="hotspot-dot" />
          
          {hoveredHotspot === hotspot.id && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 bg-white p-3 shadow-xl text-center pointer-events-none z-30 border border-[#E6E4DF]">
              <p className="text-sm font-medium text-[#1A1A1A]">{hotspot.product_name}</p>
              <p className="text-xs text-[#66605B] mt-1">Click to view details</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default HotspotImage;