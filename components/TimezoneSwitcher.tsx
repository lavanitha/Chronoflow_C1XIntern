import React from 'react';
import { LOCATIONS, DEFAULT_LOCATION } from '../constants';
import { LocationConfig, ClockSettings } from '../types';
import { MapPin, Settings2, Globe, Clock as ClockIcon, Calendar } from 'lucide-react';

interface TimezoneSwitcherProps {
  currentLocation: LocationConfig;
  onLocationChange: (loc: LocationConfig) => void;
  settings: ClockSettings;
  onSettingsChange: (settings: ClockSettings) => void;
}

export const TimezoneSwitcher: React.FC<TimezoneSwitcherProps> = ({ 
  currentLocation, 
  onLocationChange,
  settings,
  onSettingsChange
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  // Toggle helpers
  const toggleMs = () => onSettingsChange({ ...settings, showMilliseconds: !settings.showMilliseconds });
  const toggle24 = () => onSettingsChange({ ...settings, is24Hour: !settings.is24Hour });
  const toggleDate = () => onSettingsChange({ ...settings, showDate: !settings.showDate });

  return (
    <div className="flex flex-col items-center gap-6 z-10">
      
      {/* Location Selector */}
      <div className="relative group">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full transition-all duration-300 text-white group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        >
          <MapPin size={20} className="text-white/80" />
          <div className="text-left">
            <div className="text-sm font-semibold tracking-wide uppercase">{currentLocation.label}</div>
            <div className="text-xs text-white/60">{currentLocation.subLabel}</div>
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-64 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
            {LOCATIONS.map((loc) => (
              <button
                key={loc.id}
                onClick={() => {
                  onLocationChange(loc);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-5 py-3 flex items-center justify-between hover:bg-white/10 transition-colors ${
                  currentLocation.id === loc.id ? 'bg-white/20 text-white' : 'text-white/70'
                }`}
              >
                <span>{loc.label}</span>
                {currentLocation.id === loc.id && <div className="w-2 h-2 rounded-full bg-green-400 box-shadow-glow" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Settings Toolbar */}
      <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md border border-white/5 rounded-full p-2">
        <ToolButton 
          active={settings.showMilliseconds} 
          onClick={toggleMs} 
          icon={<ClockIcon size={16} />} 
          label="MS"
        />
        <div className="w-px h-4 bg-white/20 mx-1" />
        <ToolButton 
          active={settings.is24Hour} 
          onClick={toggle24} 
          icon={<Globe size={16} />} 
          label="24H"
        />
        <div className="w-px h-4 bg-white/20 mx-1" />
        <ToolButton 
          active={settings.showDate} 
          onClick={toggleDate} 
          icon={<Calendar size={16} />} 
          label="Date"
        />
      </div>
    </div>
  );
};

// Helper Subcomponent
const ToolButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300
      ${active 
        ? 'bg-white/20 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]' 
        : 'hover:bg-white/10 text-white/50 hover:text-white/80'}
    `}
  >
    {icon}
    <span>{label}</span>
  </button>
);