import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { API_BASE_URL } from '../../constants/api';

export function CommentSection({ videoId, onCommentCountChange }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchComments = useCallback(async (pageNumber = 1) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/comments/video/${videoId}?page=${pageNumber}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch comments');
      
      const data = await response.json();
      if (pageNumber === 1) {
        setComments(data.comments);
      } else {
        setComments(prev => [...prev, ...data.comments]);
      }
      setHasMore(pageNumber < data.totalPages);
      onCommentCountChange(data.totalComments || data.comments.length);
    } catch (err) {
      setError('Failed to load comments');
    }
  }, [videoId, onCommentCountChange]);

  useEffect(() => {
    fetchComments(1);
  }, [fetchComments]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          content: newComment.trim(),
          videoId
        })
      });

      if (!response.ok) throw new Error('Failed to add comment');

      const comment = await response.json();
      setComments(prev => [comment, ...prev]);
      setNewComment('');
      onCommentCountChange(prev => prev + 1);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (!editContent.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: editContent.trim() })
      });

      if (!response.ok) throw new Error('Failed to update comment');

      const updatedComment = await response.json();
      setComments(prev => prev.map(comment => 
        comment._id === commentId ? updatedComment : comment
      ));
      setEditingCommentId(null);
      setEditContent('');
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete comment');

      setComments(prev => prev.filter(comment => comment._id !== commentId));
      onCommentCountChange(prev => prev - 1);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreComments = () => {
    if (!hasMore || isLoading) return;
    setPage(prev => prev + 1);
    fetchComments(page + 1);
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
    <div className="mt-6">
      {error && (
        <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
      )}
      
      <div className="mb-6">
        <form onSubmit={handleAddComment}>
          <div className="flex items-start space-x-4">
            <img
              src={user?.profilePicture}
              alt={user?.username}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full min-h-[80px] p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                disabled={isLoading}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!newComment.trim() || isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Comment
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        {comments.map(comment => (
          <div key={comment._id} className="flex space-x-4">
            <img
              src={comment.user.profilePicture}
              alt={comment.user.username}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium">{comment.user.username}</h3>
                <span className="text-sm text-gray-500">
                  {formatTimeAgo(comment.createdAt)}
                </span>
              </div>
              
              {editingCommentId === comment._id ? (
                <div>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full min-h-[60px] p-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    disabled={isLoading}
                  />
                  <div className="flex justify-end space-x-2 mt-2">
                    <button
                      onClick={() => {
                        setEditingCommentId(null);
                        setEditContent('');
                      }}
                      className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-full"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdateComment(comment._id)}
                      disabled={!editContent.trim() || isLoading}
                      className="px-3 py-1 text-sm text-white bg-red-600 rounded-full hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-1">{comment.content}</p>
              )}

              {user?._id === comment.user._id && !editingCommentId && (
                <div className="flex items-center space-x-2 mt-2">
                  <button
                    onClick={() => {
                      setEditingCommentId(comment._id);
                      setEditContent(comment.content);
                    }}
                    disabled={isLoading}
                    className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    disabled={isLoading}
                    className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {hasMore && (
          <div className="text-center">
            <button
              onClick={loadMoreComments}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Load more comments
            </button>
          </div>
        )}
      </div>
    </div>
  );
}