import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ReportDisplay } from "@/components/dashboard/report-display";
import { notFound } from "next/navigation";
import { ReportWithId } from "@/components/reports/reports-list";
import type { NewsReport } from "@/types";

async function getNewsReport(id: string): Promise<NewsReport | null> {
  const docRef = doc(db, "news_reports", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as NewsReport;
  }
  return null;
}


export default async function NewsReportPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const newsReport = await getNewsReport(id);

  if (!newsReport) {
    notFound();
  }

  // We can reuse the ReportDisplay component by mapping the NewsReport fields
  const displayableReport: ReportWithId = {
      id: newsReport.id,
      claimTitle: newsReport.headline,
      claimStatement: newsReport.claim,
      claimCategory: newsReport.category,
      truthScore: newsReport.truthScore,
      verdict: newsReport.verdict,
      explanation: newsReport.explanation,
      sources: newsReport.sources,
      // These fields are not present in NewsReport but required by ReportWithId
      userId: 'ai_generated',
      createdAt: newsReport.createdAt,
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4 sm:px-6 lg:px-8">
      <ReportDisplay report={displayableReport} />
    </div>
  );
}
