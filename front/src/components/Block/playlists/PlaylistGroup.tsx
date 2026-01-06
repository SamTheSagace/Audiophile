import type { Column } from "../../ui/datatable";
import PlaylistTable, { type Song } from "./PlaylistTable";

type PlaylistGroupProp = {
  title: string
}


const playlist: Song[] = [
  { title: "Nights", artist: "Frank Ocean" },
  { title: "Motion Picture Soundtrack", artist: "Radiohead" },
  { title: "On Melancholy Hill", artist: "Gorillaz" },
  { title: "Myth", artist: "Beach House" },
]

const playlists =[playlist ,playlist, playlist, playlist,playlist, playlist, playlist,playlist, playlist, playlist,playlist, playlist, playlist,playlist, playlist, playlist]

const columns: Column<Song>[] = [
  {
    header: "Title",
    accessor: "title",
    cell: (value) => <span className="font-medium">{value}</span>,
  },
  {
    header: "Artist",
    accessor: "artist",
    cell: (value) => <span className="font-medium">{value}</span>,
  },
]


export default function PlaylistGroup({title}:PlaylistGroupProp) {
    return(
        <div className="flex gap-[2rem] flex-col"> 
          <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
     {title}
    </h1>
                    
          <div className="flex gap-[1rem] flex-wrap justify-center">
            {playlists.map((e,i)=>(<PlaylistTable color={"red-900"} columns={columns} data={e} key={i}/>))} 
          </div>
        </div>
    )
}