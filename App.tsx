import React, { useState } from 'react';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { Clock } from './components/Clock';
import { TimezoneSwitcher } from './components/TimezoneSwitcher';
import { LOCATIONS, DEFAULT_LOCATION, THEME_COLORS } from './constants';
import { LocationConfig, ClockSettings } from './types';

const App: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<LocationConfig>(DEFAULT_LOCATION);
  const [settings, setSettings] = useState<ClockSettings>({
    showMilliseconds: true,
    is24Hour: false,
    showDate: true,
  });

  return (
    <div className="relative w-screen h-screen overflow-hidden text-white flex flex-col justify-center items-center">
      
      {/* Dynamic Animated Background */}
      <BackgroundCanvas themeId={currentLocation.themeId} />

      {/* Main Content Layout */}
      <main className="relative z-10 flex flex-col items-center gap-12 w-full max-w-4xl px-4 animate-in fade-in zoom-in duration-700">
        
        {/* Header / Brand (Optional) */}
        <header className="absolute top-8 left-0 w-full flex justify-center opacity-30 hover:opacity-100 transition-opacity">
          <h1 className="text-xs tracking-[0.5em] uppercase font-bold">ChronoFlow</h1>
        </header>

        {/* Digital Clock Display */}
        <Clock 
          timezone={currentLocation.timezone} 
          settings={settings}
          themeColor={THEME_COLORS[currentLocation.themeId]}
        />

        {/* Interactive Controls */}
        <TimezoneSwitcher 
          currentLocation={currentLocation} 
          onLocationChange={setCurrentLocation}
          settings={settings}
          onSettingsChange={setSettings}
        />

      </main>

      {/* Overlay vignette for focus */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] z-0" />
      
    </div>
  );
};

export default App;