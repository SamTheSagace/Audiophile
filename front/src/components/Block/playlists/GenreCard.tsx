import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, User } from "lucide-react";
import { getProviderConfig } from "@/lib/providers";
import { type ProviderType, type TrackItem } from "@/types/playlist.types";

interface GenreCardProps {
  categoryName: string;
  tracks: TrackItem[];
  provider: ProviderType;
  onExport: () => void;
}

export const GenreCard = ({ categoryName, tracks, provider, onExport }: GenreCardProps) => {
  const config = getProviderConfig(provider);
  const Icon = config.icon;

  const previewArtists = Array.from(new Set(tracks.map(t => t.artist))).slice(0, 3);

  return (
    <Card className="flex flex-col h-full overflow-hidden border-l-4" style={{ borderLeftColor: config.color }}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-bold line-clamp-1" title={categoryName}>
                {categoryName}
            </CardTitle>
            <Icon style={{ color: config.color }} />
        </div>
        <Badge variant="secondary" className="w-fit mt-1">
            {tracks.length} titres
        </Badge>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 pt-2">
        <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
                Artistes principaux
            </p>
            <div className="flex flex-wrap gap-2">
                {previewArtists.map((artist, i) => (
                    <div key={i} className="flex items-center gap-1 text-sm bg-muted/50 px-2 py-1 rounded-md">
                        <User size={12} className="text-muted-foreground" />
                        <span className="truncate max-w-[120px]">{artist}</span>
                    </div>
                ))}
                {tracks.length > 3 && (
                    <span className="text-xs text-muted-foreground self-center">...</span>
                )}
            </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button 
            // AJOUT ICI : cursor-pointer explicitement ajouté
            className="w-full gap-2 text-white border-0 cursor-pointer hover:opacity-90 transition-opacity"
            style={{ background: config.bgStyle }}
            onClick={onExport}
        >
            <Download size={16} />
            Exporter cette playlist
        </Button>
      </CardFooter>
    </Card>
  );
};