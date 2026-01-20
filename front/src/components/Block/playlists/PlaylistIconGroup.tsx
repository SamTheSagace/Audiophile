import type { PlaylistSong } from './PlaylistGroup';
import PlaylistIcone from './PlaylistIcon';

type PlaylistGroupProp = {
  title: string;
};

const playlist1: PlaylistSong = {
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
const playlist2: PlaylistSong = {
  title: 'Words',
  provider: 'youtube',
  icone: 'https://img.freepik.com/free-photo/little-cat-sitting-grass_1150-17019.jpg?semt=ais_hybrid&w=740&q=80',
  song: [
    { title: 'Nights', artist: 'Frank Ocean' },
    { title: 'Motion Picture Soundtrack', artist: 'Radiohead' },
    { title: 'On Melancholy Hill', artist: 'Gorillaz' },
    { title: 'Myth', artist: 'Beach House' },
  ],
};
const playlist3: PlaylistSong = {
  title: 'Hard',
  provider: 'deezer',
  icone: 'https://img.freepik.com/free-photo/little-cat-sitting-grass_1150-17019.jpg?semt=ais_hybrid&w=740&q=80',
  song: [
    { title: 'Nights', artist: 'Frank Ocean' },
    { title: 'Motion Picture Soundtrack', artist: 'Radiohead' },
    { title: 'On Melancholy Hill', artist: 'Gorillaz' },
    { title: 'Myth', artist: 'Beach House' },
  ],
};

const playlists = [playlist1, playlist3, playlist2, playlist1, playlist3];

export default function PlaylistIconGroup({ title }: PlaylistGroupProp) {
  return (
    <div className="flex gap-[2rem] flex-col">
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">{title}</h1>

      <div className="flex gap-[1rem] flex-wrap justify-between">
        {playlists.map((e, i) => (
          <PlaylistIcone icone={e.icone} title={e.title} provider={e.provider} key={i} />
        ))}
      </div>
    </div>
  );
}
