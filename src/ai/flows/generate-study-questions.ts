'use server';
/**
 * @fileOverview A Genkit flow for generating study questions based on user-provided study content.
 *
 * - generateStudyQuestions - A function that handles the study question generation process.
 * - GenerateStudyQuestionsInput - The input type for the generateStudyQuestions function.
 * - GenerateStudyQuestionsOutput - The return type for the generateStudyQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStudyQuestionsInputSchema = z.object({
  studyContent: z
    .string()
    .describe(
      'The study notes or summary content from which to generate questions.'
    ),
});
export type GenerateStudyQuestionsInput = z.infer<
  typeof GenerateStudyQuestionsInputSchema
>;

const GenerateStudyQuestionsOutputSchema = z.object({
  questions: z
    .array(z.string())
    .describe(
      'An array of automatically generated questions based on the study content.'
    ),
});
export type GenerateStudyQuestionsOutput = z.infer<
  typeof GenerateStudyQuestionsOutputSchema
>;

export async function generateStudyQuestions(
  input: GenerateStudyQuestionsInput
): Promise<GenerateStudyQuestionsOutput> {
  return generateStudyQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStudyQuestionsPrompt',
  input: {schema: GenerateStudyQuestionsInputSchema},
  output: {schema: GenerateStudyQuestionsOutputSchema},
  prompt: `You are an expert educator tasked with creating effective study questions.

Based on the following study content, generate a list of concise, clear, and challenging questions that will help a student test their knowledge and engage in active recall.

The questions should cover key concepts and important details from the provided content.

Study Content:
{{{studyContent}}}

Generate at least 5 questions. Format the output as a JSON array of strings, where each string is a question.`,
});

const generateStudyQuestionsFlow = ai.defineFlow(
  {
    name: 'generateStudyQuestionsFlow',
    inputSchema: GenerateStudyQuestionsInputSchema,
    outputSchema: GenerateStudyQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
