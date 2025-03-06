/**
 * Gets the start date for counting API usage based on the user's last_usage_reset_at date
 */
export function getStartDateForApiUsage(lastUsageResetAt: string | null): Date {
  if (!lastUsageResetAt) {
    // Fallback to first day of current month if no reset date is available
    const currentDate = new Date();
    return new Date(
      Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 1),
    );
  }

  const resetDate = new Date(lastUsageResetAt);
  const currentDate = new Date();

  // Create date with same day in current month
  const currentMonthResetDay = new Date(
    Date.UTC(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      resetDate.getUTCDate(),
    ),
  );

  // If we're past the reset day in the current month, use current month's reset day
  // Otherwise, use last month's reset day
  if (currentDate.getTime() >= currentMonthResetDay.getTime()) {
    return currentMonthResetDay;
  } else {
    // Use the previous month's reset day
    const lastMonthResetDay = new Date(
      Date.UTC(
        currentDate.getUTCMonth() === 0
          ? currentDate.getUTCFullYear() - 1
          : currentDate.getUTCFullYear(),
        currentDate.getUTCMonth() === 0 ? 11 : currentDate.getUTCMonth() - 1,
        resetDate.getUTCDate(),
      ),
    );

    // Handle edge cases (e.g., Jan 31 → Feb 28/29)
    if (lastMonthResetDay.getUTCDate() !== resetDate.getUTCDate()) {
      // Set to the last day of the target month
      lastMonthResetDay.setUTCDate(0);
    }

    return lastMonthResetDay;
  }
}
