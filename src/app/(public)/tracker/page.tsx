import { CategoryDistributionChart } from "@/components/dashboard/category-distribution-chart";
import { DetectionAccuracyChart } from "@/components/dashboard/detection-accuracy-chart";
import { MisinformationTrendsChart } from "@/components/dashboard/misinformation-trends-chart";
import { FalseRumorsFeed } from "@/components/tracker/false-rumors-feed";
import { PublicHeader } from "@/components/tracker/public-header";
import { TopFalseClaims } from "@/components/tracker/top-false-claims";

export default function TrackerPage() {
  return (
    <div className="flex flex-col gap-6">
      <PublicHeader />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FalseRumorsFeed />
        </div>
        <aside className="flex flex-col gap-6">
          <MisinformationTrendsChart />
          <DetectionAccuracyChart />
          <CategoryDistributionChart />
          <TopFalseClaims />
        </aside>
      </div>
    </div>
  );
}
