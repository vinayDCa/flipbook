import { db } from '../../lib/firebase';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { useAuth } from '../../lib/auth';
import { BookOpen, Eye, MessageCircle, Share2, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { previewStore } from '../../lib/store';

function ProductRow({ name, code, leads, time, isNew }: { name: string, code: string, leads: number, time: string, isNew: boolean }) {
  return (
    <div className="flex items-center justify-between pb-4 border-b border-[#E5E4E2] last:border-0 last:pb-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#F9F8F6] border border-[#E5E4E2] flex items-center justify-center relative">
          <BookOpen className="w-4 h-4 text-[#C5A059]" />
          {isNew && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>}
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900">{name}</div>
          <div className="text-xs text-gray-500">{code}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold text-gray-900">{leads} Leads</div>
        <div className="text-[10px] text-gray-500">{time}</div>
      </div>
    </div>
  );
}

export default function DashboardOverview() {
  const { user } = useAuth();
  const [flipbooks, setFlipbooks] = useState<any[]>([]);
  const navigate = useNavigate();

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
            setFlipbooks(books.slice(0, 5));
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
      } catch (err) {
        console.error(err);
      }
    }
    loadFlipbooks();
  }, []);

  return (
    <div className="space-y-8 text-[#1A1A1A]">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Flipbooks" value={flipbooks.length.toString()} icon={BookOpen} percent={100} />
        <StatCard title="Total Views" value="0" icon={Eye} percent={0} />
        <StatCard title="Total Enquiries" value="0" icon={MessageCircle} percent={0} />
        <StatCard title="Total Shares" value="0" icon={Share2} percent={0} />
      </div>

      {/* Recent Activity & Top Catalogues */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif italic text-xl">Recent Flipbooks</h2>
            <Link to="/admin/flipbooks" className="text-[10px] text-[#C5A059] underline tracking-widest uppercase cursor-pointer">View All</Link>
          </div>
          
          <div className="bg-white border border-[#E5E4E2] overflow-hidden flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5E4E2]">
                  <th className="py-4 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Catalogue</th>
                  <th className="py-4 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Pages</th>
                  <th className="py-4 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Views</th>
                  <th className="py-4 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Enquiries</th>
                  <th className="py-4 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="py-4 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E4E2]">
                {flipbooks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500 text-sm">No recent activity.</td>
                  </tr>
                ) : flipbooks.map((fb, i) => (
                  <tr key={fb.id || i} className="hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => window.open(`/c/${fb.slug || 'preview'}`, '_blank')}>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-10 bg-[#F9F8F6] border border-[#E5E4E2] flex-shrink-0 flex items-center justify-center overflow-hidden">
                           {(fb.cover_url || (fb.pages && fb.pages[0]?.thumbnail_url)) ? (
                              <img src={fb.cover_url || fb.pages[0]?.thumbnail_url} alt="Cover" className="w-full h-full object-cover" />
                            ) : null}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#1A1A1A]">{fb.title || fb.business_name || 'Untitled'}</p>
                          <p className="text-[10px] text-gray-400">/catalogue/{fb.slug || 'preview'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-xs text-gray-600 text-right">{fb.page_count || fb.pages?.length || 0}</td>
                    <td className="py-4 px-5 text-xs text-gray-600 text-right">{fb.views || 0}</td>
                    <td className="py-4 px-5 text-xs text-gray-600 text-right">{fb.leads || 0}</td>
                    <td className="py-4 px-5">
                      <span className="text-[9px] px-2 py-1 rounded-full uppercase font-bold bg-green-50 text-green-600">LIVE</span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button className="text-[10px] text-gray-400 font-bold uppercase tracking-widest hover:text-[#C5A059] transition-colors flex items-center gap-1 justify-end w-full">
                        View <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif italic text-xl">Most Enquired Products</h2>
            <Link to="/admin/analytics" className="text-[10px] text-[#C5A059] underline tracking-widest uppercase cursor-pointer">Analytics</Link>
          </div>
          
          <div className="bg-white border border-[#E5E4E2] p-6 flex-1 space-y-5">
            <ProductRow name="Premium Kurta Set" code="KEW-104" leads={126} time="2m ago" isNew={true} />
            <ProductRow name="Designer Lehenga" code="KEW-205" leads={84} time="15m ago" isNew={false} />
            <ProductRow name="Royal Velvet Collection" code="RV-204" leads={62} time="1h ago" isNew={true} />
            <ProductRow name="Classic Sherwani" code="CS-110" leads={41} time="4h ago" isNew={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, percent }: { title: string, value: string, icon: any, percent: number }) {
  return (
    <div className="bg-white p-5 border border-[#E5E4E2] flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] uppercase tracking-widest text-gray-400">{title}</p>
        <Icon className="w-4 h-4 text-gray-300" />
      </div>
      <p className="text-2xl font-serif italic text-[#1A1A1A]">{value}</p>
      <div className="w-full bg-gray-100 h-[2px] mt-4">
        <div className="bg-[#C5A059] h-full transition-all duration-1000" style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}

