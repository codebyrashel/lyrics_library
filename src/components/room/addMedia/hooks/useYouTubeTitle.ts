import { useState } from 'react';

export const useYouTubeTitle = () => {
  const [videoTitle, setVideoTitle] = useState('');
  const [isLoadingTitle, setIsLoadingTitle] = useState(false);

  const fetchTitle = async (videoId: string) => {
    setIsLoadingTitle(true);
    try {
      // Use no-cors mode and handle properly
      const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
      if (!response.ok) {
        throw new Error('Failed to fetch title');
      }
      const data = await response.json();
      setVideoTitle(data.title);
    } catch (error) {
      console.error('Failed to fetch video title:', error);
      setVideoTitle(`YouTube Video`);
    } finally {
      setIsLoadingTitle(false);
    }
  };

  const resetTitle = () => {
    setVideoTitle('');
  };

  return { videoTitle, isLoadingTitle, fetchTitle, resetTitle };
};