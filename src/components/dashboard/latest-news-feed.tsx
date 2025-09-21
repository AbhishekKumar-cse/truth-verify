"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { formatDistanceToNow } from "date-fns";
import { generateAndSaveNewsReport } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Newspaper, RefreshCw } from "lucide-react";
import Link from "next/link";
import type { NewsReport } from "@/types";

const getScoreVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score >= 75) return "default";
    if (score >= 40) return "secondary";
    return "destructive";
};

type ClientNewsReport = Omit<NewsReport, 'createdAt'> & {
  createdAt: string | null;
};

export function LatestNewsFeed() {
  const [latestReport, setLatestReport] = useState<ClientNewsReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const reportsRef = collection(db, "news_reports");
    const q = query(reportsRef, orderBy("createdAt", "desc"), limit(1));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0].data();
        const createdAt = docData.createdAt;

        const reportData: ClientNewsReport = {
          id: querySnapshot.docs[0].id,
          headline: docData.headline,
          claim: docData.claim,
          category: docData.category,
          truthScore: docData.truthScore,
          verdict: docData.verdict,
          explanation: docData.explanation,
          sources: docData.sources,
          createdAt: createdAt?.seconds ? new Date(createdAt.seconds * 1000).toISOString() : null,
        };
        setLatestReport(reportData);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching latest news report:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generateAndSaveNewsReport();
      if (result.success && result.data) {
        toast({
          title: "New Report Generated!",
          description: "The latest news has been fact-checked.",
        });
        
        const createdAt = result.data.createdAt;
        const clientReport: ClientNewsReport = {
            ...result.data,
            createdAt: createdAt?.seconds ? new Date(createdAt.seconds * 1000).toISOString() : null
        }
        setLatestReport(clientReport);
      } else {
        throw new Error(result.error || "Failed to generate report.");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "An Error Occurred",
        description: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Fact-Checked News</CardTitle>
        <CardDescription>Latest news headlines, analyzed by AI.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : latestReport ? (
          <div className="space-y-4">
            <div className="flex flex-col gap-1 text-sm">
                <p className="font-medium">{latestReport.headline}</p>
                <div className="flex items-center justify-between text-muted-foreground">
                    <Badge variant={getScoreVariant(latestReport.truthScore)} className="text-xs">{latestReport.verdict}</Badge>
                    <span>
                        {latestReport.createdAt
                            ? formatDistanceToNow(new Date(latestReport.createdAt), { addSuffix: true })
                            : 'N/A'}
                    </span>
                </div>
            </div>
            <Link href={`/news/${latestReport.id}`} className="w-full">
                <Button variant="outline" size="sm" className="w-full">
                    <Newspaper className="mr-2 h-4 w-4" />
                    Read Full Analysis
                </Button>
            </Link>
          </div>
        ) : (
            <p className="text-center text-muted-foreground">No news reports found. Generate one to get started!</p>
        )}
        <Button size="sm" className="w-full mt-4" disabled={isGenerating} onClick={handleGenerate}>
            {isGenerating ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                </>
            ) : (
                <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Get Latest News Fact-Check
                </>
            )}
        </Button>
      </CardContent>
    </Card>
  );
}
