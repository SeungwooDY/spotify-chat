import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { User, Play } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";

const UserProfilePage = () => {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://127.0.0.1:3000/users/${id}`);
        setUser(response.data);
        setBio(response.data.bio ?? "");
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id]);

  return (
    <div className="min-h-screen bg-secondary px-6 pt-8 pb-28 text-foreground transition-colors md:px-12 lg:px-16 lg:py-12">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-16">

        {/* LEFT */}
        <section className="flex flex-col items-center">

          <Avatar className="h-36 w-36 ring-2 ring-border ring-offset-2 ring-offset-secondary">
            {!loading && (
              <AvatarImage src={user?.images?.[0]?.url} alt={user?.display_name} />
            )}
            <AvatarFallback className="bg-muted">
              {loading
                ? <div className="h-36 w-36 animate-pulse rounded-full bg-muted" />
                : <User className="h-20 w-20 text-foreground" strokeWidth={2} />
              }
            </AvatarFallback>
          </Avatar>

          <div className="mt-5 w-full max-w-65">
            {loading ? (
              <div className="space-y-2">
                <div className="h-7 w-40 animate-pulse rounded-md bg-muted" />
                <div className="h-3 w-24 animate-pulse rounded-md bg-muted" />
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-semibold text-foreground">
                  {user?.display_name}
                </h1>
                <p className="mt-1 text-xs text-muted-foreground">@{user?.id}</p>
              </>
            )}

            <label className="mt-6 block text-sm font-medium text-foreground">
              Bio
            </label>

            {loading ? (
              <div className="mt-2 h-24 w-full animate-pulse rounded-md bg-muted" />
            ) : (
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="mt-2 h-24 resize-none border-none bg-card text-sm text-card-foreground shadow-none focus-visible:ring-0"
              />
            )}

            <Link to="/inbox">
              <Button
                disabled={loading}
                className="mt-3 w-full cursor-pointer bg-primary text-xs text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                Message
              </Button>
            </Link>
          </div>

        </section>

        {/* RIGHT */}
        <section className="mx-auto flex w-full max-w-155 flex-col gap-5 lg:mx-0">

          <FeaturedCard title="Featured artists" loading={loading}>
            {user?.featured_artists?.length ? (
              <div className="flex flex-wrap justify-center gap-4 sm:justify-start">
                {user.featured_artists.map((artist) => (
                  <ArtistOption
                    key={artist.id}
                    name={artist.name}
                    image={artist.imageUrl}
                  />
                ))}
              </div>
            ) : (
              !loading && <p className="text-sm text-muted-foreground">Nothing featured yet.</p>
            )}
          </FeaturedCard>

          <FeaturedCard title="Featured songs" loading={loading}>
            {user?.featured_tracks?.length ? (
              <div className="flex flex-wrap justify-center gap-4 sm:justify-start">
                {user.featured_tracks.map((song) => (
                  <SongOption
                    key={song.id}
                    name={song.name}
                    image={song.imageUrl}
                  />
                ))}
              </div>
            ) : (
              !loading && <p className="text-sm text-muted-foreground">Nothing featured yet.</p>
            )}
          </FeaturedCard>

        </section>
      </div>
    </div>
  );
};

const FeaturedCard = ({ title, loading, children }) => {
  return (
    <Card className="w-full">
      <CardContent>
        <h2 className="mb-5 text-2xl font-semibold leading-none text-card-foreground">
          {title}
        </h2>
        {loading ? (
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="h-16 w-16 animate-pulse rounded-full bg-muted" />
                <div className="h-3 w-14 animate-pulse rounded-md bg-muted" />
              </div>
            ))}
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
};

const ArtistOption = ({ name, image }) => {
  return (
    <button className="flex w-20 flex-col items-center rounded-xl p-2 transition-colors hover:bg-muted">
      <Avatar className="h-16 w-16">
        <AvatarImage src={image} alt={name} />
        <AvatarFallback className="bg-muted">
          <User className="h-8 w-8 text-foreground" strokeWidth={2} />
        </AvatarFallback>
      </Avatar>
      <p className="mt-2 w-full text-center text-[11px] leading-tight text-foreground line-clamp-2">
        {name}
      </p>
    </button>
  );
};

const SongOption = ({ name, image }) => {
  return (
    <button className="flex w-20 flex-col items-center rounded-xl p-2 transition-colors hover:bg-muted">
      <Avatar className="h-16 w-16">
        <AvatarImage src={image} alt={name} />
        <AvatarFallback className="bg-muted">
          <Play className="ml-1 h-8 w-8 text-foreground" strokeWidth={1.75} />
        </AvatarFallback>
      </Avatar>
      <p className="mt-2 w-full text-center text-[11px] leading-tight text-foreground line-clamp-2">
        {name}
      </p>
    </button>
  );
};

export default UserProfilePage;
