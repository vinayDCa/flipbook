import fs from 'fs';

let content = fs.readFileSync('src/pages/admin/CreateFlipbook.tsx', 'utf8');

// Add X icon
content = content.replace(
    `import { UploadCloud, FileText, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';`,
    `import { UploadCloud, FileText, CheckCircle2, Loader2, ArrowRight, X } from 'lucide-react';`
);

// Replace handleFileChange
const handleFileChangeTarget = `  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const isPDF = selectedFiles.some(f => (f as any).type === 'application/pdf');
      
      if (isPDF && selectedFiles.length > 1) {
        alert('Please upload either a single PDF or multiple images.');
        return;
      }
      
      setFiles(selectedFiles);
    }
  };`;

const handleFileChangeReplacement = `  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const isPDF = selectedFiles.some(f => (f as any).type === 'application/pdf');
      
      if (isPDF) {
        if (selectedFiles.length > 1) {
            alert('Please upload either a single PDF or multiple images.');
            return;
        }
        setFiles(selectedFiles);
      } else {
        setFiles(prev => {
            const prevIsPDF = prev.length > 0 && prev[0].type === 'application/pdf';
            if (prevIsPDF) return selectedFiles;
            return [...prev, ...selectedFiles];
        });
      }
      
      e.target.value = '';
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };`;

if(content.includes(handleFileChangeTarget)) {
    content = content.replace(handleFileChangeTarget, handleFileChangeReplacement);
} else {
    // try partial
    console.log("Could not find exact handleFileChange target");
}

// Replace UI
const uiTarget = `              <div className="space-y-6">
                <div className="bg-[#F9F8F6] p-6 border border-[#E5E4E2] flex items-center gap-6">
                  <div className="w-12 h-12 bg-white flex items-center justify-center border border-[#E5E4E2] shrink-0 text-[#1A1A1A]">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-[#1A1A1A] truncate">
                      {files.length === 1 ? files[0].name : \`\${files.length} images selected\`}
                    </h4>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">
                      {(files.reduce((acc, f) => acc + f.size, 0) / (1024 * 1024)).toFixed(2)} MB total
                    </p>
                  </div>
                  <button 
                    onClick={() => setFiles([])}
                    className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-600 transition-colors"
                    disabled={isProcessing}
                  >
                    Remove
                  </button>
                </div>`;

const uiReplacement = `              <div className="space-y-6">
                {files[0].type === 'application/pdf' ? (
                  <div className="bg-[#F9F8F6] p-6 border border-[#E5E4E2] flex items-center gap-6">
                    <div className="w-12 h-12 bg-white flex items-center justify-center border border-[#E5E4E2] shrink-0 text-[#1A1A1A]">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-[#1A1A1A] truncate">
                        {files[0].name}
                      </h4>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">
                        {(files[0].size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button 
                      onClick={() => setFiles([])}
                      className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-600 transition-colors"
                      disabled={isProcessing}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-serif italic text-lg">{files.length} Images Selected</h4>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400">
                          {(files.reduce((acc, f) => acc + f.size, 0) / (1024 * 1024)).toFixed(2)} MB total
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="border border-[#E5E4E2] bg-[#F9F8F6] hover:border-[#C5A059] text-[#1A1A1A] px-4 py-2 text-[10px] uppercase tracking-widest font-bold transition-colors"
                          disabled={isProcessing}
                        >
                          Add More
                        </button>
                        <button 
                          onClick={() => setFiles([])}
                          className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-600 transition-colors"
                          disabled={isProcessing}
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 max-h-[400px] overflow-y-auto p-4 border border-[#E5E4E2] bg-[#F9F8F6]">
                      {files.map((file, index) => (
                        <div key={\`\${file.name}-\${index}\`} className="relative group aspect-[3/4] bg-white border border-[#E5E4E2] overflow-hidden shadow-sm">
                          <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                          <button 
                            onClick={() => removeFile(index)}
                            className="absolute top-2 right-2 bg-white hover:bg-red-500 hover:text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all text-[#1A1A1A] shadow-md"
                            title="Remove Image"
                            disabled={isProcessing}
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <div className="absolute bottom-0 left-0 w-full bg-white/90 p-1.5 text-[10px] truncate font-bold text-center border-t border-[#E5E4E2]">
                            Page {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}`;

if(content.includes(uiTarget)) {
    content = content.replace(uiTarget, uiReplacement);
} else {
    console.log("Could not find exact ui target");
}

fs.writeFileSync('src/pages/admin/CreateFlipbook.tsx', content);
console.log("Patched uploader");
