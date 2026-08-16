import React from 'react';
import { Clock, History, FileText, User, Share2, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const MOCK_HISTORY = [
  { id: 1, type: 'create', description: 'Generated new flipbook "Autumn / Winter 2026"', user: 'Admin', time: new Date(Date.now() - 1000 * 60 * 30), icon: FileText },
  { id: 2, type: 'lead', description: 'New lead received for "Premium Kurta Set"', user: 'System', time: new Date(Date.now() - 1000 * 60 * 60 * 2), icon: User },
  { id: 3, type: 'share', description: 'Shared "Glitorium Summer Collection" on WhatsApp', user: 'Admin', time: new Date(Date.now() - 1000 * 60 * 60 * 24), icon: Share2 },
  { id: 4, type: 'view', description: 'Crossed 10,000 views on "Krish Ethnic Wear"', user: 'System', time: new Date(Date.now() - 1000 * 60 * 60 * 48), icon: Eye },
  { id: 5, type: 'update', description: 'Updated hotspots on page 12 of "Royal Furniture 2026"', user: 'Admin', time: new Date(Date.now() - 1000 * 60 * 60 * 72), icon: FileText },
];

export default function HistoryLogs() {
  return (
    <div className="space-y-8 text-[#1A1A1A]">
      <div className="border-b border-[#E5E4E2] pb-6">
        <h1 className="font-serif italic text-2xl">Activity History</h1>
        <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-2">Log of all catalog generation and sharing events</p>
      </div>

      <div className="bg-white border border-[#E5E4E2] p-8">
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#E5E4E2] before:to-transparent">
          {MOCK_HISTORY.map((item, index) => (
            <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-[#F9F8F6] text-[#C5A059] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <item.icon className="w-4 h-4" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-[#E5E4E2] shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-[#1A1A1A]">{item.user}</span>
                  <time className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(item.time, { addSuffix: true })}
                  </time>
                </div>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
