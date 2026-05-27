import { getTopTracks } from '../../utils/tracks';

const TopSongsPage = () => {

  const fetchData = async () => {
    const data = await getTopTracks('short_term', 10);
  }
  
  useEffect(() => {
    fetchData();
  }, [])
  
  return (
    <>
      Top Songs Page
      <div>{data}</div>
    </>
  );
}
export default TopSongsPage;