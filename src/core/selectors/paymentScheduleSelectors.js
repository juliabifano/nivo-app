import { generateInvoice } from "../../utils/invoices";

const months = {
  jan: 0,
  fev: 1,
  mar: 2,
  abr: 3,
  mai: 4,
  jun: 5,
  jul: 6,
  ago: 7,
  set: 8,
  out: 9,
  nov: 10,
  dez: 11,
};

function getLocalToday() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function getStatus(date, isPaid) {
  if (isPaid) return "pago";

  const today = getLocalToday();
  const due = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (due < today) return "atrasado";
  if (due.getTime() === today.getTime()) return "hoje";

  return "pendente";
}

export function getPaymentSchedule({
  items = [],
  transactions = [],
  cards = [],
  month,
  year,
  paidIds = [],
  initialBalance = 0,
}) {
  const schedule = [];

  items.forEach((item) => {
    if (!item.meses?.includes(month)) return;

    const date = new Date(year, months[month], item.diaVencimento || 1);
    const paymentId = `orcamento-${item.id}-${month}-${year}`;
    const isPaid = paidIds.includes(paymentId);

    schedule.push({
      paymentId,
      sourceId: item.id,
      descricao: item.descricao,
      valor: Number(item.valorMensal || 0),
      tipo: item.tipo || "despesa",
      origem: "orcamento",
      data: date,
      categoriaId: item.categoriaId,
      accountId: item.accountId || "",
      status: getStatus(date, isPaid),
    });
  });

  cards.forEach((card) => {
    if (!["credito", "multiplo"].includes(card.tipo)) return;

    const monthNumber = months[month] + 1;

    const invoice = generateInvoice({
      transactions,
      card,
      month: monthNumber,
      year,
    });

    const valorFatura = Number(invoice.total || 0);

    if (valorFatura <= 0) return;

    const date = new Date(year, months[month], card.vencimento || 10);

    const paymentId = `fatura-${card.id}-${month}-${year}`;
    const isPaid = paidIds.includes(paymentId);

    schedule.push({
      paymentId,
      sourceId: card.id,
      descricao: `Fatura ${card.nome}`,
      valor: valorFatura,
      tipo: "despesa",
      origem: "fatura",
      data: date,
      accountId: card.accountId || "",
      status: getStatus(date, isPaid),
    });
  });

  const sorted = schedule.sort((a, b) => new Date(a.data) - new Date(b.data));

  let saldoPrevisto = Number(initialBalance || 0);

  const withBalance = sorted.map((item) => {
    if (item.status !== "pago") {
      saldoPrevisto =
        item.tipo === "receita"
          ? saldoPrevisto + item.valor
          : saldoPrevisto - item.valor;
    }

    return {
      ...item,
      saldoPrevisto,
    };
  });

  return withBalance;
}
