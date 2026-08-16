import fs from 'fs';

let content = fs.readFileSync('src/pages/viewer/PublicViewer.tsx', 'utf8');

// Import VerticalFlipbookEngine
if (!content.includes('VerticalFlipbookEngine')) {
    content = content.replace(
        `import { FlipbookEngine } from '../../components/FlipbookEngine';`,
        `import { FlipbookEngine } from '../../components/FlipbookEngine';\nimport { VerticalFlipbookEngine } from '../../components/VerticalFlipbookEngine';`
    );
}

// Ensure FlipbookEngineHandle is imported or just any type works because we use engineRef
// Let's replace the Single/Vertical view markup
const singleViewTarget = `<div className="w-full max-w-2xl flex flex-col gap-8 pb-32">
              {catalogue.pages.map((page: any, index: number) => (
                <div key={index} className="bg-white shadow-xl relative group">
                  <img src={page.image_url} alt={\`Page \${page.page_number}\`} className="w-full h-auto" />
                  
                  {catalogue.hotspots.filter((h: any) => h.page_number === page.page_number).map((hotspot: any) => (
                    <div 
                      key={hotspot.id}
                      className="absolute border-2 border-[#C5A059]/50 bg-[#C5A059]/10 cursor-pointer hover:bg-[#C5A059]/30 transition-colors flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 opacity-80 z-20"
                      style={{
                        left: \`\${hotspot.x}%\`,
                        top: \`\${hotspot.y}%\`,
                        width: \`\${hotspot.width}%\`,
                        height: \`\${hotspot.height}%\`
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
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
                  
                  <div className="absolute bottom-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest w-full text-center z-20">
                    {page.page_number}
                  </div>
                </div>
              ))}
            </div>`;

const singleViewReplacement = `<div className="relative w-full h-full max-w-6xl flex items-center justify-center">
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
            </div>`;

if(content.includes(singleViewTarget)) {
    content = content.replace(singleViewTarget, singleViewReplacement);
} else {
    console.log("Could not find single view target exactly. Using rough split.");
    const parts = content.split(`) : (`);
    if(parts.length > 1) {
        // Find the second part
        const secondHalfStart = parts[1].indexOf(`<div className="w-full max-w-2xl flex flex-col gap-8 pb-32">`);
        if(secondHalfStart !== -1) {
           // We can replace from here down to the ending JSX that closes the flipbook/single view logic
           // Since it's hard, let's just use string replacement on a smaller substring
        }
    }
}

// Let's also check if there are other exact matches
// We can use a regex if needed.
const fallbackRegex = /<div className="w-full max-w-2xl flex flex-col gap-8 pb-32">[\s\S]*?(?=<\/div>\s*<\/div>\s*\{\/\* Thumbnail Drawer)/;
if (content.match(fallbackRegex)) {
    content = content.replace(fallbackRegex, singleViewReplacement + "\n          ");
} else {
    console.log("Regex fallback failed as well.");
}

fs.writeFileSync('src/pages/viewer/PublicViewer.tsx', content);
console.log("Patched PublicViewer for Vertical Engine");
