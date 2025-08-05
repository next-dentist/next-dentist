'use client';

import { Award, GraduationCap, Heart, MapPin, Star, Users } from 'lucide-react';

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'overview', label: 'Overview', icon: Users },
  { id: 'treatments', label: 'Treatments', icon: Heart },
  { id: 'gallery', label: 'Gallery', icon: Award },
  { id: 'experience', label: 'Experience', icon: GraduationCap },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'contact', label: 'Contact', icon: MapPin },
];

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="sticky top-0 z-40 border-b border-[#92b5b9]/20 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-8 overflow-x-auto py-4">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex items-center space-x-2 rounded-full px-6 py-3 font-medium whitespace-nowrap transition-all duration-300 ${
                activeTab === id
                  ? 'bg-[#356574] text-white shadow-lg'
                  : 'text-[#356574] hover:bg-[#92b5b9]/20'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};
