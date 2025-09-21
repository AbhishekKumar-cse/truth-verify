"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ReportWithId } from "../reports/reports-list";
import { Badge } from "../ui/badge";
import { formatDistanceToNow } from "date-fns";

const getScoreVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score >= 75) return "default";
    if (score >= 40) return "secondary";
    return "destructive";
};

export function LatestReports() {
  const [reports, setReports] = useState<ReportWithId[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reportsRef = collection(db, "reports");
    const q = query(reportsRef, orderBy("createdAt", "desc"), limit(5));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const reportsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ReportWithId[];
      setReports(reportsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching latest reports:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Reports</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <ul className="space-y-4">
            {reports.map((report) => (
              <li key={report.id} className="flex flex-col gap-1 text-sm">
                <p className="font-medium truncate">{report.claimTitle}</p>
                <div className="flex items-center justify-between text-muted-foreground">
                    <Badge variant={getScoreVariant(report.truthScore)} className="text-xs">{report.verdict}</Badge>
                    <span>
                         {report.createdAt && typeof report.createdAt === 'object' && 'seconds' in report.createdAt 
                            ? formatDistanceToNow(new Date(report.createdAt.seconds * 1000), { addSuffix: true })
                            : 'N/A'}
                    </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
