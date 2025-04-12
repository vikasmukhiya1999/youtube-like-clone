import { useNavigate } from 'react-router-dom';

export function VideoCard({ video }) {
  const { _id, title, thumbnail, channel, views, createdAt } = video;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/video/${_id}`);
  };

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

  return (
    <div 
      onClick={handleClick}
      className="flex flex-col cursor-pointer group"
    >
      <div className="relative aspect-video rounded-xl overflow-hidden">
        <img 
          src={thumbnail} 
          alt={title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
        />
      </div>
      <div className="mt-2">
        <h3 className="font-medium text-sm line-clamp-2 mb-1">
          {title}
        </h3>
        <p className="text-sm text-gray-600">
          {channel.name}
        </p>
        <div className="text-sm text-gray-600 flex items-center space-x-1">
          <span>{views.toLocaleString()} views</span>
          <span>•</span>
          <span>{formatTimeAgo(createdAt)}</span>
        </div>
      </div>
    </div>
  );
}