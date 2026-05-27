export async function getTopTracks(timeRange, limit) {
    const res = await fetch(`http://127.0.0.1:3000/api/top-tracks?time_range=${timeRange}&limit=${limit}`, {
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch top tracks');
    return res.json();
}