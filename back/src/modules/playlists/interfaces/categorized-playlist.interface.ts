export interface TrackItem {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  genre: string;
}

// On garde ce nom car il a du sens pour toi !
export interface CategorizedPlaylist {
  [categoryName: string]: TrackItem[];
}