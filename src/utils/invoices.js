export function generateInvoice({ transactions, card, month, year }) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month - 1, 31);

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

  transactions.forEach((t) => {
    if (String(t.cartaoId) !== String(card.id)) return;

    console.log("FORMA PAGAMENTO:", t.formaPagamento);

    if (t.formaPagamento !== "credito") return;

    const totalParcelas = Number(t.totalParcelas || 1);
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

  console.log("EXPANDED:", expanded);

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
    const date = new Date(t.data);
    const key = date.toISOString().split("T")[0];

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(t);
  });

  return groups;
};

export const formatDateLabel = (dateStr) => {
  const date = new Date(dateStr);

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  }).toUpperCase();
};
