export enum ThemeId {
  INDIA = 'INDIA',
  NEW_YORK = 'NEW_YORK',
  LONDON = 'LONDON',
  DUBAI = 'DUBAI',
  TOKYO = 'TOKYO'
}

export interface LocationConfig {
  id: string;
  label: string;
  subLabel: string;
  timezone: string;
  themeId: ThemeId;
  coordinates: { lat: number; lng: number }; // For potential future expansion
}

export interface ClockSettings {
  showMilliseconds: boolean;
  is24Hour: boolean;
  showDate: boolean;
}

export interface PointerState {
  x: number;
  y: number;
  active: boolean; // Mouse down or touching
  moving: boolean;
}