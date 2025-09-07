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
    verdict: z.enum(["True", "False", "Unverifiable"]).describe("Your final verdict on the claim."),
    explanation: z.string().describe("A short explanation of why the claim is true, false, or unverifiable."),
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
  prompt: `You are a fact-checking assistant.
The user has submitted the following claim:

Claim: "{{statement}}"

Your tasks:
1. Analyze the claim and decide if it is factually correct or incorrect.
2. If the claim is correct, provide at least one credible source (news site, research, or government website).
3. If the claim is incorrect, explain why it is wrong and provide at least one credible source that disproves it.
4. If you cannot verify the claim, state that it is unverifiable and do not provide sources.
5. Return your answer in JSON format that strictly adheres to the defined schema.
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
