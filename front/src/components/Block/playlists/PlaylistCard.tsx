import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Music, ArrowRight, Pencil, Trash2 } from 'lucide-react';
import { type PlaylistSummary } from '@/types/playlist.types';
import { formatDuration } from '@/lib/utils';
import { getProviderConfig } from '@/lib/providers';

// --- Component Props ---

interface PlaylistCardProps {
  playlist: PlaylistSummary;
  coverUrl?: string;
  description?: string;
  onClick?: (id: string) => void;
  // onSort et onExport ne sont plus utilisés ici visuellement, 
  // mais je les laisse dans l'interface si ton parent les passe encore pour éviter les erreurs TS immédiates.
  onSort?: (id: string) => void; 
  onExport?: (id: string) => void;
  onRename?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const PlaylistCard = ({ playlist, coverUrl, description, onClick, onRename, onDelete }: PlaylistCardProps) => {
  const { color, bgStyle } = getProviderConfig(playlist.provider);
  const providerConfig = getProviderConfig(playlist.provider);

  const imageSrc = coverUrl || 'https://placehold.co/400x300/E2E8F0/1E293B?text=No+Cover';
  const descText = description || `${providerConfig.label}`;

  return (
    <Card
      className="p-0 border-0 overflow-hidden group transition-all duration-300 ring-2 ring-(--provider-color) hover:ring-4 hover:shadow-md flex flex-col h-full"
      style={{ '--provider-color': color } as React.CSSProperties }
    >
      <div 
        className="relative h-60 w-full bg-muted shrink-0 cursor-pointer"
        onClick={() => onClick?.(playlist.id)}
      >
        <img 
            src={imageSrc} 
            alt={playlist.name} 
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
      </div>

      <CardContent className="p-4 space-y-3 flex-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-lg leading-tight line-clamp-1" title={playlist.name}>
            {playlist.name}
          </h3>

          {/* --- MENU DROPDOWN --- */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground hover:text-foreground">
                <MoreVertical size={20} />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={e => {
                  e.stopPropagation();
                  onRename?.(playlist.id);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                <span>Renommer</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                onClick={e => {
                  e.stopPropagation();
                  onDelete?.(playlist.id);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Supprimer</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Music size={14} />
            <span>{playlist.trackCount} titres</span>
          </div>
          <span>•</span>
          <div>{providerConfig.label}</div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 mt-auto">
        <Button
          className="w-full gap-2 text-white border-0 cursor-pointer"
          style={{ background: bgStyle }}
          onClick={() => onClick?.(playlist.id)}
        >
          <span>Voir le détail</span>
          <ArrowRight size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
};