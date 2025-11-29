import { Home, BookOpen, BarChart3, Settings } from 'lucide-react';
import { setTab } from '../slices/navBarSlice';
import { useDispatch, useSelector } from 'react-redux';

const BottomNavBar = () => {

  const dispatch = useDispatch();
  const activeTab = useSelector(state => state.navBar.activeTab)

  const navItems = [
    { id: 'home', icon: Home, label: 'Accueil' },
    { id: 'lists', icon: BookOpen, label: 'Listes' },
    { id: 'stats', icon: BarChart3, label: 'Stats' },
    { id: 'settings', icon: Settings, label: 'Réglages' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => dispatch(setTab(item.id))}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all active:scale-95 ${
                isActive 
                  ? 'text-purple-600' 
                  : 'text-gray-400'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavBar;