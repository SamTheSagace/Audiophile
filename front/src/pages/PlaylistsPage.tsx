import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Link2, RefreshCw } from 'lucide-react';
import { ProviderEnum, type ProviderType } from '@/types/playlist.types';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { getProviderConfig, PROVIDERS_CONFIG } from '@/lib/providers';
import { getPlaylists } from '@/services/playlist.service';
import { PlaylistCard } from '@/components/Block/playlists/PlaylistCard';
import { ExportModal } from '@/components/Block/modals/ExportModal';
import auth from '@/lib/auth';
import type { PublicUser } from '@/types/user';
import { handleConnect } from '@/services/provider.service';

export default function PlaylistsPage() {
  const navigate = useNavigate();
  const [activeProvider, setActiveProvider] = useState<ProviderType>(ProviderEnum.SPOTIFY);

  const [user, setUser] = useState<PublicUser | null>(null);

  useEffect(() => {
    let mounted = true;
    auth
      .getMe()
      .then((u: PublicUser) => {
        if (mounted) setUser(u);
      })
      .catch(() => {
        if (mounted) setUser(null);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const alreadyConnected = Object.values(ProviderEnum)
    .filter(provider => user?.connectedAccounts?.some(acc => acc.provider === provider))
    .map(provider => ({
      name: PROVIDERS_CONFIG[provider].label,
      url: '/provider/' + PROVIDERS_CONFIG[provider].label.toLowerCase(),
      icon: PROVIDERS_CONFIG[provider].icon,
    }));

  const providerConfig = getProviderConfig(activeProvider);
  const isConnected = alreadyConnected.some(acc => acc.name === providerConfig.label);

  const [playlistToExport, setPlaylistToExport] = useState<string | null>(null);

  const {
    data: playlists,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['playlists', activeProvider],
    queryFn: () => getPlaylists(activeProvider),
    enabled: isConnected,
  });

  const isTokenExpired = isError && error.response.data.error.includes('SPOTIFY_TOKEN_EXPIRED');

  const handleExportClick = (id: string) => {
    setPlaylistToExport(id);
  };

  const handleExportConfirm = (targetProvider: string) => {
    setPlaylistToExport(null);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* --- HEADER --- */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Mes Playlists</h1>
        <p className="text-muted-foreground">Gérez vos playlists importées depuis vos plateformes de streaming.</p>
      </div>

      {/* --- TABS --- */}
      <Tabs defaultValue={ProviderEnum.SPOTIFY} onValueChange={val => setActiveProvider(val as ProviderType)} className="w-full">
        {/* Ligne des Onglets + Bouton Refresh Contextuel */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <TabsList className="grid w-full sm:w-auto grid-cols-4">
            {Object.values(ProviderEnum).map(provider => (
              <TabsTrigger key={provider} value={provider}>
                {getProviderConfig(provider).label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Bouton de Refresh de l'onglet actif */}
          {isConnected && (
            <Button
              variant="default"
              size="sm"
              onClick={() => refetch()}
              disabled={isRefetching || isLoading}
              className="gap-2 text-white hover:text-white border-0 hover:opacity-90 transition-opacity"
              style={{ background: providerConfig.bgStyle }}
            >
              <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Actualiser</span>
            </Button>
          )}
        </div>

        <div className="min-h-100">
          {/* ETAT 1 : NON CONNECTÉ */}
          {!isConnected || isTokenExpired ? (
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl bg-muted/30 text-center space-y-6">
              <div className="p-6 rounded-full bg-background shadow-sm" style={{ color: providerConfig.color }}>
                <Link2 size={48} />
              </div>
              <div className="space-y-2 max-w-md">
                <h3 className="text-2xl font-bold">Connectez {providerConfig.label}</h3>
                <p className="text-muted-foreground">Pour importer et gérer vos playlists, vous devez d'abord associer votre compte.</p>
              </div>
              <Button
                onClick={() => handleConnect(activeProvider)}
                size="lg"
                className="gap-2 text-white font-semibold shadow-md hover:opacity-90 transition-opacity"
                style={{ background: providerConfig.bgStyle }}
              >
                Se connecter à {providerConfig.label}
              </Button>
            </div>
          ) : null}

          {/* ETAT 2 : ERREUR API */}
          {isConnected && isError && !isTokenExpired ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur de synchronisation</AlertTitle>
              <AlertDescription>
                {(error as Error).message}. <br />
                <Button variant="link" onClick={() => refetch()} className="p-0 h-auto font-bold text-destructive">
                  Réessayer ?
                </Button>
              </AlertDescription>
            </Alert>
          ) : null}

          {/* ETAT 3 : CHARGEMENT */}
          {isConnected && isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-48 w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {/* ETAT 4 : DONNÉES DISPONIBLES */}
          {isConnected && !isLoading && !isError ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Liste des playlists */}
              {playlists?.map(playlist => (
                <PlaylistCard
                  key={playlist.id}
                  playlist={playlist}
                  coverUrl={playlist.imageUrl ?? `https://picsum.photos/seed/${playlist.id}/400/400`}
                  onClick={id => navigate(`/playlist/${playlist.provider}/${id}`)}
                  onSort={id => console.log('Sort', id)}
                  onExport={id => handleExportClick(id)}
                  onRename={id => console.log('Rename', id)}
                  onDelete={id => console.log('Delete', id)}
                />
              ))}

              {/* ETAT 5 : LISTE VIDE (Mais connecté) */}
              {playlists?.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl bg-muted/10 text-center space-y-4">
                  <div className="p-4 bg-muted rounded-full text-muted-foreground">
                    <FolderSearch size={48} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold">Aucune playlist trouvée</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">Nous n'avons trouvé aucune playlist sur votre compte {providerConfig.label}.</p>
                  </div>
                  <Button
                    onClick={() => refetch()}
                    variant="outline"
                    className="gap-2 border-primary/20 hover:bg-primary/5"
                    style={{ background: providerConfig.bgStyle }}
                  >
                    <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
                    {isRefetching ? 'Recherche en cours...' : 'Récupérer mes playlists'}
                  </Button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </Tabs>
      <ExportModal
        isOpen={!!playlistToExport}
        onClose={() => setPlaylistToExport(null)}
        onConfirm={handleExportConfirm}
        categoryName={''}
        provider={activeProvider}
      />
    </div>
  );
}
