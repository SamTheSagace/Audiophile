import { Injectable } from '@nestjs/common';
import { NormalizedPlaylist } from '../music-providers/interfaces/music-provider.interface';
import { CategorizedPlaylist, TrackItem } from './interfaces/categorized-playlist.interface';

@Injectable()
export class PlaylistCategorizerService {
  
  private readonly GENRE_FAMILIES_MAPPING: Record<string, string[]> = {
    'Rock & Metal': ['rock', 'metal', 'punk', 'grunge', 'indie', 'alternative'],
    'Hip-Hop & Rap': ['rap', 'hip hop', 'trap', 'drill', 'urban'],
    'Electro & Dance': ['electro', 'house', 'techno', 'dance', 'edm', 'dubstep', 'drum and bass'],
    'Pop & Variété': ['pop', 'disco', 'singer-songwriter'],
    'Classique & Jazz': ['classic', 'jazz', 'blues', 'piano', 'orchestra'],
  };

  classifyByGenreFamilies(playlist: NormalizedPlaylist): CategorizedPlaylist {
    const results: CategorizedPlaylist = {};

    playlist.tracks.forEach((track) => {
      // 1. On sécurise le genre (si undefined -> chaine vide)
      const safeGenre = track.genre || '';
      
      const family = this.getFamilyForGenre(safeGenre);

      if (!results[family]) {
        results[family] = [];
      }

      // 2. On crée l'objet propre
      const trackItem: TrackItem = {
        id: track.id,
        title: track.title, 
        artist: track.artist,
        album: track.album,
        duration: track.duration,
        genre: track.genre || 'Unknown', 
      };

      results[family].push(trackItem);
    });

    return results;
  }

  private getFamilyForGenre(genre: string): string {
    const lowerGenre = genre.toLowerCase();

    for (const [family, keywords] of Object.entries(this.GENRE_FAMILIES_MAPPING)) {
      if (keywords.some((keyword) => lowerGenre.includes(keyword))) {
        return family;
      }
    }

    return 'Autres';
  }
}