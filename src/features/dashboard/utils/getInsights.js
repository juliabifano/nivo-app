export function getInsights({
  transactions = [],
  topCategories = [],
  summary,
  cards = [],
}) {
  const insights = [];

  // -------------------------
  // MAIOR CATEGORIA
  // -------------------------
  if (topCategories.length > 0 && summary.despesas > 0) {
    const top = topCategories[0];

    const percent = Math.round(
      (top.value / summary.despesas) * 100,
    );

    insights.push({
      type: "warning",
      title: "Maior categoria",
      message: `${top.name} representa ${percent}% das suas despesas.`,
    });
  }

  // -------------------------
  // TRANSAÇÕES ALTAS
  // -------------------------
  const highTransactions = transactions.filter(
    (t) => Number(t.valor) >= 1000,
  );

  if (highTransactions.length > 0) {
    insights.push({
      type: "info",
      title: "Movimentação alta",
      message: `${highTransactions.length} transações passaram de R$ 1.000.`,
    });
  }

  // -------------------------
  // CARTÃO MAIS USADO
  // -------------------------
  const usage = {};

  transactions.forEach((t) => {
    if (!t.cartaoId) return;

    usage[t.cartaoId] =
      (usage[t.cartaoId] || 0) + Number(t.valor || 0);
  });

  const topCardId = Object.entries(usage).sort(
    (a, b) => b[1] - a[1],
  )[0];

  if (topCardId) {
    const card = cards.find(
      (c) => String(c.id) === String(topCardId[0]),
    );

    if (card) {
      insights.push({
        type: "success",
        title: "Cartão principal",
        message: `${card.nome} foi o cartão mais utilizado no mês.`,
      });
    }
  }

  return insights.slice(0, 3);
}