import { useAuth } from '@/context/AuthContext';
import { useSpotifyData } from '@/context/SpotifyDataContext';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

const TopSongsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { tracks, loading: dataLoading } = useSpotifyData();
  const currentTracks = tracks.short_term;

  if (authLoading || dataLoading) return null;

  const topFour = currentTracks.slice(0, 4);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-background text-foreground transition-colors md:h-screen">
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
            <Avatar className="h-12 w-12 border-2 border-border bg-muted">
              <AvatarImage src={user?.profileImage}
                alt={user?.displayName} />
                  <AvatarFallback className="bg-muted">
                    <User className="h-6 w-6 text-foreground" strokeWidth={2.5} />
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
        {currentTracks.map((track, index) => (
          <li key={track.id} className="flex items-center gap-4 border-b border-border py-3">
            <span className="w-7 shrink-0 text-right text-lg font-bold text-muted-foreground">
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
              <p className="truncate text-sm text-muted-foreground">
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
