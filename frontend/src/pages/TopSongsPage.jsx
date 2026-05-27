import { getTopTracks } from '../../utils/tracks';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

const TopSongsPage = () => {
  const { user, loading } = useAuth();
  const [tracks, setTracks] = useState([]);
  const [fetchingTracks, setFetchingTracks] = useState(true);

  useEffect(() => {
    getTopTracks('short_term', 10)
      .then(data => setTracks(data.items ?? []))
      .catch(err => console.error(err))
      .finally(() => setFetchingTracks(false));
  }, []);

  if (loading || fetchingTracks) return null;

  const topFour = tracks.slice(0, 4);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-white text-black md:h-screen">
      {/* Header */}
      <div className="mx-auto flex w-full max-w-2xl gap-8 px-6 pt-8 pb-6">
        {/* Top 4 album covers - 2x2 grid */}
        <div className="grid grid-cols-2 grid-rows-2 gap-1 overflow-hidden rounded-lg shrink-0">
          {topFour.map(track => (
            <img
              key={track.id}
              src={track.album?.images?.[0]?.url}
              alt={track.name}
              className="h-28 w-28 object-cover"
            />
          ))}
        </div>

        {/* Title + profile */}
        <div className="flex flex-col justify-center gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-white/25 bg-[#E5E5E5]">
              <AvatarImage src={user?.profileImage}
                alt={user?.displayName} />
                  <AvatarFallback className="bg-[#E5E5E5]">
                    <User className="h-6 w-6 text-[#222222]" strokeWidth={2.5} />
                  </AvatarFallback>
            </Avatar>
            <span className="text-lg font-medium">{user?.displayName}</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Top Songs
          </h1>
        </div>
      </div>
        <br />
      {/* Scrollable track list */}
      <ol className="w-full flex-1 overflow-y-auto px-6 pb-24">
        {tracks.map((track, index) => (
          <li key={track.id} className="flex items-center gap-4 border-b border-gray-100 py-3">
            <span className="w-7 shrink-0 text-right text-lg font-bold text-gray-400">
              {index + 1}
            </span>
            {track.album?.images?.[0]?.url && (
              <img
                src={track.album.images[0].url}
                alt={track.name}
                className="h-12 w-12 shrink-0 rounded object-cover"
              />
            )}
            <div className="min-w-0">
              <p className="truncate font-medium">{track.name}</p>
              <p className="truncate text-sm text-gray-500">
                {track.artists?.map(a => a.name).join(', ')}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
export default TopSongsPage;