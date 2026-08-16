import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Calendar, Download, Eye, MessageCircle, MousePointer2, TrendingUp, Users } from 'lucide-react';
import { cn } from '../../lib/utils';

const pageViewsData = [
  { name: 'Mon', views: 4000, unique: 2400 },
  { name: 'Tue', views: 3000, unique: 1398 },
  { name: 'Wed', views: 2000, unique: 9800 },
  { name: 'Thu', views: 2780, unique: 3908 },
  { name: 'Fri', views: 1890, unique: 4800 },
  { name: 'Sat', views: 2390, unique: 3800 },
  { name: 'Sun', views: 3490, unique: 4300 },
];

const hotspotData = [
  { name: 'Premium Kurta', clicks: 420 },
  { name: 'Designer Lehenga', clicks: 380 },
  { name: 'Royal Velvet', clicks: 250 },
  { name: 'Classic Sherwani', clicks: 190 },
  { name: 'Silk Saree', clicks: 150 },
];

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState('7D');

  return (
    <div className="space-y-8 text-[#1A1A1A]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E4E2] pb-6">
        <div>
          <h1 className="font-serif italic text-2xl">Analytics</h1>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-2">Track performance across all your catalogues</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-[#F9F8F6] border border-[#E5E4E2] p-1">
            {['7D', '30D', '90D', '1Y'].map(range => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={cn(
                  "px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold transition-colors",
                  dateRange === range ? "bg-[#1A1A1A] text-white" : "text-gray-500 hover:text-[#1A1A1A]"
                )}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 bg-white border border-[#E5E4E2] px-4 py-2 text-[10px] uppercase tracking-widest font-bold hover:border-[#C5A059] transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Views" value="45.2K" change="+12.5%" icon={Eye} />
        <KPICard title="Unique Visitors" value="12.8K" change="+5.2%" icon={Users} />
        <KPICard title="WhatsApp Leads" value="1,492" change="+18.4%" icon={MessageCircle} />
        <KPICard title="Hotspot Clicks" value="8,234" change="+2.1%" icon={MousePointer2} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white border border-[#E5E4E2] p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-serif italic text-lg">Viewer Engagement</h3>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">Page views vs unique visitors over time</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#1A1A1A]" />
                <span>Page Views</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#C5A059]" />
                <span>Unique</span>
              </div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={pageViewsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1A1A1A" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1A1A1A" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorUnique" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C5A059" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E4E2" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', borderRadius: '4px', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="views" stroke="#1A1A1A" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                <Area type="monotone" dataKey="unique" stroke="#C5A059" strokeWidth={2} fillOpacity={1} fill="url(#colorUnique)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Hotspots */}
        <div className="bg-white border border-[#E5E4E2] p-6">
          <h3 className="font-serif italic text-lg mb-1">Top Hotspots</h3>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-8">Most clicked products</p>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hotspotData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E4E2" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#1A1A1A', fontWeight: 'bold' }} width={100} />
                <Tooltip 
                  cursor={{ fill: '#F9F8F6' }}
                  contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', borderRadius: '4px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="clicks" fill="#C5A059" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Device & Location Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-[#E5E4E2] p-6">
          <h3 className="font-serif italic text-lg mb-6">Device Breakdown</h3>
          <div className="space-y-6">
            <DeviceRow device="Mobile" percentage={68} />
            <DeviceRow device="Desktop" percentage={28} />
            <DeviceRow device="Tablet" percentage={4} />
          </div>
        </div>
        
        <div className="bg-white border border-[#E5E4E2] p-6">
          <h3 className="font-serif italic text-lg mb-6">Top Locations</h3>
          <div className="space-y-4">
            <LocationRow city="Mumbai, IN" users="4.2k" />
            <LocationRow city="Delhi, IN" users="3.1k" />
            <LocationRow city="Dubai, UAE" users="2.8k" />
            <LocationRow city="London, UK" users="1.4k" />
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, change, icon: Icon }: any) {
  const isPositive = change.startsWith('+');
  
  return (
    <div className="bg-white border border-[#E5E4E2] p-6 flex flex-col justify-between relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{title}</h4>
        <Icon className="w-4 h-4 text-[#C5A059]" />
      </div>
      <div className="relative z-10">
        <p className="font-serif italic text-3xl text-[#1A1A1A] mb-2">{value}</p>
        <span className={cn("text-[10px] font-bold tracking-wider px-2 py-1", isPositive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600")}>
          {change} vs last period
        </span>
      </div>
      <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
        <Icon className="w-32 h-32 text-[#1A1A1A]" />
      </div>
    </div>
  );
}

function DeviceRow({ device, percentage }: any) {
  return (
    <div>
      <div className="flex justify-between text-xs font-bold text-[#1A1A1A] mb-2">
        <span>{device}</span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full bg-[#F9F8F6] h-2">
        <div className="bg-[#1A1A1A] h-full" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function LocationRow({ city, users }: any) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#F9F8F6] last:border-0">
      <span className="text-xs font-bold text-[#1A1A1A]">{city}</span>
      <span className="text-[10px] font-bold text-gray-400">{users} users</span>
    </div>
  );
}
