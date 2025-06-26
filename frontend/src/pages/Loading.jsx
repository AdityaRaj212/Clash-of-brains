import React from 'react';

const Loading = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50">
      {/* Animated Brain Icon */}
      <div className="relative mb-6">
        <svg
          className="w-24 h-24 animate-bounce drop-shadow-lg"
          viewBox="0 0 64 64"
          fill="none"
        >
          <ellipse cx="32" cy="32" rx="28" ry="20" fill="#fbbf24" opacity="0.5" />
          <ellipse cx="24" cy="32" rx="14" ry="16" fill="#60a5fa" opacity="0.8" />
          <ellipse cx="40" cy="32" rx="14" ry="16" fill="#f472b6" opacity="0.8" />
          <ellipse cx="32" cy="32" rx="12" ry="14" fill="#fff" opacity="0.7" />
        </svg>
        {/* Sparkle animation */}
        <div className="absolute top-2 right-2 w-4 h-4 bg-yellow-300 rounded-full animate-ping opacity-70"></div>
      </div>
      {/* App Title */}
      <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-gradient-to-r from-blue-600 via-pink-500 to-yellow-400 bg-clip-text tracking-tight mb-2 animate-pulse">
        Clash of Brains
      </h2>
      <h3 className="text-lg text-gray-500 font-semibold tracking-wide animate-fade-in">
        Loading your next challenge...
      </h3>
    </div>
  );
};

export default Loading;
