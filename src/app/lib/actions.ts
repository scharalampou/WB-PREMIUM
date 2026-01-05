"use server";

const WIN_SUGGESTIONS = [
  "I put on 'real' pants today (leggings count).",
  "I didn't argue with a stranger on the internet.",
  "I drank water instead of a third cup of coffee.",
  "I actually ate a vegetable!",
  "I survived a meeting that definitely could have been an email.",
  "I washed the one dish I actually needed to use.",
  "I stepped outside for 3 minutes and didn't immediately turn back.",
  "I let a phone call go to voicemail because I wasn't feeling it.",
  "I took a deep breath that actually reached my stomach.",
  "I remembered to take my vitamins.",
  "Grateful for... the cold side of the pillow.",
  "Grateful for... the 'Skip Intro' button on Netflix.",
  "Grateful for... the fact that dogs and cats exist."
];

export async function getWinSuggestion() {
  try {
    const suggestion = WIN_SUGGESTIONS[Math.floor(Math.random() * WIN_SUGGESTIONS.length)];
    return { suggestion };
  } catch (error) {
    console.error("Suggestion error:", error);
    return { error: "Failed to generate a suggestion. Please try again." };
  }
}