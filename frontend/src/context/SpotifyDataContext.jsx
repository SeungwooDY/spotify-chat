import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const SpotifyDataContext = createContext(null);

export function SpotifyDataProvider({ children }) {
    const { token, loading: authLoading } = useAuth();
    const [artists, setArtists] = useState([]);
    const [tracks, setTracks] = useState({ short_term: [], medium_term: [], long_term: [] });
    const [loading, setLoading] = useState(false);
    const hasFetched = useRef(false);

    const fetchTracks = (timeRange) =>
        fetch(`${API_BASE}/api/top-tracks?time_range=${timeRange}&limit=10`, { credentials: 'include' })
            .then(res => {
                if (!res.ok) throw new Error(`Failed to fetch ${timeRange} tracks`);
                return res.json();
            });

    useEffect(() => {
        if (!token) {
            hasFetched.current = false;
            setArtists([]);
            setTracks({ short_term: [], medium_term: [], long_term: [] });
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
            fetchTracks('short_term'),
            fetchTracks('medium_term'),
            fetchTracks('long_term'),
        ])
            .then(([artistsData, shortTerm, mediumTerm, longTerm]) => {
                setArtists(
                    (artistsData.items ?? []).slice(0, 9).map((artist, index) => ({
                        id: artist.id ?? `spotify-artist-${index + 1}`,
                        name: artist.name ?? `Artist ${index + 1}`,
                        imageUrl: artist.images?.[0]?.url ?? null,
                        spotifyUrl: artist.external_urls?.spotify ?? null,
                    }))
                );
                setTracks({
                    short_term: shortTerm.items ?? [],
                    medium_term: mediumTerm.items ?? [],
                    long_term: longTerm.items ?? [],
                });
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
