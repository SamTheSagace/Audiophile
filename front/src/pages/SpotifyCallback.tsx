import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'

export default function SpotifyCallback() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { refresh } = useAuth()
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const linked = params.get('spotify')
    const error = params.get('spotify_error')

    if (linked === 'linked') {
      setMessage('Compte Spotify lié avec succès. Redirection...')
      // refresh user connections
      refresh().catch(() => {})
      setTimeout(() => navigate('/profile'), 1200)
      return
    }

    if (error) {
      setMessage(`Erreur Spotify : ${error}`)
      setTimeout(() => navigate('/profile'), 2500)
      return
    }

    setMessage('Aucune information Spotify reçue. Redirection...')
    setTimeout(() => navigate('/profile'), 1200)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Spotify</h2>
      <p className="mt-4">{message || 'Traitement en cours...'}</p>
    </div>
  )
}
