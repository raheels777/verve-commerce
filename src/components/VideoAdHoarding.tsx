import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Play, Pause, ArrowUpRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { videoAdStore, type VideoAd } from "@/store/adminStore";

// Detect YouTube and convert to embed URL with autoplay+mute params
const getYouTubeEmbed = (url: string): string | null => {
  try {
    const u = new URL(url);
    let id: string | null = null;
    if (u.hostname.includes("youtube.com")) {
      id = u.searchParams.get("v");
      if (!id && u.pathname.startsWith("/embed/")) id = u.pathname.split("/embed/")[1];
      if (!id && u.pathname.startsWith("/shorts/")) id = u.pathname.split("/shorts/")[1];
    } else if (u.hostname.includes("youtu.be")) {
      id = u.pathname.slice(1);
    }
    if (!id) return null;
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&modestbranding=1&playsinline=1&rel=0`;
  } catch {
    return null;
  }
};

const VideoAdCard = ({ ad }: { ad: VideoAd }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const youtubeEmbed = getYouTubeEmbed(ad.videoUrl);
  const isExternal = ad.ctaUrl?.startsWith("http");

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setPlaying(true);
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-elegant group bg-card"
    >
      {/* Video */}
      <div className="relative aspect-video w-full bg-black">
        {youtubeEmbed ? (
          <iframe
            src={youtubeEmbed}
            title={ad.title}
            className="absolute inset-0 w-full h-full"
            frameBorder={0}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            ref={videoRef}
            src={ad.videoUrl}
            poster={ad.posterUrl || undefined}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Bottom gradient + content overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

        {/* Top badge */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-deal text-deal-foreground text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-deal">
            <Sparkles className="h-3 w-3" /> Sponsored
          </span>
        </div>

        {/* Mute / Play controls (only for native video) */}
        {!youtubeEmbed && (
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex gap-2">
            <button
              onClick={togglePlay}
              aria-label={playing ? "Pause" : "Play"}
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-background/30 backdrop-blur-md text-white flex items-center justify-center hover:bg-background/50 transition"
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-background/30 backdrop-blur-md text-white flex items-center justify-center hover:bg-background/50 transition"
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </div>
        )}

        {/* Bottom content */}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 z-10 text-white">
          <h3 className="font-display font-bold text-lg sm:text-2xl md:text-3xl leading-tight drop-shadow-lg">
            {ad.title}
          </h3>
          {ad.subtitle && (
            <p className="text-xs sm:text-sm opacity-90 mt-1 max-w-md">{ad.subtitle}</p>
          )}
          {ad.ctaLabel && ad.ctaUrl && (
            <div className="mt-3 sm:mt-4">
              {isExternal ? (
                <a href={ad.ctaUrl} target="_blank" rel="noopener noreferrer sponsored">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-sm font-semibold shadow-glow"
                  >
                    {ad.ctaLabel}
                    <ArrowUpRight className="h-4 w-4" />
                  </motion.button>
                </a>
              ) : (
                <Link to={ad.ctaUrl}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-sm font-semibold shadow-glow"
                  >
                    {ad.ctaLabel}
                    <ArrowUpRight className="h-4 w-4" />
                  </motion.button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const VideoAdHoarding = () => {
  const [ads, setAds] = useState<VideoAd[]>([]);

  useEffect(() => {
    const load = () => setAds(videoAdStore.getActive());
    load();
    window.addEventListener("video-ads-updated", load);
    return () => window.removeEventListener("video-ads-updated", load);
  }, []);

  if (ads.length === 0) return null;

  return (
    <section className="container py-10 sm:py-14">
      <div className="flex items-end justify-between mb-6 sm:mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-2">
            Featured Ad
          </p>
          <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl">
            Watch & Shop
          </h2>
        </div>
      </div>

      <div className={`grid gap-5 ${ads.length === 1 ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"}`}>
        <AnimatePresence>
          {ads.map((ad) => (
            <VideoAdCard key={ad.id} ad={ad} />
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default VideoAdHoarding;
