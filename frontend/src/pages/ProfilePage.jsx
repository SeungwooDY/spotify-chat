import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Play, Check } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

async function spotifyGet(endpoint, token) {
  const res = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Spotify ${res.status}: ${endpoint}`);
  return res.json();
}

const MOCK_DATA = {
  profile: { display_name: "Your Name", id: "yourusername", images: [] },
  artists: [
    { id: "a1", name: "Artist One", images: [] },
    { id: "a2", name: "Artist Two", images: [] },
    { id: "a3", name: "Artist Three", images: [] },
    { id: "a4", name: "Artist Four", images: [] },
  ],
  tracks: [
    { id: "t1", name: "Song One", album: { images: [] } },
    { id: "t2", name: "Song Two", album: { images: [] } },
    { id: "t3", name: "Song Three", album: { images: [] } },
    { id: "t4", name: "Song Four", album: { images: [] } },
  ],
};

const ProfilePage = () => {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [artists, setArtists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [bio, setBio] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [selectedArtists, setSelectedArtists] = useState(new Set());
  const [selectedTracks, setSelectedTracks] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      if (import.meta.env.VITE_MOCK_DATA === "true") {
        setProfile(MOCK_DATA.profile);
        setArtists(MOCK_DATA.artists);
        setTracks(MOCK_DATA.tracks);
        setLoading(false);
      }
      return;
    }
    Promise.all([
      spotifyGet("/me", token),
      spotifyGet("/me/top/artists?limit=4", token),
      spotifyGet("/me/top/tracks?limit=4", token),
    ])
      .then(([profileData, artistsData, tracksData]) => {
        setProfile(profileData);
        setArtists(artistsData.items);
        setTracks(tracksData.items);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const toggleArtist = (id) => {
    setSelectedArtists((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleTrack = (id) => {
    setSelectedTracks((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const hasChanges =
    bio !== "" ||
    isPublic !== true ||
    selectedArtists.size > 0 ||
    selectedTracks.size > 0;

  if (loading) return <p className="p-8 text-sm text-[#5F6368]">Loading...</p>;
  if (error) return <p className="p-8 text-sm text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-[#F4F2EA] px-6 pt-8 pb-28 md:px-12 lg:px-16 lg:py-12">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
        <section className="flex flex-col items-center">
          <Avatar className="h-30 w-30 border border-[#202124] bg-[#D9D9D9]">
            <AvatarImage src={profile?.images?.[0]?.url} alt="profile" />
            <AvatarFallback className="bg-[#D9D9D9]">
              <User className="h-16 w-16 text-[#202124]" strokeWidth={2.5} />
            </AvatarFallback>
          </Avatar>

          <Button
            variant="outline"
            size="sm"
            className="mt-3 border-[#6EA3D5] text-xs text-[#6EA3D5]"
          >
            Edit Photo
          </Button>

          <div className="mt-6 w-full max-w-65">
            <h1 className="text-2xl font-semibold text-[#0F1F2F]">
              {profile?.display_name}
            </h1>
            <p className="mt-1 text-xs text-[#5F6368]">@{profile?.id}</p>

            <label className="mt-6 block text-sm font-medium text-[#0F1F2F]">
              Bio
            </label>

            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell people about your music taste..."
              className="mt-2 h-24 resize-none border-none bg-white text-sm text-[#0F1F2F] shadow-none focus-visible:ring-0"
            />

            <div className="mt-6 flex items-center justify-between rounded-lg bg-white px-4 py-3">
              <div>
                <p className="text-sm font-medium text-[#0F1F2F]">
                  Public Profile
                </p>
                <p className="text-xs text-[#5F6368]">Visible on Discover</p>
              </div>
              <Switch checked={isPublic} onCheckedChange={setIsPublic} />
            </div>
          </div>
        </section>

        <section className="mx-auto flex w-full max-w-155 flex-col gap-5 lg:mx-0">
          <FeaturedCard
            title="Featured artists"
            subtitle="Pick from your top artists"
            buttons={[{ label: "View top artists", to: "/top-artists" }]}
          >
            <div className="mx-auto grid w-fit grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4">
              {artists.map((artist) => (
                <ArtistOption
                  key={artist.id}
                  name={artist.name}
                  imageUrl={artist.images?.[2]?.url ?? artist.images?.[0]?.url}
                  selected={selectedArtists.has(artist.id)}
                  onToggle={() => toggleArtist(artist.id)}
                />
              ))}
            </div>
          </FeaturedCard>

          <FeaturedCard
            title="Featured songs"
            subtitle="Pick from your top songs"
            buttons={[
              { label: "View top songs", to: "/top-songs" },
              { label: "View liked songs", to: "/liked-songs" },
            ]}
          >
            <div className="mx-auto grid w-fit grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4">
              {tracks.map((track) => (
                <SongOption
                  key={track.id}
                  name={track.name}
                  imageUrl={
                    track.album?.images?.[2]?.url ??
                    track.album?.images?.[0]?.url
                  }
                  selected={selectedTracks.has(track.id)}
                  onToggle={() => toggleTrack(track.id)}
                />
              ))}
            </div>
          </FeaturedCard>

          <Button
            disabled={!hasChanges}
            className={`self-end text-xs text-white transition-colors ${
              hasChanges
                ? "bg-[#4B8DB3] hover:bg-[#4B8DB3]/90"
                : "bg-[#91C8E4] cursor-not-allowed"
            }`}
          >
            Save Changes
          </Button>
        </section>
      </div>
    </div>
  );
};

const FeaturedCard = ({ title, subtitle, buttons, children }) => {
  const navigate = useNavigate();
  return (
    <Card className="w-full">
      <CardContent className="p-5">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold leading-none text-[#0F1F2F]">
              {title}
            </h2>
            <p className="mt-2 text-sm text-[#5F6368]">{subtitle}</p>
          </div>

          <div className="flex flex-wrap justify-start gap-2 sm:justify-end">
            {buttons.map(({ label, to }) => (
              <Button
                key={label}
                size="sm"
                className="rounded-full bg-[#4B8DB3] text-xs text-white hover:bg-[#3a7ca3] active:scale-95"
                onClick={() => navigate(to)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {children}
      </CardContent>
    </Card>
  );
};

const ArtistOption = ({ name, imageUrl, selected, onToggle }) => {
  return (
    <button className="flex w-20 flex-col items-center" onClick={onToggle}>
      <div className="relative">
        <div
          className={`flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-[#202124] bg-[#D9D9D9] ${
            selected ? "ring-4 ring-[#4B8DB3]" : ""
          }`}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-7 w-7 text-[#202124]" strokeWidth={2.5} />
          )}
        </div>
        {selected && <SelectionCheck />}
      </div>
      <p className="mt-2 text-center text-[11px] leading-tight text-[#0F1F2F]">
        {name}
      </p>
    </button>
  );
};

const SongOption = ({ name, imageUrl, selected, onToggle }) => {
  return (
    <button className="flex w-20 flex-col items-center" onClick={onToggle}>
      <div className="relative">
        <div
          className={`flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-[#202124] bg-[#D9D9D9] ${
            selected ? "ring-4 ring-[#4B8DB3]" : ""
          }`}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <Play className="ml-1 h-7 w-7 text-[#202124]" strokeWidth={1.75} />
          )}
        </div>
        {selected && <SelectionCheck />}
      </div>
      <p className="mt-2 text-center text-[11px] leading-tight text-[#0F1F2F]">
        {name}
      </p>
    </button>
  );
};

const SelectionCheck = () => {
  return (
    <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#4B8DB3]">
      <Check className="h-3 w-3 text-white" strokeWidth={3} />
    </div>
  );
};

export default ProfilePage;
