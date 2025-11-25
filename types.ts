
export interface TextOverlay {
  id: string;
  text: string;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  fontSize: number; // pixel value relative to canvas (500px base)
  color: string;
  fontFamily: 'Fredoka' | 'Poppins';
}

export interface Slide {
  id: string;
  imageUrl: string;
  overlays: TextOverlay[];
}

export interface ProductListing {
  slides: Slide[];
  logoText: string;
  activeSlideIndex: number;
}

export const DEFAULT_SLIDE: Slide = {
  id: 'slide-1',
  imageUrl: "https://picsum.photos/800/800?random=1",
  overlays: [
    {
      id: 'ov-1',
      text: "BUAYA KAWAN SETIA!",
      x: 50,
      y: 10,
      fontSize: 32,
      color: "#FACC15", // Yellow-400
      fontFamily: 'Fredoka'
    },
    {
      id: 'ov-2',
      text: "80cm & 100cm",
      x: 50,
      y: 85,
      fontSize: 24,
      color: "#ffffff",
      fontFamily: 'Poppins'
    }
  ]
};

export const DEFAULT_LISTING: ProductListing = {
  slides: [DEFAULT_SLIDE],
  logoText: "SneakPeekArts",
  activeSlideIndex: 0
};

export const COLORS = [
  // Mono
  '#ffffff', // White
  '#000000', // Black
  '#1f2937', // Gray-800
  '#4b5563', // Gray-600
  
  // TikTok Brand
  '#FE2C55', // TikTok Pink
  '#25F4EE', // TikTok Cyan
  
  // Reds & Pinks
  '#ef4444', // Red-500
  '#b91c1c', // Red-700
  '#f472b6', // Pink-400
  '#be185d', // Pink-700
  
  // Yellows & Oranges
  '#FACC15', // Yellow-400
  '#a16207', // Yellow-700
  '#fb923c', // Orange-400
  '#c2410c', // Orange-700
  
  // Greens
  '#4ade80', // Green-400
  '#15803d', // Green-700
  '#14b8a6', // Teal-500
  
  // Blues & Purples
  '#60a5fa', // Blue-400
  '#1d4ed8', // Blue-700
  '#a855f7', // Purple-500
  '#7e22ce', // Purple-700
  '#e879f9', // Fuchsia-400
];
