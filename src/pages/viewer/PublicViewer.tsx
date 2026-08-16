import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Share2, Download, Search, Maximize, MessageCircle, ChevronLeft, ChevronRight, Grid, ArrowLeft, Home } from 'lucide-react';
import { DEMO_CATALOGUE } from '../../lib/demo-data';
import { cn } from '../../lib/utils';
import { FlipbookEngine, FlipbookEngineHandle } from '../../components/FlipbookEngine';
import { previewStore } from '../../lib/store';

export default function PublicViewer() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const engineRef = useRef<FlipbookEngineHandle>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [catalogue, setCatalogue] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function loadData() {
      if (slug === 'preview') {
        const previewData = await previewStore.load();
        if (previewData) {
          setCatalogue(previewData);
        } else {
          navigate('/admin/create');
        }
      } else {
        // Fallback to demo for any other slug until backend is connected
        setCatalogue(DEMO_CATALOGUE);
      }
      setIsLoading(false);
    }
    loadData();
  }, [slug, navigate]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-100 flex items-center justify-center">
        <div className="text-gray-400 font-bold uppercase tracking-widest text-[10px] animate-pulse">Loading Catalogue...</div>
      </div>
    );
  }

  if (!catalogue) return null;
  
  const totalPages = catalogue.page_count;

  const handlePageChange = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  const jumpToPage = (pageIndex: number) => {
    if (engineRef.current) {
      engineRef.current.turnToPage(pageIndex);
      setShowThumbnails(false);
    }
  };

  const nextButtonClick = () => {
    if (engineRef.current) engineRef.current.flipNext();
  };

  const prevButtonClick = () => {
    if (engineRef.current) engineRef.current.flipPrev();
  };
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleWhatsApp = (productCode?: string) => {
    const whatsappNum = String(catalogue.whatsapp || '919876543210');
    const message = productCode 
      ? `Hi, I am interested in Product ${productCode} from your catalogue.`
      : `Hi, I am interested in your catalogue.`;
    const url = `https://wa.me/${whatsappNum.replace('+', '')}?text=${encodeURIComponent(message)}`;
    
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = async () => {
    const shareData = {
      title: catalogue.business_name || catalogue.title,
      text: `Check out this catalogue: ${catalogue.title}`,
      url: window.location.href
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy link', err);
      }
    }
  };

  const handleDownload = () => {
    if (catalogue.pdf_url) {
      const a = document.createElement('a');
      a.href = catalogue.pdf_url;
      a.target = '_blank';
      a.download = `${catalogue.slug}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // For flipbooks without a direct PDF URL, trigger print to Save as PDF
      window.print();
    }
  };

  return (
    <div ref={containerRef} className="fixed inset-0 bg-gray-100 flex flex-col font-sans overflow-hidden">
      {/* Top Bar */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-10 shrink-0 shadow-sm">
        <div className="flex items-center gap-1 sm:gap-2">
          <button onClick={() => navigate(-1)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-1 text-sm font-medium" title="Go Back">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button onClick={() => navigate('/')} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-1 text-sm font-medium" title="Home">
            <Home className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1 sm:mx-2 hidden sm:block"></div>
          <div className="font-bold tracking-tight text-gray-900 truncate max-w-[150px] sm:max-w-xs ml-1 sm:ml-2">
            {catalogue.business_name || catalogue.title}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors hidden sm:block">
            <Search className="w-5 h-5" />
          </button>
          <button onClick={handleDownload} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors hidden sm:block" title="Download">
            <Download className="w-5 h-5" />
          </button>
          <button onClick={handleShare} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors hidden sm:block" title="Share">
            <Share2 className="w-5 h-5" />
          </button>
          <button 
            onClick={toggleFullscreen}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            title="Toggle Fullscreen"
          >
            <Maximize className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Viewer Area */}
      <div className="flex-1 relative flex items-center justify-center p-4 sm:p-8 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="relative w-full h-full max-w-6xl flex items-center justify-center">
          
          <button 
            onClick={prevButtonClick}
            disabled={currentPage === 0}
            className="absolute left-0 z-10 p-3 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-lg backdrop-blur disabled:opacity-30 disabled:cursor-not-allowed transition-all transform -translate-x-1/2"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* HTMLFlipBook requires fixed dimensions or a sized container. We use aspect ratio and sizing constraints here. */}
          <FlipbookEngine 
            ref={engineRef}
            pages={catalogue.pages}
            hotspots={catalogue.hotspots}
            onPageChange={handlePageChange}
            handleWhatsApp={handleWhatsApp}
          />

          <button 
            onClick={nextButtonClick}
            disabled={currentPage >= totalPages - 1}
            className="absolute right-0 z-10 p-3 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-lg backdrop-blur disabled:opacity-30 disabled:cursor-not-allowed transition-all transform translate-x-1/2"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Bottom Toolbar */}
      <div className="h-14 bg-white/90 backdrop-blur border-t border-gray-200 flex items-center justify-between px-4 sm:px-8 z-20 shrink-0 relative">
        <button 
          onClick={() => setShowThumbnails(!showThumbnails)}
          className={cn("flex items-center gap-2 text-sm font-medium transition-colors p-2 rounded-lg", showThumbnails ? "bg-gray-100 text-indigo-600" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50")}
        >
          <Grid className="w-4 h-4" />
          <span className="hidden sm:inline">Thumbnails</span>
        </button>

        <div className="text-sm font-medium text-gray-500">
          Page {currentPage + 1} of {totalPages}
        </div>

        <button 
          onClick={() => handleWhatsApp()}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Enquire on WhatsApp</span>
          <span className="sm:hidden">Enquire</span>
        </button>
      </div>

      {/* Thumbnail Drawer */}
      <div 
        className={cn(
          "absolute bottom-14 left-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-xl transition-transform duration-300 ease-in-out z-10 flex gap-4 p-4 overflow-x-auto",
          showThumbnails ? "translate-y-0" : "translate-y-full"
        )}
      >
        {catalogue.pages.map((page, index) => (
          <div 
            key={index} 
            onClick={() => jumpToPage(index)}
            className={cn(
              "shrink-0 cursor-pointer flex flex-col gap-2 items-center group",
              index === currentPage || index === currentPage - 1 ? "opacity-100" : "opacity-60 hover:opacity-100"
            )}
          >
            <div className={cn(
              "w-20 h-28 bg-gray-100 rounded border-2 overflow-hidden transition-colors",
              index === currentPage || index === currentPage - 1 ? "border-indigo-600" : "border-transparent group-hover:border-gray-300"
            )}>
              <img src={page.thumbnail_url || page.image_url} className="w-full h-full object-cover" alt={`Thumb ${page.page_number}`} />
            </div>
            <span className="text-xs font-medium text-gray-600">{page.page_number}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
