import { BookOpen, Copy, Download, ExternalLink, Plus, Search, Share2, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { useAuth } from '../../lib/auth';
import { useState, useEffect } from 'react';
import { previewStore } from '../../lib/store';

export default function FlipbooksList() {
  const { user } = useAuth();
  const [flipbooks, setFlipbooks] = useState<any[]>([]);

  useEffect(() => {
    async function loadFlipbooks() {
      try {
        if (user) {
          const q = query(
            collection(db, 'flipbooks'),
            where('user_id', '==', user.uid)
          );
          const querySnapshot = await getDocs(q);
          const books = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
          books.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          
          if (books.length > 0) {
            setFlipbooks(books);
          } else {
            const preview = await previewStore.load();
            if (preview) setFlipbooks([preview]);
          }
        } else {
          const preview = await previewStore.load();
          if (preview) {
            setFlipbooks([preview]);
          }
        }
      } catch (error) {
        console.error("Failed to load flipbooks:", error);
      }
    }
    loadFlipbooks();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif italic text-3xl mb-2">My Flipbooks</h1>
          <p className="text-[10px] uppercase tracking-widest text-gray-500">Manage your digital catalogues</p>
        </div>
        
        <Link 
          to="/admin/create"
          className="bg-[#1A1A1A] text-white px-6 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-[#C5A059] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create New
        </Link>
      </div>

      <div className="bg-white border border-[#E5E4E2]">
        <div className="p-4 border-b border-[#E5E4E2] flex items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="SEARCH CATALOGUES..."
              className="w-full bg-[#F9F8F6] border border-[#E5E4E2] pl-10 pr-4 py-2 text-[10px] uppercase tracking-widest focus:outline-none focus:border-[#C5A059] transition-colors"
            />
          </div>
        </div>

        {flipbooks.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            No flipbooks found. Create your first catalogue to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] uppercase tracking-widest text-gray-500 bg-[#F9F8F6] border-b border-[#E5E4E2]">
                <tr>
                  <th className="px-6 py-4 font-bold">Catalogue</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Views</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E4E2]">
                {flipbooks.map((book, idx) => (
                  <tr key={book.id || idx} className="hover:bg-[#F9F8F6] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-16 bg-gray-100 border border-[#E5E4E2] overflow-hidden">
                          <img src={book.cover_image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 mb-1">{book.title}</div>
                          <div className="text-[10px] text-gray-500 uppercase tracking-widest">{book.page_count} Pages</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Published
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Eye className="w-4 h-4" />
                        124
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={`/catalogue/${book.id || 'preview'}`} target="_blank" className="p-2 text-gray-400 hover:text-[#C5A059] transition-colors" title="View Public Link">
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button className="p-2 text-gray-400 hover:text-[#C5A059] transition-colors" title="Share">
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
