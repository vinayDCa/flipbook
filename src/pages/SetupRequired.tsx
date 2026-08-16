import { Settings, Database } from 'lucide-react';

export default function SetupRequired() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
          <Database className="w-8 h-8" />
        </div>
        
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Supabase Setup Required</h1>
          <p className="text-gray-600">
            This application requires Supabase for the database, storage, and authentication.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-left border border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Instructions
          </h2>
          <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
            <li>Create a new project on Supabase.</li>
            <li>Run the SQL commands to create the required tables (businesses, flipbooks, pages, etc.).</li>
            <li>Get your project URL and anon key.</li>
            <li>Open the AI Studio Settings / Secrets panel or add them to the <code className="bg-gray-100 px-1 py-0.5 rounded">.env</code> file:
              <pre className="mt-2 p-2 bg-gray-900 text-gray-100 rounded text-xs overflow-x-auto">
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
              </pre>
            </li>
          </ol>
        </div>

        <button 
          onClick={() => window.location.reload()}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
        >
          I've added the keys, reload page
        </button>
      </div>
    </div>
  );
}
