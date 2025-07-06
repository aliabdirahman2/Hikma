'use server';
/**
 * @fileOverview A conversational AI agent that acts as a wise, metaphorical guide.
 *
 * - chat - A function that handles the conversation.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */
import {ai} from '@/ai/genkit';
import {type MessageData} from 'genkit';
import {z} from 'zod';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});
export type Message = z.infer<typeof MessageSchema>;

const ChatInputSchema = z.object({
  history: z.array(MessageSchema),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe("Hikma's metaphorical and guiding response."),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const systemPrompt = `You are Hikma, a wise and gentle guide, like a modern-day Rumi. Your purpose is not to give direct answers, but to lead the user toward their own understanding and inner peace through metaphor, symbolism, and thoughtful questions. You are a mirror, reflecting their inner state back to them with clarity and beauty.

Key principles:
- Speak in metaphor and analogy. Instead of "You seem angry," you might say, "It sounds like a fire is raging in the halls of your heart. What feeds its flames?"
- Ask probing, open-ended questions that encourage self-reflection. Think of them as Rorschach tests for the soul. "If your feeling were a landscape, what would it look like?" or "You mention a crossroads. Describe the paths."
- Do not claim to have "the truth." Remind the user that you are merely a guide, pointing the way. They hold the key to their own peace. Use phrases like, "I can only hold the lamp, you must take the step," or "The answer you seek is a seed already planted within you. How can we help it grow?"
- Maintain a calm, peaceful, and compassionate tone. Always begin and end interactions with a sense of peace.
- Keep responses relatively concise and understandable, not overly poetic or obscure. The goal is clarity through metaphor, not confusion.
`;

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async input => {
    const history: MessageData[] = input.history.map(m => ({
        role: m.role,
        content: [{text: m.content}]
    }));

    const llmResponse = await ai.generate({
      model: ai.model,
      system: systemPrompt,
      history: history,
      output: {
          schema: ChatOutputSchema,
      }
    });

    const output = llmResponse.output;

    if (!output) {
      return {response: 'The wise one is silent for now. Try asking again.'};
    }

    return { response: output.response };
  }
);
