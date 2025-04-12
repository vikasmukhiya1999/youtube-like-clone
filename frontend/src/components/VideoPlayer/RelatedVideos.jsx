import { useState, useEffect } from 'react';
import { VideoCard } from '../VideoGrid/VideoCard';
import { API_BASE_URL } from '../../constants/api';
import { LoadingSpinner } from '../common/LoadingSpinner';

export function RelatedVideos({ currentVideo }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatedVideos = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          category: currentVideo.category,
          limit: 10
        });

        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/videos/search?${queryParams}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch related videos');
        
        const data = await response.json();
        // Filter out the current video and limit to 10 videos
        const filteredVideos = data.videos
          .filter(video => video._id !== currentVideo._id)
          .slice(0, 10);
          
        setVideos(filteredVideos);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentVideo) {
      fetchRelatedVideos();
    }
  }, [currentVideo]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        {error}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No related videos found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {videos.map(video => (
        <div key={video._id} className="w-full">
          <VideoCard video={video} />
        </div>
      ))}
    </div>
  );
}