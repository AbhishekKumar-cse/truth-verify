"use server";

import { z } from "zod";
import { db } from "@/lib/firebase";
import { generateFactCheckReport, GenerateFactCheckReportInput, GenerateFactCheckReportOutput } from "@/ai/flows/generate-fact-check-report";
import { collection, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";

const claimSchema = z.object({
  title: z.string(),
  statement: z.string(),
  category: z.string(),
  sourceUrl: z.string().optional(),
});

export async function submitClaim(values: z.infer<typeof claimSchema>, userId: string): Promise<{ success: boolean; data?: GenerateFactCheckReportOutput & { id: string }; error?: string }> {
  try {
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
      truthScore: report.truthScore,
      verdict: report.verdict,
      supportingSources: report.supportingSources,
      createdAt: serverTimestamp() as Timestamp,
    };

    const docRef = await addDoc(collection(db, "reports"), reportData);

    return { success: true, data: { ...report, id: docRef.id } };
  } catch (error: any) {
    console.error("Error submitting claim:", error);
    const errorMessage = error.message || "An unexpected response was received from the server.";
    return { success: false, error: errorMessage };
  }
}
