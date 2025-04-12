import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { VideoGrid } from '../../components/VideoGrid/VideoGrid';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export function ChannelPage() {
  const { channelId } = useParams();
  const { user } = useAuth();
  const [channel, setChannel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const isOwner = user?.id === channel?.owner;

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/channels/${channelId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setChannel(data);
        } else {
          setError('Failed to load channel');
        }
      } catch (err) {
        setError('Failed to load channel');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChannel();
  }, [channelId]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !channel) {
    return (
      <div className="p-4 text-center text-red-500">
        {error || 'Channel not found'}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="relative h-48 md:h-64 rounded-lg overflow-hidden mb-6">
        <img
          src={channel.channelBanner}
          alt={channel.channelName}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex items-start gap-6 mb-8">
        <img
          src={channel.avatar}
          alt={channel.channelName}
          className="w-24 h-24 rounded-full"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{channel.channelName}</h1>
          <p className="text-gray-600 mb-2">{channel.subscribers.toLocaleString()} subscribers</p>
          <p className="text-gray-700">{channel.description}</p>
        </div>
        {isOwner && (
          <button
            onClick={() => {/* Handle edit channel */}}
            className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Edit Channel
          </button>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Videos</h2>
        <VideoGrid channelId={channelId} isOwner={isOwner} />
      </div>
    </div>
  );
}