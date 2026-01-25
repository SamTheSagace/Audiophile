import { type NormalizedPlaylist, ProviderEnum } from "@/types/playlist.types";

export const MOCK_PLAYLISTS_LIST: NormalizedPlaylist[] = [
  {
    id: "pl-1",
    name: "Summer Vibes 2024 ☀️",
    provider: ProviderEnum.SPOTIFY,
    tracks: Array(42).fill({}),
  },
  {
    id: "pl-2",
    name: "Coding Focus 🧠",
    provider: ProviderEnum.DEEZER,
    tracks: Array(128).fill({}), 
  },
  {
    id: "pl-3",
    name: "Rock Classics 🎸",
    provider: ProviderEnum.SPOTIFY,
    tracks: Array(15).fill({}), 
  },
  {
    id: "pl-4",
    name: "Sleepy Jazz 🎷",
    provider: ProviderEnum.DEEZER,
    tracks: Array(60).fill({}), 
  },
];
