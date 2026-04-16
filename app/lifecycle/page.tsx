export default function LifecyclePage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-dh-blue mb-2">Lifecycle Management</h2>
        <p className="text-gray-500 mb-6">
          SKU stage tracking from New → Active → Review → Phase-out, with velocity trends from the SKU Lifecycle Engine.
        </p>

        {/* Funnel placeholder */}
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-12">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-64 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 font-medium">
              New (24 SKUs)
            </div>
            <div className="w-72 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-700 font-medium">
              Active (156 SKUs)
            </div>
            <div className="w-56 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-700 font-medium">
              Review (18 SKUs)
            </div>
            <div className="w-40 h-12 bg-red-100 rounded-lg flex items-center justify-center text-red-700 font-medium">
              Phase-out (7 SKUs)
            </div>
          </div>

          <p className="text-center text-gray-400 text-sm mt-8">
            Full lifecycle analytics and stage transition controls coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}