export function createFinanceSelectors(finance) {
  const cardMap = new Map(
    finance.cards.map((c) => [String(c.id), c]),
  );

  const getCard = (id) => cardMap.get(String(id));

  const getBalance = () => finance.summary.balance;

  const getIncome = () => finance.summary.income;

  const getExpense = () => finance.summary.expense;

  return {
    getCard,
    getBalance,
    getIncome,
    getExpense,
  };
}