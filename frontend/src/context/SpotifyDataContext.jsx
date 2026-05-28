import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const SpotifyDataContext = createContext(null);

export function SpotifyDataProvider({ children }) {
    const { token, loading: authLoading } = useAuth();
    const emptyByRange = () => ({ short_term: [], medium_term: [], long_term: [] });
    const [artists, setArtists] = useState(emptyByRange());
    const [tracks, setTracks] = useState(emptyByRange());
    const [loading, setLoading] = useState(false);
    const hasFetched = useRef(false);

    const fetchByRange = (endpoint, timeRange) =>
        fetch(`${API_BASE}/${endpoint}?time_range=${timeRange}&limit=10`, { credentials: 'include' })
            .then(res => {
                if (!res.ok) throw new Error(`Failed to fetch ${timeRange} ${endpoint}`);
                return res.json();
            });

    useEffect(() => {
        if (!token) {
            hasFetched.current = false;
            setArtists(emptyByRange());
            setTracks(emptyByRange());
            return;
        }

        if (authLoading || hasFetched.current) return;

        hasFetched.current = true;
        setLoading(true);

        Promise.all([
            fetchByRange('api/top-artists', 'short_term'),
            fetchByRange('api/top-artists', 'medium_term'),
            fetchByRange('api/top-artists', 'long_term'),
            fetchByRange('api/top-tracks', 'short_term'),
            fetchByRange('api/top-tracks', 'medium_term'),
            fetchByRange('api/top-tracks', 'long_term'),
        ])
            .then(([artistsShort, artistsMedium, artistsLong, tracksShort, tracksMedium, tracksLong]) => {
                const mapArtists = (data) =>
                    (data.items ?? []).slice(0, 9).map((artist, index) => ({
                        id: artist.id ?? `spotify-artist-${index + 1}`,
                        name: artist.name ?? `Artist ${index + 1}`,
                        imageUrl: artist.images?.[0]?.url ?? null,
                        spotifyUrl: artist.external_urls?.spotify ?? null,
                    }));

                setArtists({
                    short_term: mapArtists(artistsShort),
                    medium_term: mapArtists(artistsMedium),
                    long_term: mapArtists(artistsLong),
                });
                setTracks({
                    short_term: tracksShort.items ?? [],
                    medium_term: tracksMedium.items ?? [],
                    long_term: tracksLong.items ?? [],
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
