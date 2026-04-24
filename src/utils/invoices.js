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

  transactions.forEach((t) => {
    if (String(t.cartaoId) !== String(card.id)) return;

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

      expanded.push({
        id: `${t.id}-${i}`,
        descricao: `${t.descricao} (${i + 1}/${totalParcelas})`,
        valor: valorParcela,
        data: dataParcela,
        cartaoId: t.cartaoId,
      });
    }
  });

  const filtered = expanded.filter((t) => {
    const date = new Date(t.data);
    return date >= startDate && date <= endDate;
  });

  return {
    cardId: card.id,
    cardName: card.nome,
    total: filtered.reduce((a, t) => a + t.valor, 0),
    transactions: filtered,
  };
}
