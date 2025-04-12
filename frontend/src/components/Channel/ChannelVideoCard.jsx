import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { API_BASE_URL } from '../../constants/api';

export function ChannelVideoCard({ video, isOwner, onDelete, onEdit }) {
  const { id, title, thumbnail, views, timestamp } = video;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClick = () => {
    navigate(`/video/${id}`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/videos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        onDelete(id);
      } else {
        setError('Failed to delete video');
      }
    } catch (err) {
      setError('Failed to delete video');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(video);
  };

  return (
    <div 
      onClick={handleClick}
      className="flex flex-col cursor-pointer group relative"
    >
      <div className="relative aspect-video rounded-xl overflow-hidden">
        <img 
          src={thumbnail} 
          alt={title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
        />
        {isOwner && (
          <div className="absolute top-2 right-2 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleEdit}
              disabled={isLoading}
              className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      <div className="mt-2">
        <h3 className="font-medium text-sm line-clamp-2 mb-1">
          {title}
        </h3>
        <div className="text-sm text-gray-600 flex items-center space-x-1">
          <span>{views} views</span>
          <span>•</span>
          <span>{timestamp}</span>
        </div>
        {error && (
          <p className="text-sm text-red-500 mt-1">{error}</p>
        )}
      </div>
    </div>
  );
}