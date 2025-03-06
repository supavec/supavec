import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Message } from "ai";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getMostRecentUserMessage(messages: Array<Message>) {
  const userMessages = messages.filter((message) => message.role === "user");
  return userMessages.at(-1);
}

/**
 * Calculates the next usage reset date based on the last usage reset date.
 * Follows Stripe's monthly cycle logic (e.g., Jan 2 → Feb 2).
 * Handles edge cases like month end dates properly.
 *
 * @param lastUsageResetAt - ISO string date of the last usage reset
 * @returns ISO string of the next usage reset date
 */
export function getNextUsageResetDate(
  lastUsageResetAt: string | null,
): string | null {
  if (!lastUsageResetAt) return null;

  const resetDate = new Date(lastUsageResetAt);
  const day = resetDate.getDate();
  const month = resetDate.getMonth();
  const year = resetDate.getFullYear();

  // Create a new date for the next month with the same day
  const nextResetDate = new Date(year, month + 1, day);

  // Handle edge cases (e.g., Jan 31 → Feb 28/29)
  // If the day doesn't match, it means we've rolled over to the next month
  // due to the target month not having enough days
  if (nextResetDate.getDate() !== day) {
    // Set to the last day of the target month
    nextResetDate.setDate(0);
  }

  return nextResetDate.toISOString();
}
