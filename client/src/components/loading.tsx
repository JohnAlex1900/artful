export default function Loading() {
  return (
    <div className="fixed inset-0 bg-cream-50 flex items-center justify-center z-50" data-testid="loading-screen">
      <div className="text-center">
        {/* Logo/Brand Name */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-charcoal-800 mb-2">
            <span className="text-gold-500">ARTFUL</span>
            <span className="text-charcoal-800"> STRUCTURES</span>
          </h1>
          <p className="text-charcoal-600 text-sm tracking-wider uppercase">Limited</p>
        </div>

        {/* Loading Animation */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-3 h-3 bg-gold-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-gold-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>

        {/* Loading Text */}
        <p className="text-charcoal-600 text-sm">Loading your experience...</p>
      </div>
    </div>
  );
}