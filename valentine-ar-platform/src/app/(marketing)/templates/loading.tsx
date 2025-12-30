export default function TemplatesLoading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-12 text-center">
          <div className="h-10 w-64 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 w-96 bg-gray-200 rounded mx-auto animate-pulse"></div>
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Image skeleton */}
                <div className="h-64 bg-gray-200"></div>

                {/* Content skeleton */}
                <div className="p-6 space-y-4">
                  <div className="h-7 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>

                  {/* Price and button skeleton */}
                  <div className="flex items-center justify-between pt-4">
                    <div className="h-8 w-20 bg-gray-200 rounded"></div>
                    <div className="h-10 w-28 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
