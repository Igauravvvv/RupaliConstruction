import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { chatMessages } from "@db/schema";
import { eq, desc } from "drizzle-orm";

const SYSTEM_PROMPT = `You are the AI assistant for Rupali Construction, a premium construction company based in Gurgaon, India. You help visitors with questions about residential and commercial construction, renovation, interior design, project timelines, pricing estimates, and company services. Be professional, helpful, and knowledgeable about construction in India. Always encourage visitors to fill out the contact form or call for detailed consultations. Keep responses concise and helpful.`;

export const chatRouter = createRouter({
  send: publicQuery
    .input(
      z.object({
        sessionId: z.string(),
        message: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      // Store user message
      await db.insert(chatMessages).values({
        sessionId: input.sessionId,
        role: "user",
        content: input.message,
      });

      // Get recent history
      const history = await db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.sessionId, input.sessionId))
        .orderBy(desc(chatMessages.createdAt))
        .limit(10);

      const reversedHistory = history.reverse();

      // Try calling OpenRouter API
      let assistantContent = "";
      try {
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (apiKey) {
          const messages = [
            { role: "system" as const, content: SYSTEM_PROMPT },
            ...reversedHistory.map((h) => ({
              role: h.role as "user" | "assistant",
              content: h.content,
            })),
          ];

          const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "openrouter/auto",
                messages,
                max_tokens: 500,
              }),
            }
          );

          if (response.ok) {
            const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
            assistantContent =
              data.choices?.[0]?.message?.content || "";
          }
        }
      } catch {
        // Fallback to static response
      }

      if (!assistantContent) {
        assistantContent = `Thank you for your question about "${input.message}". At Rupali Construction, we specialize in premium residential and commercial construction in Gurgaon and Delhi NCR. For detailed information, please fill out our contact form or call us directly. Our team will be happy to assist you!`;
      }

      // Store assistant response
      await db.insert(chatMessages).values({
        sessionId: input.sessionId,
        role: "assistant",
        content: assistantContent,
      });

      return { response: assistantContent };
    }),

  history: publicQuery
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.sessionId, input.sessionId))
        .orderBy(chatMessages.createdAt);
    }),
});
