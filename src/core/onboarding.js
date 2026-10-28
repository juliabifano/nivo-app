export function getOnboardingState({ status, loading, accounts, categories, cards, transactions, items }) {
  const steps = {
    "/accounts": accounts.length > 0,
    "/categories": categories.length > 0,
    "/cards": cards.length > 0,
    "/transactions": transactions.length > 0,
  };
  const allStepsCompleted = Object.values(steps).every(Boolean);
  const hasAnyData = Object.values(steps).some(Boolean) || items.length > 0;
  const finished = status === "completed" || status === "skipped" || (!loading && allStepsCompleted);

  return {
    steps,
    allStepsCompleted,
    hasAnyData,
    finished,
    active: !loading && !finished && (status === "active" || hasAnyData),
    needsWelcome: !loading && !finished && !hasAnyData && status !== "active",
  };
}

export async function persistOnboardingStatus(auth, status) {
  const { error } = await auth.updateUser({ data: { nivo_onboarding_status: status } });
  if (error) throw error;
}
