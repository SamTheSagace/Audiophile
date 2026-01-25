import { MOCK_PLAYLISTS_LIST } from '@/data/mock-playlists';
import type { NormalizedPlaylist } from '@/types/playlist.types';
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
  return React.createElement(Icon, props);
};

export const formatDuration = (seconds: number): string => {
  if (!seconds) return "0min";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, '0')}min`;
  }
  return `${minutes}min`;
};

// Petite fonction utilitaire pour simuler un délai API (Fake API Call) A SUPPRIMER APRES TESTS
export const mockFetchPlaylists = async (provider: string): Promise<NormalizedPlaylist[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // On filtre juste pour faire semblant que le back travaille
      const filtered = MOCK_PLAYLISTS_LIST.filter(p => p.provider === provider);
      resolve(filtered);
    }, 1500); // 1.5 secondes de délai pour voir le Skeleton
  });
};