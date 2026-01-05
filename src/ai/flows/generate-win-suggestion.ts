'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating witty and funny win suggestions.
 *
 * The flow takes no input and returns a string containing a win suggestion.
 * It exports the `generateWinSuggestion` function, which calls the flow.
 *
 * @interface GenerateWinSuggestionOutput The output of the generateWinSuggestion flow, which is a string containing a win suggestion.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWinSuggestionOutputSchema = z.string().describe('A witty and funny suggestion for a daily win.');
export type GenerateWinSuggestionOutput = z.infer<typeof GenerateWinSuggestionOutputSchema>;

async function generateWinSuggestion(): Promise<GenerateWinSuggestionOutput> {
  return generateWinSuggestionFlow();
}

const generateWinSuggestionPrompt = ai.definePrompt({
  name: 'generateWinSuggestionPrompt',
  prompt: `You are a witty and funny assistant helping users to come up with ideas for small daily wins.  Provide a single suggestion, phrased as a complete sentence. The suggestions should be lighthearted and inspire the user to recognize positive aspects of their day, no matter how small.

Example Suggestions:
* "I successfully navigated a crowded grocery store without buying impulse snacks."
* "I managed to parallel park on the first try, like a boss."
* "I replied to that email I was dreading."
* "I found matching socks in the laundry today. A true victory!"
* "I made my bed!"
* "I resisted the urge to binge-watch TV and read a book instead!"
* "I drank enough water today."

Now, generate a new, unique suggestion:
`,
  output: {schema: GenerateWinSuggestionOutputSchema},
});

const generateWinSuggestionFlow = ai.defineFlow(
  {
    name: 'generateWinSuggestionFlow',
    inputSchema: z.void(),
    outputSchema: GenerateWinSuggestionOutputSchema,
  },
  async () => {
    const {text} = await generateWinSuggestionPrompt();
    return text!;
  }
);

export {generateWinSuggestion};
