import { ProviderIcon, TEXT_MAP } from '@/lib/utils';
import type { PlaylistSong } from '../Block/playlists/PlaylistGroup';
import PlaylistTable from '../Block/playlists/PlaylistTable';

type PlaylistPageProps = {
  id: string;
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

export default function PlaylistPage({ id }: PlaylistPageProps) {
  return (
    <main className="p-4 flex flex-col gap-8">
      <div className="flex items-end">
        <h1 className="scroll-m-20 text-6xl font-extrabold tracking-tight text-balance">{playlist.title}</h1>
      </div>

      <div className="flex gap-8">
        <div className="size-[35vw] rounded-md overflow-hidden">
          <img className="object-cover h-[35vw]" src={playlist.icone} alt="" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-end gap-2">
            <p>from :</p>
            <ProviderIcon className={TEXT_MAP[playlist.provider]} provider={playlist.provider} />{' '}
            <p className={TEXT_MAP[playlist.provider]}>{playlist.provider}</p>
          </div>

          <PlaylistTable data={playlist.song} provider={playlist.provider} />
        </div>
      </div>
    </main>
  );
}
