import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User, Play, Check } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import { useSpotifyData } from '@/context/SpotifyDataContext';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

function authHeaders(extra = {}) {
  const token = sessionStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}`, ...extra } : { ...extra };
}

async function backendGet(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Request failed (${res.status}): ${path}`);
  return res.json();
}

async function backendPut(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    credentials: "include",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Request failed (${res.status}): ${path}`);
  return res.json();
}

function resizeImage(file, size = 200) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      const scale = Math.max(size / img.width, size / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = reject;
    img.src = url;
  });
}

function setsEqual(a, b) {
  if (a.size !== b.size) return false;
  for (const x of a) if (!b.has(x)) return false;
  return true;
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
  const fileInputRef = useRef(null);
  const [mockArtists, setMockArtists] = useState([]);
  const [mockTracks, setMockTracks] = useState([]);
  const [bio, setBio] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [selectedArtists, setSelectedArtists] = useState(new Set());
  const [selectedTracks, setSelectedTracks] = useState(new Set());
  const [savedBio, setSavedBio] = useState("");
  const [savedIsPublic, setSavedIsPublic] = useState(true);
  const [savedArtists, setSavedArtists] = useState(new Set());
  const [savedTracks, setSavedTracks] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useAuth();
  const { artists: contextArtists, tracks: contextTracks } = useSpotifyData();

  const isMock = import.meta.env.VITE_MOCK_DATA === "true";
  const artists = isMock ? mockArtists : contextArtists.medium_term.slice(0, 4);
  const tracks = isMock ? mockTracks : contextTracks.medium_term.slice(0, 4);

  useEffect(() => {
    if (import.meta.env.VITE_MOCK_DATA === "true") {
      setMockArtists(MOCK_DATA.artists);
      setMockTracks(MOCK_DATA.tracks);
      setLoading(false);
      return;
    }

    backendGet("/api/profile")
      .then((profileSettings) => {
        const initBio = profileSettings.bio || "";
        const initIsPublic = profileSettings.isPublic !== false;
        const initArtists = new Set(
          (profileSettings.featuredArtists || []).map((a) => a.id)
        );
        const initTracks = new Set(
          (profileSettings.featuredTracks || []).map((t) => t.id)
        );

        setBio(initBio);
        setIsPublic(initIsPublic);
        setSelectedArtists(initArtists);
        setSelectedTracks(initTracks);
        setSavedBio(initBio);
        setSavedIsPublic(initIsPublic);
        setSavedArtists(initArtists);
        setSavedTracks(initTracks);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    try {
      const resized = await resizeImage(file);
      const res = await fetch(`${API_BASE}/api/profile/photo`, {
        method: "POST",
        credentials: "include",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ image: resized }),
      });
      if (!res.ok) throw new Error("Failed to upload photo");
    } catch (err) {
      setError(err.message);
    }
  };

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
    bio !== savedBio ||
    isPublic !== savedIsPublic ||
    !setsEqual(selectedArtists, savedArtists) ||
    !setsEqual(selectedTracks, savedTracks);

  const handleSave = async () => {
    setSaving(true);
    try {
      const featuredArtists = artists
        .filter((a) => selectedArtists.has(a.id))
        .map((a) => ({
          id: a.id,
          name: a.name,
          imageUrl: a.images?.[2]?.url ?? a.images?.[0]?.url ?? null,
        }));

      const featuredTracks = tracks
        .filter((t) => selectedTracks.has(t.id))
        .map((t) => ({
          id: t.id,
          name: t.name,
          imageUrl:
            t.album?.images?.[2]?.url ?? t.album?.images?.[0]?.url ?? null,
        }));

      await backendPut("/api/profile", {
        bio,
        isPublic,
        featuredArtists,
        featuredTracks,
      });

      setSavedBio(bio);
      setSavedIsPublic(isPublic);
      setSavedArtists(new Set(selectedArtists));
      setSavedTracks(new Set(selectedTracks));
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-8 text-sm text-[#5F6368]">Loading...</p>;
  if (error) return <p className="p-8 text-sm text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-secondary px-6 pt-8 pb-28 text-foreground transition-colors md:px-12 lg:px-16 lg:py-12">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
        <section className="flex flex-col items-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />

          <Avatar className="h-30 w-30 border border-[#202124] bg-[#D9D9D9]">
            <AvatarImage src={user?.profileImage} alt={user?.displayName} />
            <AvatarFallback className="bg-[#D9D9D9]">
              <User className="h-16 w-16 text-[#202124]" strokeWidth={2.5} />
            </AvatarFallback>
          </Avatar>

          <Button
            variant="outline"
            size="sm"
            className="mt-3 cursor-pointer border-[#6EA3D5] text-xs text-[#6EA3D5] hover:bg-[#6EA3D5]/10"
            onClick={() => fileInputRef.current?.click()}
          >
            Edit Photo
          </Button>

          <div className="mt-6 w-full max-w-65">
            <h1 className="text-2xl font-semibold text-[#0F1F2F]">
              {user?.displayName}
            </h1>
            <p className="mt-1 text-xs text-[#5F6368]">@{user?.id}</p>

            <label className="mt-6 block text-sm font-medium text-foreground">
              Bio
            </label>

            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell people about your music taste..."
              className="mt-2 h-24 resize-none border-none bg-white text-sm text-[#0F1F2F] shadow-none focus-visible:ring-0"
            />

            <div className="mt-6 flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
              <div>
                <p className="text-sm font-medium text-card-foreground">
                  Public Profile
                </p>
                <p className="text-xs text-[#5F6368]">
                  {isPublic
                    ? "Anyone can find you on Discover"
                    : "Your profile is hidden from Discover"}
                </p>
              </div>
              <Switch checked={isPublic} onCheckedChange={setIsPublic} />
            </div>
          </div>
        </section>

        <section className="mx-auto flex w-full max-w-155 flex-col gap-5 lg:mx-0">
          <FeaturedCard
            title="Featured artists"
            subtitle="Select artists to display on your profile"
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
            subtitle="Select songs to display on your profile"
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
            disabled={!hasChanges || saving || justSaved}
            onClick={handleSave}
            className={`self-end text-xs text-white transition-colors ${
              justSaved
                ? "bg-green-500 cursor-default"
                : hasChanges && !saving
                ? "bg-[#4B8DB3] hover:bg-[#4B8DB3]/90"
                : "bg-[#91C8E4] cursor-not-allowed"
            }`}
          >
            {saving ? (
              "Saving..."
            ) : justSaved ? (
              <span className="flex items-center gap-1">
                <Check className="h-3.5 w-3.5" strokeWidth={3} /> Saved!
              </span>
            ) : (
              "Save Changes"
            )}
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
            <h2 className="text-2xl font-semibold leading-none text-card-foreground">
              {title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
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
    <button className="flex w-20 cursor-pointer flex-col items-center" onClick={onToggle}>
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
    <button className="flex w-20 cursor-pointer flex-col items-center" onClick={onToggle}>
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
    <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
      <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />
    </div>
  );
};

export default ProfilePage;
