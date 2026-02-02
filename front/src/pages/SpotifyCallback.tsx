import { useAuth } from '@/context/AuthContext'
import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

const REDIRECT_URL_COOKIE = 'provider_redirect_url'

function getRedirectUrlFromCookie(): string | null {
  const name = `${REDIRECT_URL_COOKIE}=`
  const decodedCookie = decodeURIComponent(document.cookie)
  const cookieArray = decodedCookie.split(';')
  for (let cookie of cookieArray) {
    cookie = cookie.trim()
    if (cookie.indexOf(name) === 0) {
      return decodeURIComponent(cookie.substring(name.length))
    }
  }
  return null
}

function clearRedirectUrlCookie() {
  document.cookie = `${REDIRECT_URL_COOKIE}=; path=/; max-age=0`
}

export default function SpotifyCallback() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { refresh } = useAuth()
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const linked = params.get('spotify')
    const error = params.get('spotify_error')
    const redirectUrl = getRedirectUrlFromCookie()
    const targetUrl = redirectUrl || '/'

    if (linked === 'linked') {
      setMessage('Compte Spotify lié avec succès. Redirection...')
      // refresh user connections
      refresh().catch(() => {})
      clearRedirectUrlCookie()
      setTimeout(() => navigate(targetUrl), 1200)
      return
    }

    if (error) {
      setMessage(`Erreur Spotify : ${error}`)
      clearRedirectUrlCookie()
      setTimeout(() => navigate('/'), 2500)
      return
    }

    setMessage('Aucune information Spotify reçue. Redirection...')
    clearRedirectUrlCookie()
    setTimeout(() => navigate(targetUrl), 1200)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Spotify</h2>
      <p className="mt-4">{message || 'Traitement en cours...'}</p>
    </div>
  )
}
