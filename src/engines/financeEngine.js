export const getMonthFromDate = (date) => {
  const months = [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez",
  ];

  return months[new Date(date).getMonth()];
};

export const getMonthlySummary = (transactions, month) => {
  let receitas = 0;
  let despesas = 0;

  transactions.forEach((t) => {
    if (getMonthFromDate(t.data) !== month) return;

    const valor = Number(t.valor) || 0;

    if (t.tipo === "receita") receitas += valor;
    else despesas += valor;
  });

  return {
    receitas,
    despesas,
    saldo: receitas - despesas,
  };
};


export const getCategoryTotals = (transactions, month) => {
  const data = {};

  transactions.forEach((t) => {
    if (getMonthFromDate(t.data) !== month) return;
    if (t.tipo !== "despesa") return;

    const valor = Number(t.valor) || 0;
    const cat = t.categoria || "Sem categoria";

    data[cat] = (data[cat] || 0) + valor;
  });

  return Object.entries(data).map(([name, value]) => ({
    name,
    value,
  }));
};

export const getRecentTransactions = (transactions, limit = 5) => {
  return [...transactions]
    .sort((a, b) => new Date(b.data) - new Date(a.data))
    .slice(0, limit);
};

export const getMostUsedCard = (transactions) => {
  const map = {};

  transactions.forEach((t) => {
    if (!t.cartao) return;

    map[t.cartao] = (map[t.cartao] || 0) + Number(t.valor || 0);
  });

  const top = Object.entries(map).sort((a, b) => b[1] - a[1])[0];

  return top || null;
};