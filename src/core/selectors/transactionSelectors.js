export function getTotalReceitas(transactions) {
  return transactions
    .filter((t) => t.tipo === "receita")
    .reduce((acc, t) => acc + t.valor, 0);
}

export function getTotalDespesas(transactions) {
  return transactions
    .filter((t) => t.tipo === "despesa")
    .reduce((acc, t) => acc + t.valor, 0);
}

export function getSaldo(transactions) {
  const receitas = getTotalReceitas(transactions);
  const despesas = getTotalDespesas(transactions);

  return receitas - despesas;
}

export function filterTransactions(transactions, filters) {
  return transactions.filter((t) => {
    const matchTipo =
      filters.tipo === "todos" || t.tipo === filters.tipo;

    const matchCategoria =
      !filters.categoriaId || t.categoriaId === filters.categoriaId;

    return matchTipo && matchCategoria;
  });
}

export function sortTransactionsByDate(transactions) {
  return [...transactions].sort(
    (a, b) => new Date(b.data) - new Date(a.data)
  );
}