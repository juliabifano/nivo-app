export function getBudgetPaymentId(itemId, month, year) {
  return `orcamento-${itemId}-${month}-${year}`;
}

export function getBudgetOccurrence(item, transactions, month, year) {
  const paymentId = getBudgetPaymentId(item.id, month, year);
  const linked = transactions.filter((transaction) => transaction.schedulePaymentId === paymentId);
  return linked.find((transaction) => !transaction.isPreview) || linked[0];
}

export async function saveTransactionEdit({ transaction, changes, transactions, add, update }) {
  if (transaction.isPreview && transaction.id.startsWith("budget-")) {
    const existing = transactions.find((item) => item.schedulePaymentId === transaction.schedulePaymentId);
    if (existing) return update(existing.id, changes);
    const saved = await add({
      ...changes,
      schedulePaymentId: transaction.schedulePaymentId,
      origem: "orcamento",
      isPreview: true,
    });
    if (!saved) throw new Error("Não foi possível salvar o lançamento deste mês.");
    return saved;
  }
  return update(transaction.id, changes);
}
