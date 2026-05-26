export function generateInvoice({
  transactions = [],
  budgetItems = [],
  card,
  month,
  year,
}) {
  const expanded = [];

  const parseDate = (date) => {
    if (date instanceof Date) return date;

    if (typeof date === "string") {
      const [year, month, day] = date.split("-");
      return new Date(year, month - 1, day);
    }

    return new Date(date);
  };

  const getInvoiceMonth = (dataCompra, diaFechamento) => {
    const dia = dataCompra.getDate();
    const mes = dataCompra.getMonth(); // 0–11
    const ano = dataCompra.getFullYear();

    if (dia > diaFechamento) {
      return { mes: mes + 2, ano }; // próximo mês (1–12)
    }

    return { mes: mes + 1, ano }; // mês atual (1–12)
  };

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

  const budgetAsTransactions = [];

  budgetItems.forEach((item) => {
    if (item.formaPagamento !== "credito") return;
    if (String(item.cartaoId) !== String(card.id)) return;

    const anos = [year - 1, year, year + 1];

    anos.forEach((anoBase) => {
      months.forEach((m, index) => {
        if (!item.meses?.includes(m)) return;

        budgetAsTransactions.push({
          id: `budget-${item.id}-${m}-${anoBase}`,
          descricao: item.descricao,
          valor: Number(item.valorMensal || 0),
          data: `${anoBase}-${String(index + 1).padStart(2, "0")}-${String(
            item.diaVencimento || 1,
          ).padStart(2, "0")}`,
          formaPagamento: "credito",
          cartaoId: item.cartaoId,
          parcelas: 1,
          origem: "orcamento",
        });
      });
    });
  });

  [...transactions, ...budgetAsTransactions].forEach((t) => {
    if (String(t.cartaoId) !== String(card.id)) return;

    if (t.formaPagamento !== "credito") return;

    const totalParcelas = Number(t.parcelas || 1);
    const valorParcela = Number(t.valor) / totalParcelas;

    const dataCompra = parseDate(t.data);

    for (let i = 0; i < totalParcelas; i++) {
      const dataParcela = new Date(
        dataCompra.getFullYear(),
        dataCompra.getMonth() + i,
        dataCompra.getDate(),
      );

      const { mes, ano } = getInvoiceMonth(dataParcela, card.fechamento || 10);

      expanded.push({
        id: `${t.id}-${i}`,
        descricao: `${t.descricao} (${i + 1}/${totalParcelas})`,
        valor: valorParcela,
        data: dataParcela,
        mesFatura: mes,
        anoFatura: ano,
        cartaoId: t.cartaoId,
      });
    }
  });

  const filtered = expanded.filter((t) => {
    return t.mesFatura === month && t.anoFatura === year;
  });

  return {
    cardId: card.id,
    cardName: card.nome,
    total: filtered.reduce((a, t) => a + t.valor, 0),
    transactions: filtered,
  };
}

export const groupByDate = (transactions) => {
  const groups = {};

  transactions.forEach((t) => {
    const date = t.data instanceof Date ? t.data : new Date(t.data);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const key = `${year}-${month}-${day}`;

    if (!groups[key]) groups[key] = [];

    groups[key].push(t);
  });

  return groups;
};

export const formatDateLabel = (dateStr) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date
    .toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    })
    .toUpperCase();
};
