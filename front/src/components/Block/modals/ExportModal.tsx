import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FaDeezer, FaSpotify, FaYoutube } from 'react-icons/fa';
import { SiApplemusic } from 'react-icons/si';

type ExportModalProps = {
  onClick: () => void;
};

export function ExportModal({ onClick }: ExportModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1 ">
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export a playlist</DialogTitle>
          <DialogDescription>Choose wich site to export too</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <DialogClose asChild>
            <Button onClick={onClick} type="submit">
              <FaSpotify /> Spotify
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={onClick} type="submit">
              <FaDeezer />
              Deezer
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={onClick} type="submit">
              <FaYoutube />
              Youtube Music
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={onClick} type="submit">
              <SiApplemusic />
              Apple Music
            </Button>
          </DialogClose>
        </div>
        {/* <DialogFooter>
          </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
