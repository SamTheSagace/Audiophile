import useAuth from '@/hooks/useAuth'
import auth from '@/lib/auth'

export default function Profile() {
  const { user } = useAuth()

  const api = import.meta.env.VITE_API_URL || 'http://localhost:3000'

  const handleConnect = async () => {
    try {
      const res = await auth.authFetch(`${api}/auth/spotify/login-url`, { method: 'POST' })
      if (!res.ok) throw new Error('Failed to get spotify url')
      const body = await res.json()
      if (body.url) window.location.href = body.url
    } catch (e) {
      console.error('Spotify connect failed', e)
      window.alert('Impossible d\'initier la connexion Spotify')
    }
  }

  const isSpotifyLinked = user?.connectedAccounts?.some(c => c.provider === 'spotify')

  return (
    <div>
      <h2 className="text-2xl font-bold">Profile</h2>
      <p className="mt-4">User profile and account settings.</p>

      <div className="mt-6">
        <h3 className="font-semibold">Connections</h3>
        <div className="mt-2">
          <button
            onClick={handleConnect}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            {isSpotifyLinked ? 'Reconnecter Spotify' : 'Connecter Spotify'}
          </button>
        </div>
      </div>
    </div>
  )
}
