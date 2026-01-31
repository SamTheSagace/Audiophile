import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistCategorizerService } from './playlist-categorizer.service';
import { NormalizedTrack, NormalizedPlaylist } from '../music-providers/interfaces/music-provider.interface';
import { ProviderEnum } from '../music-providers/interfaces/provider.enum';

// JEUX DE DONNÉES DE TEST
const mockTrackRock: NormalizedTrack = {
  id: '1', title: 'In the End', artist: 'Linkin Park', album: 'Hybrid Theory', duration: 216,
  genre: 'alt metal', // Cas Nominal
};

const mockTrackUnknown: NormalizedTrack = {
  id: '2', title: 'Glitch Sound', artist: 'Unknown', album: 'Unknown', duration: 120,
  genre: 'glitch hop', // Cas "Pas de match"
};

const mockTrackNoGenre: NormalizedTrack = {
  id: '3', title: 'Mystery', artist: 'Mystery', album: 'Mystery', duration: 180,
  genre: undefined, // Cas Limite
};

const mockPlaylist: NormalizedPlaylist = {
  id: 'playlist-1', name: 'My Mix', provider: ProviderEnum.SPOTIFY,
  tracks: [mockTrackRock, mockTrackUnknown, mockTrackNoGenre],
};

describe('PlaylistCategorizerService', () => {
  let service: PlaylistCategorizerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlaylistCategorizerService],
    }).compile();

    service = module.get<PlaylistCategorizerService>(PlaylistCategorizerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('classifyByGenreFamilies', () => {
    it('should categorize a known genre into the correct family (Rock & Metal)', () => {
      const input = { ...mockPlaylist, tracks: [mockTrackRock] };
      const result = service.classifyByGenreFamilies(input);
      
      expect(result['Rock & Metal']).toBeDefined();
      expect(result['Rock & Metal'][0].title).toEqual('In the End');
    });

    it('should categorize tracks with undefined genre into "Autres"', () => {
      const input = { ...mockPlaylist, tracks: [mockTrackNoGenre] };
      const result = service.classifyByGenreFamilies(input);
      
      expect(result['Autres']).toBeDefined();
    });

    it('should categorize unmapped exotic genres into "Autres"', () => {
      const input = { ...mockPlaylist, tracks: [mockTrackUnknown] };
      const result = service.classifyByGenreFamilies(input);
      
      expect(result['Autres']).toBeDefined();
      expect(result['Autres'][0].genre).toEqual('glitch hop');
    });
  });
});