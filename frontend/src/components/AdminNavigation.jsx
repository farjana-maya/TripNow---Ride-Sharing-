import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  MapPin, 
  BarChart3, 
  Settings,
  UserCheck,
  MessageSquare,
  Gift
} from 'lucide-react';

const AdminNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'rides', label: 'Ride Management', icon: Car, path: '/admin/rides' },
    { id: 'drivers', label: 'Driver Management', icon: UserCheck, path: '/admin/drivers' },
    { id: 'riders', label: 'Rider Management', icon: Users, path: '/admin/riders' },
    { id: 'live-map', label: 'Live Tracking', icon: MapPin, path: '/admin/live-map' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-r border-gray-200 w-64 min-h-screen">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900">TripNow Admin</h2>
      </div>
      
      <div className="px-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-all ${
              isActive(item.path)
                ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default AdminNavigation;