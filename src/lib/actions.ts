"use server";

import { z } from "zod";
import { adminDb } from "@/lib/firebase-admin";
import { generateFactCheckReport, GenerateFactCheckReportInput } from "@/ai/flows/generate-fact-check-report";
import { Timestamp } from "firebase-admin/firestore";

const claimSchema = z.object({
  title: z.string(),
  statement: z.string(),
  category: z.string(),
  sourceUrl: z.string().optional(),
});

type SubmitClaimResult = {
  success: true;
  data: {
    id: string;
    verdict: string;
    explanation: string;
    sources: { title: string; url: string }[];
  };
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

    const reportData = {
      userId,
      claimTitle: validatedValues.title,
      claimStatement: validatedValues.statement,
      claimCategory: validatedValues.category,
      claimSourceUrl: validatedValues.sourceUrl || "",
      verdict: report.verdict,
      explanation: report.explanation,
      sources: report.sources,
      createdAt: Timestamp.now(),
    };

    const docRef = await adminDb.collection("reports").add(reportData);

    return { success: true, data: { ...report, id: docRef.id } };
  } catch (error: any) {
    console.error("Error submitting claim:", error);

    const errorMessage = error.message || "An unexpected response was received from the server.";
    return { success: false, error: errorMessage };
  }
}
