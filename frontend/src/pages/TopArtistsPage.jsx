import { User } from "lucide-react";
import { useSpotifyData } from "@/context/SpotifyDataContext";

const DUMMY_ARTISTS = Array.from({ length: 9 }, (_, index) => ({
  id: `dummy-${index + 1}`,
  name: `Artist ${index + 1}`,
  imageUrl: null,
  spotifyUrl: null,
}));

const TopArtistsPage = () => {
  const { artists: allArtists } = useSpotifyData();
  const currentArtists = allArtists.medium_term;
  const artists = currentArtists.length > 0 ? currentArtists : DUMMY_ARTISTS;

  return (
    <section className="flex min-h-screen flex-col bg-background px-5 pb-24 pt-4 text-foreground transition-colors md:px-6 md:pb-12">
      <h1 className="mb-6 text-5xl font-bold leading-none md:text-[46px]">
        Top Artists
      </h1>

      <div className="grid w-full flex-1 grid-cols-1 content-start justify-items-center gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-16 xl:gap-x-24">
        {artists.map((artist, index) => {
          const artistContent = (
            <>
              <div className="flex h-20 w-32 items-center justify-start gap-3">
                <span className="w-7 text-right text-3xl font-bold leading-none">
                  {index + 1}
                </span>

                <div className="flex h-[76px] w-[76px] items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
                  {artist.imageUrl ? (
                    <img
                      src={artist.imageUrl}
                      alt={artist.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User
                      className="h-10 w-10 text-foreground"
                      strokeWidth={2.5}
                    />
                  )}
                </div>
              </div>

              <div className="mt-2 ml-10 leading-tight">
                <p className="text-sm font-medium">{artist.name}</p>
                <p className="text-xs">artist</p>
              </div>
            </>
          );

          return artist.spotifyUrl ? (
            <a
              key={artist.id}
              href={artist.spotifyUrl}
              target="_blank"
              rel="noreferrer"
              className="block w-fit text-foreground no-underline"
            >
              {artistContent}
            </a>
          ) : (
            <article key={artist.id} className="w-fit">
              {artistContent}
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default TopArtistsPage;
