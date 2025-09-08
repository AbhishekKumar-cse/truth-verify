"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { ReportWithId } from "../reports/reports-list";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "../ui/skeleton";

const getScoreVariant = (score: number): "destructive" | "secondary" => {
    return score < 20 ? "destructive" : "secondary";
};

const getScoreLabel = (score: number): string => {
    if (score < 20) return "Confirmed False";
    return "Likely False";
}

export function FalseRumorsFeed() {
  const [reports, setReports] = useState<ReportWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFalseRumors = async () => {
      try {
        const reportsRef = collection(db, "reports");
        const q = query(
          reportsRef,
          where("truthScore", "<", 40),
          orderBy("truthScore", "asc"),
          orderBy("createdAt", "desc"),
          limit(20)
        );

        const querySnapshot = await getDocs(q);
        const reportsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ReportWithId[];
        
        setReports(reportsData);
      } catch (err: any) {
        console.error("Error fetching false rumors:", err);
        setError("Failed to load misinformation feed. Please check console for details.");
      } finally {
        setLoading(false);
      }
    };

    fetchFalseRumors();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error) {
     return (
        <Card className="text-center py-12 bg-destructive/10 border-destructive">
            <CardHeader>
                <CardTitle className="text-destructive">An Error Occurred</CardTitle>
                <CardDescription className="text-destructive/80 break-all">
                    {error}
                </CardDescription>
            </CardHeader>
        </Card>
     )
  }

  if (reports.length === 0) {
    return (
        <Card className="text-center py-12">
            <CardHeader>
                <CardTitle>No Misinformation Found</CardTitle>
                <CardDescription>Currently, there are no items flagged as high-confidence misinformation.</CardDescription>
            </CardHeader>
        </Card>
    );
  }

  return (
    <div className="space-y-4">
        {reports.map((report) => (
            <Card key={report.id}>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <Badge variant={getScoreVariant(report.truthScore)}>
                                {getScoreLabel(report.truthScore)}: {report.truthScore}% Confidence
                            </Badge>
                            <CardTitle className="mt-2">{report.claimTitle}</CardTitle>
                        </div>
                        <Badge variant="outline">{report.claimCategory}</Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{report.explanation}</p>
                </CardContent>
                <CardFooter>
                     <p className="text-xs text-muted-foreground">
                        First Detected: {report.createdAt && typeof report.createdAt === 'object' && 'seconds' in report.createdAt ? new Date(report.createdAt.seconds * 1000).toLocaleString() : 'N/A'}
                    </p>
                </CardFooter>
            </Card>
        ))}
    </div>
  );
}
