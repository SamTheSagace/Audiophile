import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Welcome to Audiophile</h1>
      <p className="mt-4">A minimal music playlist manager.</p>
      <div className="mt-6">
        <Link to="/login" className="underline">Login</Link> or <Link to="/register" className="underline">Register</Link>
      </div>
    </div>
  )
}
