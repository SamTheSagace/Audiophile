import type { Column } from "../../ui/datatable";
import PlaylistTable from "./PlaylistTable";

type Song = {
  title: string
  artist: string
}

const playlist: Song[] = [
  { title: "Nights", artist: "Frank Ocean" },
  { title: "Motion Picture Soundtrack", artist: "Radiohead" },
  { title: "On Melancholy Hill", artist: "Gorillaz" },
  { title: "Myth", artist: "Beach House" },
]

const playlists =[playlist ,playlist, playlist, playlist]

const columns: Column<Song>[] = [
  {
    header: "Title",
    accessor: "title",
    cell: (value) => <span className="font-medium">{value}</span>,
  },
  {
    header: "Artist",
    accessor: "artist",
    cell: (value) => <span className="text-muted-foreground">{value}</span>,
  },
]


export default function PlaylistGroup() {
    return(
        <div className="flex gap-[1rem] flex-wrap">
          {playlists.map((e,i)=>(<PlaylistTable columns={columns} data={e} key={i}/>))} 
        </div>
    )
}