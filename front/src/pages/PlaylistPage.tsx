import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Sparkles, Music2, PlayCircle, LayoutGrid, List, AlertCircle } from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Custom Components

// Data & Utils
import { getProviderConfig } from '@/lib/providers';
import { formatDuration } from '@/lib/utils';
import { mockCategorizePlaylist } from '@/data/mock-playlist';
import { PlaylistTracksTable } from '@/components/Block/playlists/PlaylistTrackTable';
import { GenreCard } from '@/components/Block/playlists/GenreCard';
import { ExportModal } from '@/components/Block/modals/ExportModal';
import type { NormalizedPlaylist, CategorizedPlaylist } from '@/types/playlist.types';
import { getPlaylistById } from '@/services/playlist.service';

export default function PlaylistPage() {
  const { provider, id } = useParams<{ provider?: string; id?: string }>();

  const { data: playlist, isLoading, isError, error } = useQuery<NormalizedPlaylist>({
    queryKey: ['playlist', provider, id],
    queryFn: () => getPlaylistById(provider ?? '', id!),
    enabled: !!provider && !!id,
  });

  const providerConfig = playlist ? getProviderConfig(playlist.provider) : { label: '', color: '', bgStyle: '' } as {
    label: string;
    color: string;
    bgStyle: string;
  };
  const label = providerConfig.label;
  const color = providerConfig.color;
  const bgStyle = providerConfig.bgStyle;

  const totalDuration = playlist ? playlist.tracks.reduce((acc, track) => acc + track.duration, 0) : 0;

  const [categorizedData, setCategorizedData] = useState<CategorizedPlaylist | null>(null);

  const categorizeMutation = useMutation({
    mutationFn: (playlistId: string) => mockCategorizePlaylist(playlistId),
    onSuccess: data => {
      setCategorizedData(data);
    },
  });

  const [exportState, setExportState] = useState<{ isOpen: boolean; category: string }>({
    isOpen: false,
    category: '',
  });

  const handleCategorize = () => {
    if (id) categorizeMutation.mutate(id);
  };

  const handleExportOpen = (categoryName: string) => {
    setExportState({ isOpen: true, category: categoryName });
  };

  const handleExportConfirm = (customName: string) => {
    console.log(`EXPORT START: Playlist [${id}] - Category [${exportState.category}] - Name [${customName}]`);
    setExportState({ isOpen: false, category: '' });
  };

  return (
    <div className="flex flex-col min-h-screen pb-20 animate-in fade-in duration-500">
      {/* --- HEADER HERO --- */}
      <div className="relative flex flex-col md:flex-row items-end gap-6 p-8 bg-linear-to-b from-muted/50 to-background">
        {/* Cover */}
        <div className="h-40 w-40 md:h-52 md:w-52 shadow-2xl rounded-md overflow-hidden shrink-0 mx-auto md:mx-0 ring-1 ring-white/10">
          {isLoading ? (
            <Skeleton className="h-full w-full object-cover" />
          ) : (
            <img
              src={playlist?.imageUrl ?? 'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?auto=format&fit=crop&q=80&w=400'}
              alt={playlist?.name ?? ''}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        {/* Metadata */}
        <div className="flex flex-col gap-2 w-full text-center md:text-left z-10">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-background/50 backdrop-blur text-[10px] font-bold tracking-widest uppercase border">
              Playlist Source
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-32 mx-auto md:mx-0" />
              <Skeleton className="h-12 w-3/4 mx-auto md:mx-0" />
              <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 pt-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2">{playlist?.name ?? ''}</h1>

              <div className="flex items-center justify-center md:justify-start gap-3 text-sm font-medium text-muted-foreground">
                <div className="flex items-center gap-1.5" style={{ color: color }}>
                  <Music2 className="h-4 w-4" />
                  <span>{label}</span>
                </div>
                <span>•</span>
                <span>{playlist?.tracks.length ?? 0} titres</span>
                <span>•</span>
                <span>{formatDuration(totalDuration)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* --- ERREUR DE CHARGEMENT --- */}
      {isError && (
        <div className="px-4 md:px-8 mt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur de chargement</AlertTitle>
            <AlertDescription>{(error as Error)?.message ?? 'Impossible de charger la playlist.'}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* --- ACTION BAR --- */}
      <div className="px-8 py-2 flex flex-col md:flex-row items-center gap-4 justify-between sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b pb-4 pt-2">
        {/* Play Button (Fake) */}
        <div className="flex items-center gap-4">
            <Button
            size="icon"
            className="rounded-full h-12 w-12 shadow-lg hover:scale-105 transition-transform text-white border-0"
              style={{ background: bgStyle }}
          >
            <PlayCircle size={28} />
          </Button>
          {categorizedData && (
            <Button variant="ghost" onClick={() => setCategorizedData(null)} className="gap-2">
              <List size={16} />
              Retour à la liste
            </Button>
          )}
        </div>

        {/* LE GROS BOUTON D'ACTION : CATEGORIZE */}
        {!categorizedData && (
          <Button
            size="lg"
            onClick={handleCategorize}
            disabled={categorizeMutation.isPending}
            className="w-full md:w-auto gap-2 font-bold shadow-md animate-pulse hover:animate-none"
          >
            {categorizeMutation.isPending ? (
              <>
                <Sparkles className="h-4 w-4 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Générer les playlists par Genre
              </>
            )}
          </Button>
        )}

        {/* Indicateur de mode si catégorisé */}
        {categorizedData && (
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            <LayoutGrid size={16} />
            Mode Trié activé
          </div>
        )}
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="px-4 md:px-8 mt-8 min-h-75">
        {/* MODE 1: LISTE BRUTE (Tableau) */}
        {!categorizedData && !categorizeMutation.isPending && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
            <PlaylistTracksTable tracks={playlist?.tracks ?? []} />
          </div>
        )}

        {/* MODE LOADING (Pendant le tri) */}
        {categorizeMutation.isPending && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 rounded-xl border bg-muted/50 space-y-4 p-6">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
                <div className="space-y-2 pt-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODE 2: RÉSULTATS CATÉGORISÉS (Grille de GenreCard) */}
        {categorizedData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in zoom-in-95 duration-500">
            {Object.entries(categorizedData).map(([category, tracks]) => (
              <GenreCard key={category} categoryName={category} tracks={tracks} provider={playlist?.provider ?? 'spotify'} onExport={() => handleExportOpen(category)} />
            ))}
          </div>
        )}
      </div>

      {/* --- MODALE D'EXPORT --- */}
      <ExportModal
        isOpen={exportState.isOpen}
        onClose={() => setExportState({ ...exportState, isOpen: false })}
        onConfirm={handleExportConfirm}
        categoryName={exportState.category}
        provider={playlist?.provider ?? 'spotify'}
        isExporting={false} // À connecter à une future mutation d'export
      />
    </div>
  );
}
