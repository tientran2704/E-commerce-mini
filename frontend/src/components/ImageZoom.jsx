import { useState, useRef } from 'react';

function ImageZoom({ src, alt, zoomLevel = 2 }) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!imgRef.current) return;
    
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setPosition({ x, y });
  };

  return (
    <div 
      className="relative overflow-hidden rounded-xl cursor-crosshair"
      ref={imgRef}
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
      onMouseMove={handleMouseMove}
    >
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-300 ${
          isZoomed ? 'opacity-0' : 'opacity-100'
        }`}
      />
      
      {isZoomed && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${src})`,
            backgroundPosition: `${position.x}% ${position.y}%`,
            backgroundSize: `${zoomLevel * 100}%`,
            backgroundRepeat: 'no-repeat',
          }}
        />
      )}
      
      {/* Zoom indicator */}
      <div className="absolute bottom-3 right-3 bg-black/50 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
        </svg>
        Hover to zoom
      </div>
    </div>
  );
}

export default ImageZoom;
