export const ProviderEnum = {
  SPOTIFY: 'spotify',
  DEEZER: 'deezer',
  APPLE: 'apple',
  YOUTUBE: 'youtube_music',
} as const;

export type ProviderType = (typeof ProviderEnum)[keyof typeof ProviderEnum];

export interface NormalizedTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  genre?: string;
}

export interface NormalizedPlaylist {
  id: string;
  name: string;
  provider: ProviderType;
  tracks: NormalizedTrack[];
}


export interface TrackItem {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  genre: string;
}

export interface CategorizedPlaylist {
  [categoryName: string]: TrackItem[];
}