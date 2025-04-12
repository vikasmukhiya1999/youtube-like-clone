import { useState, useEffect } from 'react';
import { useSearch } from '../../hooks/useSearch';
import { API_BASE_URL } from '../../constants/api';
import { VideoCard } from './VideoCard';
import { LoadingSpinner } from '../common/LoadingSpinner';

export function VideoGrid() {
  const { searchQuery, selectedCategory, isLoading: searchLoading, error: searchError } = useSearch();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (searchQuery) queryParams.append('search', searchQuery);
        if (selectedCategory && selectedCategory !== 'All') {
          queryParams.append('category', selectedCategory);
        }

        const response = await fetch(`${API_BASE_URL}/videos/search?${queryParams}`);
        if (!response.ok) throw new Error('Failed to fetch videos');
        
        const data = await response.json();
        setVideos(data.videos);
        setError(null);
      } catch (err) {
        setError(err.message);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [searchQuery, selectedCategory]);

  if (loading || searchLoading) {
    return <LoadingSpinner />;
  }

  if (error || searchError) {
    return (
      <div className="flex items-center justify-center p-8 text-red-500">
        {error || searchError}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {videos.map(video => (
        <VideoCard key={video._id} video={video} />
      ))}
      {videos.length === 0 && (
        <div className="col-span-full text-center py-10 text-gray-500">
          {searchQuery 
            ? `No videos found for "${searchQuery}" in ${selectedCategory}` 
            : `No videos found in ${selectedCategory}`}
        </div>
      )}
    </div>
  );
}