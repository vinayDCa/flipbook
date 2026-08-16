import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Share2, Download, Search, Maximize, MessageCircle, ChevronLeft, ChevronRight, Grid, ArrowLeft, Home, ZoomIn, ZoomOut, FileText, BookOpen, Volume2, VolumeX, Loader2, Play, Pause } from 'lucide-react';
import jsPDF from 'jspdf';
import { DEMO_CATALOGUE } from '../../lib/demo-data';
import { cn } from '../../lib/utils';
import { FlipbookEngine, FlipbookEngineHandle } from '../../components/FlipbookEngine';
import { VerticalFlipbookEngine } from '../../components/VerticalFlipbookEngine';
import { previewStore } from '../../lib/store';
import { usePageTurnSound } from '../../hooks/usePageTurnSound';

export default function PublicViewer() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const engineRef = useRef<FlipbookEngineHandle>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState<'flipbook' | 'single'>('flipbook');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [autoPlayDirection, setAutoPlayDirection] = useState<'forward' | 'backward' | null>(null);
  
  const [catalogue, setCatalogue] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const playPageTurnSound = usePageTurnSound('https://cdn.freesound.org/previews/411/411639_5121236-lq.mp3');
  const bgMusicRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoPlayDirection && viewMode === 'flipbook' && catalogue) {
      interval = setInterval(() => {
        if (autoPlayDirection === 'forward') {
          if (currentPage >= catalogue.page_count - 1) {
            setAutoPlayDirection(null);
          } else {
            engineRef.current?.flipNext();
          }
        } else if (autoPlayDirection === 'backward') {
          if (currentPage <= 0) {
            setAutoPlayDirection(null);
          } else {
            engineRef.current?.flipPrev();
          }
        }
      }, 3500); // Wait 3.5 seconds per page
    }
    
    return () => clearInterval(interval);
  }, [autoPlayDirection, viewMode, currentPage, catalogue]);

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
    playPageTurnSound();
  };

  const toggleMusic = () => {
    if (!bgMusicRef.current) return;
    if (isMusicPlaying) {
      bgMusicRef.current.pause();
    } else {
      bgMusicRef.current.play().catch(() => {});
    }
    setIsMusicPlaying(!isMusicPlaying);
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

  const handleWhatsApp = (productCode?: string, customNumber?: string) => {
    const whatsappNum = String(customNumber || catalogue.whatsapp || '919876543210');
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

  const handleDownload = async () => {
    if (catalogue.pdf_url) {
      const a = document.createElement('a');
      a.href = catalogue.pdf_url;
      a.target = '_blank';
      a.download = `${catalogue.slug}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Generate PDF from images using jsPDF
      setIsDownloading(true);
      try {
        const doc = new jsPDF({ unit: 'px', format: 'a4' });
        
        for (let i = 0; i < catalogue.pages.length; i++) {
          const page = catalogue.pages[i];
          if (i > 0) doc.addPage();
          
          const img = new Image();
          img.crossOrigin = 'Anonymous';
          img.src = page.image_url;
          
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });
          
          const pageWidth = doc.internal.pageSize.getWidth();
          const pageHeight = doc.internal.pageSize.getHeight();
          const imgRatio = img.width / img.height;
          const pageRatio = pageWidth / pageHeight;
          
          let drawWidth = pageWidth;
          let drawHeight = pageHeight;
          
          if (imgRatio > pageRatio) {
            drawHeight = drawWidth / imgRatio;
          } else {
            drawWidth = drawHeight * imgRatio;
          }
          
          const x = (pageWidth - drawWidth) / 2;
          const y = (pageHeight - drawHeight) / 2;
          
          doc.addImage(img, 'JPEG', x, y, drawWidth, drawHeight);
        }
        
        doc.save(`${catalogue.slug || 'catalogue'}.pdf`);
      } catch (err) {
        console.error('Error generating PDF', err);
        alert('Could not generate PDF automatically. Falling back to print dialogue.');
        window.print();
      }
      setIsDownloading(false);
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
          {catalogue.logo_url && (
            <img src={catalogue.logo_url} alt="Logo" className="h-6 w-auto ml-1 sm:ml-2 object-contain" />
          )}
          <div className="font-bold tracking-tight text-gray-900 truncate max-w-[150px] sm:max-w-xs ml-1 sm:ml-2">
            {catalogue.business_name || catalogue.title}
          </div>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2">
          <button onClick={toggleMusic} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors hidden sm:block" title="Toggle Music">
            {isMusicPlaying ? <Volume2 className="w-5 h-5 text-indigo-600" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1 hidden sm:block"></div>
          
          <button onClick={() => setZoom(z => Math.max(z - 0.25, 0.5))} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors hidden sm:block" title="Zoom Out">
            <ZoomOut className="w-5 h-5" />
          </button>
          <button onClick={() => setZoom(z => Math.min(z + 0.25, 3))} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors hidden sm:block" title="Zoom In">
            <ZoomIn className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1 hidden sm:block"></div>
          
          <button onClick={handleDownload} disabled={isDownloading} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors hidden sm:block disabled:opacity-50" title="Download">
            {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
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
      <div className={cn("flex-1 relative bg-gradient-to-br from-gray-100 to-gray-200", zoom > 1 ? "overflow-auto" : "overflow-hidden")}
        onWheel={(e) => {
          if (e.ctrlKey || e.metaKey || viewMode === 'flipbook') {
             const newZoom = Math.min(Math.max(zoom - e.deltaY * 0.005, 0.5), 4);
             setZoom(newZoom);
          }
        }}>
        <div 
          className="relative w-full h-full min-h-full flex items-center justify-center p-4 sm:p-8 transition-transform duration-200 ease-out origin-center"
          style={{ transform: `scale(${zoom})`, width: zoom > 1 ? `${zoom * 100}%` : '100%', height: zoom > 1 ? `${zoom * 100}%` : '100%' }}
        >
          {viewMode === 'flipbook' ? (
            <div className="relative w-full h-full max-w-6xl flex items-center justify-center">
              <button 
                onClick={prevButtonClick}
                disabled={currentPage === 0}
                className="absolute left-0 z-10 p-3 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-lg backdrop-blur disabled:opacity-30 disabled:cursor-not-allowed transition-all transform -translate-x-1/2"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

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
          ) : (
            <div className="relative w-full h-full max-w-6xl flex items-center justify-center">
              <button 
                onClick={prevButtonClick}
                disabled={currentPage === 0}
                className="absolute top-4 sm:top-10 z-10 p-3 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-lg backdrop-blur disabled:opacity-30 disabled:cursor-not-allowed transition-all transform -translate-y-1/2 rotate-90"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <VerticalFlipbookEngine 
                ref={engineRef}
                pages={catalogue.pages}
                hotspots={catalogue.hotspots}
                onPageChange={handlePageChange}
                handleWhatsApp={handleWhatsApp}
              />
              
              <button 
                onClick={nextButtonClick}
                disabled={currentPage >= totalPages - 1}
                className="absolute bottom-4 sm:bottom-10 z-10 p-3 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-lg backdrop-blur disabled:opacity-30 disabled:cursor-not-allowed transition-all transform translate-y-1/2 rotate-90"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Toolbar */}
      <div className="h-14 bg-white/90 backdrop-blur border-t border-gray-200 flex items-center justify-between px-4 sm:px-8 z-20 shrink-0 relative">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowThumbnails(!showThumbnails)}
            className={cn("flex items-center gap-2 text-sm font-medium transition-colors p-2 rounded-lg", showThumbnails ? "bg-gray-100 text-indigo-600" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50")}
            title="Thumbnails"
          >
            <Grid className="w-5 h-5" />
          </button>
          
          {/* Layout Toggle */}
          <div className="hidden sm:flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('flipbook')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                viewMode === 'flipbook' ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <BookOpen className="w-4 h-4" />
              Horizontal Album
            </button>
            <button
              onClick={() => setViewMode('single')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                viewMode === 'single' ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <FileText className="w-4 h-4" />
              Vertical Album
            </button>
          </div>

          {/* Mobile Layout Toggle (Icon Only) */}
          <button 
            onClick={() => setViewMode(prev => prev === 'flipbook' ? 'single' : 'flipbook')}
            className="sm:hidden flex items-center gap-2 text-sm font-medium transition-colors p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            title={viewMode === 'flipbook' ? "Switch to Vertical Album" : "Switch to Horizontal Album"}
          >
            {viewMode === 'flipbook' ? <FileText className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
          </button>
        </div>

        <div className="text-sm font-medium text-gray-500 hidden sm:flex items-center gap-3">
          {viewMode === 'flipbook' && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setAutoPlayDirection(autoPlayDirection === 'backward' ? null : 'backward')}
                className={cn("p-1.5 rounded-full transition-colors flex items-center justify-center", autoPlayDirection === 'backward' ? "bg-indigo-100 text-indigo-600" : "hover:bg-gray-100 text-gray-500")}
                title={autoPlayDirection === 'backward' ? "Pause Auto-play" : "Auto-play Reverse"}
              >
                {autoPlayDirection === 'backward' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 rotate-180" />}
              </button>
              <button
                onClick={() => setAutoPlayDirection(autoPlayDirection === 'forward' ? null : 'forward')}
                className={cn("p-1.5 rounded-full transition-colors flex items-center justify-center", autoPlayDirection === 'forward' ? "bg-indigo-100 text-indigo-600" : "hover:bg-gray-100 text-gray-500")}
                title={autoPlayDirection === 'forward' ? "Pause Auto-play" : "Auto-play Forward"}
              >
                {autoPlayDirection === 'forward' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </div>
          )}
          <span>{viewMode === 'flipbook' ? `Page ${currentPage + 1} of ${totalPages}` : `${totalPages} Pages`}</span>
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

      {/* Hidden Audio Elements */}

      <audio 
        ref={bgMusicRef} 
        src="https://upload.wikimedia.org/wikipedia/commons/4/4b/Piano_sonata_no._14_in_C-sharp_minor_%22Moonlight%22%2C_Op._27_No._2_-_I._Adagio_sostenuto.ogg" 
        loop 
        preload="auto" 
        crossOrigin="anonymous"
      />
    </div>
  );
}
