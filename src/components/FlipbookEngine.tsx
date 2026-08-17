import React, { useRef, useImperativeHandle, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { MessageCircle, Loader2 } from 'lucide-react';

interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  page: any;
  hotspots: any[];
  handleWhatsApp: (target?: string) => void;
  priorityLoad: boolean;
}

const Page = React.forwardRef<HTMLDivElement, PageProps>(
  ({ page, hotspots, handleWhatsApp, priorityLoad, ...props }, ref) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
      <div className="bg-white relative overflow-hidden group flex flex-col items-center justify-center" ref={ref} data-density="soft" {...props}>
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-0">
            <Loader2 className="w-6 h-6 text-gray-300 animate-spin" />
          </div>
        )}
        <img 
          src={page.image_url} 
          alt={`Page ${page.page_number}`} 
          className={`w-full h-full object-contain pointer-events-none z-10 transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading={priorityLoad ? "eager" : "lazy"}
          onLoad={() => setImageLoaded(true)}
        />
        
        {page.product_details && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest z-30 shadow-lg backdrop-blur pointer-events-none truncate max-w-[90%]">
            {page.product_details}
          </div>
        )}

        {/* Render Hotspots for this page */}
        {hotspots.map((hotspot) => (
          <div 
            key={hotspot.id}
            className="absolute border-2 border-[#C5A059]/50 bg-[#C5A059]/10 cursor-pointer hover:bg-[#C5A059]/30 transition-colors flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 opacity-80 z-20"
            style={{
              left: `${hotspot.x}%`,
              top: `${hotspot.y}%`,
              width: `${hotspot.width}%`,
              height: `${hotspot.height}%`
            }}
            onPointerDown={(e) => {
              // Prevent react-pageflip from capturing this as a page turn
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (hotspot.type === 'whatsapp') {
                handleWhatsApp(hotspot.target, hotspot.whatsapp_number);
              }
            }}
          >
            <div className="bg-white/80 rounded-full p-1 sm:p-2 shadow-sm animate-pulse">
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#25D366]" />
            </div>
          </div>
        ))}
        
        {/* Page number subtle indicator */}
        <div className="absolute bottom-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest w-full text-center z-20">
          {page.page_number}
        </div>
      </div>
    );
  }
);

export interface FlipbookEngineHandle {
  flipNext: () => void;
  flipPrev: () => void;
  turnToPage: (pageIndex: number) => void;
}

interface FlipbookEngineProps {
  pages: any[];
  hotspots: any[];
  onPageChange: (pageIndex: number) => void;
  handleWhatsApp: (target?: string) => void;
}

export const FlipbookEngine = React.forwardRef<FlipbookEngineHandle, FlipbookEngineProps>(
  ({ pages, hotspots, onPageChange, handleWhatsApp }, ref) => {
    const bookRef = useRef<any>(null);
    const [dimensions, setDimensions] = useState<{width: number, height: number} | null>(null);

    React.useEffect(() => {
      if (pages.length > 0) {
        const img = new Image();
        img.onload = () => {
          const ratio = img.naturalWidth / img.naturalHeight;
          const baseWidth = Math.min(img.naturalWidth, 600);
          const baseHeight = baseWidth / ratio;
          setDimensions({ width: baseWidth, height: baseHeight });
        };
        img.src = pages[0].image_url;
      }
    }, [pages]);

    useImperativeHandle(ref, () => ({
      flipNext: () => {
        if (bookRef.current && bookRef.current.pageFlip()) {
          bookRef.current.pageFlip().flipNext();
        }
      },
      flipPrev: () => {
        if (bookRef.current && bookRef.current.pageFlip()) {
          bookRef.current.pageFlip().flipPrev();
        }
      },
      turnToPage: (pageIndex: number) => {
        if (bookRef.current && bookRef.current.pageFlip()) {
          bookRef.current.pageFlip().turnToPage(pageIndex);
        }
      }
    }));

    if (!dimensions) {
      return (
        <div className="w-full h-[80vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      );
    }

    return (
      <div className="shadow-2xl shadow-black/20 ring-1 ring-black/5 bg-white w-full h-[80vh] max-w-[800px] mx-auto">
        {/* @ts-ignore - react-pageflip types are problematic */}
        <HTMLFlipBook
          width={dimensions.width}
          height={dimensions.height}
          size="stretch"
          minWidth={315}
          maxWidth={2000}
          minHeight={400}
          maxHeight={3000}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          onFlip={(e: any) => onPageChange(e.data)}
          className="flip-book"
          ref={bookRef}
          usePortrait={true}
          drawShadow={true}
          flippingTime={1000}
        >
          {pages.map((page, index) => (
            <Page 
              key={index} 
              page={page} 
              hotspots={hotspots.filter((h: any) => h.page_number === page.page_number)} 
              handleWhatsApp={handleWhatsApp} 
              priorityLoad={index < 4} 
            />
          ))}
        </HTMLFlipBook>
      </div>
    );
  }
);
