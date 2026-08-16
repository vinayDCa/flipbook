import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const isPDF = selectedFiles.some(f => (f as any).type === 'application/pdf');
      
      if (isPDF && selectedFiles.length > 1) {
        alert('Please upload either a single PDF or multiple images.');
        return;
      }
      
      setFiles(selectedFiles);
    }
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
                      {files.length === 1 ? files[0].name : `${files.length} images selected`}
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
                </div>

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
