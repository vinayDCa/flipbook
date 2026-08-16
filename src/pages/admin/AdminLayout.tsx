import { Outlet, Link, useLocation } from 'react-router-dom';
import { BookOpen, BarChart3, Users, Settings, LogOut, LayoutDashboard, Database } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function AdminLayout() {
  const location = useLocation();

  const navItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Flipbooks', path: '/admin/flipbooks', icon: BookOpen },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Leads', path: '/admin/leads', icon: Users },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#1A1A1A] flex font-sans">
      {/* Sidebar */}
      <aside className="w-20 bg-[#1A1A1A] flex-shrink-0 flex flex-col items-center py-8 hidden md:flex space-y-10">
        <div className="w-10 h-10 bg-[#C5A059] rounded-full flex items-center justify-center text-white font-serif italic text-xl">
          V
        </div>

        <nav className="flex-1 flex flex-col space-y-8 text-gray-400 w-full items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                title={item.name}
                className={cn(
                  "w-6 h-6 flex items-center justify-center border rounded cursor-pointer transition-colors",
                  isActive 
                    ? "border-[#C5A059] bg-[#C5A059] text-white" 
                    : "border-gray-600 hover:border-[#C5A059] hover:text-[#C5A059]"
                )}
              >
                <item.icon className="w-4 h-4" />
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col items-center gap-6">
          <button title="Sign Out" className="w-6 h-6 flex items-center justify-center border border-gray-600 rounded text-gray-400 hover:border-[#C5A059] hover:text-[#C5A059] transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
          <div className="text-gray-500 text-[10px] uppercase tracking-widest mt-4" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
            V-FLIP V2.0
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white border-b border-[#E5E4E2] px-10 flex items-center justify-between flex-shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-semibold">Project Active</span>
            <h1 className="font-serif italic text-2xl">
              {navItems.find(i => location.pathname === i.path || (i.path !== '/admin' && location.pathname.startsWith(i.path)))?.name || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center space-x-6">
             <div className="text-right mr-4 hidden sm:block">
               <p className="text-[10px] uppercase tracking-widest text-gray-400">Catalogue Status</p>
               <p className="text-xs font-bold text-green-600">● LIVE & SYNCED</p>
             </div>
             <Link to="/admin/create" className="bg-[#1A1A1A] text-white px-6 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-[#C5A059] transition-colors">
               Create New Flipbook
             </Link>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
