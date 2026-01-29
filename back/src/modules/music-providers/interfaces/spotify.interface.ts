/**
 * Interfaces derived from the sample Spotify response for "shows" / paginated items.
 */

export interface SpotifyImage {
  url: string;
  height?: number | null;
  width?: number | null;
}

export interface SpotifyExternalUrls {
  spotify: string;
  [key: string]: string | undefined;
}

export interface SpotifyOwner {
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  type: string;
  uri: string;
  display_name?: string;
}

export interface SpotifyTracksSummary {
  href: string;
  total: number;
}

export interface SpotifyShowItem {
  collaborative?: boolean;
  description?: string;
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  owner: SpotifyOwner;
  public?: boolean | null;
  snapshot_id?: string;
  tracks: SpotifyTracksSummary;
  type: string;
  uri: string;
  [key: string]: any;
}

export interface SpotifyPlaylistSummary {
  href: string;
  limit: number;
  next?: string | null;
  offset: number;
  previous?: string | null;
  total: number;
  items: SpotifyShowItem[];
}

/**
 * Interfaces for a targeted playlist / playlist tracks response (items contain "added_at", "added_by", "track", ...)
 */

export interface SpotifyExternalIds {
  isrc?: string;
  ean?: string;
  upc?: string;
  [key: string]: string | undefined;
}

export interface SpotifyArtist {
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface SpotifyAlbum {
  album_type?: string;
  total_tracks?: number;
  available_markets?: string[];
  external_urls?: SpotifyExternalUrls;
  href?: string;
  id?: string;
  images?: SpotifyImage[];
  name?: string;
  release_date?: string;
  release_date_precision?: string;
  restrictions?: { reason?: string };
  type?: string;
  uri?: string;
  artists?: SpotifyArtist[];
}

export interface SpotifyTrack {
  album?: SpotifyAlbum;
  artists?: SpotifyArtist[];
  available_markets?: string[];
  disc_number?: number;
  duration_ms?: number;
  explicit?: boolean;
  external_ids?: SpotifyExternalIds;
  external_urls?: SpotifyExternalUrls;
  href?: string;
  id?: string;
  is_playable?: boolean;
  linked_from?: Record<string, any>;
  restrictions?: { reason?: string };
  name?: string;
  popularity?: number;
  preview_url?: string | null;
  track_number?: number;
  type?: string;
  uri?: string;
  is_local?: boolean;
}

export interface SpotifyAddedBy {
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  type: string;
  uri: string;
}

export interface SpotifyPlaylistTrackItem {
  added_at?: string | null;
  added_by?: SpotifyAddedBy | null;
  is_local?: boolean;
  track: SpotifyTrack;
}

export interface SpotifyPagedPlaylistTrack {
  href: string;
  limit: number;
  next?: string | null;
  offset: number;
  previous?: string | null;
  total: number;
  items: SpotifyPlaylistTrackItem[];
}

export interface SpotifyPlaylist {
  collaborative: boolean;
  description?: string | null;
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  owner: SpotifyOwner;
  public?: boolean | null;
  snapshot_id?: string;
  tracks: SpotifyPagedPlaylistTrack;
  type: string;
  uri: string;
  [key: string]: any;
}

/**
 * Réponse paginée utilisée pour lister les tracks d'une playlist
 */
export type SpotifyPlaylistTracksResponse = SpotifyPagedPlaylistTrack;
