'use server';
/**
 * @fileOverview Fact-check report generation flow.
 *
 * - generateFactCheckReport - Generates a fact-check report for a given claim.
 * - GenerateFactCheckReportInput - The input type for the generateFactCheckReport function.
 * - GenerateFactCheckReportOutput - The return type for the generateFactCheckReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFactCheckReportInputSchema = z.object({
  title: z.string().describe('The title of the claim.'),
  statement: z.string().describe('The full statement of the claim to be fact-checked.'),
  category: z.string().describe('The category of the claim (e.g., politics, science, health).'),
  sourceUrl: z.string().url().optional().describe('Optional URL providing additional context for the claim.'),
});
export type GenerateFactCheckReportInput = z.infer<typeof GenerateFactCheckReportInputSchema>;

const GenerateFactCheckReportOutputSchema = z.object({
    truthScore: z.number().min(0).max(100).describe("A numerical score from 0 to 100 representing the likelihood that the claim is true. 100 is completely true, 0 is completely false."),
    verdict: z.string().describe("A concise (2-4 word) verdict summarizing the finding, like 'Highly Misleading', 'Factually Correct', or 'Lacks Evidence'."),
    explanation: z.string().describe("A detailed explanation of the reasoning behind the verdict and score, analyzing the claim and the evidence."),
    sources: z.array(z.object({
        title: z.string().describe("The title of the source article or page."),
        url: z.string().url().describe("The URL of the credible source."),
    })).describe("A list of credible sources to support the verdict."),
});
export type GenerateFactCheckReportOutput = z.infer<typeof GenerateFactCheckReportOutputSchema>;

export async function generateFactCheckReport(input: GenerateFactCheckReportInput): Promise<GenerateFactCheckReportOutput> {
  return generateFactCheckReportFlow(input);
}

const generateFactCheckReportPrompt = ai.definePrompt({
  name: 'generateFactCheckReportPrompt',
  input: {schema: GenerateFactCheckReportInputSchema},
  output: {schema: GenerateFactCheckReportOutputSchema},
  prompt: `You are a sophisticated fact-checking AI. The user has submitted a claim for analysis.

Claim: "{{statement}}"
{{#if sourceUrl}}Source Provided: {{sourceUrl}}{{/if}}

Your tasks are to:
1.  **Analyze the claim thoroughly.** Scrutinize the statement, its implications, and any provided source material.
2.  **Determine a Truth Score.** Assign a confidence score from 0 (completely false) to 100 (completely true) based on credible evidence.
3.  **Provide a concise Verdict.** Give a short, descriptive verdict (e.g., "Factually Correct," "Mostly True," "Misleading," "False," "Unverifiable").
4.  **Write a detailed Explanation.** Explain your reasoning for the score and verdict. If the claim is false or misleading, clearly state why and what the correct information is.
5.  **Find Supporting Sources.** Provide at least two credible, high-authority sources (e.g., major news outlets, scientific journals, government reports) that support your analysis. If the claim is unverifiable, do not provide sources.
6.  **Return your answer in the required JSON format.**
`,
});

const generateFactCheckReportFlow = ai.defineFlow(
  {
    name: 'generateFactCheckReportFlow',
    inputSchema: GenerateFactCheckReportInputSchema,
    outputSchema: GenerateFactCheckReportOutputSchema,
  },
  async input => {
    const {output} = await generateFactCheckReportPrompt(input);
    if (!output) {
      throw new Error("The AI model failed to produce a valid report. Please try again.");
    }
    return output;
  }
);
