import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpIconSolid, HandThumbDownIcon as HandThumbDownIconSolid } from '@heroicons/react/24/solid';
import { API_BASE_URL } from '../../constants/api';

export function VideoInfo({ video, commentCount }) {
  const { user } = useAuth();
  const [likes, setLikes] = useState(video.likes ? video.likes.length : 0);
  const [dislikes, setDislikes] = useState(video.dislikes ? video.dislikes.length : 0);
  const [isLiked, setIsLiked] = useState(video.likes ? video.likes.includes(video.currentUser) : false);
  const [isDisliked, setIsDisliked] = useState(video.dislikes ? video.dislikes.includes(video.currentUser) : false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval} year${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval} month${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} hour${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval} minute${interval === 1 ? '' : 's'} ago`;
    
    return 'Just now';
  };

  const handleLike = async () => {
    if (!user) {
      setError('Please log in to like videos');
      return;
    }

    if (isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/videos/${video._id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to like video');
      }

      const data = await response.json();
      setLikes(data.likes);
      setDislikes(data.dislikes);
      setIsLiked(!isLiked);
      if (isDisliked) setIsDisliked(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDislike = async () => {
    if (!user) {
      setError('Please log in to dislike videos');
      return;
    }

    if (isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/videos/${video._id}/dislike`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to dislike video');
      }

      const data = await response.json();
      setLikes(data.likes);
      setDislikes(data.dislikes);
      setIsDisliked(!isDisliked);
      if (isLiked) setIsLiked(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <h1 className="text-xl font-bold mb-2">{video.title}</h1>
      <div className="flex items-center justify-between mb-4">
        <Link to={`/channel/${video.channel._id}`} className="flex items-center">
          <img 
            src={video.channel.avatar} 
            alt={video.channel.name}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <h2 className="font-medium">{video.channel.name}</h2>
            <p className="text-sm text-gray-500">
              {video.channel.subscriberCount.toLocaleString()} subscribers
            </p>
          </div>
        </Link>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            disabled={isLoading}
            className={`flex items-center space-x-1 hover:bg-gray-100 px-3 py-2 rounded-full ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title={user ? 'Like video' : 'Log in to like video'}
          >
            {isLiked ? (
              <HandThumbUpIconSolid className="h-6 w-6" />
            ) : (
              <HandThumbUpIcon className="h-6 w-6" />
            )}
            <span>{likes.toLocaleString()}</span>
          </button>
          <button
            onClick={handleDislike}
            disabled={isLoading}
            className={`flex items-center space-x-1 hover:bg-gray-100 px-3 py-2 rounded-full ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title={user ? 'Dislike video' : 'Log in to dislike video'}
          >
            {isDisliked ? (
              <HandThumbDownIconSolid className="h-6 w-6" />
            ) : (
              <HandThumbDownIcon className="h-6 w-6" />
            )}
            <span>{dislikes.toLocaleString()}</span>
          </button>
        </div>
      </div>
      <div className="bg-gray-100 rounded-xl p-4">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span>{video.views.toLocaleString()} views</span>
          <span className="mx-1">•</span>
          <span>{formatTimeAgo(video.createdAt)}</span>
        </div>
        {error && (
          <div className="text-red-500 text-sm mb-2">{error}</div>
        )}
        <p className="text-sm whitespace-pre-line">{video.description}</p>
      </div>
    </div>
  );
}