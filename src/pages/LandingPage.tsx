import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Zap, Share2, BarChart3, QrCode } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          <span className="font-bold text-xl tracking-tight">Vinifinity Flipbook</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/catalogue/krish-aw26" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            View Demo
          </Link>
          <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Login
          </Link>
          <Link to="/admin/create" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
            Turn Your PDF Into an <span className="text-indigo-600">Interactive Digital Catalogue</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Create beautiful flipbooks with WhatsApp enquiries, analytics, QR codes and branded sharing. No coding required.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link to="/admin/create" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-full text-lg font-medium transition-all flex items-center gap-2 shadow-xl shadow-gray-900/20">
              Create Flipbook
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/catalogue/krish-aw26" className="bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-full text-lg font-medium transition-all">
              View Demo
            </Link>
          </div>
        </div>
        
        {/* Preview Image/Mockup */}
        <div className="mt-20 relative mx-auto max-w-5xl">
          <div className="aspect-[16/9] bg-gray-100 rounded-2xl overflow-hidden shadow-2xl border border-gray-200/50 flex items-center justify-center">
             <div className="flex gap-1 text-gray-400">
               <BookOpen className="w-16 h-16 opacity-50" />
             </div>
          </div>
          {/* Decorative blur */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-indigo-500/20 blur-[120px] -z-10 rounded-full pointer-events-none"></div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need to sell online</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Upload your PDF once, and we'll automatically generate an interactive experience optimized for desktop and mobile.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-amber-500" />}
              title="Instant Conversion"
              description="Upload your PDF and watch it transform into a realistic 3D flipbook in seconds."
            />
            <FeatureCard 
              icon={<Share2 className="w-6 h-6 text-blue-500" />}
              title="WhatsApp Integration"
              description="Add clickable product hotspots that open pre-filled WhatsApp enquiry messages."
            />
            <FeatureCard 
              icon={<BarChart3 className="w-6 h-6 text-green-500" />}
              title="Advanced Analytics"
              description="Track page views, unique visitors, time spent, and WhatsApp clicks."
            />
            <FeatureCard 
              icon={<QrCode className="w-6 h-6 text-purple-500" />}
              title="QR Code Generation"
              description="Download print-ready QR codes to bridge your offline marketing with your digital catalogue."
            />
          </div>
        </div>
      </section>
      
      {/* Simple Footer */}
      <footer className="py-12 px-6 border-t border-gray-100 text-center text-gray-500 text-sm">
        <p>© 2026 Vinifinity Flipbook. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-4 border border-gray-100">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
