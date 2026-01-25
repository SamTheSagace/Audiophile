import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock } from "lucide-react";
import type { NormalizedTrack } from "@/types/playlist.types";
import { formatDuration } from "@/lib/utils";

interface PlaylistTracksTableProps {
  tracks: NormalizedTrack[];
}

export const PlaylistTracksTable = ({ tracks }: PlaylistTracksTableProps) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Titre</TableHead>
            <TableHead className="hidden md:table-cell">Album</TableHead>
            <TableHead className="hidden md:table-cell">Genre</TableHead>
            <TableHead className="text-right">
                <Clock className="ml-auto h-4 w-4" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tracks.map((track, index) => (
            <TableRow key={track.id}>
              <TableCell className="font-medium text-muted-foreground">
                {index + 1}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{track.title}</span>
                  <span className="text-xs text-muted-foreground">{track.artist}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">
                {track.album}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                    {track.genre || "Inconnu"}
                </span>
              </TableCell>
              <TableCell className="text-right font-mono text-sm">
                {formatDuration(track.duration)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};