import fs from 'fs';
let content = fs.readFileSync('src/pages/admin/DashboardOverview.tsx', 'utf8');

const target = `export default function DashboardOverview() {`;
const replacement = `function ProductRow({ name, code, leads, time, isNew }: { name: string, code: string, leads: number, time: string, isNew: boolean }) {
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

export default function DashboardOverview() {`;

content = content.replace(target, replacement);
fs.writeFileSync('src/pages/admin/DashboardOverview.tsx', content);
console.log("Patched DashboardOverview");
