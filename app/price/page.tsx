export default function PricePage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-dh-blue mb-2">Price & Promo</h2>
        <p className="text-gray-500 mb-6">
          Competitor price comparison, promo triggers, and price gap analysis from the Affordability Engine.
        </p>

        {/* Placeholder content */}
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">Price & Promo features coming soon</p>
          <p className="text-gray-400 text-sm mt-1">
            Competitor price matching, promo recommendations, and affordability alerts.
          </p>
        </div>
      </div>
    </div>
  );
}