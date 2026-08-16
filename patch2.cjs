const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/CreateFlipbook.tsx', 'utf8');
code = code.replace(`            {!file ? (
              <div 
                className="border border-dashed border-[#E5E4E2] bg-[#F9F8F6] p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#C5A059] transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-12 h-12 bg-white border border-[#E5E4E2] flex items-center justify-center mb-6 text-[#1A1A1A]">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <h3 className="font-serif italic text-lg mb-2">Click or drag PDF to upload</h3>
                <p className="text-[10px] uppercase tracking-widest text-gray-400">Maximum file size 50MB. Ensure all pages have the same dimensions.</p>
                <input 
                  type="file" 
                  accept=".pdf" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-[#F9F8F6] p-6 border border-[#E5E4E2] flex items-center gap-6">
                  <div className="w-12 h-12 bg-white flex items-center justify-center border border-[#E5E4E2] shrink-0 text-[#1A1A1A]">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-[#1A1A1A] truncate">{file.name}</h4>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                  <button 
                    onClick={() => setFile(null)}
                    className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-600 transition-colors"
                    disabled={isProcessing}
                  >`, `            {files.length === 0 ? (
              <div 
                className="border border-dashed border-[#E5E4E2] bg-[#F9F8F6] p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#C5A059] transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-12 h-12 bg-white border border-[#E5E4E2] flex items-center justify-center mb-6 text-[#1A1A1A]">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <h3 className="font-serif italic text-lg mb-2">Click or drag PDF or Images to upload</h3>
                <p className="text-[10px] uppercase tracking-widest text-gray-400">Upload a single PDF or multiple Images. Maximum file size 50MB.</p>
                <input 
                  type="file" 
                  accept="application/pdf, image/*"
                  multiple 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="space-y-6">
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
                  >`);
code = code.replace(`                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}`, `                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}`); // Just a check

fs.writeFileSync('src/pages/admin/CreateFlipbook.tsx', code);
