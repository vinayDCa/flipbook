import { Users, Filter, Star, Phone, Mail, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function LeadQualification() {
  const leads = [
    { name: "Sarah Jenkins", company: "Boutique Elegance", score: 95, status: "Hot Lead", intent: "High intent. Viewed pages 4, 5, and 12 multiple times. Clicked WhatsApp enquiry for Product #890." },
    { name: "Michael Chen", company: "Chen Retailers", score: 82, status: "Warm", intent: "Moderate intent. Spent 4 minutes on the Summer Collection catalogue." },
    { name: "Emma Thompson", company: "Independent", score: 45, status: "Cold", intent: "Low intent. Bounced after page 2." }
  ];

  return (
    <div className="space-y-6 text-[#1A1A1A]">
      <div>
        <h1 className="font-serif italic text-2xl flex items-center gap-2"><Users className="w-6 h-6 text-[#C5A059]"/> AI Lead Qualification</h1>
        <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-2">Automatically score and rank incoming leads based on catalogue engagement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#E5E4E2] p-6">
          <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Total Leads (30d)</h4>
          <p className="text-3xl font-serif">142</p>
          <p className="text-xs text-green-600 mt-2">+12% from last month</p>
        </div>
        <div className="bg-white border border-[#E5E4E2] p-6">
          <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">AI Qualified 'Hot'</h4>
          <p className="text-3xl font-serif">28</p>
          <p className="text-xs text-gray-500 mt-2">Ready for outreach</p>
        </div>
        <div className="bg-white border border-[#E5E4E2] p-6">
          <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Conversion Prediction</h4>
          <p className="text-3xl font-serif">64%</p>
          <p className="text-xs text-gray-500 mt-2">Based on current engagement</p>
        </div>
      </div>

      <div className="bg-white border border-[#E5E4E2] overflow-hidden">
        <div className="p-4 border-b border-[#E5E4E2] flex items-center justify-between">
          <h3 className="font-bold">Prioritized Lead Queue</h3>
          <button className="flex items-center gap-2 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 hover:bg-gray-50">
            <Filter className="w-3 h-3" /> Filter
          </button>
        </div>
        <div className="divide-y divide-[#E5E4E2]">
          {leads.map((lead, i) => (
            <div key={i} className="p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-bold text-lg">{lead.name}</h4>
                  <span className={`text-[10px] uppercase tracking-widest px-2 py-1 font-bold \${lead.score > 90 ? 'bg-red-50 text-red-600' : lead.score > 70 ? 'bg-orange-50 text-orange-600' : 'bg-gray-100 text-gray-600'}`}>
                    {lead.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-3">{lead.company}</p>
                <div className="bg-[#F9F8F6] p-3 border border-[#E5E4E2] text-sm text-gray-700 flex gap-3">
                  <BrainCircuit className="w-5 h-5 text-[#C5A059] flex-shrink-0" />
                  <p><strong>AI Insight:</strong> {lead.intent}</p>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-4 min-w-[150px]">
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">AI Score</p>
                  <p className={`text-2xl font-serif \${lead.score > 90 ? 'text-red-600' : ''}`}>{lead.score}/100</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 border border-gray-200 text-gray-600 hover:text-[#C5A059] hover:border-[#C5A059] transition-colors rounded-full" title="Call">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="p-2 border border-gray-200 text-gray-600 hover:text-[#C5A059] hover:border-[#C5A059] transition-colors rounded-full" title="Email">
                    <Mail className="w-4 h-4" />
                  </button>
                  <button className="flex items-center gap-1 px-4 py-2 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-widest font-bold hover:bg-[#C5A059] transition-colors rounded-full">
                    View CRM <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
import { BrainCircuit } from 'lucide-react';
