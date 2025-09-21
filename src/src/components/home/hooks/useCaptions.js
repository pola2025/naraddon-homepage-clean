import { useState, useEffect } from 'react';
import { captions } from '../constants/captions';

export const useCaptions = (isPlaying) => {
  const [currentCaption, setCurrentCaption] = useState('');
  const [currentSubCaption, setCurrentSubCaption] = useState('');
  const [isCaptionVisible, setIsCaptionVisible] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;

    const startTime = Date.now();

    const updateCaption = () => {
      const elapsed = (Date.now() - startTime) / 1000;

      const caption = captions.find((cap) => elapsed >= cap.time && elapsed < cap.endTime);

      if (caption) {
        if (caption.text !== currentCaption || caption.subText !== currentSubCaption) {
          setIsCaptionVisible(false);

          setTimeout(() => {
            setCurrentCaption(caption.text);
            setCurrentSubCaption(caption.subText || '');
            setIsCaptionVisible(true);
          }, 200);
        }
      } else {
        setCurrentCaption('');
        setCurrentSubCaption('');
      }
    };

    const interval = setInterval(updateCaption, 100);

    return () => clearInterval(interval);
  }, [isPlaying, currentCaption, currentSubCaption]);

  return { currentCaption, currentSubCaption, isCaptionVisible };
};
