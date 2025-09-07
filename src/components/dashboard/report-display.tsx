"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, FileDown, RotateCcw } from "lucide-react";
import type { ReportWithId } from "../reports/reports-list";
import { Button } from "../ui/button";

type ReportDisplayProps = {
  report: ReportWithId;
  onNewCheck?: () => void;
};

const getVerdictVariant = (verdict: string): "default" | "secondary" | "destructive" | "outline" => {
    const lowerVerdict = verdict.toLowerCase();
    if (lowerVerdict.includes("true")) return "default";
    if (lowerVerdict.includes("false")) return "destructive";
    return "secondary";
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
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Fact-Check Report</CardTitle>
        <CardDescription className="text-lg">Analysis of: "{report.claimTitle}"</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center p-4 rounded-lg bg-accent/50">
            <h3 className="text-sm font-semibold uppercase text-muted-foreground">Verdict</h3>
            <Badge variant={getVerdictVariant(report.verdict)} className="text-xl px-4 py-1 my-2">
                {report.verdict}
            </Badge>
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
                            {source.title} ({source.url})
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
