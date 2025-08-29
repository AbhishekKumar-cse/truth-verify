"use server";

import { z } from "zod";
import { db } from "@/lib/firebase";
import { generateFactCheckReport } from "@/ai/flows/generate-fact-check-report";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import type { GenerateFactCheckReportInput } from "@/ai/flows/generate-fact-check-report";

const claimSchema = z.object({
  title: z.string(),
  statement: z.string(),
  category: z.string(),
  sourceUrl: z.string().optional(),
});

export async function submitClaim(values: z.infer<typeof claimSchema>, userId: string) {
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
      ...report,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "reports"), reportData);

    return { success: true, data: { ...report, id: docRef.id } };
  } catch (error: any) {
    console.error("Error submitting claim:", error);
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}
