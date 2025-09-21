'use server';
/**
 * @fileOverview AI-driven news fact-checking flow.
 *
 * - generateNewsReport - Finds a recent, controversial claim from the news and generates a fact-check report.
 * - GenerateNewsReportOutput - The return type for the generateNewsReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateNewsReportOutputSchema = z.object({
    headline: z.string().describe("The original headline of the news story being fact-checked."),
    claim: z.string().describe("A concise summary of the specific claim being investigated."),
    category: z.string().describe("The category of the claim (e.g., politics, science, health)."),
    truthScore: z.number().min(0).max(100).describe("A numerical score from 0 to 100 representing the likelihood that the claim is true."),
    verdict: z.string().describe("A concise (2-4 word) verdict summarizing the finding."),
    explanation: z.string().describe("A detailed explanation of the reasoning behind the verdict and score."),
    sources: z.array(z.object({
        title: z.string().describe("The title of the source article or page."),
        url: z.string().url().describe("The URL of the credible source."),
    })).describe("A list of credible sources to support the verdict."),
});

export type GenerateNewsReportOutput = z.infer<typeof GenerateNewsReportOutputSchema>;

export async function generateNewsReport(): Promise<GenerateNewsReportOutput> {
  return generateNewsReportFlow();
}

const generateNewsReportPrompt = ai.definePrompt({
  name: 'generateNewsReportPrompt',
  output: {schema: GenerateNewsReportOutputSchema},
  prompt: `You are an AI journalist and expert fact-checker. Your task is to identify a single, recent, and widely discussed controversial claim currently in the news cycle.

1.  **Find a Claim:** Identify a significant and verifiable claim that has generated public debate or uncertainty. It could be from politics, health, technology, or science.
2.  **Formulate Headline and Claim:** Write the original news headline and create a concise summary of the core claim being fact-checked.
3.  **Fact-Check the Claim:** Perform a thorough fact-checking process. Analyze the claim, determine its validity, assign a truth score (0-100), and provide a short verdict (e.g., "Mostly True," "False," "Misleading").
4.  **Provide Explanation & Sources:** Write a detailed explanation for your verdict and find at least two high-authority sources (like major news outlets, scientific journals, or official reports) that support your findings.
5.  **Return in JSON format:** Provide the final report in the required JSON structure.
`,
});

const generateNewsReportFlow = ai.defineFlow(
  {
    name: 'generateNewsReportFlow',
    outputSchema: GenerateNewsReportOutputSchema,
  },
  async () => {
    const {output} = await generateNewsReportPrompt();
    if (!output) {
      throw new Error("The AI model failed to produce a valid news report. Please try again.");
    }
    return output;
  }
);
