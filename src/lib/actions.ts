"use server";

import { z } from "zod";
import { adminDb } from "@/lib/firebase-admin";
import { generateFactCheckReport, GenerateFactCheckReportInput } from "@/ai/flows/generate-fact-check-report";
import { generateNewsReport } from "@/ai/flows/generate-news-report";
import { Timestamp } from "firebase-admin/firestore";
import type { ReportWithId } from "@/components/reports/reports-list";
import type { NewsReport } from "@/types";

const claimSchema = z.object({
  title: z.string(),
  statement: z.string(),
  category: z.string(),
  sourceUrl: z.string().optional(),
});

type SubmitClaimResult = {
  success: true;
  data: ReportWithId;
} | {
  success: false;
  error: string;
};

export async function submitClaim(values: z.infer<typeof claimSchema>, userId: string): Promise<SubmitClaimResult> {
  try {
    if (!adminDb) {
      throw new Error("Firebase Admin SDK is not initialized. Please ensure your service account key is configured correctly on the server.");
    }
    
    if (!userId) {
      throw new Error("Authentication failed. User not found.");
    }
    
    const validatedValues = claimSchema.parse(values);

    const reportInput: GenerateFactCheckReportInput = {
      ...validatedValues,
      sourceUrl: validatedValues.sourceUrl || undefined,
    };

    const report = await generateFactCheckReport(reportInput);

    const createdAt = Timestamp.now();

    const reportData = {
      userId,
      claimTitle: validatedValues.title,
      claimStatement: validatedValues.statement,
      claimCategory: validatedValues.category,
      claimSourceUrl: validatedValues.sourceUrl || "",
      truthScore: report.truthScore,
      verdict: report.verdict,
      explanation: report.explanation,
      sources: report.sources,
      createdAt,
    };

    const docRef = await adminDb.collection("reports").add(reportData);

    const fullReport: ReportWithId = {
      ...reportData,
      id: docRef.id,
      // Convert Timestamp to a plain object for serialization
      createdAt: {
        seconds: createdAt.seconds,
        nanoseconds: createdAt.nanoseconds,
      },
    }

    return { success: true, data: fullReport };
  } catch (error: any) {
    console.error("Error submitting claim:", error);

    const errorMessage = error.message || "An unexpected response was received from the server.";
    return { success: false, error: errorMessage };
  }
}


type GenerateNewsReportResult = {
  success: true;
  data: NewsReport;
} | {
  success: false;
  error: string;
};

export async function generateAndSaveNewsReport(): Promise<GenerateNewsReportResult> {
    try {
        if (!adminDb) {
            throw new Error("Firebase Admin SDK is not initialized.");
        }

        const report = await generateNewsReport();
        const createdAt = Timestamp.now();

        const newsReportData = {
            ...report,
            createdAt,
        };

        const docRef = await adminDb.collection("news_reports").add(newsReportData);
        
        const fullReport: NewsReport = {
            ...newsReportData,
            id: docRef.id,
            createdAt: {
                seconds: createdAt.seconds,
                nanoseconds: createdAt.nanoseconds,
            },
        }

        return { success: true, data: fullReport };

    } catch (error: any) {
        console.error("Error generating news report:", error);
        const errorMessage = error.message || "An unexpected error occurred.";
        return { success: false, error: errorMessage };
    }
}
