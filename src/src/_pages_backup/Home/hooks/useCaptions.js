import { useState, useEffect } from 'react';

export const useCaptions = (showStartButton, captions) => {
  const [currentCaption, setCurrentCaption] = useState('');
  const [currentSubCaption, setCurrentSubCaption] = useState('');
  const [isCaptionVisible, setIsCaptionVisible] = useState(false);

  useEffect(() => {
    if (showStartButton) {
      const video = document.querySelector('.intro-video-section video');
      if (video) {
        let previousCaption = '';

        const updateCaption = () => {
          const currentTime = video.currentTime;
          const caption = captions.find((cap) => {
            return currentTime >= cap.time && currentTime < cap.endTime;
          });

          if (!caption || (!caption.text && !caption.subText)) {
            if (previousCaption) {
              setCurrentCaption('');
              setCurrentSubCaption('');
              setIsCaptionVisible(false);
              previousCaption = '';
            }
            return;
          }

          const captionKey = caption.text + (caption.subText || '');

          if (captionKey !== previousCaption) {
            if (!previousCaption) {
              setCurrentCaption(caption.text);
              setCurrentSubCaption(caption.subText || '');
              setIsCaptionVisible(true);
            } else {
              setCurrentCaption(caption.text);
              setCurrentSubCaption(caption.subText || '');
              if (!isCaptionVisible) {
                setIsCaptionVisible(true);
              }
            }
            previousCaption = captionKey;
          }
        };

        video.addEventListener('timeupdate', updateCaption);

        return () => {
          video.removeEventListener('timeupdate', updateCaption);
        };
      }
    } else {
      setCurrentCaption('');
      setCurrentSubCaption('');
      setIsCaptionVisible(false);
    }
  }, [showStartButton, captions, isCaptionVisible]);

  return { currentCaption, currentSubCaption, isCaptionVisible };
};
