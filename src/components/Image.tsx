import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
}

export default function Image({ src, alt, className, containerClassName, onLoad, onError, ...props }: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const image = imageRef.current;
    setIsLoaded(!!image?.complete && image.naturalWidth > 0);
    setFailed(!!image?.complete && image.naturalWidth === 0);
  }, [src]);

  return (
    <div className={cn("relative overflow-hidden bg-gray-100", containerClassName, className)}>
      {!isLoaded && !failed && (
        <div className="absolute inset-0 w-full h-full bg-gray-200 animate-pulse" />
      )}
      {failed && <div className="absolute inset-0 flex items-center justify-center bg-slate-100 p-5 text-center text-sm text-slate-500">{alt || 'Project image unavailable'}</div>}
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={(event) => { setIsLoaded(true); setFailed(false); onLoad?.(event); }}
        onError={(event) => { setFailed(true); onError?.(event); }}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-500",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        {...props}
      />
    </div>
  );
}
