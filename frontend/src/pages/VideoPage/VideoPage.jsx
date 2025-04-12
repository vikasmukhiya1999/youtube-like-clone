import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { API_BASE_URL } from '../../constants/api';
import { VideoPlayer } from '../../components/VideoPlayer/VideoPlayer';
import { VideoInfo } from '../../components/VideoPlayer/VideoInfo';
import { CommentSection } from '../../components/VideoPlayer/CommentSection';
import { RelatedVideos } from '../../components/VideoPlayer/RelatedVideos';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export function VideoPage() {
  const { videoId } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    const fetchVideo = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/videos/${videoId}`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : ''
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch video');
        }

        const data = await response.json();
        setVideo(data);
        setCommentCount(data.commentCount || 0);
        setError(null);
      } catch (err) {
        console.error('Error fetching video:', err);
        setError(err.message);
        setVideo(null);
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchVideo();
    }
  }, [videoId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !video) {
    return (
      <div className="p-4 text-center">
        <div className="text-red-500 text-lg mb-4">{error || 'Video not found'}</div>
        {!user && (
          <div className="text-gray-600">
            Please log in to view this video
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <VideoPlayer videoUrl={video.videoUrl} />
        <VideoInfo 
          video={video} 
          commentCount={commentCount} 
        />
        <CommentSection 
          videoId={video._id} 
          onCommentCountChange={setCommentCount}
        />
      </div>
      <div className="lg:col-span-1">
        <RelatedVideos currentVideo={video} />
      </div>
    </div>
  );
}