import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, Loader2, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import { previewStore } from '../../lib/store';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export default function CreateFlipbook() {
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Branding States
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#C5A059');
  const [companyName, setCompanyName] = useState('');
  const [companyLogo, setCompanyLogo] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement> | any) => {
    const filesList = e.target?.files || e.dataTransfer?.files;
    if (filesList && filesList.length > 0) {
      const selectedFiles = Array.from(filesList as File[]).sort((a, b) => a.name.localeCompare(b.name, undefined, {numeric: true}));
      
      // Handle ZIP Files
      const isZip = selectedFiles.some(f => f.name.toLowerCase().endsWith('.zip') || f.type.includes('zip'));
      
      if (isZip) {
        setIsProcessing(true);
        const zipFile = selectedFiles.find(f => f.name.toLowerCase().endsWith('.zip') || f.type.includes('zip'));
        if (zipFile) {
          try {
            const zip = new JSZip();
            const loadedZip = await zip.loadAsync(zipFile);
            const extractedFiles: File[] = [];
            
            const entries = Object.entries(loadedZip.files);
            for (const [relativePath, zipEntry] of entries) {
              if (!zipEntry.dir && relativePath.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
                // Ignore __MACOSX and hidden files
                if (relativePath.includes('__MACOSX') || relativePath.split('/').pop()?.startsWith('.')) continue;
                
                const blob = await zipEntry.async('blob');
                const file = new File([blob], relativePath.split('/').pop() || 'image.jpg', { type: blob.type || 'image/jpeg' });
                extractedFiles.push(file);
              }
            }
            
            extractedFiles.sort((a, b) => a.name.localeCompare(b.name, undefined, {numeric: true}));
            
            setFiles(prev => {
              const prevIsPDF = prev.length > 0 && prev[0].type === 'application/pdf';
              if (prevIsPDF) return extractedFiles;
              return [...prev, ...extractedFiles];
            });
          } catch (err) {
            console.error("Failed to parse zip", err);
            alert("Failed to parse zip file. Please ensure it contains valid images.");
          }
        }
        setIsProcessing(false);
      } else {
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
      }
      
      if (e.target && e.target.value !== undefined) {
        try { e.target.value = ''; } catch(e) {}
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setProgress(0);
        
    try {
      const extractedPages = [];
      const isPDF = files[0].type === 'application/pdf';

      if (isPDF) {
        const arrayBuffer = await files[0].arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ 
          data: arrayBuffer,
          standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/standard_fonts/`,
          cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
          cMapPacked: true,
        }).promise;
        const numPages = pdf.numPages;
            
        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          // Scale of 1.5 usually offers a good balance of quality vs memory for preview
          const viewport = page.getViewport({ scale: 1.5 });
              
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (!context) continue;
              
          canvas.width = viewport.width;
          canvas.height = viewport.height;
              
          // Fill with white background to prevent black background when saving as JPEG
          context.fillStyle = '#ffffff';
          context.fillRect(0, 0, canvas.width, canvas.height);
              
          await page.render({ canvasContext: context, viewport }).promise;
              
          // Use JPEG for smaller memory footprint compared to PNG
          const imageUrl = canvas.toDataURL('image/jpeg', 0.8);
          extractedPages.push({
            page_number: i,
            image_url: imageUrl,
            thumbnail_url: imageUrl
          });
              
          setProgress(Math.round((i / numPages) * 100));
        }
      } else {
        // Handle Multiple Images
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const imageUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

          extractedPages.push({
            page_number: i + 1,
            image_url: imageUrl,
            thumbnail_url: imageUrl
          });

          setProgress(Math.round(((i + 1) / files.length) * 100));
        }
      }
          
      await previewStore.save({
        title: 'Preview',
        slug: 'preview',
        page_count: extractedPages.length,
        pages: extractedPages,
        hotspots: [],
        products: []
      });
          
      setIsProcessing(false);
      setStep(2);
    } catch (error) {
      console.error("Error processing files:", error);
      alert("Failed to process the files. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-[#1A1A1A]">
      <div className="mb-8 border-b border-[#E5E4E2] pb-6">
        <h1 className="font-serif italic text-2xl">Create New Catalogue</h1>
        <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-2">Upload your PDF or Images to generate an interactive flipbook</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-4 mb-10">
        <StepIndicator step={1} currentStep={step} label="Upload Files" />
        <div className="flex-1 h-[1px] bg-[#E5E4E2]" />
        <StepIndicator step={2} currentStep={step} label="Branding" />
        <div className="flex-1 h-[1px] bg-[#E5E4E2]" />
        <StepIndicator step={3} currentStep={step} label="Products & Hotspots" />
      </div>

      <div className="bg-white border border-[#E5E4E2] p-8">
        {step === 1 && (
          <div className="space-y-6">
            {files.length === 0 ? (
              <div 
                className="border border-dashed border-[#E5E4E2] bg-[#F9F8F6] p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#C5A059] transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleFileChange(e); }}
              >
                <div className="w-12 h-12 bg-white border border-[#E5E4E2] flex items-center justify-center mb-6 text-[#1A1A1A]">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <h3 className="font-serif italic text-lg mb-2">Click or drag PDF, Images, or a ZIP folder to upload</h3>
                <p className="text-[10px] uppercase tracking-widest text-gray-400">Upload a single PDF, multiple Images, or a .zip file of images. Maximum file size 50MB.</p>
                <input 
                  type="file" 
                  accept="application/pdf, image/*, application/zip, .zip"
                  multiple 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="space-y-6">
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
                        <div key={`${file.name}-${index}`} className="relative group aspect-[3/4] bg-white border border-[#E5E4E2] overflow-hidden shadow-sm">
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
                )}

                {isProcessing ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] flex items-center gap-3">
                        <Loader2 className="w-4 h-4 animate-spin text-[#C5A059]" />
                        Processing pages...
                      </span>
                      <span className="text-[10px] font-bold">{progress}%</span>
                    </div>
                    <div className="w-full bg-[#E5E4E2] h-[2px] overflow-hidden">
                      <div className="bg-[#C5A059] h-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end pt-4 border-t border-[#E5E4E2]">
                    <button 
                      onClick={handleProcess}
                      className="bg-[#1A1A1A] text-white px-8 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-[#C5A059] transition-colors flex items-center gap-3"
                    >
                      Process Files
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h3 className="font-serif italic text-lg">Catalogue Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Catalogue Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-[#F9F8F6] border border-[#E5E4E2] focus:border-[#C5A059] focus:ring-0 p-3 text-sm outline-none" placeholder="e.g. Autumn / Winter 2026" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Custom URL Slug</label>
                <div className="flex items-center">
                  <span className="bg-[#E5E4E2] px-4 py-3 text-gray-500 text-sm border border-[#E5E4E2] border-r-0">catalogue/</span>
                  <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="flex-1 bg-[#F9F8F6] border border-[#E5E4E2] focus:border-[#C5A059] focus:ring-0 p-3 text-sm outline-none" placeholder="krish-aw26" />
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Company Name</label>
                <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full bg-[#F9F8F6] border border-[#E5E4E2] focus:border-[#C5A059] focus:ring-0 p-3 text-sm outline-none" placeholder="e.g. Krish Ethnic Wear" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Company Logo URL</label>
                <input type="text" value={companyLogo} onChange={(e) => setCompanyLogo(e.target.value)} className="w-full bg-[#F9F8F6] border border-[#E5E4E2] focus:border-[#C5A059] focus:ring-0 p-3 text-sm outline-none" placeholder="https://example.com/logo.png" />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">WhatsApp Number</label>
                <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="w-full bg-[#F9F8F6] border border-[#E5E4E2] focus:border-[#C5A059] focus:ring-0 p-3 text-sm outline-none" placeholder="+91 98765 43210" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Primary Color</label>
                <div className="flex gap-3">
                  <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="h-[46px] w-[46px] cursor-pointer bg-[#F9F8F6] border border-[#E5E4E2] p-1" />
                  <input type="text" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="flex-1 bg-[#F9F8F6] border border-[#E5E4E2] focus:border-[#C5A059] focus:ring-0 p-3 text-sm outline-none" />
                </div>
              </div>
            </div>
            
            <div className="flex justify-between pt-8 border-t border-[#E5E4E2]">
              <button onClick={() => setStep(1)} className="text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-[#1A1A1A] px-4 py-3">Back</button>
              <button onClick={async () => {
                const currentData = await previewStore.load();
                if (currentData) {
                  await previewStore.save({
                    ...currentData,
                    title: title || currentData.title,
                    slug: slug || currentData.slug,
                    whatsapp: whatsapp,
                    business_name: companyName,
                    logo_url: companyLogo,
                    primary_color: primaryColor
                  });
                }
                setStep(3);
              }} className="bg-[#1A1A1A] text-white px-8 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-[#C5A059] transition-colors">Continue to Content</button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-8 text-center animate-in fade-in duration-500 py-16">
             <div className="w-16 h-16 bg-[#F9F8F6] border border-[#E5E4E2] text-[#C5A059] flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-8 h-8" />
             </div>
             <h3 className="font-serif italic text-2xl">Catalogue Created Successfully</h3>
             <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
               Your flipbook has been generated. You can now add product hotspots, view analytics, or share the public link.
             </p>
             <div className="flex items-center justify-center gap-4 pt-8">
               <button onClick={() => navigate('/catalogue/preview')} className="border border-[#E5E4E2] bg-[#F9F8F6] hover:border-[#C5A059] text-[#1A1A1A] px-8 py-3 text-[10px] uppercase tracking-widest font-bold transition-colors">
                 Preview Flipbook
               </button>
               <button onClick={() => navigate('/admin/flipbooks')} className="bg-[#1A1A1A] text-white px-8 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-[#C5A059] transition-colors">
                 Go to Editor
               </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StepIndicator({ step, currentStep, label }: { step: number, currentStep: number, label: string }) {
  const isActive = step === currentStep;
  const isCompleted = step < currentStep;

  return (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 flex items-center justify-center text-[10px] font-bold transition-colors border ${
        isActive ? 'border-[#C5A059] bg-[#C5A059] text-white' :
        isCompleted ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white' :
        'border-[#E5E4E2] bg-white text-gray-400'
      }`}>
        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : step}
      </div>
      <span className={`text-[10px] uppercase tracking-widest font-bold ${isActive ? 'text-[#1A1A1A]' : 'text-gray-400 hidden sm:block'}`}>
        {label}
      </span>
    </div>
  );
}
