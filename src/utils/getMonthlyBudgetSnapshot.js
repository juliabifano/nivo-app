export function getMonthlyBudgetSnapshot(
  items = [],
  transactions = [],
  month,
  categories = [],
) {
  const safe = (v) => Number(v || 0);

  const getCategoryName = (categoriaId) =>
    categories.find((c) => String(c.id) === String(categoriaId))?.nome ||
    "Sem categoria";

  const getMonthFromDate = (date) =>
    new Date(date)
      .toLocaleString("pt-BR", { month: "short" })
      .toLowerCase()
      .replace(".", "");

  const expandTransactions = (transactions) => {
    const expanded = [];

    for (const t of transactions) {
      const parcelas = Number(t.parcelas || 1);
      const valorParcela = safe(t.valor) / parcelas;
      const baseDate = new Date(t.data);

      for (let i = 0; i < parcelas; i++) {
        const newDate = new Date(baseDate);
        newDate.setMonth(baseDate.getMonth() + i);

        expanded.push({
          ...t,
          valor: valorParcela,
          valorFinal: valorParcela,
          data: newDate.toISOString(),
        });
      }
    }

    return expanded;
  };

  const allTransactions = expandTransactions(transactions);

  const monthlyItems = [
    ...items.map((i) => ({
      ...i,
      valorFinal: safe(i.valorMensal ?? i.valor),
      categoriaNome: getCategoryName(i.categoriaId),
      origem: "orcamento",
    })),

    ...allTransactions.map((t) => ({
      ...t,
      valorFinal: safe(t.valor),
      categoriaNome: getCategoryName(t.categoriaId),
      origem: "transacao",
    })),
  ].filter((item) => {
    if (item.origem === "orcamento") {
      return item.meses?.includes(month);
    }

    if (item.origem === "transacao") {
      return getMonthFromDate(item.data) === month;
    }

    return false;
  });

  let receitas = 0;
  let despesas = 0;

  const byCategory = {
    receita: {},
    despesa: {},
  };

  for (const item of monthlyItems) {
    const valor = item.valorFinal;
    const categoria = item.categoriaNome || "Sem categoria";

    if (item.tipo === "receita") {
      receitas += valor;
      byCategory.receita[categoria] =
        (byCategory.receita[categoria] || 0) + valor;
    } else {
      despesas += valor;
      byCategory.despesa[categoria] =
        (byCategory.despesa[categoria] || 0) + valor;
    }
  }

  const toArray = (obj) =>
    Object.entries(obj).map(([name, value]) => ({ name, value }));

  return {
    monthlyItems,
    receitas,
    despesas,
    saldo: receitas - despesas,
    receitasData: toArray(byCategory.receita),
    despesasData: toArray(byCategory.despesa),
  };
}
