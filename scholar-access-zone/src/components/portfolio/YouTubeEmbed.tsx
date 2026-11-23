import React from 'react';
import { getYouTubeEmbedUrl, extractYouTubeVideoId } from '@/lib/youtube';

interface YouTubeEmbedProps {
  youtubeUrl: string;
  title: string;
  className?: string;
  aspectRatio?: '16/9' | '4/3';
}

export const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
  youtubeUrl,
  title,
  className = '',
  aspectRatio = '16/9'
}) => {
  const videoId = extractYouTubeVideoId(youtubeUrl);
  const embedUrl = getYouTubeEmbedUrl(youtubeUrl);

  if (!videoId || !embedUrl) {
    return (
      <div className={`relative w-full aspect-video bg-slate-900 flex items-center justify-center text-slate-400 rounded-t-lg overflow-hidden ${className}`}>
        <div className="text-center p-4">
          <i className="fab fa-youtube text-4xl text-red-500 mb-2 block"></i>
          <span className="text-sm">Video unavailable</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden bg-black rounded-t-lg ${className}`} style={{ aspectRatio }}>
      <iframe
        src={embedUrl}
        title={title}
        className="w-full h-full border-0 absolute top-0 left-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
};

export default YouTubeEmbed;
