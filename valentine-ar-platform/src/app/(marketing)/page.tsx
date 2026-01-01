import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Hand, Mic, Sparkles, Gift, Share2, Zap } from "lucide-react"

export const metadata = {
  title: "Valentine AR - Create Magical AR Valentine Cards",
  description: "Create interactive AR Valentine cards with hand gestures and voice interactions. Share magical moments with your loved ones.",
}

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-valentine-50 via-pink-50 to-purple-50 py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-valentine-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Create Magical AR Valentine Cards
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Send interactive AR greeting cards with hand gestures and voice triggers.
              Make this Valentine&apos;s Day unforgettable with personalized AR experiences.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg" className="bg-valentine-500 hover:bg-valentine-600 shadow-[0_0_20px_rgba(236,72,153,0.5)] hover:shadow-[0_0_30px_rgba(236,72,153,0.7)] transition-all duration-300">
                <Link href="/templates">Browse Templates</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#how-it-works">How It Works</Link>
              </Button>
            </div>

            {/* Video Demo */}
            <div className="mt-16 relative aspect-video w-full max-w-3xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-gray-200 bg-black group">
              <video
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                poster="/demo-poster.jpg"
                onError={(e) => {
                  (e.target as HTMLVideoElement).style.display = 'none';
                  const fallback = (e.target as HTMLVideoElement).nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              >
                <source src="/demo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Fallback Animation */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-valentine-100 to-pink-100 hidden flex-col items-center justify-center"
                style={{ display: 'none' }}
              >
                <Sparkles className="w-16 h-16 text-valentine-500 animate-pulse mb-4" />
                <p className="text-valentine-600 font-medium">Experience the Magic of AR</p>
                <p className="text-valentine-400 text-sm mt-2">Demo video coming soon</p>
              </div>

              {/* Play Overlay */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                  <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[15px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Magical AR Features
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Interactive experiences powered by cutting-edge AR technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="relative p-6 bg-gradient-to-br from-valentine-50 to-pink-50 rounded-2xl border border-valentine-100">
              <div className="w-12 h-12 bg-valentine-500 rounded-lg flex items-center justify-center mb-4">
                <Hand className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Hand Gestures</h3>
              <p className="text-gray-600">
                Wave, heart gesture, victory sign - trigger magical effects with your hands
              </p>
            </div>

            {/* Feature 2 */}
            <div className="relative p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <Mic className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Voice Triggers</h3>
              <p className="text-gray-600">
                Say &quot;I love you&quot; or &quot;Happy Valentine&quot; to activate special animations
              </p>
            </div>

            {/* Feature 3 */}
            <div className="relative p-6 bg-gradient-to-br from-pink-50 to-orange-50 rounded-2xl border border-pink-100">
              <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AR Effects</h3>
              <p className="text-gray-600">
                Hearts, fireworks, glow effects, and confetti bring your card to life
              </p>
            </div>

            {/* Feature 4 */}
            <div className="relative p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-100">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Full Customization</h3>
              <p className="text-gray-600">
                Personalize names, messages, backgrounds, music, and effects
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Create your magical AR card in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-valentine-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose Template</h3>
              <p className="text-gray-600">
                Browse our collection of beautiful AR Valentine card templates
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-pink-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Customize & Purchase</h3>
              <p className="text-gray-600">
                Personalize your card with names, messages, backgrounds, and music
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Share AR Link</h3>
              <p className="text-gray-600">
                Send the unique link to your loved one and watch their reaction
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button asChild size="lg" className="bg-valentine-500 hover:bg-valentine-600">
              <Link href="/templates">Start Creating</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Highlight */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">
              Why Choose Valentine AR?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-8 bg-valentine-50 rounded-2xl border border-valentine-100">
              <div className="w-14 h-14 bg-valentine-100 rounded-xl flex items-center justify-center mb-6">
                <Zap className="h-7 w-7 text-valentine-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy to Use</h3>
              <p className="text-gray-600">
                No app download required. Works directly in the browser on any device.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-8 bg-pink-50 rounded-2xl border border-pink-100">
              <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center mb-6">
                <Share2 className="h-7 w-7 text-pink-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Sharing</h3>
              <p className="text-gray-600">
                Share via link, QR code, or social media. No complicated setup.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-8 bg-purple-50 rounded-2xl border border-purple-100">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="h-7 w-7 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Truly Memorable</h3>
              <p className="text-gray-600">
                Create an experience they&apos;ll never forget with interactive AR magic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-valentine-500 to-pink-500">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Create Your Magical Card?
          </h2>
          <p className="text-valentine-50 text-lg mb-8 max-w-2xl mx-auto">
            Start creating your personalized AR Valentine card today and make this Valentine&apos;s Day truly special.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/templates">
              Browse Templates
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
