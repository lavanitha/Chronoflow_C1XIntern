import { LocationConfig, ThemeId } from './types';

export const LOCATIONS: LocationConfig[] = [
  {
    id: 'india',
    label: 'New Delhi',
    subLabel: 'India (IST)',
    timezone: 'Asia/Kolkata',
    themeId: ThemeId.INDIA,
    coordinates: { lat: 28.6139, lng: 77.2090 }
  },
  {
    id: 'nyc',
    label: 'New York',
    subLabel: 'USA (EST)',
    timezone: 'America/New_York',
    themeId: ThemeId.NEW_YORK,
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  {
    id: 'london',
    label: 'London',
    subLabel: 'UK (GMT)',
    timezone: 'Europe/London',
    themeId: ThemeId.LONDON,
    coordinates: { lat: 51.5074, lng: -0.1278 }
  },
  {
    id: 'dubai',
    label: 'Dubai',
    subLabel: 'UAE (GST)',
    timezone: 'Asia/Dubai',
    themeId: ThemeId.DUBAI,
    coordinates: { lat: 25.2048, lng: 55.2708 }
  },
  {
    id: 'tokyo',
    label: 'Tokyo',
    subLabel: 'Japan (JST)',
    timezone: 'Asia/Tokyo',
    themeId: ThemeId.TOKYO,
    coordinates: { lat: 35.6762, lng: 139.6503 }
  }
];

export const DEFAULT_LOCATION = LOCATIONS[0];

export const THEME_COLORS: Record<ThemeId, string> = {
  [ThemeId.INDIA]: 'text-orange-100',
  [ThemeId.NEW_YORK]: 'text-blue-100',
  [ThemeId.LONDON]: 'text-slate-200',
  [ThemeId.DUBAI]: 'text-amber-100',
  [ThemeId.TOKYO]: 'text-fuchsia-100'
};