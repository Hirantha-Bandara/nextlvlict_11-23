
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

const extractYoutubeId = (url: string): string | null => {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/|youtube\.com\/live\/)([^#\&\?\n]*)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
};

const VideoPlayer = ({ videoUrl, title, isOpen, onClose }: VideoPlayerProps) => {
  if (!isOpen) return null;
  
  const youtubeId = extractYoutubeId(videoUrl);
  
  if (!youtubeId) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] p-0">
          <DialogHeader className="p-4 flex flex-row justify-between items-center">
            <DialogTitle className="font-display text-lg text-nl-ink">{title}</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-nl-ink hover:bg-nl-mist" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </DialogHeader>
          <div className="aspect-video w-full flex items-center justify-center bg-nl-mist">
            <p className="text-destructive">Video source not found</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] p-0">
        <DialogHeader className="p-4 flex flex-row justify-between items-center">
          <DialogTitle className="text-lg">{title}</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>
        <div className="aspect-video w-full">
          <iframe 
            width="100%" 
            height="100%" 
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            className="border-0"
          ></iframe>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayer;
