import fs from 'fs';

let content = fs.readFileSync('src/pages/admin/CreateFlipbook.tsx', 'utf8');

const target = `{step === 2 && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h3 className="font-serif italic text-lg">Catalogue Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Catalogue Title</label>
                <input type="text" className="w-full bg-[#F9F8F6] border border-[#E5E4E2] focus:border-[#C5A059] focus:ring-0 p-3 text-sm outline-none" placeholder="e.g. Autumn / Winter 2026" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Custom URL Slug</label>
                <div className="flex items-center">
                  <span className="bg-[#E5E4E2] px-4 py-3 text-gray-500 text-sm border border-[#E5E4E2] border-r-0">catalogue/</span>
                  <input type="text" className="flex-1 bg-[#F9F8F6] border border-[#E5E4E2] focus:border-[#C5A059] focus:ring-0 p-3 text-sm outline-none" placeholder="krish-aw26" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">WhatsApp Number</label>
                <input type="text" className="w-full bg-[#F9F8F6] border border-[#E5E4E2] focus:border-[#C5A059] focus:ring-0 p-3 text-sm outline-none" placeholder="+91 98765 43210" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Primary Color</label>
                <div className="flex gap-3">
                  <input type="color" className="h-[46px] w-[46px] cursor-pointer bg-[#F9F8F6] border border-[#E5E4E2] p-1" defaultValue="#C5A059" />
                  <input type="text" className="flex-1 bg-[#F9F8F6] border border-[#E5E4E2] focus:border-[#C5A059] focus:ring-0 p-3 text-sm outline-none" defaultValue="#C5A059" />
                </div>
              </div>
            </div>
            
            <div className="flex justify-between pt-8 border-t border-[#E5E4E2]">
              <button onClick={() => setStep(1)} className="text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-[#1A1A1A] px-4 py-3">Back</button>
              <button onClick={() => setStep(3)} className="bg-[#1A1A1A] text-white px-8 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-[#C5A059] transition-colors">Continue to Content</button>
            </div>
          </div>
        )}`;

const replacement = `{step === 2 && (
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
        )}`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync('src/pages/admin/CreateFlipbook.tsx', content);
    console.log("Patched CreateFlipbook");
} else {
    // If spaces mismatch, just do a rough replace
    console.log("Exact match failed, doing rough replace");
    const startIndex = content.indexOf('{step === 2 && (');
    const endIndex = content.indexOf('{step === 3 && (');
    if (startIndex !== -1 && endIndex !== -1) {
       content = content.substring(0, startIndex) + replacement + "\n        " + content.substring(endIndex);
       fs.writeFileSync('src/pages/admin/CreateFlipbook.tsx', content);
       console.log("Rough patch applied");
    }
}
