import React, { useEffect, useState } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import {
    SidebarProvider,
    SidebarTrigger,
    SidebarInset,
} from '@/components/ui/sidebar'
import { Button } from './components/ui/button'
import { FaBars } from 'react-icons/fa'
import { LoginForm } from './components/login'
import RegisterForm from './components/register'
import auth from './lib/auth'

export default function App() {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any | null>(null)

    const refreshUser = async () => {
        try {
            const u = await auth.getMe()
            setUser(u)
        } catch {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        refreshUser()
    }, [])

    const [mode, setMode] = useState<'login'|'register'>('login')

    if (loading) return <div className="p-6">Chargement...</div>

    if (!user) {
        return (
            <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm md:max-w-4xl">
                    {mode === 'login' ? (
                        <LoginForm onLogin={refreshUser} onSwitchToRegister={() => setMode('register')} />
                    ) : (
                        <RegisterForm onRegister={() => setMode('login')} onSwitchToLogin={() => setMode('login')} />
                    )}
                </div>
            </div>
        )
    }

    return (
        <SidebarProvider>
            <AppSidebar />

            <SidebarInset>
                <header className="flex h-14 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1">
                        <FaBars className="h-4 w-4" />
                    </SidebarTrigger>
                    <div className="font-semibold">Audiophile</div>
                </header>

                <main className="p-4">
                    Hello
                    <h1 className="text-3xl font-bold underline">Hello world!</h1>
                    <Button>Click me</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                    <Button variant="destructive">Delete</Button>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
