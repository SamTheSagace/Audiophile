import { useParams } from 'react-router-dom'
import { MusicProvider } from '@/types/provider'

export default function ProviderPage() {
  const { provider } = useParams<{ provider: string }>()

  const validProviders = Object.values(MusicProvider) as string[]

  if (!provider) return <div className="p-6">Provider manquant</div>
  if (!validProviders.includes(provider)) {
    return (
        <div className="p-6">Fournisseur inconnu: {provider}</div>
    )
  }

  return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Provider: {provider}</h1>
        <p className="mt-4">Ici vous pourrez afficher les playlists, les connexions ou actions liées au provider <strong>{provider}</strong>.</p>
      </div>
  )
}
