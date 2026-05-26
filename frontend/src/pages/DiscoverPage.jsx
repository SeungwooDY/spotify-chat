import { useState } from "react";
import { Search, X, User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// placeholder data -- replace with real Spotify API responses
const MOCK_FRIENDS = [
  { id: "1", display_name: "alex_r", images: [] },
  { id: "2", display_name: "maya.k", images: [] },
  { id: "3", display_name: "djblue", images: [] },
  { id: "4", display_name: "sonicsam", images: [] },
  { id: "5", display_name: "lyriq", images: [] },
  { id: "6", display_name: "beatrix", images: [] },
  { id: "7", display_name: "novawave", images: [] },
];

const MOCK_SUGGESTED = [
  { id: "8", display_name: "indie_jess", images: [] },
  { id: "9", display_name: "lo_fi_tom", images: [] },
  { id: "10", display_name: "retrovik", images: [] },
  { id: "11", display_name: "synthpop", images: [] },
  { id: "12", display_name: "cass_m", images: [] },
  { id: "13", display_name: "waverly", images: [] },
  { id: "14", display_name: "jazzcat", images: [] },
];

const MOCK_SIMILAR = [
  { id: "15", display_name: "phoebe_w", images: [] },
  { id: "16", display_name: "ambient_g", images: [] },
  { id: "17", display_name: "drumline9", images: [] },
  { id: "18", display_name: "moodring", images: [] },
  { id: "19", display_name: "folksam", images: [] },
  { id: "20", display_name: "nocturn", images: [] },
  { id: "21", display_name: "glitchr", images: [] },
];

const ProfileCard = ({ user }) => (
  <div className="flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer transition-colors">
    <Avatar className="size-20">
      {/* images[0]?.url will be populated real Spotify API response */}
      <AvatarImage src={user.images?.[0]?.url} alt={user.display_name} />
      <AvatarFallback className="bg-muted">
        <User className="size-6 text-muted-foreground" />
      </AvatarFallback>
    </Avatar>

    <span className="text-sm font-medium truncate max-w-[100px]">
      {user.display_name}
    </span>

    <span className="text-xs text-muted-foreground">profile</span>
  </div>
);

const ProfileSection = ({ label, profiles, query }) => {
  const filtered = profiles.filter((p) =>
    p.display_name.toLowerCase().includes(query.toLowerCase())
  );

  if (filtered.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-base text-muted-foreground font-normal mb-4">
        {label}
      </h2>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4">
        {filtered.map((user) => (
          <ProfileCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

const DiscoverPage = ({
  friends = MOCK_FRIENDS,
  suggested = MOCK_SUGGESTED,
  similar = MOCK_SIMILAR,
}) => {
  const [query, setQuery] = useState("");

  const noResults =
    query &&
    [...friends, ...suggested, ...similar].every(
      (p) => !p.display_name.toLowerCase().includes(query.toLowerCase())
    );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 gap-4">
        <h1 className="text-5xl font-bold">Discover</h1>

        {/* Search bar */}
        <div className="relative flex items-center max-w-xs w-full">
          <Search
            className="absolute left-3 size-4 text-muted-foreground pointer-events-none"
            aria-hidden="true"
          />

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for profiles..."
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
      </div>

      {/* Profile sections */}
      {/* TODO: limit visible profiles to one row and hide overflow on smaller screens */}
      {/* TODO: improve keyboard accessibility (tab navigation, focus states, and keyboard-only interaction support) */}
      <ProfileSection
        label="Your friends"
        profiles={friends}
        query={query}
      />
      <ProfileSection
        label="Suggested for you"
        profiles={suggested}
        query={query}
      />
      <ProfileSection
        label="Similar music taste"
        profiles={similar}
        query={query}
      />

      {/* Empty state */}
      {noResults && (
        <p className="text-sm text-muted-foreground mt-4">
          No profiles found for "{query}"
        </p>
      )}
    </div>
  );
};

export default DiscoverPage;
