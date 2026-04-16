import { KPICard } from "@/components/KPICard";
import { GMVChart } from "@/components/GMVChart";
import { EngineSignals } from "@/components/EngineSignals";
import { SAMPLE_KPIS } from "@/lib/sample-data";

export default function PerformancePage() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {SAMPLE_KPIS.map((kpi, index) => (
          <KPICard
            key={index}
            label={kpi.label}
            value={kpi.value}
            delta={kpi.delta}
            direction={kpi.direction}
            subtitle={kpi.subtitle}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart - 2 columns */}
        <div className="lg:col-span-2">
          <GMVChart />
        </div>

        {/* Engine Signals - 1 column */}
        <div>
          <EngineSignals />
        </div>
      </div>
    </div>
  );
}