export function getCardSummary({ card, transactions }) {
  const total = transactions
    .filter((t) => String(t.cartaoId) === String(card.id))
    .reduce((acc, t) => acc + Number(t.valor || 0), 0);

  const limite = Number(card.limite || 0);
  const saldo = Number(card.saldoInicial || 0);

  let available = 0;
  let percent = 0;

  if (card.tipo === "credito" || card.tipo === "multiplo") {
    available = limite - total;
    percent = limite > 0 ? (total / limite) * 100 : 0;
  }

  if (card.tipo === "vale") {
    available = saldo - total;
    percent = saldo > 0 ? (total / saldo) * 100 : 0;
  }

  return {
    tipo: card.tipo,
    limite,
    saldo,
    total,
    available,
    percent: Math.min(percent, 100),
  };
}