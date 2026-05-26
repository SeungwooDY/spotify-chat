import { useState } from "react";
import { User, Play, Check } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";

const mockUser = {
  name: "Johnathan S.",
  username: "@johnathanwhatever",
  bio: "I like EDM and pop music!",
  publicProfile: true,
};

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

const ProfilePage = () => {
  const [bio, setBio] = useState(mockUser.bio);
  const [isPublic, setIsPublic] = useState(mockUser.publicProfile);

  return (
    <div className="min-h-screen bg-[#F4F2EA] px-6 pt-8 pb-28 md:px-12 lg:px-16 lg:py-12">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_1.25fr] md:gap-16">
        <section className="flex flex-col items-center">
          <Avatar className="h-30 w-30 border border-[#202124] bg-[#D9D9D9]">
            <AvatarImage src="" alt="profile" />
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

          <div className="mt-6 w-full max-w-[260px]">
            <h1 className="text-2xl font-semibold text-[#0F1F2F]">
              {mockUser.name}
            </h1>
            <p className="mt-1 text-xs text-[#5F6368]">{mockUser.username}</p>

            <label className="mt-6 block text-sm font-medium text-[#0F1F2F]">
              Bio
            </label>

            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
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
        <section className="flex flex-col gap-5">
          <FeaturedCard
            title="Featured artists"
            subtitle="Pick from your top artists"
            buttonLabels={["View top artists"]}
          >
            <div className="grid grid-cols-4 gap-5">
              {topArtists.map((artist) => (
                <ArtistOption
                  key={artist.id}
                  name={artist.name}
                  selected={artist.selected}
                />
              ))}
            </div>
          </FeaturedCard>

          <FeaturedCard
            title="Featured songs"
            subtitle="Pick from your top songs"
            buttonLabels={["View top songs", "View liked songs"]}
          >
            <div className="grid grid-cols-4 gap-5">
              {topSongs.map((song) => (
                <SongOption
                  key={song.id}
                  name={song.name}
                  selected={song.selected}
                />
              ))}
            </div>
          </FeaturedCard>

          <Button className="ml-auto mt-2 bg-[#4B8DB3] text-xs text-white hover:bg-[#4B8DB3]/90">
            Save Changes
          </Button>
        </section>
      </div>
    </div>
  );
};

const FeaturedCard = ({ title, subtitle, buttonLabels, children }) => {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold leading-none text-[#0F1F2F]">
              {title}
            </h2>
            <p className="mt-2 text-sm text-[#5F6368]">{subtitle}</p>
          </div>

          <div className="flex flex-col gap-2">
            {buttonLabels.map((label) => (
              <Button
                key={label}
                size="sm"
                className="rounded-full bg-[#4B8DB3] text-xs text-white hover:bg-[#4B8DB3]/90"
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
    <button className="flex flex-col items-center">
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
    <button className="flex flex-col items-center">
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
export default ProfilePage;
