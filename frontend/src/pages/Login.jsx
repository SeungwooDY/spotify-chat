import { Headphones, Music2 } from "lucide-react";

const BACKEND_URI = 'http://127.0.0.1:3000';

export default function Login() {
  const handleLogin = () => {
    window.location.href = `${BACKEND_URI}/login`;
  };

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-6 sm:px-10 lg:px-16">
        <header className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Headphones className="size-5" aria-hidden="true" />
          </div>
          <span className="text-lg font-semibold">ECHO</span>
        </header>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-2xl text-center">
            <div className="mx-auto flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Music2 className="size-5" aria-hidden="true" />
            </div>
            <p className="mt-6 text-sm font-medium text-muted-foreground">
              Music, profiles, and conversations in one place.
            </p>

            <h1 className="mt-3 text-6xl font-bold leading-none text-foreground sm:text-7xl lg:text-8xl">
              ECHO
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Connect with Spotify to see your top artists, share your listening
              identity, and discover people through the music you already love.
            </p>

            <div className="mx-auto mt-8 flex max-w-sm flex-col gap-3">
              <button
                type="button"
                onClick={handleLogin}
                className="inline-flex h-12 items-center justify-center gap-3 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Music2 className="size-5" aria-hidden="true" />
                Continue with Spotify
              </button>

              <p className="text-xs leading-5 text-muted-foreground">
                You will be redirected to Spotify to securely sign in.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
