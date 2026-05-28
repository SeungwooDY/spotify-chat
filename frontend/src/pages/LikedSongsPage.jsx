import { Search, X } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";

const TrackCard = ({ track }) => (
  <div className="flex flex-col bg-white border border-black/5 rounded-xl overflow-hidden">
    {/* Load Image */}
    {track.album?.images?.[0]?.url && (
      <img
        className="w-full aspect-square object-cover"
        src={track.album.images[0].url}
        alt={track.name}
        loading="lazy"
      />
    )}
    {/* Track Info */}
    <div className="flex flex-col gap-0.5 px-3 py-2">
      <p className="text-xs font-semibold text-gray-900 truncate" title={track.name}>
        {track.name}
      </p>
      <p className="text-[11px] text-gray-500 truncate" title={track.artists?.map((a) => a.name).join(", ")}>
        {track.artists?.map((a) => a.name).join(", ")}
      </p>
      <p className="text-[10px] text-gray-400 truncate" title={track.album?.name}>
        {track.album?.name}
      </p>
    </div>
  </div>
);

const LikedSongsPage = () => {
  const [tracks, setTracks] = useState([]);
  const [loadingTracks, setLoadingTracks] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const getLikedSongs = async () => {
      try {
        setLoadingTracks(true);

        const response = await axios.get(`http://127.0.0.1:3000/api/liked-songs`, {
          params: { offset: 0, limit: 50 },
          withCredentials: true,
        });

        setTracks(response.data.items ?? []);
      } catch (err) {
        console.error("Error fetching liked songs:", err);
        setError("Failed to load liked songs");
      } finally {
        setLoadingTracks(false);
      }
    }
    getLikedSongs();
  }, []);

  const filteredTracks = tracks.filter(({ track }) => {
    const t = query.toLowerCase();
    const matchesSearch =
      !t ||
      track.name.toLowerCase().includes(t) ||
      track.artists?.some((a) => a.name.toLowerCase().includes(t)) ||
      track.album?.name.toLowerCase().includes(t);
    return matchesSearch;
  });

  return (
    <div className="flex flex-col gap-5 p-6 w-full h-[calc(100dvh-80px)] md:h-screen overflow-hidden">
      {/* Page title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-none shrink-0">
        Liked Songs
      </h1>

      {/* Main container */}
      <div className="w-full bg-[#f6f4eb] rounded-2xl shadow-sm border border-black/5 py-6 pl-6 pr-2 flex flex-col gap-4 flex-1 min-h-0">

        {/* Search */}
        <div className="relative flex items-center w-full">
          <Search className="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search songs, artists, albums..."
            className="w-full pl-9 pr-8 py-2 rounded-full border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3"
              aria-label="Clear search"
            >
              <X className="size-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Results count */}
        {!loadingTracks && !error && (
          <p className="text-xs text-gray-400 font-medium">
            {filteredTracks.length} song{filteredTracks.length !== 1 ? "s" : ""}
            {(query) && " found"}
          </p>
        )}

        {/* Loading state */}
        {loadingTracks && (
          <p className="text-sm text-center text-muted-foreground py-12">Loading liked songs...</p>
        )}

        {error && (
          <p className="text-sm text-center text-muted-foreground py-12">{error}</p>
        )}

        {/* Song grid */}
        {!loadingTracks && !error && (
          <div className="overflow-y-auto flex-1 min-h-0 pr-4">
            {filteredTracks.length > 0 ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-3">
                {filteredTracks.map(({ track }) => (
                  <TrackCard key={track.id} track={track} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-center text-muted-foreground py-12">
                No songs match your search.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedSongsPage;
