import fs from 'fs';

let content = fs.readFileSync('src/pages/viewer/PublicViewer.tsx', 'utf8');

// 1. Update logo and business name in top bar
const headerTarget = `<div className="font-bold tracking-tight text-gray-900 truncate max-w-[150px] sm:max-w-xs ml-1 sm:ml-2">
            {catalogue.business_name || catalogue.title}
          </div>`;
const headerReplacement = `{catalogue.logo_url && (
            <img src={catalogue.logo_url} alt="Logo" className="h-6 w-auto ml-1 sm:ml-2 object-contain" />
          )}
          <div className="font-bold tracking-tight text-gray-900 truncate max-w-[150px] sm:max-w-xs ml-1 sm:ml-2">
            {catalogue.business_name || catalogue.title}
          </div>`;

if (content.includes(headerTarget)) {
    content = content.replace(headerTarget, headerReplacement);
}

// 2. Add scroll zoom handling
const viewerAreaTarget = `className={cn("flex-1 relative bg-gradient-to-br from-gray-100 to-gray-200", zoom > 1 ? "overflow-auto" : "overflow-hidden")}`;
const viewerAreaReplacement = `className={cn("flex-1 relative bg-gradient-to-br from-gray-100 to-gray-200", zoom > 1 ? "overflow-auto" : "overflow-hidden")}
        onWheel={(e) => {
          if (e.ctrlKey || e.metaKey || viewMode === 'flipbook') {
             const newZoom = Math.min(Math.max(zoom - e.deltaY * 0.005, 0.5), 4);
             setZoom(newZoom);
          }
        }}`;
        
if (content.includes(viewerAreaTarget)) {
    content = content.replace(viewerAreaTarget, viewerAreaReplacement);
}

// 3. Update Audio files
const audioTarget = `{/* Hidden Audio Elements */}
      <audio 
        ref={pageTurnSoundRef} 
        src="https://actions.google.com/sounds/v1/foley/page_turn.ogg" 
        preload="auto" 
      />
      <audio 
        ref={bgMusicRef} 
        src="https://cdn.pixabay.com/download/audio/2022/02/10/audio_fc48af67b2.mp3" 
        loop 
        preload="auto" 
        crossOrigin="anonymous"
      />`;
const audioReplacement = `{/* Hidden Audio Elements */}
      <audio 
        ref={pageTurnSoundRef} 
        src="https://upload.wikimedia.org/wikipedia/commons/3/34/Sound_Effect_-_Page_Turn.ogg" 
        preload="auto" 
      />
      <audio 
        ref={bgMusicRef} 
        src="https://upload.wikimedia.org/wikipedia/commons/4/4b/Piano_sonata_no._14_in_C-sharp_minor_%22Moonlight%22%2C_Op._27_No._2_-_I._Adagio_sostenuto.ogg" 
        loop 
        preload="auto" 
        crossOrigin="anonymous"
      />`;
      
if (content.includes(audioTarget)) {
    content = content.replace(audioTarget, audioReplacement);
} else {
    const audioTarget2 = `<audio          ref={pageTurnSoundRef}          src="https://actions.google.com/sounds/v1/foley/page_turn.ogg"          preload="auto"        />       <audio          ref={bgMusicRef}          src="https://cdn.pixabay.com/download/audio/2022/02/10/audio_fc48af67b2.mp3"          loop          preload="auto"          crossOrigin="anonymous"       />`;
    
    const startIndex = content.indexOf('ref={pageTurnSoundRef}');
    if (startIndex !== -1) {
       console.log("Found audio ref directly");
       content = content.replace(/src="https:\/\/actions\.google\.com[^"]+"/, 'src="https://upload.wikimedia.org/wikipedia/commons/3/34/Sound_Effect_-_Page_Turn.ogg"');
       content = content.replace(/src="https:\/\/cdn\.pixabay\.com[^"]+"/, 'src="https://upload.wikimedia.org/wikipedia/commons/4/4b/Piano_sonata_no._14_in_C-sharp_minor_%22Moonlight%22%2C_Op._27_No._2_-_I._Adagio_sostenuto.ogg"');
    }
}

// 4. Update window wheel listener if needed for passive=false
const effectTarget = `useEffect(() => {
    const loadCatalogue = async () => {`;
const effectReplacement = `useEffect(() => {
    // Prevent default scroll behavior when zooming with mouse wheel
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey || (viewMode === 'flipbook' && !document.fullscreenElement)) {
        e.preventDefault();
      }
    };
    document.addEventListener('wheel', handleWheel, { passive: false });
    return () => document.removeEventListener('wheel', handleWheel);
  }, [viewMode]);

  useEffect(() => {
    const loadCatalogue = async () => {`;

if (content.includes(effectTarget) && !content.includes('handleWheel')) {
    content = content.replace(effectTarget, effectReplacement);
}

fs.writeFileSync('src/pages/viewer/PublicViewer.tsx', content);
console.log("Patched PublicViewer");
