import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Link2 } from 'lucide-react';
import { getProviderConfig } from '@/lib/providers';
import { ProviderEnum, type ProviderType } from '@/types/playlist.types';
import { handleConnect, handleDisconnect as disconnectProvider } from '@/services/provider.service';
import type { PublicUser } from '@/types/user';
import auth from '@/lib/auth';

interface Provider {
  name: ProviderType;
  connected: boolean;
  icon: React.ComponentType<{ size?: number; color?: string }>;
}

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Récupérer les infos utilisateur avec ses connexions
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

  // Mutation pour déconnecter un provider
  const disconnectMutation = useMutation({
    mutationFn: async (provider: ProviderType) => {
      const response = await disconnectProvider(provider);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      auth.getMe().then(u => setUser(u));
    },
  });

  const handleConnect_ = (provider: ProviderType) => {
    handleConnect(provider, '/settings');
  };

  const handleDisconnect = (provider: ProviderType) => {
    disconnectMutation.mutate(provider);
  };

  // Construire la liste des providers
  const providers: Provider[] = Object.values(ProviderEnum).map(provider => ({
    name: provider,
    connected: user?.connectedAccounts?.some(acc => acc.provider === provider) ?? false,
    icon: getProviderConfig(provider).icon,
  }));

  return (
    <div className="min-h-screen animate-in fade-in duration-500">
      <div className="container mx-auto p-6 space-y-8">
        {/* --- HEADER --- */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground">Gérez vos connexions aux services musicaux et vos préférences.</p>
        </div>

        {/* --- ACCOUNT SECTION --- */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Compte</h2>
            <p className="text-sm text-muted-foreground mt-1">Informations de votre profil</p>
          </div>

          {!user ? (
            <div className="space-y-3">
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-4 rounded-lg border border-border bg-card/50">
                <p className="text-xs font-medium text-muted-foreground uppercase">Email</p>
                <p className="text-base font-semibold mt-2">{user.email}</p>
              </div>

              <div className="p-4 rounded-lg border border-border bg-card/50">
                <p className="text-xs font-medium text-muted-foreground uppercase">Nom d'utilisateur</p>
                <p className="text-base font-semibold mt-2">{user.displayName || 'Non défini'}</p>
              </div>
            </div>
          )}
        </div>


        {/* --- PROVIDERS SECTION --- */}
        <div className="border-t border-border pt-8 space-y-4">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Services Musicaux
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Connectez ou déconnectez vos comptes de streaming</p>
          </div>

          {!user ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-20 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {providers.map(provider => {
                const config = getProviderConfig(provider.name);
                return (
                  <div
                    key={provider.name}
                    className="flex flex-col gap-4 p-5 rounded-xl border border-border bg-card hover:bg-card/80 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="p-3 rounded-lg"
                          style={{ backgroundColor: config.color + '20' }}
                        >
                          <config.icon size={24} style={{ color: config.color }} />
                        </div>
                        <div>
                          <p className="font-semibold">{config.label}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {provider.connected ? (
                              <>
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <span className="text-xs text-green-500 font-medium">Connecté</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">Non connecté</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() =>
                        provider.connected
                          ? handleDisconnect(provider.name)
                          : handleConnect_(provider.name)
                      }
                      disabled={disconnectMutation.isPending}
                      variant={provider.connected ? 'destructive' : 'default'}
                      className="w-full"
                      style={
                        !provider.connected
                          ? { background: config.bgStyle }
                          : {}
                      }
                    >
                      {disconnectMutation.isPending ? (
                        <span className="animate-spin">⏳</span>
                      ) : provider.connected ? (
                        'Délier le compte'
                      ) : (
                        `Connecter ${config.label}`
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {deleteError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{deleteError}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}