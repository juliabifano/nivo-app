export function getInsights({
  transactions = [],
  topCategories = [],
  summary,
  cards = [],
}) {
  const insights = [];

  const realTransactions = transactions.filter(
    (t) =>
      !t.isPreview &&
      t.origem !== "pagamento_fatura" &&
      t.formaPagamento !== "pagamento_fatura",
  );

  if (topCategories.length > 0 && summary.despesas > 0) {
    const top = topCategories[0];
    const percent = Math.round((top.value / summary.despesas) * 100);

    insights.push({
      type: percent >= 40 ? "warning" : "info",
      title: "Maior categoria",
      message: `${top.name} representa ${percent}% das suas despesas.`,
    });
  }

  const highTransactions = realTransactions.filter(
    (t) => Number(t.valor) >= 1000,
  );

  if (highTransactions.length > 0) {
    insights.push({
      type: "info",
      title: "Movimentação alta",
      message: `${highTransactions.length} lançamento(s) passaram de R$ 1.000.`,
    });
  }

  const usage = {};

  realTransactions.forEach((t) => {
    if (!t.cartaoId) return;
    if (t.formaPagamento !== "credito") return;

    usage[t.cartaoId] = (usage[t.cartaoId] || 0) + Number(t.valor || 0);
  });

  const topCardId = Object.entries(usage).sort((a, b) => b[1] - a[1])[0];

  if (topCardId) {
    const card = cards.find((c) => String(c.id) === String(topCardId[0]));

    if (card) {
      insights.push({
        type: "success",
        title: "Cartão principal",
        message: `${card.nome} foi o cartão mais utilizado no mês.`,
      });
    }
  }

  cards.forEach((card) => {
    if (!["credito", "multiplo"].includes(card.tipo)) return;

    const total = usage[card.id] || 0;
    const limite = Number(card.limite || 0);

    if (limite > 0) {
      const percent = Math.round((total / limite) * 100);

      if (percent >= 80) {
        insights.push({
          type: "warning",
          title: "Limite em atenção",
          message: `${card.nome} já usou ${percent}% do limite.`,
        });
      }
    }
  });

  if (summary.saldo < 0) {
    insights.push({
      type: "warning",
      title: "Saldo negativo",
      message: "Suas despesas estão maiores que suas receitas neste mês.",
    });
  }

  return insights.slice(0, 4);
}