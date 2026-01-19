import type { Provider } from '@/lib/utils';
import PlaylistTable, { type Song } from './PlaylistTable';

type PlaylistGroupProp = {
  title: string;
};

export type PlaylistSong = {
  song: Song[];
  icone: string;
  title: string;
  provider: Provider;
};

const playlist: PlaylistSong = {
  title: 'hello',
  provider: 'spotify',
  icone: 'https://img.freepik.com/free-photo/little-cat-sitting-grass_1150-17019.jpg?semt=ais_hybrid&w=740&q=80',
  song: [
    { title: 'Nights', artist: 'Frank Ocean' },
    { title: 'Motion Picture Soundtrack', artist: 'Radiohead' },
    { title: 'On Melancholy Hill', artist: 'Gorillaz' },
    { title: 'Myth', artist: 'Beach House' },
  ],
};

const playlists = [
  playlist,
  playlist,
  playlist,
  playlist,
  playlist,
  playlist,
  playlist,
  playlist,
  playlist,
  playlist,
  playlist,
  playlist,
  playlist,
  playlist,
  playlist,
  playlist,
];

export default function PlaylistGroup({ title }: PlaylistGroupProp) {
  return (
    <div className="flex gap-[2rem] flex-col">
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">{title}</h1>

      <div className="flex gap-[1rem] flex-wrap justify-between">
        {playlists.map((e, i) => (
          <PlaylistTable color={'red-900'} data={e.song} key={i} />
        ))}
      </div>
    </div>
  );
}
