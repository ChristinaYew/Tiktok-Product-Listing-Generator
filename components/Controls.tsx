
import React, { useRef } from 'react';
import { ProductListing, COLORS, Slide, TextOverlay } from '../types';
import { Wand2, Image as ImageIcon, Plus, Trash2, Move, Layers, Upload, Type, Download } from 'lucide-react';

interface ControlsProps {
  listing: ProductListing;
  onUpdateSlide: (slideId: string, updates: Partial<Slide>) => void;
  onAddSlide: () => void;
  onDeleteSlide: (slideId: string) => void;
  onSetActiveSlide: (index: number) => void;
  selectedOverlayId: string | null;
  onUpdateOverlay: (overlayId: string, updates: Partial<TextOverlay>) => void;
  onAddOverlay: () => void;
  onDeleteOverlay: (overlayId: string) => void;
  onGenerateMalayPhrases: () => void;
  onGenerateImage: () => void;
  isGeneratingText: boolean;
  isGeneratingImage: boolean;
  onUploadImages: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDownload: () => void;
}

export const Controls: React.FC<ControlsProps> = ({ 
  listing,
  onUpdateSlide,
  onAddSlide,
  onDeleteSlide,
  onSetActiveSlide,
  selectedOverlayId,
  onUpdateOverlay,
  onAddOverlay,
  onDeleteOverlay,
  onGenerateMalayPhrases,
  onGenerateImage,
  isGeneratingText,
  isGeneratingImage,
  onUploadImages,
  onDownload
}) => {
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeSlide = listing.slides[listing.activeSlideIndex];
  const selectedOverlay = activeSlide.overlays.find(o => o.id === selectedOverlayId);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col h-full overflow-hidden">
      
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800 font-display flex items-center gap-2">
          <Layers className="w-5 h-5 text-tiktok-pink" />
          Editor
        </h2>
        <button 
          onClick={onDownload}
          className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-700 transition-colors shadow-sm"
        >
          <Download className="w-3 h-3" /> Save Image
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Slide Navigation & Upload */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-gray-500 uppercase">Product Photos</label>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={onUploadImages}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="text-xs bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-full font-bold shadow-sm hover:bg-gray-50 flex items-center gap-1 transition-all"
            >
              <Upload className="w-3 h-3" /> Upload
            </button>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {listing.slides.map((slide, idx) => (
              <div 
                key={slide.id}
                onClick={() => onSetActiveSlide(idx)}
                className={`relative flex-shrink-0 w-16 h-16 rounded-md border-2 cursor-pointer overflow-hidden transition-all
                  ${idx === listing.activeSlideIndex ? 'border-tiktok-cyan ring-2 ring-tiktok-cyan/30' : 'border-gray-200 hover:border-gray-400'}
                `}
              >
                <img src={slide.imageUrl} className="w-full h-full object-cover" alt={`Slide ${idx+1}`} />
                <div className="absolute bottom-0 right-0 bg-black/50 text-white text-[10px] px-1 font-mono">
                  {idx + 1}
                </div>
              </div>
            ))}
            
            {/* Quick Add Blank Slide Button */}
            <button 
                onClick={onAddSlide}
                className="flex-shrink-0 w-16 h-16 rounded-md border-2 border-dashed border-gray-300 hover:border-gray-400 flex items-center justify-center text-gray-400 hover:text-gray-600 bg-gray-50"
                title="Add Blank Slide"
            >
                <Plus className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex justify-between items-center mt-2 px-1">
             <button 
                onClick={onGenerateImage}
                disabled={isGeneratingImage}
                className="text-xs flex items-center gap-1 text-indigo-600 font-semibold hover:bg-indigo-50 px-2 py-1 rounded transition-colors disabled:opacity-50"
             >
                {isGeneratingImage ? "Generating..." : <><ImageIcon className="w-3 h-3" /> AI Generate Image</>}
             </button>
             {listing.slides.length > 1 && (
                <button 
                  onClick={() => onDeleteSlide(activeSlide.id)}
                  className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Delete Slide
                </button>
             )}
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Text Generator */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-gray-500 uppercase">AI Marketing Copy</label>
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border border-indigo-100">
             <p className="text-xs text-gray-600 mb-3">
               Add 1-3 catchy Malay phrases ("Memang Padu!", "Paling Murah!") to this image.
             </p>
             <button 
                onClick={onGenerateMalayPhrases}
                disabled={isGeneratingText}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50 transform active:scale-95"
            >
                {isGeneratingText ? "Writing..." : <><Wand2 className="w-4 h-4" /> Add Catchy Phrases</>}
            </button>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Layer Controls */}
        <div className="space-y-4">
           <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-gray-500 uppercase">Text Editing</label>
            <button 
              onClick={onAddOverlay}
              className="text-xs border border-gray-300 px-2 py-1 rounded hover:bg-gray-50 flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add Text
            </button>
          </div>

          {selectedOverlay ? (
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200 animate-in fade-in duration-300">
               <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-gray-700 flex items-center gap-1"><Type className="w-3 h-3"/> Text Properties</span>
                  <button onClick={() => onDeleteOverlay(selectedOverlay.id)} className="text-red-500 hover:bg-red-50 p-1 rounded" title="Remove Text">
                    <Trash2 className="w-4 h-4" />
                  </button>
               </div>

               {/* Text Content */}
               <div>
                  <input 
                    type="text" 
                    value={selectedOverlay.text}
                    onChange={(e) => onUpdateOverlay(selectedOverlay.id, { text: e.target.value })}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-tiktok-cyan outline-none font-medium"
                    placeholder="Enter text..."
                  />
               </div>

               {/* Font Size Slider */}
               <div>
                  <div className="flex justify-between text-[10px] text-gray-500 uppercase font-bold mb-1">
                    <span>Size</span>
                    <span>{selectedOverlay.fontSize}px</span>
                  </div>
                  <input 
                    type="range" 
                    min="12" 
                    max="120" 
                    value={selectedOverlay.fontSize}
                    onChange={(e) => onUpdateOverlay(selectedOverlay.id, { fontSize: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
                  />
               </div>

               {/* Font Family */}
               <div className="flex gap-2">
                 <button 
                   onClick={() => onUpdateOverlay(selectedOverlay.id, { fontFamily: 'Fredoka' })}
                   className={`flex-1 py-1.5 text-xs rounded border transition-colors ${selectedOverlay.fontFamily === 'Fredoka' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100'}`}
                 >
                   Fun (Fredoka)
                 </button>
                 <button 
                   onClick={() => onUpdateOverlay(selectedOverlay.id, { fontFamily: 'Poppins' })}
                   className={`flex-1 py-1.5 text-xs rounded border transition-colors ${selectedOverlay.fontFamily === 'Poppins' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100'}`}
                 >
                   Clean (Poppins)
                 </button>
               </div>

               {/* Color Picker */}
               <div>
                  <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block">Color</label>
                  <div className="flex flex-wrap gap-1.5">
                    {COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => onUpdateOverlay(selectedOverlay.id, { color })}
                        className={`w-6 h-6 rounded-full border border-gray-200 shadow-sm transition-transform hover:scale-110 ${selectedOverlay.color === color ? 'ring-2 ring-gray-900 ring-offset-1' : ''}`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
               </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
               <Move className="w-8 h-8 mx-auto mb-2 opacity-50" />
               <p className="text-sm font-medium">Click text on the image to edit</p>
               <p className="text-xs opacity-70 mt-1">or click "Add Text" to start</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
