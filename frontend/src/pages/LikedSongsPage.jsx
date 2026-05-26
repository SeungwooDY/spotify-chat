import "../styling/LikedSongs.css";

const LikedSongsPage = () => {
  return (
    <>
      <section className="page-content">
        <div className="page-title">Liked Songs</div>

        <div className="song-container">
          <div className="song-row-container">
            <h3>Genre: xxx</h3>
            <div className="song-row">
              <div className="song-card"> Song </div>
              <div className="song-card"> Song </div>
              <div className="song-card"> Song </div>
            </div>
          </div>

          <div className="song-row-container">
            <h3>Genre: xxx</h3>
            <div className="song-row">

            </div>
          </div>

          <div className="song-row-container">
            <h3>Genre: xxx</h3>
            <div className="song-row">

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default LikedSongsPage;