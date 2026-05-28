import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { User, Play, Check } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";

const mockBio = "I like EDM and pop music!";

const topArtists = [
  { id: 1, name: "Artist Name", selected: true },
  { id: 2, name: "Artist Name", selected: true },
  { id: 3, name: "Artist Name", selected: false },
  { id: 4, name: "Artist Name", selected: false },
];

const topSongs = [
  { id: 1, name: "Song Name", selected: true },
  { id: 2, name: "Song Name", selected: true },
  { id: 3, name: "Song Name", selected: false },
  { id: 4, name: "Song Name", selected: false },
];

const UserProfilePage = () => {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [bio, setBio] = useState(mockBio);
  const [loading, setLoading] = useState(true);

  // fetch specific user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`http://127.0.0.1:3000/users/${id}`);

        setUser(response.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary px-6 pt-8 pb-28 text-foreground transition-colors md:px-12 lg:px-16 lg:py-12">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-16">

        {/* LEFT */}
        <section className="flex flex-col items-center">

          <Avatar className="h-30 w-30 border border-border bg-muted">
            <AvatarImage src={user.images?.[0]?.url} alt={user.display_name} />
            <AvatarFallback className="bg-muted">
              <User className="h-16 w-16 text-foreground" strokeWidth={2.5} />
            </AvatarFallback>
          </Avatar>

          <div className="mt-4 w-full max-w-65">
            <h1 className="text-2xl font-semibold text-foreground">
              {user?.display_name}
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">@{user.id}</p>

            <label className="mt-6 block text-sm font-medium text-foreground">
              Bio
            </label>

            <Textarea
              value={user.bio}
              onChange={(e) => setBio(e.target.value)}
              className="mt-2 h-24 resize-none border-none bg-card text-sm text-card-foreground shadow-none focus-visible:ring-0"
            />
          </div>

          <div className="mt-4 flex">
            <Link to="/inbox" className="flex-1">
              <Button className="w-full cursor-pointer bg-primary text-xs text-primary-foreground hover:bg-primary/90">
                Message
              </Button>
            </Link>
          </div>
        </section>

        {/* RIGHT */}
        <section className="mx-auto flex w-full max-w-155 flex-col gap-5 lg:mx-0">

          <FeaturedCard
            title="Featured artists"
          >
            <div className="mx-auto grid w-fit grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4 ">
              {user.featured_artists.map((artist) => (
                <ArtistOption
                  key={artist.id}
                  name={artist.name}
                  image={artist.imageUrl}
                />
              ))}
            </div>
          </FeaturedCard>

          <FeaturedCard
            title="Featured songs"
          >
            <div className="mx-auto grid w-fit grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4">
              {user.featured_tracks.map((song) => (
                <SongOption
                  key={song.id}
                  name={song.name}
                  image={song.imageUrl}
                />
              ))}
            </div>
          </FeaturedCard>

        </section>
      </div>
    </div>
  );
};

const FeaturedCard = ({ title, children }) => {
  return (
    <Card className="w-full">
      <CardContent>
        <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold leading-none text-card-foreground">
              {title}
            </h2>
          </div>
        </div>
        {children}
      </CardContent>
    </Card>
  );
};

const ArtistOption = ({ name, image, selected }) => {
  return (
    <button className="flex w-25 flex-col items-center p-2 hover:bg-muted rounded-xl">
      <div className="relative">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-muted">
          <Avatar className="h-12 w-12 text-foreground">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback className="bg-muted">
              <User className="h-7 w-7 text-foreground" strokeWidth={2.5} />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <p className="mt-2 text-center text-[11px] leading-tight text-foreground">
        {name}
      </p>
    </button>
  );
};

const SongOption = ({ name, image, selected }) => {
  return (
    <button className="flex w-25 flex-col items-center p-2 hover:bg-muted rounded-xl">
      <div className="relative">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-muted">
          <Avatar className="h-12 w-12 text-foreground">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback className="bg-muted">
              <Play className="ml-1 h-7 w-7 text-foreground" strokeWidth={1.75} />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <p className="mt-2 text-center text-[11px] leading-tight text-foreground">
        {name}
      </p>
    </button>
  );
};

export default UserProfilePage;
