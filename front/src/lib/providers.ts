import { ProviderEnum, type ProviderType } from "@/types/playlist.types";
import type { IconType } from "react-icons";
import { FaDeezer, FaSpotify, FaYoutube } from "react-icons/fa";
import { SiApplemusic } from "react-icons/si";

interface ProviderConfig {
  label: string;
  color: string;   // Pour le Texte, les Bordures, les Icônes (Doit être solide)
  bgStyle: string; // Pour les Boutons et les Fonds (Peut être un gradient)
  icon: IconType;
}

export const PROVIDERS_CONFIG: Record<string, ProviderConfig> = {
  [ProviderEnum.SPOTIFY]: { 
    label: 'Spotify', 
    color: '#1DB954',
    bgStyle: '#1DB954',
    icon: FaSpotify
  },
  [ProviderEnum.DEEZER]: { 
    label: 'Deezer', 
    color: '#A238FF',
    bgStyle: 'linear-gradient(45deg, #A238FF 0%, #5E17EB 100%)',
    icon: FaDeezer
  },
  [ProviderEnum.APPLE]: { 
    label: 'Apple Music', 
    color: '#FA243C',
    bgStyle: 'linear-gradient(135deg, #FA243C 0%, #8229F8 100%)',
    icon: SiApplemusic
  },
  [ProviderEnum.YOUTUBE]: { 
    label: 'YouTube Music', 
    color: '#FF0000',
    bgStyle: '#FF0000',
    icon: FaYoutube
  },
};

export const getProviderConfig = (provider: ProviderType | string): ProviderConfig => {
  return PROVIDERS_CONFIG[provider] || { label: 'Service', color: '#cccccc', bgStyle: '#cccccc', icon: FaSpotify };
};