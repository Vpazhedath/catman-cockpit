export default function ProfitabilityPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-dh-blue mb-2">Profitability</h2>
        <p className="text-gray-500 mb-6">
          Supplier scorecards, margin analysis, and renegotiation opportunities from the Profitability Engine.
        </p>

        {/* Placeholder content */}
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">Profitability features coming soon</p>
          <p className="text-gray-400 text-sm mt-1">
            Supplier performance scorecards, margin waterfall, and renegotiation alerts.
          </p>
        </div>
      </div>
    </div>
  );
}