"use server";

import { generateWinSuggestion } from "@/ai/flows/generate-win-suggestion";

export async function getWinSuggestion() {
  try {
    const suggestion = await generateWinSuggestion();
    return { suggestion };
  } catch (error) {
    console.error("AI suggestion error:", error);
    return { error: "Failed to generate a suggestion. Please try again." };
  }
}
