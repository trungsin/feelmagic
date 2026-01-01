"use client"

import { useState } from "react"
import { Sparkles } from "lucide-react"

export function DemoVideo() {
  const [hasError, setHasError] = useState(false)

  return (
    <div className="relative aspect-video w-full max-w-3xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-gray-200 bg-black group">
      {!hasError && (
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/demo-poster.jpg"
          onError={() => setHasError(true)}
        >
          <source src="/demo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Fallback Animation */}
      {hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-valentine-100 to-pink-100 flex flex-col items-center justify-center">
          <Sparkles className="w-16 h-16 text-valentine-500 animate-pulse mb-4" />
          <p className="text-valentine-600 font-medium">Experience the Magic of AR</p>
          <p className="text-valentine-400 text-sm mt-2">Demo video coming soon</p>
        </div>
      )}

      {/* Play Overlay */}
      {!hasError && (
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform" />
        </div>
      )}
    </div>
  )
}
