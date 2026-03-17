import { 
  LayoutDashboard, 
  User, 
  Shield, 
  FileText, 
  AlertTriangle, 
  Activity, 
  Settings 
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: User, label: 'Worker Profile', active: false },
  { icon: Shield, label: 'Policies', active: false },
  { icon: FileText, label: 'Claims', active: false },
  { icon: AlertTriangle, label: 'Fraud Detection AI', active: false },
  { icon: Activity, label: 'Risk Score', active: false },
  { icon: Settings, label: 'Settings', active: false },
];

export function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-900">SwiftSure</span>
        </div>
        <p className="text-xs text-gray-500 mt-1 ml-10">AI Insurance</p>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              item.active
                ? 'bg-[#2563EB] text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
