import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const SPOTIFY_ITEM_LIMIT = 10;

const SpotifyDataContext = createContext(null);

export function SpotifyDataProvider({ children }) {
    const { token, loading: authLoading } = useAuth();
    const emptyByRange = () => ({ short_term: [], medium_term: [], long_term: [] });
    const [artists, setArtists] = useState(emptyByRange());
    const [tracks, setTracks] = useState(emptyByRange());
    const [likedSongs, setLikedSongs] = useState([]);
    const [loading, setLoading] = useState(false);
    const hasFetched = useRef(false);

    const fetchByRange = (endpoint, timeRange) =>
        fetch(`${API_BASE}/${endpoint}?time_range=${timeRange}&limit=${SPOTIFY_ITEM_LIMIT}`, {
            credentials: 'include',
            headers: { Authorization: `Bearer ${token}` },
        }).then(res => {
            if (!res.ok) throw new Error(`Failed to fetch ${timeRange} ${endpoint}`);
            return res.json();
        });

    const fetchLikedSongs = () =>
        fetch(`${API_BASE}/api/liked-songs?offset=0&limit=50`, {
            credentials: 'include',
            headers: { Authorization: `Bearer ${token}` },
        }).then(res => {
            if (!res.ok) throw new Error('Failed to fetch liked songs');
            return res.json();
        });

    useEffect(() => {
        if (!token) {
            hasFetched.current = false;
            setArtists(emptyByRange());
            setTracks(emptyByRange());
            setLikedSongs([]);
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
            fetchLikedSongs(),
        ])
            .then(([artistsShort, artistsMedium, artistsLong, tracksShort, tracksMedium, tracksLong, likedSongsData]) => {
                const mapArtists = (data) =>
                    (data.items ?? []).slice(0, SPOTIFY_ITEM_LIMIT).map((artist, index) => ({
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
                setLikedSongs(likedSongsData.items ?? []);
            })
            .catch(err => console.error('Failed to fetch Spotify data:', err))
            .finally(() => setLoading(false));
    }, [token, authLoading]);

    return (
        <SpotifyDataContext.Provider value={{ artists, tracks, likedSongs, loading }}>
            {children}
        </SpotifyDataContext.Provider>
    );
}

export function useSpotifyData() {
    return useContext(SpotifyDataContext);
}
