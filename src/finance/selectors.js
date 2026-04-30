export const getMonthFromDate = (date) => {
  const months = [
    "jan","fev","mar","abr","mai","jun",
    "jul","ago","set","out","nov","dez",
  ];

  return months[new Date(date).getMonth()];
};

export const getMonthlySummary = (transactions, month) => {
  let receitas = 0;
  let despesas = 0;

  for (const t of transactions) {
    if (getMonthFromDate(t.data) !== month) continue;

    const valor = Number(t.valor || 0);

    if (t.tipo === "receita") receitas += valor;
    else despesas += valor;
  }

  return { receitas, despesas, saldo: receitas - despesas };
};

export const getCategoryTotals = (transactions, month) => {
  const data = {};

  for (const t of transactions) {
    if (getMonthFromDate(t.data) !== month) continue;
    if (t.tipo !== "despesa") continue;

    const valor = Number(t.valor || 0);
    const cat = t.categoria || "Sem categoria";

    data[cat] = (data[cat] || 0) + valor;
  }

  return Object.entries(data).map(([name, value]) => ({
    name,
    value,
  }));
};