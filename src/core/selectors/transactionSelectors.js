export function getTotalReceitas(transactions) {
  return transactions
    .filter((t) => t.tipo === "receita")
    .reduce((acc, t) => acc + Number(t.valor || 0), 0);
}

export function getTotalDespesas(transactions) {
  return transactions
    .filter((t) => t.tipo === "despesa")
    .reduce((acc, t) => acc + Number(t.valor || 0), 0);
}

export function getSaldo(transactions) {
  return getTotalReceitas(transactions) - getTotalDespesas(transactions);
}

export function parseLocalDate(date) {
  if (!date) return new Date();

  if (date instanceof Date) return date;

  if (String(date).includes("T")) {
    return new Date(date);
  }

  const [y, m, d] = String(date).split("-");

  return new Date(Number(y), Number(m) - 1, Number(d));
}

export function filterTransactions(transactions = [], filters = {}) {
  return transactions.filter((t) => {
    const matchTipo =
      !filters.tipo || filters.tipo === "todos" || t.tipo === filters.tipo;

    const matchCategoria =
      !filters.categoriaId ||
      String(t.categoriaId) === String(filters.categoriaId);

    const matchPeriodo = filterByPeriod(t.data, filters.periodo);

    const matchForma =
      !filters.formaPagamento || t.formaPagamento === filters.formaPagamento;

    const matchCartao =
      !filters.cartaoId || String(t.cartaoId) === String(filters.cartaoId);

    const matchConta =
      !filters.accountId || String(t.accountId) === String(filters.accountId);

    const matchData = !filters.data || isSameDay(t.data, filters.data);

    const matchDateRange = filterByDateRange(
      t.data,
      filters.dataInicio,
      filters.dataFim,
    );

    return (
      matchTipo &&
      matchCategoria &&
      matchPeriodo &&
      matchForma &&
      matchCartao &&
      matchConta &&
      matchData &&
      matchDateRange
    );
  });
}

function isSameDay(date1, date2) {
  const d1 = parseLocalDate(date1);
  const d2 = parseLocalDate(date2);

  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function filterByDateRange(date, dataInicio, dataFim) {
  if (!dataInicio && !dataFim) return true;

  const tx = parseLocalDate(date);

  const start = dataInicio ? parseLocalDate(dataInicio) : null;
  const end = dataFim ? parseLocalDate(dataFim) : null;

  if (start && tx < start) return false;
  if (end && tx > end) return false;

  return true;
}

function filterByPeriod(date, periodo) {
  if (!periodo || periodo === "todos") return true;

  const transactionDate = parseLocalDate(date);
  const today = new Date();

  const startOfDay = (d) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const tx = startOfDay(transactionDate);
  const now = startOfDay(today);

  if (periodo === "hoje") {
    return tx.getTime() === now.getTime();
  }

  if (periodo === "ontem") {
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    return tx.getTime() === yesterday.getTime();
  }

  if (periodo === "7dias") {
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 6);

    return tx >= sevenDaysAgo && tx <= now;
  }

  return true;
}

export function sortTransactionsByDate(transactions) {
  return [...transactions].sort((a, b) => {
    const dateA = new Date(a.createdAt || parseLocalDate(a.data));
    const dateB = new Date(b.createdAt || parseLocalDate(b.data));

    return dateB - dateA;
  });
}
