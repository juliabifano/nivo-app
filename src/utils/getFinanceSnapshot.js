export function getFinanceSnapshot({ transactions = [], cartoes = [] }) {
  const safeNumber = (v) => Number(v || 0);

  const cards = cartoes.map((card) => {
    const cardTransactions = transactions.filter(
      (t) => String(t.cartaoId) === String(card.id),
    );

    // =========================
    // 💳 CRÉDITO / MÚLTIPLO
    // =========================
    if (card.tipo === "credito" || card.tipo === "multiplo") {
      const gastos = cardTransactions
        .filter((t) => t.tipo === "despesa")
        .reduce((acc, t) => acc + safeNumber(t.valor), 0);

      const entradas = cardTransactions
        .filter((t) => t.tipo === "receita")
        .reduce((acc, t) => acc + safeNumber(t.valor), 0);

      const limite = safeNumber(card.limite);

      const disponivel = limite - gastos + entradas;

      return {
        ...card,
        limite,
        spent: gastos,
        available: disponivel,
        disponivel,
        percent:
          limite > 0 ? (gastos / limite) * 100 : 0,
      };
    }

    // =========================
    // 💰 DÉBITO
    // =========================
    if (card.tipo === "debito") {
      return {
        ...card,
        balance: safeNumber(card.saldoInicial),
        available: safeNumber(card.saldoInicial),
        percent: 0,
      };
    }

    // =========================
    // 🎁 VALE (CORREÇÃO DEFINITIVA)
    // =========================
    if (card.tipo === "vale") {
      const saldoInicial = safeNumber(card.saldoInicial);

      const getLastResetDate = (diaReset) => {
        if (!diaReset) return null;

        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = hoje.getMonth();

        const resetAtual = new Date(ano, mes, diaReset);

        if (hoje < resetAtual) {
          return new Date(ano, mes - 1, diaReset);
        }

        return resetAtual;
      };

      const lastReset = getLastResetDate(card.diaReset);

      const gastoPeriodo = cardTransactions
        .filter((t) => {
          const data = new Date(t.data);
          return lastReset ? data >= lastReset : true;
        })
        .reduce((acc, t) => acc + safeNumber(t.valor), 0);

      const disponivel = saldoInicial - gastoPeriodo;

      return {
        ...card,
        saldoInicial,
        spent: gastoPeriodo,
        available: disponivel,
        disponivel,
        balance: disponivel,
        percent:
          saldoInicial > 0
            ? (gastoPeriodo / saldoInicial) * 100
            : 0,
      };
    }

    return {
      ...card,
      available: 0,
      percent: 0,
    };
  });

  // =========================
  // 📊 RESUMO GERAL
  // =========================
  const totalIncome = transactions
    .filter((t) => t.tipo === "receita")
    .reduce((acc, t) => acc + safeNumber(t.valor), 0);

  const totalExpense = transactions
    .filter((t) => t.tipo === "despesa")
    .reduce((acc, t) => acc + safeNumber(t.valor), 0);

  const balance = totalIncome - totalExpense;

  return {
    cards,
    summary: {
      income: totalIncome,
      expense: totalExpense,
      balance,
    },
  };
}