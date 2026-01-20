export const MusicProvider = {
    SPOTIFY: 'spotify',
    DEEZER: 'deezer',
    YOUTUBE: 'youtube',
    SOUNDCLOUD: 'soundcloud',
    APPLE_MUSIC: 'apple_music',
    AMAZON_MUSIC: 'amazon_music',
} as const

export type MusicProvider = (typeof MusicProvider)[keyof typeof MusicProvider]
