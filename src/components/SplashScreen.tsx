import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnd = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onFinish();
    }, 900);
  }, [onFinish]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.load();
    video.play().catch(() => {
      console.warn('Video autoplay blocked');
      handleVideoEnd();
    });

    // Expand near the end of the video
    const onTime = () => {
      if (video.duration && video.currentTime >= video.duration - 1.5) {
        setExpanded(true);
        video.removeEventListener('timeupdate', onTime);
      }
    };
    video.addEventListener('timeupdate', onTime);

    // Fallback
    const fallback = setTimeout(() => handleVideoEnd(), 7000);

    return () => {
      video.removeEventListener('timeupdate', onTime);
      clearTimeout(fallback);
    };
  }, [handleVideoEnd]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* 
            Video is rendered at full viewport size but scaled down via CSS transform.
            This keeps it at full resolution — no quality loss on scale-up.
            will-change hints the GPU to composite on a separate layer.
          */}
          <video
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            onEnded={handleVideoEnd}
            onError={() => handleVideoEnd()}
            style={{
              width: '100vw',
              height: '100vh',
              objectFit: 'cover',
              display: 'block',
              mixBlendMode: 'multiply',
              filter: 'brightness(1.15) contrast(1.3)',
              willChange: 'transform',
              transform: expanded ? 'scale(1.2)' : 'scale(0.75)',
              transition: 'transform 1.4s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            <source src="/intro-video.mp4" type="video/mp4" />
          </video>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
