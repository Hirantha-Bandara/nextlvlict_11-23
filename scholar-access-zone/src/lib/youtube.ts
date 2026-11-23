/**
 * YouTube Utility Functions
 * Safely extracts video IDs, validates URLs, and generates embed URLs.
 */

// Regular expressions to match YouTube video IDs from various formats
const YOUTUBE_REGEXES = [
  /(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})(?:&.*)?/,
  /(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})(?:\?.*)?/,
  /(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})(?:\?.*)?/,
  /(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})(?:\?.*)?/,
  /(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/live\/([a-zA-Z0-9_-]{11})(?:\?.*)?/,
  /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})(?:\?.*)?/,
  /^([a-zA-Z0-9_-]{11})$/
];

/**
 * Extracts the 11-character YouTube video ID from a given URL or ID string.
 * Returns null if the URL is invalid or the ID cannot be found.
 */
export function extractYouTubeVideoId(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  for (const regex of YOUTUBE_REGEXES) {
    const match = trimmed.match(regex);
    if (match && match[1]) {
      return match[1];
    }
  }

  // Also handle URL query parameter fallback
  try {
    const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    if (parsed.hostname.includes('youtube.com')) {
      const v = parsed.searchParams.get('v');
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) {
        return v;
      }
    }
  } catch {
    // Ignore URL parsing errors
  }

  return null;
}

/**
 * Validates if the given string is a valid YouTube URL or video ID.
 */
export function isValidYouTubeUrl(url: string | null | undefined): boolean {
  return extractYouTubeVideoId(url) !== null;
}

/**
 * Generates a safe YouTube embed URL from a URL or video ID.
 */
export function getYouTubeEmbedUrl(urlOrId: string | null | undefined, options?: { autoplay?: boolean; rel?: number }): string {
  const videoId = extractYouTubeVideoId(urlOrId);
  if (!videoId) return '';
  
  const params = new URLSearchParams();
  if (options?.autoplay) params.set('autoplay', '1');
  if (options?.rel !== undefined) params.set('rel', options.rel.toString());
  
  const query = params.toString();
  return `https://www.youtube-nocookie.com/embed/${videoId}${query ? `?${query}` : ''}`;
}

/**
 * Generates a standard YouTube watch URL.
 */
export function getYouTubeWatchUrl(urlOrId: string | null | undefined): string {
  const videoId = extractYouTubeVideoId(urlOrId);
  if (!videoId) return urlOrId || '';
  return `https://www.youtube.com/watch?v=${videoId}`;
}

/**
 * Generates the thumbnail URL for a YouTube video.
 */
export function getYouTubeThumbnailUrl(
  urlOrId: string | null | undefined,
  quality: 'default' | 'hqdefault' | 'mqdefault' | 'sddefault' | 'maxresdefault' = 'hqdefault'
): string {
  const videoId = extractYouTubeVideoId(urlOrId);
  if (!videoId) return 'https://placehold.co/640x360/1a365d/FFFFFF?text=YouTube+Video';
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}
