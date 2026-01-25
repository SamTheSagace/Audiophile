import { type CategorizedPlaylist, type NormalizedPlaylist, ProviderEnum } from "@/types/playlist.types";

export const MOCK_PLAYLIST: NormalizedPlaylist = {
  id: "playlist-123",
  name: "Late Night Drive 🌙",
  provider: ProviderEnum.SPOTIFY,
  tracks: [
    { id: "1", title: "Nights", artist: "Frank Ocean", album: "Blonde", duration: 307, genre: "R&B" },
    { id: "2", title: "Midnight City", artist: "M83", album: "Hurry Up, We're Dreaming", duration: 243, genre: "Electronic" },
    { id: "3", title: "Instant Crush", artist: "Daft Punk", album: "Random Access Memories", duration: 337, genre: "Pop" },
    { id: "4", title: "The Less I Know The Better", artist: "Tame Impala", album: "Currents", duration: 216, genre: "Alternative" },
    { id: "5", title: "Space Song", artist: "Beach House", album: "Depression Cherry", duration: 320, genre: "Dream Pop" },
  ]
};

export const mockCategorizePlaylist = async (playlistId: string): Promise<CategorizedPlaylist> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        "Rock & Metal": [
           { id: "1", title: "Nights", artist: "Frank Ocean", album: "Blonde", duration: 300, genre: "Rock" },
           { id: "2", title: "The Less I Know The Better", artist: "Tame Impala", album: "Currents", duration: 216, genre: "Rock" },
           { id: "3", title: "Seven Nation Army", artist: "The White Stripes", album: "Elephant", duration: 240, genre: "Rock" },
        ],
        "Electro & Synth": [
           { id: "4", title: "Midnight City", artist: "M83", album: "Hurry Up", duration: 243, genre: "Electro" },
           { id: "5", title: "Instant Crush", artist: "Daft Punk", album: "RAM", duration: 337, genre: "Electro" },
        ],
        "Chill & Jazz": [
           { id: "6", title: "Space Song", artist: "Beach House", album: "Depression", duration: 320, genre: "Dream Pop" },
        ]
      });
    }, 2000); // 2 secondes de "réflexion"
  });
};