"use client";

import { useState } from "react";
import { ClaimForm } from "@/components/dashboard/claim-form";
import { MisinformationTrendsChart } from "@/components/dashboard/misinformation-trends-chart";
import { DetectionAccuracyChart } from "@/components/dashboard/detection-accuracy-chart";
import { ReportSummaryChart } from "@/components/dashboard/report-summary-chart";
import { CategoryDistributionChart } from "@/components/dashboard/category-distribution-chart";
import { ReportDisplay } from "@/components/dashboard/report-display";
import type { ReportWithId } from "@/components/reports/reports-list";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LatestReports } from "@/components/dashboard/latest-reports";
import { LatestNewsFeed } from "@/components/dashboard/latest-news-feed";

export default function DashboardPage() {
  const [currentReport, setCurrentReport] = useState<ReportWithId | null>(null);

  const handleReportGenerated = (report: ReportWithId) => {
    setCurrentReport(report);
  };

  const handleNewCheck = () => {
    setCurrentReport(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Misinformation Detection</h1>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {currentReport ? (
             <ReportDisplay report={currentReport} onNewCheck={handleNewCheck} />
          ) : (
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Submit a Claim for Fact-Checking</CardTitle>
              </CardHeader>
              <CardContent>
                <ClaimForm onReportGenerated={handleReportGenerated} />
              </CardContent>
            </Card>
          )}
        </div>
        <div className="flex flex-col gap-6">
          <LatestNewsFeed />
          <LatestReports />
          <MisinformationTrendsChart />
        </div>
      </div>
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ReportSummaryChart />
          </div>
           <div className="flex flex-col gap-6">
              <DetectionAccuracyChart />
              <CategoryDistributionChart />
           </div>
       </div>
    </div>
  );
}
