import { Plus, Search, MoreVertical, Link as LinkIcon, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FlipbooksList() {
  return (
    <div className="space-y-6 text-[#1A1A1A]">
      <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h1 className="font-serif italic text-2xl">Flipbooks</h1>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-2">Manage your digital catalogues</p>
        </div>
        <Link to="/admin/create" className="bg-[#1A1A1A] text-white px-6 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-[#C5A059] transition-colors flex items-center gap-2 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Create Flipbook
        </Link>
      </div>

      <div className="bg-white border border-[#E5E4E2] overflow-hidden">
        <div className="p-4 border-b border-[#E5E4E2] flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search flipbooks..." 
              className="w-full pl-12 pr-4 py-3 bg-[#F9F8F6] border border-[#E5E4E2] text-sm focus:bg-white focus:border-[#C5A059] focus:ring-0 transition-all outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E5E4E2]">
              <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Catalogue</th>
              <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Created</th>
              <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Views</th>
              <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Leads</th>
              <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
              <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E4E2]">
            {[1, 2, 3].map((i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-14 bg-[#F9F8F6] border border-[#E5E4E2] flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-[#1A1A1A]">Collection {i}</p>
                      <p className="text-[10px] text-gray-400">/catalogue/col-{i}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-xs text-gray-600">Oct {i}, 2026</td>
                <td className="py-4 px-6 text-xs text-gray-600 text-right">{i * 1234}</td>
                <td className="py-4 px-6 text-xs text-gray-600 text-right">{i * 12}</td>
                <td className="py-4 px-6">
                  <span className="text-[9px] px-2 py-1 rounded-full uppercase font-bold bg-green-50 text-green-600">
                    LIVE
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-6 h-6 flex items-center justify-center border border-transparent text-gray-400 hover:border-[#C5A059] hover:text-[#C5A059] transition-colors" title="Copy Link">
                      <LinkIcon className="w-3 h-3" />
                    </button>
                    <button className="w-6 h-6 flex items-center justify-center border border-transparent text-gray-400 hover:border-[#C5A059] hover:text-[#C5A059] transition-colors" title="QR Code">
                      <QrCode className="w-3 h-3" />
                    </button>
                    <button className="w-6 h-6 flex items-center justify-center border border-transparent text-gray-400 hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-colors" title="Options">
                      <MoreVertical className="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
