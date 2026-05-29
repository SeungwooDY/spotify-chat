import { Search, X, User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ProfileCard = ({ user }) => (
  <Link to={`/user/${user.id}`} className="block">
    <div className="flex flex-col items-center p-4 rounded-xl transition-colors hover:bg-muted">
      {/* Avatar centered */}
      <Avatar className="size-20">
        <AvatarImage src={user.images?.[0]?.url} alt={user.display_name} />
        <AvatarFallback className="bg-muted">
          <User className="size-6 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>

      {/* Text below, left-aligned */}
      <div className="w-full mt-2 text-left leading-tight">
        <p className="text-sm font-medium truncate">{user?.display_name}</p>
        <p className="text-xs text-muted-foreground">profile</p>
      </div>
    </div>
  </Link>
);

const ProfileSection = ({ label, profiles }) => {
  if (profiles.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-base text-muted-foreground font-normal mb-4">
        {label}
      </h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4">
        {profiles.map((user) => (
          <ProfileCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

const DiscoverPage = () => {
  const { user, token } = useAuth();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/users`, {
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`);
        const data = await res.json();
        setUsers(data.filter(u => u.id !== user?.id));
      } catch (err) {
        console.error("Error fetching users:", err.response?.data ?? err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token, user]);

  const filtered = users.filter(
    (user) =>
      user.isPublic !== false &&
      user.display_name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-none">
          Discover
        </h1>

        {/* Search bar */}
        <div className="relative flex items-center max-w-xs w-full">
          <Search className="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
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

      {/* Loading state */}
      {loading && (
        <p className="text-sm text-muted-foreground">Loading users...</p>
      )}

      {/* Profile section */}
      {!loading && (
        <>
          <ProfileSection
            label="People"
            profiles={filtered}
          />
        </>
      )}

      {/* Empty state */}
      {!loading && query && filtered.length === 0 && (
        <p>No profiles found for "{query}"</p>
      )}
    </div>
  );
};

export default DiscoverPage;
