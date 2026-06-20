'use server';
/**
 * @fileOverview A Genkit flow for suggesting relevant tags for study content.
 *
 * - suggestContentTags - A function that suggests tags based on content title and summary.
 * - SuggestContentTagsInput - The input type for the suggestContentTags function.
 * - SuggestContentTagsOutput - The return type for the suggestContentTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestContentTagsInputSchema = z.object({
  title: z.string().describe('The title of the study content.'),
  summary: z.string().describe('A summary of the study content.'),
});
export type SuggestContentTagsInput = z.infer<typeof SuggestContentTagsInputSchema>;

const SuggestContentTagsOutputSchema = z.object({
  suggestedTags: z
    .array(z.string())
    .describe('A list of relevant tags for the study content.'),
});
export type SuggestContentTagsOutput = z.infer<typeof SuggestContentTagsOutputSchema>;

export async function suggestContentTags(
  input: SuggestContentTagsInput
): Promise<SuggestContentTagsOutput> {
  return suggestContentTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestContentTagsPrompt',
  input: {schema: SuggestContentTagsInputSchema},
  output: {schema: SuggestContentTagsOutputSchema},
  prompt: `You are an AI assistant specialized in organizing study materials.
Your task is to suggest relevant and concise tags for study content based on its title and summary.
Aim for 3 to 7 tags that accurately categorize the content and make it easy to find.
Provide the tags as a JSON array.

Title: {{{title}}}
Summary: {{{summary}}}`,
});

const suggestContentTagsFlow = ai.defineFlow(
  {
    name: 'suggestContentTagsFlow',
    inputSchema: SuggestContentTagsInputSchema,
    outputSchema: SuggestContentTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate tags.');
    }
    return output;
  }
);
