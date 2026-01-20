import { clsx, type ClassValue } from 'clsx';
import React from 'react';
import type { IconType } from 'react-icons';
import { FaSpotify, FaDeezer, FaYoutube } from 'react-icons/fa';
import { SiApplemusic } from 'react-icons/si';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Provider = 'spotify' | 'youtube' | 'deezer' | 'apple';

export const BORDER_MAP: Record<Provider, string> = { spotify: 'border-chart-1', deezer: 'border-chart-2', youtube: 'border-chart-3', apple: 'border-chart-1' };

export const TEXT_MAP: Record<Provider, string> = { spotify: 'text-chart-1', deezer: 'text-chart-2', youtube: 'text-chart-3', apple: 'text-chart-1' };

export const ICON_MAP: Record<Provider, IconType> = {
  spotify: FaSpotify,
  deezer: FaDeezer,
  youtube: FaYoutube,
  apple: SiApplemusic,
};

type ProviderIconProps = {
  provider: Provider;
} & React.ComponentProps<IconType>;

export const ProviderIcon: React.FC<ProviderIconProps> = ({ provider, ...props }) => {
  const Icon = ICON_MAP[provider];
  // Use createElement to avoid JSX restrictions
  return React.createElement(Icon, props);
};
