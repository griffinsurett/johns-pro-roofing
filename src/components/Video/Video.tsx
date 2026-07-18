// src/components/Video/Video.tsx
/**
 * Video Component (React)
 *
 * Client-side video player with lazy loading support.
 */
import { useRef, useEffect, forwardRef, useState } from "react";
import type {
  VideoHTMLAttributes,
  ReactNode,
} from "react";

interface VideoProps extends VideoHTMLAttributes<HTMLVideoElement> {
  lazy?: boolean;
  sourceType?: string;
  children?: ReactNode;
  clientLoadPlaceholder?: boolean;
  placeholderSrc?: string;
  clientPosterSrc?: string;
  clientPlaceholderSrc?: string;
  wrapperClass?: string;
}

const isLocalVideo = (videoSrc: unknown): videoSrc is string => {
  return typeof videoSrc === "string" && videoSrc.startsWith("/");
};

const getGeneratedPosterPath = (videoSrc?: string): string | undefined => {
  if (!isLocalVideo(videoSrc)) return undefined;

  const baseName = videoSrc.replace(/^\/+/, "").split("?")[0].split("/").pop();
  if (!baseName) return undefined;

  const stem = baseName.replace(/\.[^/.]+$/, "");
  if (!stem) return undefined;

  return `/__video-thumbnails/${stem}-poster.webp`;
};

export const Video = forwardRef<HTMLVideoElement, VideoProps>(
  (
    {
      src,
      poster,
      className = "",
      autoPlay = true,
      muted = false,
      loop = true,
      controls = false,
      playsInline = true,
      lazy = true,
      sourceType,
      children,
      clientLoadPlaceholder = false,
      placeholderSrc,
      clientPosterSrc,
      clientPlaceholderSrc,
      wrapperClass = "",
      onPlay,
      ...rest
    },
    ref,
  ) => {
    const internalRef = useRef<HTMLVideoElement | null>(null);
    const fallbackPoster = getGeneratedPosterPath(src);
    const [resolvedPoster, setResolvedPoster] = useState<string | undefined>(poster ?? fallbackPoster);
    const [resolvedPlaceholderSrc, setResolvedPlaceholderSrc] = useState<
      string | undefined
    >(placeholderSrc);
    const [hasStartedPlayback, setHasStartedPlayback] = useState(false);

    const assignRef = (node: HTMLVideoElement | null) => {
      internalRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    useEffect(() => {
      const video = internalRef.current;
      if (!video || !lazy) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const dataSrc = video.dataset.videoSrc;
              if (dataSrc && !video.getAttribute("src")) {
                video.src = dataSrc;
              }
              // Promote network loading once near viewport while keeping
              // an iOS-safe poster render path from initial SSR markup.
              if (video.preload === "none") {
                video.preload = "metadata";
              }
              if (video.getAttribute("src")) {
                video.load();
              }
              if (autoPlay) {
                video.play().catch(() => {});
              }
              observer.disconnect();
            }
          });
        },
        { threshold: 0.35, rootMargin: "0px 0px 160px 0px" },
      );

      observer.observe(video);
      return () => observer.disconnect();
    }, [lazy, autoPlay]);

    useEffect(() => {
      if (clientLoadPlaceholder && clientPosterSrc) {
        setResolvedPoster(clientPosterSrc);
        return;
      }
      setResolvedPoster(poster ?? fallbackPoster);
    }, [clientLoadPlaceholder, clientPosterSrc, poster, fallbackPoster]);

    useEffect(() => {
      if (clientLoadPlaceholder) {
        setResolvedPlaceholderSrc(
          clientPosterSrc ??
            clientPlaceholderSrc ??
            placeholderSrc ??
            poster ??
            fallbackPoster,
        );
        return;
      }
      setResolvedPlaceholderSrc(placeholderSrc ?? poster ?? fallbackPoster);
    }, [
      clientLoadPlaceholder,
      clientPosterSrc,
      clientPlaceholderSrc,
      placeholderSrc,
      poster,
      fallbackPoster,
    ]);

    useEffect(() => {
      setHasStartedPlayback(false);
    }, [src, resolvedPoster, resolvedPlaceholderSrc]);

    const wrapperClasses = `relative grid w-full h-full ${wrapperClass ?? ""}`.trim();
    const mediaClasses = `w-full h-full object-cover ${className ?? ""}`.trim();
    const stackClasses = "col-start-1 col-end-2 row-start-1 row-end-2";
    const overlaySrc = resolvedPlaceholderSrc ?? resolvedPoster;
    const showOverlay = Boolean(overlaySrc) && !hasStartedPlayback;

    const handlePlay: NonNullable<VideoHTMLAttributes<HTMLVideoElement>["onPlay"]> = (event) => {
      setHasStartedPlayback(true);
      onPlay?.(event);
    };

    return (
      <div className={wrapperClasses}>
        {overlaySrc && (
          <img
            src={overlaySrc}
            alt=""
            aria-hidden="true"
            className={`${mediaClasses} ${stackClasses}`.trim()}
            loading={lazy ? "lazy" : "eager"}
            decoding="async"
            fetchPriority={lazy ? "auto" : "high"}
            style={{
              zIndex: 2,
              opacity: showOverlay ? 1 : 0,
              pointerEvents: "none",
              transition: "opacity 180ms ease",
            }}
          />
        )}
        <video
          ref={assignRef}
          className={`${mediaClasses} ${stackClasses}`.trim()}
          poster={resolvedPoster}
          autoPlay={!lazy && autoPlay}
          muted={muted}
          loop={loop}
          controls={controls}
          playsInline={playsInline}
          preload={lazy ? "none" : "auto"}
          data-video-src={lazy ? src : undefined}
          src={lazy ? undefined : src}
          style={{ zIndex: 1 }}
          {...rest}
          onPlay={handlePlay}
        >
          {!lazy && src && (
            <source
              src={src}
              type={sourceType}
            />
          )}
          {children ?? "Your browser does not support the video tag."}
        </video>
      </div>
    );
  },
);

Video.displayName = "Video";

export default Video;
