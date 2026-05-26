import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

import db from "@/firebase";

import { User, Play, Check } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";

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
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(true);

  // ---------------- FETCH USER ----------------
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const ref = doc(db, "users", id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();

          setUser({
            id: id,
            displayName: data.displayName,
            profileImage: data.profileImage,
          });
        } else {
          setUser({
            id: "User not found",
            displayName: "User not found",
            profileImage: "",
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F2EA] px-6 pt-8 pb-28 md:px-12 lg:px-16 lg:py-12">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-16">

        {/* LEFT */}
        <section className="flex flex-col items-center">

          <Avatar className="h-30 w-30 border border-[#202124] bg-[#D9D9D9]">
            <AvatarImage src={user?.profileImage} />
            <AvatarFallback className="bg-[#D9D9D9]">
              <User className="h-16 w-16 text-[#202124]" strokeWidth={2.5} />
            </AvatarFallback>
          </Avatar>

          <div className="mt-4 w-full max-w-65">
            <h1 className="text-2xl font-semibold text-[#0F1F2F]">
              {user?.displayName}
            </h1>
            <p className="mt-1 text-xs text-[#5F6368]">@{user.id}</p>

            <label className="mt-6 block text-sm font-medium text-[#0F1F2F]">
              Bio
            </label>

            <Textarea
              value={bio}
              className="mt-2 h-24 resize-none border-none bg-white text-sm text-[#0F1F2F] shadow-none focus-visible:ring-0"
            />
          </div>

<div className="mt-4 flex">
  <Link to="/inbox" className="flex-1">
    <Button className="w-full bg-[#4B8DB3] text-xs text-white hover:bg-[#4B8DB3]/90 cursor-pointer">
      Message
    </Button>
  </Link>
</div>
        </section>

        {/* RIGHT (MOCK ONLY) */}
        <section className="mx-auto flex w-full max-w-155 flex-col gap-5 lg:mx-0">

          <FeaturedCard
            title="Featured artists"
            buttonLabels={["View top artists"]}
          >
            <div className="mx-auto grid w-fit grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4 ">
              {topArtists.map((artist) => (
                <ArtistOption
                  key={artist.id}
                  name={artist.name}
                />
              ))}
            </div>
          </FeaturedCard>

          <FeaturedCard
            title="Featured songs"
            buttonLabels={["View top songs", "View liked songs"]}
          >
            <div className="mx-auto grid w-fit grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4">
              {topSongs.map((song) => (
                <SongOption
                  key={song.id}
                  name={song.name}
                />
              ))}
            </div>
          </FeaturedCard>

        </section>
      </div>
    </div>
  );
};

const FeaturedCard = ({ title, subtitle, buttonLabels, children }) => {
  return (
    <Card className="w-full">
      <CardContent>
        <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold leading-none text-[#0F1F2F]">
              {title}
            </h2>
            <p className="mt-2 text-sm text-[#5F6368]">{subtitle}</p>
          </div>

          <div className="flex flex-wrap justify-start gap-2 sm:justify-end">
            {buttonLabels.map((label) => (
              <Button
                key={label}
                size="sm"
                className="rounded-full bg-[#4B8DB3] text-xs text-white hover:bg-[#4B8DB3]/90 cursor-pointer"
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

const ArtistOption = ({ name, selected }) => {
  return (
    <button className="flex w-25 flex-col items-center p-2 cursor-pointer hover:bg-muted rounded-xl">
      <div className="relative">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full border border-[#202124] bg-[#D9D9D9] ${
            selected ? "ring-4 ring-[#4B8DB3]" : ""
          }`}
        >
          <User className="h-7 w-7 text-[#202124]" strokeWidth={2.5} />
        </div>

        {selected && <SelectionCheck />}
      </div>

      <p className="mt-2 text-center text-[11px] leading-tight text-[#0F1F2F]">
        {name}
      </p>
    </button>
  );
};

const SongOption = ({ name, selected }) => {
  return (
    <button className="flex w-25 flex-col items-center p-2 cursor-pointer hover:bg-muted rounded-xl">
      <div className="relative">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full border border-[#202124] bg-[#D9D9D9] ${
            selected ? "ring-4 ring-[#4B8DB3]" : ""
          }`}
        >
          <Play className="ml-1 h-7 w-7 text-[#202124]" strokeWidth={1.75} />
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

export default UserProfilePage;
