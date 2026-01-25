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