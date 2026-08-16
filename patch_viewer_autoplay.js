import fs from 'fs';

let content = fs.readFileSync('src/pages/viewer/PublicViewer.tsx', 'utf8');

// Replace isAutoPlaying state with autoPlayDirection
content = content.replace(
  "const [isAutoPlaying, setIsAutoPlaying] = useState(false);",
  "const [autoPlayDirection, setAutoPlayDirection] = useState<'forward' | 'backward' | null>(null);"
);

// Replace the auto play effect
const effectTarget = `  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isAutoPlaying && viewMode === 'flipbook' && catalogue) {
      interval = setInterval(() => {
        if (currentPage >= catalogue.page_count - 1) {
          setIsAutoPlaying(false);
        } else {
          engineRef.current?.flipNext();
        }
      }, 3500); // Wait 3.5 seconds per page
    }
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, viewMode, currentPage, catalogue]);`;

const effectReplacement = `  useEffect(() => {
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
  }, [autoPlayDirection, viewMode, currentPage, catalogue]);`;

content = content.replace(effectTarget, effectReplacement);

// Update UI
// Import Play, Pause, FastForward, Rewind? Let's add standard icons.
// I will just use `<Play className="w-4 h-4 rotate-180" />` for reverse play.
const uiTarget = `          {viewMode === 'flipbook' && (
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={cn("p-1.5 rounded-full transition-colors flex items-center gap-1", isAutoPlaying ? "bg-indigo-100 text-indigo-600" : "hover:bg-gray-100 text-gray-500")}
              title={isAutoPlaying ? "Pause Auto-play" : "Start Auto-play"}
            >
              {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          )}`;

const uiReplacement = `          {viewMode === 'flipbook' && (
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
          )}`;

if (content.includes(uiTarget)) {
  content = content.replace(uiTarget, uiReplacement);
  fs.writeFileSync('src/pages/viewer/PublicViewer.tsx', content);
  console.log("Patched PublicViewer UI and Autoplay logic");
} else {
  console.log("Could not find ui target");
}
