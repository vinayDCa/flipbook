import { BookOpen, Eye, MessageCircle, Share2, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardOverview() {
  return (
    <div className="space-y-8 text-[#1A1A1A]">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Flipbooks" value="12" icon={BookOpen} percent={100} />
        <StatCard title="Total Views" value="24,892" icon={Eye} percent={70} />
        <StatCard title="Total Enquiries" value="842" icon={MessageCircle} percent={45} />
        <StatCard title="Total Shares" value="1,204" icon={Share2} percent={85} />
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
                <TableRow 
                  name="Krish Ethnic Wear — AW 2026" 
                  slug="krish-aw26" 
                  pages={42} 
                  views="12.4k" 
                  enquiries={482} 
                  status="Published" 
                />
                <TableRow 
                  name="Glitorium Summer Collection" 
                  slug="glitorium-summer" 
                  pages={28} 
                  views="8.2k" 
                  enquiries={214} 
                  status="Published" 
                />
                <TableRow 
                  name="Royal Furniture 2026" 
                  slug="royal-furniture" 
                  pages={64} 
                  views="3.1k" 
                  enquiries={89} 
                  status="Draft" 
                />
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

function TableRow({ name, slug, pages, views, enquiries, status }: any) {
  const isPublished = status === 'Published';
  return (
    <tr className="hover:bg-gray-50/50 transition-colors group">
      <td className="py-4 px-5">
        <p className="text-xs font-bold text-[#1A1A1A]">{name}</p>
        <p className="text-[10px] text-gray-400">/{slug}</p>
      </td>
      <td className="py-4 px-5 text-xs text-gray-600 text-right">{pages}</td>
      <td className="py-4 px-5 text-xs text-gray-600 text-right">{views}</td>
      <td className="py-4 px-5 text-xs text-gray-600 text-right">{enquiries}</td>
      <td className="py-4 px-5">
        <span className={`text-[9px] px-2 py-1 rounded-full uppercase font-bold ${isPublished ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
          {isPublished ? 'LIVE' : 'DRAFT'}
        </span>
      </td>
      <td className="py-4 px-5 text-right">
        <Link to={`/catalogue/${slug}`} target="_blank" className="text-gray-400 hover:text-[#C5A059] transition-colors inline-flex p-1">
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </td>
    </tr>
  );
}

function ProductRow({ name, code, leads, time, isNew }: any) {
  return (
    <div className="border-b border-gray-100 pb-3 flex justify-between items-center last:border-0 last:pb-0">
      <div className="flex flex-col">
        <p className="text-xs font-bold text-[#1A1A1A]">{name}</p>
        <p className="text-[10px] text-gray-400">Code {code} • {leads} leads</p>
      </div>
      <span className={`text-[9px] px-2 py-1 rounded-full uppercase font-bold ${isNew ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
        {isNew ? 'NEW' : 'TREND'}
      </span>
    </div>
  );
}
