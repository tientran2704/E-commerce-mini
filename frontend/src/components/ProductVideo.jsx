import { useState } from 'react';

function ProductVideo({ videoUrl, poster, alt }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Handle YouTube/Vimeo URLs
  const getEmbedUrl = (url) => {
    if (!url) return null;
    
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1`;
    }
    
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    }
    
    // Direct video file
    return url;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  if (!videoUrl) {
    return null;
  }

  return (
    <div 
      className="relative rounded-xl overflow-hidden bg-gray-900"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => !isPlaying && setShowControls(true)}
    >
      {!isPlaying ? (
        <div 
          className="relative aspect-video cursor-pointer group"
          onClick={() => setIsPlaying(true)}
        >
          {/* Poster Image */}
          <img
            src={poster || 'https://via.placeholder.com/800x450'}
            alt={alt}
            className="w-full h-full object-cover"
          />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
            <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <svg className="w-10 h-10 text-primary-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          
          {/* Video Badge */}
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Product Video
          </div>
        </div>
      ) : (
        <div className="aspect-video">
          {embedUrl?.includes('youtube') || embedUrl?.includes('vimeo') ? (
            <iframe
              src={embedUrl}
              title={alt}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={embedUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
          )}
          
          {/* Close Video Button */}
          <button
            onClick={() => setIsPlaying(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-black/70 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductVideo;
