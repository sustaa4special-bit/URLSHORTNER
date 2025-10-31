"use client";

import React from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Instagram, Youtube, Video } from "lucide-react";

interface ViewPostModalProps {
  clipUrl: string;
  platform: 'TikTok' | 'Instagram' | 'YouTube Shorts';
  campaignHeadline: string;
  onClose: () => void;
}

const ViewPostModal: React.FC<ViewPostModalProps> = ({ clipUrl, platform, campaignHeadline, onClose }) => {
  const getPlatformIcon = (platform: 'TikTok' | 'Instagram' | 'YouTube Shorts') => {
    switch (platform) {
      case 'Instagram':
        return <Instagram className="h-5 w-5 mr-2 text-pink-400" />;
      case 'YouTube Shorts':
        return <Youtube className="h-5 w-5 mr-2 text-red-400" />;
      case 'TikTok':
      default:
        return <Video className="h-5 w-5 mr-2 text-blue-400" />;
    }
  };

  // Basic embedding logic - in a real app, you'd use platform-specific embed SDKs
  const getEmbedUrl = (url: string, platform: 'TikTok' | 'Instagram' | 'YouTube Shorts') => {
    if (platform === 'TikTok') {
      // TikTok embeds are complex, often require their SDK. For mock, just link.
      return url;
    } else if (platform === 'Instagram') {
      // Instagram embeds also require their script. For mock, just link.
      return url;
    } else if (platform === 'YouTube Shorts') {
      // YouTube Shorts are just regular YouTube videos, can use embed URL
      const videoIdMatch = url.match(/(?:youtube\.com\/(?:shorts\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      if (videoIdMatch && videoIdMatch[1]) {
        return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
      }
    }
    return url; // Fallback
  };

  const embedUrl = getEmbedUrl(clipUrl, platform);
  const isEmbeddable = platform === 'YouTube Shorts' && embedUrl.includes('youtube.com/embed');

  return (
    <DialogContent className="sm:max-w-[700px] w-full h-[80vh] flex flex-col bg-gray-900 text-white border-gray-700">
      <DialogHeader>
        <DialogTitle className="text-white flex items-center">
          {getPlatformIcon(platform)} View Post: {campaignHeadline}
        </DialogTitle>
        <DialogDescription className="text-gray-400">
          Review the submitted content from the creator.
        </DialogDescription>
      </DialogHeader>
      <div className="flex-1 flex items-center justify-center bg-gray-800 rounded-md overflow-hidden mt-4">
        {isEmbeddable ? (
          <iframe
            width="100%"
            height="100%"
            src={embedUrl}
            title="Creator Post"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        ) : (
          <div className="text-center p-4">
            <p className="text-gray-300 mb-4">
              Direct embedding for {platform} is not fully supported in this mock environment.
            </p>
            <a
              href={clipUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:underline flex items-center justify-center"
            >
              <Eye className="h-5 w-5 mr-2" /> Open Post in New Tab
            </a>
            <p className="text-sm text-gray-500 mt-2 break-all">{clipUrl}</p>
          </div>
        )}
      </div>
    </DialogContent>
  );
};

export default ViewPostModal;