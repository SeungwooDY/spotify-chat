import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const SpotifyDataContext = createContext(null);

export function SpotifyDataProvider({ children }) {
    const { token, loading: authLoading } = useAuth();
    const [artists, setArtists] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(false);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (!token) {
            hasFetched.current = false;
            setArtists([]);
            setTracks([]);
            return;
        }

        if (authLoading || hasFetched.current) return;

        hasFetched.current = true;
        setLoading(true);

        Promise.all([
            fetch(`${API_BASE}/api/top-artists`, { credentials: 'include' })
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch top artists');
                    return res.json();
                }),
            fetch(`${API_BASE}/api/top-tracks?time_range=short_term&limit=10`, { credentials: 'include' })
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch top tracks');
                    return res.json();
                }),
        ])
            .then(([artistsData, tracksData]) => {
                setArtists(
                    (artistsData.items ?? []).slice(0, 9).map((artist, index) => ({
                        id: artist.id ?? `spotify-artist-${index + 1}`,
                        name: artist.name ?? `Artist ${index + 1}`,
                        imageUrl: artist.images?.[0]?.url ?? null,
                        spotifyUrl: artist.external_urls?.spotify ?? null,
                    }))
                );
                setTracks(tracksData.items ?? []);
            })
            .catch(err => console.error('Failed to fetch Spotify data:', err))
            .finally(() => setLoading(false));
    }, [token, authLoading]);

    return (
        <SpotifyDataContext.Provider value={{ artists, tracks, loading }}>
            {children}
        </SpotifyDataContext.Provider>
    );
}

export function useSpotifyData() {
    return useContext(SpotifyDataContext);
}
