import React from 'react';

const VideoPlayer = ({ videoId = "kJQP7kiw5Fk" }) => {
  return (
    <div className="w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-800 aspect-video relative group">
      <iframe
        className="w-full h-full absolute top-0 left-0"
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      
      {/* Overlay gradient for a more premium look (only visible briefly on load or hover) */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"></div>
    </div>
  );
};

export default VideoPlayer;
