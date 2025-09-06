"use client";

import { useState } from "react";
import { ClaimForm } from "@/components/dashboard/claim-form";
import { ReportDisplay } from "@/components/dashboard/report-display";
import type { GenerateFactCheckReportOutput } from "@/ai/flows/generate-fact-check-report";
import { Button } from "@/components/ui/button";

export type ReportWithId = GenerateFactCheckReportOutput & { id: string };

export default function DashboardPage() {
  const [report, setReport] = useState<ReportWithId | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  const handleReportGenerated = (generatedReport: ReportWithId) => {
    setIsExiting(true);
    setTimeout(() => {
        setReport(generatedReport);
        setIsExiting(false);
    }, 500);
  };

  const handleNewCheck = () => {
    setIsExiting(true);
    setTimeout(() => {
        setReport(null);
        setIsExiting(false);
    }, 500);
  }

  const getAnimationClasses = (isReportVisible: boolean) => {
    if (isExiting) {
        return isReportVisible 
            ? 'animate-slide-out-to-right' 
            : 'animate-slide-out-to-left';
    }
    return isReportVisible
        ? 'animate-slide-in-from-right'
        : 'animate-slide-in-from-left';
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      {report ? (
        <div className={`space-y-6 ${getAnimationClasses(true)}`}>
            <ReportDisplay report={report} />
            <div className="text-center">
                <Button onClick={handleNewCheck} size="lg">
                    Check Another Claim
                </Button>
            </div>
        </div>
      ) : (
        <div className={getAnimationClasses(false)}>
            <ClaimForm onReportGenerated={handleReportGenerated} />
        </div>
      )}
    </div>
  );
}
