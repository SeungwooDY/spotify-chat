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
    <div className="min-h-screen bg-secondary px-6 pt-8 pb-28 text-foreground transition-colors md:px-12 lg:px-16 lg:py-12">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
        <section className="flex flex-col items-center">
          <Avatar className="h-30 w-30 border border-border bg-muted">
            <AvatarImage src="" alt="profile" />
            <AvatarFallback className="bg-muted">
              <User className="h-16 w-16 text-foreground" strokeWidth={2.5} />
            </AvatarFallback>
          </Avatar>

          <Button
            variant="outline"
            size="sm"
            className="mt-3 border-primary text-xs text-primary hover:bg-accent hover:text-accent-foreground"
          >
            Edit Photo
          </Button>

          <div className="mt-6 w-full max-w-65">
            <h1 className="text-2xl font-semibold text-foreground">
              {mockUser.name}
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">{mockUser.username}</p>

            <label className="mt-6 block text-sm font-medium text-foreground">
              Bio
            </label>

            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mt-2 h-24 resize-none border-none bg-card text-sm text-card-foreground shadow-none focus-visible:ring-0"
            />

            <div className="mt-6 flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
              <div>
                <p className="text-sm font-medium text-card-foreground">
                  Public Profile
                </p>
                <p className="text-xs text-muted-foreground">Visible on Discover</p>
              </div>
              <Switch checked={isPublic} onCheckedChange={setIsPublic} />
            </div>
          </div>
        </section>

        <section className="mx-auto flex w-full max-w-155 flex-col gap-5 lg:mx-0">
          <FeaturedCard
            title="Featured artists"
            subtitle="Pick from your top artists"
            buttonLabels={["View top artists"]}
          >
            <div className="mx-auto grid w-fit grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4">
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
            <div className="mx-auto grid w-fit grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4">
              {topSongs.map((song) => (
                <SongOption
                  key={song.id}
                  name={song.name}
                  selected={song.selected}
                />
              ))}
            </div>
          </FeaturedCard>

          <Button className="self-end bg-primary text-xs text-primary-foreground hover:bg-primary/90">
            Save Changes
          </Button>
        </section>
      </div>
    </div>
  );
};

const FeaturedCard = ({ title, subtitle, buttonLabels, children }) => {
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
            {buttonLabels.map((label) => (
              <Button
                key={label}
                size="sm"
                className="rounded-full bg-primary text-xs text-primary-foreground hover:bg-primary/90"
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
    <button className="flex w-20 flex-col items-center">
      <div className="relative">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full border border-border bg-muted ${
            selected ? "ring-4 ring-primary" : ""
          }`}
        >
          <User className="h-7 w-7 text-foreground" strokeWidth={2.5} />
        </div>

        {selected && <SelectionCheck />}
      </div>

      <p className="mt-2 text-center text-[11px] leading-tight text-foreground">
        {name}
      </p>
    </button>
  );
};

const SongOption = ({ name, selected }) => {
  return (
    <button className="flex w-20 flex-col items-center">
      <div className="relative">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full border border-border bg-muted ${
            selected ? "ring-4 ring-primary" : ""
          }`}
        >
          <Play className="ml-1 h-7 w-7 text-foreground" strokeWidth={1.75} />
        </div>

        {selected && <SelectionCheck />}
      </div>

      <p className="mt-2 text-center text-[11px] leading-tight text-foreground">
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
