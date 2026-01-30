import React, { useEffect, useState, useRef } from 'react';
import { ClockSettings } from '../types';

interface ClockProps {
  timezone: string;
  settings: ClockSettings;
  themeColor: string;
}

export const Clock: React.FC<ClockProps> = ({ timezone, settings, themeColor }) => {
  const [timeStr, setTimeStr] = useState({ 
    time: '00:00:00', 
    ms: '000', 
    ampm: '', 
    date: '' 
  });
  
  const frameId = useRef<number>(0);

  useEffect(() => {
    const updateTime = (_time: number) => {
      const now = new Date(Date.now());
      
      // Formatting
      // We use Intl.DateTimeFormat for robust timezone handling
      const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        hour12: !settings.is24Hour,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };

      // Get HH:MM:SS part
      const mainTimeParts = new Intl.DateTimeFormat('en-US', options).formatToParts(now);
      const h = mainTimeParts.find(p => p.type === 'hour')?.value || '00';
      const m = mainTimeParts.find(p => p.type === 'minute')?.value || '00';
      const s = mainTimeParts.find(p => p.type === 'second')?.value || '00';
      const ampm = mainTimeParts.find(p => p.type === 'dayPeriod')?.value || '';

      // Get Date part
      const dateStr = settings.showDate ? new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      }).format(now) : '';

      // Milliseconds (Calculated raw for smoothness)
      const ms = String(now.getMilliseconds()).padStart(3, '0');

      setTimeStr({
        time: `${h}:${m}:${s}`,
        ms: ms,
        ampm: ampm,
        date: dateStr
      });

      frameId.current = window.requestAnimationFrame(updateTime);
    };

    frameId.current = window.requestAnimationFrame(updateTime);

    return () => {
      if (frameId.current) cancelAnimationFrame(frameId.current);
    };
  }, [timezone, settings]);

  return (
    <div className={`flex flex-col items-center select-none ${themeColor} transition-colors duration-700`}>
      {/* Date */}
      {settings.showDate && (
        <div className="text-sm md:text-xl font-light tracking-widest uppercase mb-2 opacity-80 animate-fade-in">
          {timeStr.date}
        </div>
      )}

      {/* Main Clock */}
      <div className="flex items-baseline font-mono-digits font-bold leading-none">
        <span className="text-6xl md:text-9xl tracking-tighter drop-shadow-2xl">
          {timeStr.time}
        </span>
        
        {/* Milliseconds & AM/PM */}
        <div className="flex flex-col ml-2 md:ml-4">
          {!settings.is24Hour && (
            <span className="text-xl md:text-3xl font-light opacity-80">{timeStr.ampm}</span>
          )}
          {settings.showMilliseconds && (
            <span className="text-2xl md:text-4xl w-[3ch] text-right opacity-60 mt-1">
              .{timeStr.ms}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};