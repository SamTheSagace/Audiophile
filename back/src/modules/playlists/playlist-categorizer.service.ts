// src/modules/playlists/playlist-analyzer.service.ts
import { Injectable } from '@nestjs/common';
import { NormalizedPlaylist, NormalizedTrack } from '../music-providers/interfaces/music-provider.interface';

export interface CategorizedPlaylist {
  originalName: string;
  stats: Record<string, number>;
  categories: Record<string, NormalizedTrack[]>;
}

@Injectable()
export class PlaylistCategorizerService {
  private readonly GENRE_FAMILIES_MAPPING: Record<string, string[]> = {
    'Rock & Metal': ['rock', 'metal', 'punk', 'grunge', 'indie', 'alternative'],
    'Hip-Hop & Rap': ['rap', 'hip hop', 'trap', 'drill', 'urban'],
    'Electro & Dance': ['electro', 'house', 'techno', 'dance', 'edm', 'dubstep', 'drum and bass'],
    'Pop & Variété': ['pop', 'disco', 'singer-songwriter'],
    'Classique & Jazz': ['classic', 'jazz', 'blues', 'piano', 'orchestra'],
  };

   //Analyse une playlist normalisée et renvoie une version triée et catégorisée.
  public classifyByGenreFamilies(playlist: NormalizedPlaylist): CategorizedPlaylist {
    const result: CategorizedPlaylist = {
      originalName: playlist.name,
      stats: {},
      categories: { 'Autre': [] },
    };

    // Init des catégories
    Object.keys(this.GENRE_FAMILIES_MAPPING).forEach(key => result.categories[key] = []);

    // Le tri
    for (const track of playlist.tracks) {
      const family = this.detectGenreFamily(track.genre);
      result.categories[family].push(track);
    }

    // Le calcul de stats
    Object.keys(result.categories).forEach(category => {
      const count = result.categories[category].length;
      if (count > 0) {
        result.stats[category] = count;
      } else {
        delete result.categories[category];
      }
    });

    return result;
  }

  private detectGenreFamily(subGenre: string | undefined): string {
    if (!subGenre) return 'Autre';
    const lowerGenre = subGenre.toLowerCase();

    for (const [family, keywords] of Object.entries(this.GENRE_FAMILIES_MAPPING)) {
      if (keywords.some(keyword => lowerGenre.includes(keyword))) {
        return family;
      }
    }
    return 'Autre';
  }
}