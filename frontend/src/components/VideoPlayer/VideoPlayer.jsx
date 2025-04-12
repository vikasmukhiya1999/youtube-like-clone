import { useEffect, useRef } from 'react';

export function VideoPlayer({ videoUrl }) {
  const iframeRef = useRef(null);

  // Convert YouTube watch URL to embed URL
  const getEmbedUrl = (url) => {
    const videoId = url.includes('youtu.be') 
      ? url.split('youtu.be/')[1]?.split('?')[0]
      : url.split('v=')[1]?.split('&')[0];

    if (!videoId) return url;
    
    // Add parameters to reduce console noise and improve privacy
    const params = new URLSearchParams({
      autoplay: '1',
      rel: '0',
      modestbranding: '1',
      enablejsapi: '0',
      origin: window.location.origin,
      widget_referrer: window.location.origin,
      controls: '1',
      color: 'red',
      hl: 'en',
      mute: '0'
    });

    return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
  };

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.source !== iframeRef.current?.contentWindow) return;
      // Silently handle YouTube player messages
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-lg">
      <iframe
        ref={iframeRef}
        src={getEmbedUrl(videoUrl)}
        title="Video player"
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        sandbox="allow-same-origin allow-scripts allow-forms allow-presentation"
      />
    </div>
  );
}