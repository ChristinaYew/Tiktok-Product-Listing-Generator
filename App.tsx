
import React, { useState, useRef } from 'react';
import { PreviewCanvas } from './components/PreviewCanvas';
import { Controls } from './components/Controls';
import { generateMalayPhrases, generateProductImage } from './services/geminiService';
import { ProductListing, DEFAULT_LISTING, Slide, TextOverlay } from './types';
import { nanoid } from 'nanoid';

function App() {
  const [listing, setListing] = useState<ProductListing>(DEFAULT_LISTING);
  const [selectedOverlayId, setSelectedOverlayId] = useState<string | null>(null);
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const activeSlide = listing.slides[listing.activeSlideIndex];

  // --- Slide Management ---
  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: nanoid(),
      imageUrl: "https://picsum.photos/800/800?random=" + Math.random(),
      overlays: [
         {
            id: nanoid(),
            text: "New Slide",
            x: 50,
            y: 50,
            fontSize: 32,
            color: "#ffffff",
            fontFamily: 'Fredoka'
         }
      ]
    };
    setListing(prev => ({
      ...prev,
      slides: [...prev.slides, newSlide],
      activeSlideIndex: prev.slides.length // Select the new slide
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      const fileReaders = files.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file as Blob);
        });
      });

      try {
        const images = await Promise.all(fileReaders);
        const newSlides: Slide[] = images.map(img => ({
          id: nanoid(),
          imageUrl: img,
          overlays: []
        }));

        setListing(prev => ({
          ...prev,
          slides: [...prev.slides, ...newSlides],
          activeSlideIndex: prev.slides.length // Jump to the first of the new slides
        }));
      } catch (error) {
        console.error("Error reading files", error);
        alert("Failed to upload images");
      }
    }
  };

  const handleDeleteSlide = (slideId: string) => {
    if (listing.slides.length <= 1) return;
    const newSlides = listing.slides.filter(s => s.id !== slideId);
    setListing(prev => ({
      ...prev,
      slides: newSlides,
      activeSlideIndex: Math.min(prev.activeSlideIndex, newSlides.length - 1)
    }));
  };

  const handleUpdateSlide = (slideId: string, updates: Partial<Slide>) => {
    setListing(prev => ({
      ...prev,
      slides: prev.slides.map(s => s.id === slideId ? { ...s, ...updates } : s)
    }));
  };

  // --- Overlay Management ---
  const handleAddOverlay = () => {
    const newOverlay: TextOverlay = {
      id: nanoid(),
      text: "Edit Me",
      x: 50,
      y: 50,
      fontSize: 24,
      color: "#ffffff",
      fontFamily: 'Fredoka'
    };
    handleUpdateSlide(activeSlide.id, {
      overlays: [...activeSlide.overlays, newOverlay]
    });
    setSelectedOverlayId(newOverlay.id);
  };

  const handleDeleteOverlay = (overlayId: string) => {
    handleUpdateSlide(activeSlide.id, {
      overlays: activeSlide.overlays.filter(o => o.id !== overlayId)
    });
    setSelectedOverlayId(null);
  };

  const handleUpdateOverlay = (overlayId: string, updates: Partial<TextOverlay>) => {
    handleUpdateSlide(activeSlide.id, {
      overlays: activeSlide.overlays.map(o => o.id === overlayId ? { ...o, ...updates } : o)
    });
  };

  // --- AI Features ---
  const handleGenerateMalayPhrases = async () => {
    setIsGeneratingText(true);
    try {
      const phrases = await generateMalayPhrases();
      // Take up to 3 phrases as requested
      const newOverlays: TextOverlay[] = phrases.slice(0, 3).map((text, i) => ({
        id: nanoid(),
        text: text,
        x: 50,
        y: 20 + (i * 25), // Stagger them vertically
        fontSize: 42, // Slightly larger by default for impact
        color: i % 2 === 0 ? "#FACC15" : "#25F4EE", // Alternate Yellow and TikTok Cyan
        fontFamily: 'Fredoka'
      }));
      
      handleUpdateSlide(activeSlide.id, {
        overlays: [...activeSlide.overlays, ...newOverlays]
      });
      if (newOverlays.length > 0) {
        setSelectedOverlayId(newOverlays[0].id);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to generate phrases");
    } finally {
      setIsGeneratingText(false);
    }
  };

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    try {
      const base64Image = await generateProductImage();
      handleUpdateSlide(activeSlide.id, { imageUrl: base64Image });
    } catch (e) {
      console.error(e);
      alert("Failed to generate image");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // --- Download Feature ---
  const handleDownload = async () => {
    const canvas = document.createElement('canvas');
    // High res output for TikTok (1080x1080 is standard)
    const size = 1080; 
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load Image
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = activeSlide.imageUrl;
    
    try {
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        if (img.complete) resolve(null);
      });

      // 1. Draw Background (Cover fit)
      const scale = Math.max(size / img.width, size / img.height);
      const x = (size / 2) - (img.width / 2) * scale;
      const y = (size / 2) - (img.height / 2) * scale;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      // 2. Draw Side Logo Bar
      const barWidth = size * 0.08; // 8% width
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(size - barWidth, 0, barWidth, size);
      
      // Draw Side Vertical Line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(size - barWidth, 0);
      ctx.lineTo(size - barWidth, size);
      ctx.stroke();

      // Draw Side Logo Text
      ctx.save();
      ctx.translate(size - (barWidth/2), size / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.font = `bold ${size * 0.035}px 'Fredoka', sans-serif`; 
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'black';
      ctx.shadowBlur = 5;
      ctx.fillText(listing.logoText, 0, 0);
      ctx.restore();

      // 3. Draw Overlays
      activeSlide.overlays.forEach(overlay => {
        // Scale font size from preview (500px) to output (1080px)
        const scaleFactor = size / 500;
        const fontSize = overlay.fontSize * scaleFactor;
        
        ctx.font = `700 ${fontSize}px '${overlay.fontFamily}', sans-serif`;
        ctx.fillStyle = overlay.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Shadow/Outline effect for readability
        ctx.strokeStyle = 'black';
        ctx.lineWidth = fontSize * 0.08; // Proportional outline
        ctx.lineJoin = 'round';
        ctx.miterLimit = 2;
        
        const posX = (overlay.x / 100) * size;
        const posY = (overlay.y / 100) * size;

        // Draw stroke first, then fill
        ctx.strokeText(overlay.text, posX, posY);
        ctx.fillText(overlay.text, posX, posY);
      });

      // 4. Trigger Download
      const link = document.createElement('a');
      link.download = `sneakpeek-listing-${nanoid(6)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error("Error generating image", err);
      alert("Could not download image. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4 font-sans">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-4rem)]">
        
        {/* Left Column: Canvas Preview */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center bg-gray-200/50 rounded-2xl p-8 border-2 border-dashed border-gray-300">
          <div className="mb-4 text-center">
             <h1 className="text-3xl font-display font-black text-gray-900 mb-1">
               <span className="text-tiktok-pink">TikTok</span> Shop Generator
             </h1>
             <p className="text-gray-500 text-sm">Upload Photos • Drag text to position • AI Phrases</p>
          </div>
          
          <PreviewCanvas 
            slide={activeSlide}
            logoText={listing.logoText}
            onUpdateOverlay={handleUpdateOverlay}
            selectedOverlayId={selectedOverlayId}
            onSelectOverlay={setSelectedOverlayId}
          />

          <div className="mt-6 text-xs text-gray-400">
            Current Slide: {listing.activeSlideIndex + 1} / {listing.slides.length}
          </div>
        </div>

        {/* Right Column: Controls */}
        <div className="lg:col-span-4 h-full">
          <Controls 
            listing={listing}
            onUpdateSlide={handleUpdateSlide}
            onAddSlide={handleAddSlide}
            onDeleteSlide={handleDeleteSlide}
            onSetActiveSlide={(idx) => setListing(prev => ({ ...prev, activeSlideIndex: idx }))}
            selectedOverlayId={selectedOverlayId}
            onUpdateOverlay={handleUpdateOverlay}
            onAddOverlay={handleAddOverlay}
            onDeleteOverlay={handleDeleteOverlay}
            onGenerateMalayPhrases={handleGenerateMalayPhrases}
            onGenerateImage={handleGenerateImage}
            isGeneratingText={isGeneratingText}
            isGeneratingImage={isGeneratingImage}
            onUploadImages={handleImageUpload}
            onDownload={handleDownload}
          />
        </div>

      </div>
    </div>
  );
}

export default App;
