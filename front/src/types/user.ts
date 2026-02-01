import { MusicProvider } from "./provider" 

export interface User {
    userId: string
    email: string
    displayName?: string
    connectedAccounts?: Array<{
        provider: MusicProvider
        providerUserId: string
        expiresAt?: Date
    }>
}

export type PublicUser = {
    displayName: string
    email: string
    avatar: string
    connectedAccounts?: Array<{
        provider: MusicProvider
        providerUserId: string
        expiresAt?: Date
    }>
}
