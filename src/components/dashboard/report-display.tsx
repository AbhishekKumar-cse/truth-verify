"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, FileDown, RotateCcw } from "lucide-react";
import type { ReportWithId } from "../reports/reports-list";
import { Button } from "../ui/button";
import { ScoreCircle } from "./score-circle";

type ReportDisplayProps = {
  report: ReportWithId;
  onNewCheck?: () => void;
};

export function ReportDisplay({ report, onNewCheck }: ReportDisplayProps) {

  const handlePrint = () => {
    const printWindow = window.open(`/reports/${report.id}?print=true`, '_blank');
    printWindow?.addEventListener('load', () => {
        printWindow?.print();
    });
  };

  return (
    <Card className="w-full" id="report-content">
      <CardHeader className="items-center text-center">
        <CardTitle className="text-3xl font-bold">Fact-Check Report</CardTitle>
        <CardDescription className="text-lg">Analysis of: "{report.claimTitle}"</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-4 text-center">
            <ScoreCircle score={report.truthScore} />
            <h2 className="text-2xl font-semibold">{report.verdict}</h2>
        </div>
        
        <div className="p-4 rounded-lg bg-accent/50">
            <h3 className="mb-2 text-lg font-semibold text-center">Detailed Explanation</h3>
            <p className="text-accent-foreground">{report.explanation}</p>
        </div>
        
        <div>
            <h3 className="mb-2 text-lg font-semibold border-b pb-2">Supporting Sources</h3>
            {report.sources?.length > 0 ? (
                <ul className="space-y-2">
                    {report.sources.map((source, index) => (
                    <li key={index} className="flex items-start gap-2">
                        <ExternalLink className="h-4 w-4 mt-1 shrink-0 text-primary" />
                        <a 
                            href={source.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-primary hover:underline break-all"
                        >
                            {source.title}
                        </a>
                    </li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted-foreground">No specific sources were identified by the AI.</p>
            )}
        </div>
      </CardContent>
      <CardFooter className="justify-center gap-2">
         <Button variant="outline" onClick={handlePrint}>
            <FileDown className="mr-2 h-4 w-4" />
            Download as PDF
        </Button>
        {onNewCheck && (
            <Button onClick={onNewCheck}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Start New Check
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}
