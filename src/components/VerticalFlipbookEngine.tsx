import React, { useState, useImperativeHandle, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { FlipbookEngineHandle } from './FlipbookEngine';

interface VerticalFlipbookEngineProps {
  pages: any[];
  hotspots: any[];
  onPageChange: (pageIndex: number) => void;
  handleWhatsApp: (target?: string, customNumber?: string) => void;
}

export const VerticalFlipbookEngine = React.forwardRef<FlipbookEngineHandle, VerticalFlipbookEngineProps>(
  ({ pages, hotspots, onPageChange, handleWhatsApp }, ref) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    
    const triggerPageTurnSound = () => {
      // The parent handles sound onPageChange now, but we want to make sure it plays accurately on vertical too.
      // Since we call onPageChange directly, the sound should already work from the parent viewer.
    };

    useImperativeHandle(ref, () => ({
      flipNext: () => {
        if (currentIndex < pages.length - 1) {
          setDirection(1);
          const nextIdx = currentIndex + 1;
          setCurrentIndex(nextIdx);
          onPageChange(nextIdx);
        }
      },
      flipPrev: () => {
        if (currentIndex > 0) {
          setDirection(-1);
          const prevIdx = currentIndex - 1;
          setCurrentIndex(prevIdx);
          onPageChange(prevIdx);
        }
      },
      turnToPage: (index: number) => {
        if (index >= 0 && index < pages.length) {
          setDirection(index > currentIndex ? 1 : -1);
          setCurrentIndex(index);
          onPageChange(index);
        }
      }
    }));

    const variants = {
      enter: (direction: number) => ({
        y: direction > 0 ? 1000 : -1000,
        opacity: 0,
        rotateX: direction > 0 ? 45 : -45,
        scale: 0.9,
      }),
      center: {
        y: 0,
        opacity: 1,
        rotateX: 0,
        scale: 1,
      },
      exit: (direction: number) => ({
        y: direction < 0 ? 1000 : -1000,
        opacity: 0,
        rotateX: direction < 0 ? 45 : -45,
        scale: 0.9,
      })
    };

    const handleDragEnd = (e: any, { offset, velocity }: any) => {
      const swipe = offset.y;
      if (swipe < -100 || velocity.y < -500) {
        // swipe up -> next page
        if (currentIndex < pages.length - 1) {
          setDirection(1);
          setCurrentIndex(prev => prev + 1);
          onPageChange(currentIndex + 1);
        }
      } else if (swipe > 100 || velocity.y > 500) {
        // swipe down -> prev page
        if (currentIndex > 0) {
          setDirection(-1);
          setCurrentIndex(prev => prev - 1);
          onPageChange(currentIndex - 1);
        }
      }
    };

    const page = pages[currentIndex];
    if (!page) return null;

    return (
      <div 
        className="relative w-full h-full max-w-2xl mx-auto flex items-center justify-center overflow-hidden"
        style={{ perspective: 2000 }}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              opacity: { duration: 0.2 }
            }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={1}
            onDragEnd={handleDragEnd}
            className="absolute w-full max-h-full aspect-[3/4] bg-white shadow-2xl flex flex-col items-center justify-center cursor-grab active:cursor-grabbing border border-gray-200"
          >
            <img src={page.image_url} alt={`Page ${page.page_number}`} className="w-full h-full object-contain pointer-events-none" />
            
            {/* Hotspots */}
            {hotspots.filter(h => h.page_number === page.page_number).map(hotspot => (
              <div 
                key={hotspot.id}
                className="absolute border-2 border-[#C5A059]/50 bg-[#C5A059]/10 cursor-pointer hover:bg-[#C5A059]/30 transition-colors flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 opacity-80 z-20"
                style={{
                  left: `${hotspot.x}%`,
                  top: `${hotspot.y}%`,
                  width: `${hotspot.width}%`,
                  height: `${hotspot.height}%`
                }}
                onPointerDown={(e) => e.stopPropagation()}
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
            
            <div className="absolute bottom-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest w-full text-center z-20 pointer-events-none">
              {page.page_number}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }
);
