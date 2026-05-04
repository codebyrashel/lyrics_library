import { useState } from 'react';

export const useYouTubeTitle = () => {
  const [videoTitle, setVideoTitle] = useState('');
  const [isLoadingTitle, setIsLoadingTitle] = useState(false);

  const fetchTitle = async (videoId: string) => {
    setIsLoadingTitle(true);
    try {
      const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
      const data = await response.json();
      setVideoTitle(data.title);
    } catch (error) {
      console.error('Failed to fetch video title:', error);
      setVideoTitle(`YouTube Video (${videoId})`);
    } finally {
      setIsLoadingTitle(false);
    }
  };

  return { videoTitle, isLoadingTitle, fetchTitle };
};