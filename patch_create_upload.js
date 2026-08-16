import fs from 'fs';

let content = fs.readFileSync('src/pages/admin/CreateFlipbook.tsx', 'utf8');

const targetChange = `  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const isPDF = selectedFiles.some(f => (f as any).type === 'application/pdf');`;

const replacementChange = `  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement> | any) => {
    const filesList = e.target?.files || e.dataTransfer?.files;
    if (filesList && filesList.length > 0) {
      const selectedFiles = Array.from(filesList as File[]).sort((a, b) => a.name.localeCompare(b.name, undefined, {numeric: true}));
      const isPDF = selectedFiles.some(f => (f as any).type === 'application/pdf');`;

content = content.replace(targetChange, replacementChange);

const dropTarget = `              <div 
                className="border border-dashed border-[#E5E4E2] bg-[#F9F8F6] p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#C5A059] transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >`;

const dropReplacement = `              <div 
                className="border border-dashed border-[#E5E4E2] bg-[#F9F8F6] p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#C5A059] transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleFileChange(e); }}
              >`;

content = content.replace(dropTarget, dropReplacement);

fs.writeFileSync('src/pages/admin/CreateFlipbook.tsx', content);
console.log("Patched CreateFlipbook");
