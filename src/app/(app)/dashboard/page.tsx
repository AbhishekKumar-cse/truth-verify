import { ClaimForm } from "@/components/dashboard/claim-form";
import { MisinformationTrendsChart } from "@/components/dashboard/misinformation-trends-chart";
import { DetectionAccuracyChart } from "@/components/dashboard/detection-accuracy-chart";
import { ReportSummaryChart } from "@/components/dashboard/report-summary-chart";
import { CategoryDistributionChart } from "@/components/dashboard/category-distribution-chart";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Misinformation Detection</h1>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ClaimForm />
        </div>
        <div className="flex flex-col gap-6">
          <MisinformationTrendsChart />
          <DetectionAccuracyChart />
        </div>
      </div>
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ReportSummaryChart />
          </div>
          <CategoryDistributionChart />
       </div>
    </div>
  );
}
