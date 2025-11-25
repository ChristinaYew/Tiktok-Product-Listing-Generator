import React, { useRef, useState, useEffect } from 'react';
import { Slide, TextOverlay } from '../types';

interface PreviewCanvasProps {
  slide: Slide;
  logoText: string;
  onUpdateOverlay: (overlayId: string, updates: Partial<TextOverlay>) => void;
  selectedOverlayId: string | null;
  onSelectOverlay: (id: string | null) => void;
}

export const PreviewCanvas: React.FC<PreviewCanvasProps> = ({ 
  slide, 
  logoText, 
  onUpdateOverlay,
  selectedOverlayId,
  onSelectOverlay
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialOverlayPos, setInitialOverlayPos] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent, overlay: TextOverlay) => {
    e.stopPropagation();
    onSelectOverlay(overlay.id);
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialOverlayPos({ x: overlay.x, y: overlay.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedOverlayId || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    // Convert pixels to percentage
    const deltaXPercent = (deltaX / containerRect.width) * 100;
    const deltaYPercent = (deltaY / containerRect.height) * 100;

    onUpdateOverlay(selectedOverlayId, {
      x: initialOverlayPos.x + deltaXPercent,
      y: initialOverlayPos.y + deltaYPercent
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Deselect when clicking background
  const handleBackgroundClick = () => {
    onSelectOverlay(null);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="w-full flex justify-center p-4">
      <div 
        ref={containerRef}
        className="relative w-[500px] h-[500px] bg-gray-100 overflow-hidden shadow-2xl rounded-sm select-none border border-gray-300"
        onMouseMove={handleMouseMove}
        onClick={handleBackgroundClick}
      >
        {/* Background Image */}
        <img 
          src={slide.imageUrl} 
          alt="Slide Background" 
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        />

        {/* SneakPeekArts Watermark (Fixed Side Logo) */}
        <div className="absolute right-0 top-0 bottom-0 w-10 bg-black/60 backdrop-blur-sm flex items-center justify-center z-30 border-l border-white/20">
          <span className="text-white font-display font-bold tracking-widest -rotate-90 whitespace-nowrap text-lg shadow-black drop-shadow-md">
            {logoText}
          </span>
        </div>

        {/* Draggable Text Overlays */}
        {slide.overlays.map((overlay) => (
          <div
            key={overlay.id}
            onMouseDown={(e) => handleMouseDown(e, overlay)}
            className={`absolute z-20 cursor-move transition-shadow duration-200 
              ${selectedOverlayId === overlay.id ? 'ring-2 ring-tiktok-cyan ring-offset-2 ring-offset-transparent' : 'hover:ring-1 hover:ring-white/50'}`}
            style={{
              left: `${overlay.x}%`,
              top: `${overlay.y}%`,
              transform: 'translate(-50%, -50%)',
              fontSize: `${overlay.fontSize}px`,
              color: overlay.color,
              fontFamily: overlay.fontFamily === 'Fredoka' ? "'Fredoka', sans-serif" : "'Poppins', sans-serif",
              fontWeight: 700,
              textShadow: '2px 2px 0px rgba(0,0,0,1)', // Strong outline for readability
              whiteSpace: 'nowrap',
              maxWidth: '85%' // Prevent overflow offscreen mostly
            }}
          >
            {overlay.text}
          </div>
        ))}
      </div>
    </div>
  );
};
