import { useState, useCallback, useEffect } from 'react';
import { Bars3Icon, MagnifyingGlassIcon, BellIcon, UserCircleIcon, XMarkIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSearch } from '../../hooks/useSearch';
import { API_BASE_URL } from '../../constants/api';
import { debounce } from 'lodash';

export function Header({ onMenuClick }) {
  const { user, logout, error: authError, clearError } = useAuth();
  const { setSearchQuery, isLoading, error: searchError, clearError: clearSearchError } = useSearch();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [userHasChannel, setUserHasChannel] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const checkUserChannel = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const userData = await response.json();
        setUserHasChannel(userData.channels && userData.channels.length > 0);
      } catch (err) {
        console.error('Failed to check user channel:', err);
      }
    };

    checkUserChannel();
  }, [user]);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchQuery(value);
    }, 300),
    []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };

  const handleClearSearch = () => {
    setInputValue('');
    setSearchQuery('');
    clearSearchError();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(inputValue);
    setIsSearchOpen(false);
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    clearError();
  };

  const handleCreateChannel = () => {
    navigate('/channel/create');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white flex items-center justify-between h-14 z-50">
      <div className={`flex items-center ${isSearchOpen ? 'hidden md:flex' : 'px-4'}`}>
        <button 
          onClick={onMenuClick} 
          className="p-2 hover:bg-gray-100 rounded-full"
          aria-label="Toggle menu"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        <Link to="/" className="ml-4">
          <img src="/youtube.svg" alt="YouTube" className="h-5" />
        </Link>
      </div>

      {/* Mobile Search Button */}
      <button
        onClick={() => setIsSearchOpen(true)}
        className="md:hidden p-2 hover:bg-gray-100 rounded-full ml-auto mr-2"
        aria-label="Open Search"
      >
        <MagnifyingGlassIcon className="h-6 w-6" />
      </button>

      {/* Search Form */}
      <form 
        onSubmit={handleSearch} 
        className={`${
          isSearchOpen
            ? 'absolute inset-x-0 px-4 flex bg-white h-full items-center'
            : 'hidden md:flex'
        } flex-1 max-w-2xl mx-4`}
      >
        {isSearchOpen && (
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="mr-2 p-2 hover:bg-gray-100 rounded-full"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        )}
        <div className="flex flex-1">
          <div className="flex flex-1 items-center border border-gray-300 rounded-l-full px-4">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Search"
              className="w-full py-2 outline-none text-sm"
              disabled={isLoading}
            />
            {inputValue && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            )}
          </div>
          <button 
            type="submit"
            disabled={isLoading}
            className={`px-6 border border-l-0 border-gray-300 rounded-r-full ${
              isLoading 
                ? 'bg-gray-50 cursor-not-allowed' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            aria-label="Search"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>
        </div>
      </form>

      <div className={`flex items-center space-x-2 ${isSearchOpen ? 'hidden md:flex' : 'px-4'}`}>
        {authError && (
          <div className="hidden md:block text-red-500 text-sm mr-2">{authError}</div>
        )}
        
        {user && !userHasChannel && (
          <button
            onClick={handleCreateChannel}
            className="hidden md:flex items-center space-x-2 text-white bg-red-600 rounded-full px-4 py-1 hover:bg-red-700"
          >
            <VideoCameraIcon className="h-5 w-5" />
            <span>Create Channel</span>
          </button>
        )}

        {user ? (
          <>
            <button 
              className="p-2 hover:bg-gray-100 rounded-full hidden md:block"
              aria-label="Notifications"
            >
              <BellIcon className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium hidden md:block">{user.username}</span>
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-gray-100 rounded-full group relative"
                aria-label="Logout"
              >
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.username}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <UserCircleIcon className="h-6 w-6" />
                )}
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {user.username ? `Logout (${user.username})` : 'Logout'}
                </span>
              </button>
            </div>
          </>
        ) : (
          <Link 
            to="/login"
            className="flex items-center space-x-2 text-blue-600 border border-blue-600 rounded-full px-4 py-1 hover:bg-blue-50"
          >
            <UserCircleIcon className="h-6 w-6" />
            <span className="hidden md:inline">Sign in</span>
          </Link>
        )}
      </div>
    </header>
  );
}