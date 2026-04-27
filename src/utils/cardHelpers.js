// utils/cardHelpers.js

const ensureArray = (data) => (Array.isArray(data) ? data : []);

// 🔹 Normaliza data
const parseDate = (date) => {
  if (date instanceof Date) return date;

  if (typeof date === "string") {
    const [year, month, day] = date.split("-");
    return new Date(year, month - 1, day);
  }

  return new Date(date);
};

// 🔹 Transações do cartão
export const getTransacoesDoCartao = (transactions, cardId) => {
  return ensureArray(transactions).filter(
    (t) => String(t.cartaoId) === String(cardId),
  );
};

// 🔹 Gasto do mês atual
export const getGasto = (transactions, cardId) => {
  const now = new Date();

  return getTransacoesDoCartao(transactions, cardId)
    .filter((t) => {
      const d = parseDate(t.data);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    })
    .reduce((acc, t) => acc + Number(t.valor || 0), 0);
};

// 🔹 Reset de vale
export const getLastResetDate = (diaReset) => {
  if (!diaReset) return null;

  const hoje = new Date();
  const dataAtual = new Date(hoje.getFullYear(), hoje.getMonth(), diaReset);

  if (hoje < dataAtual) {
    return new Date(hoje.getFullYear(), hoje.getMonth() - 1, diaReset);
  }

  return dataAtual;
};

// 🔹 Período da fatura
export const getInvoicePeriod = (month, year, fechamento = 10) => {
  const end = new Date(year, month - 1, fechamento);
  const start = new Date(year, month - 2, fechamento + 1);

  return { start, end };
};

// 🔹 Mês atual da fatura
export const getCurrentInvoiceDate = (card) => {
  const hoje = new Date();
  const diaHoje = hoje.getDate();

  let mes = hoje.getMonth() + 1;
  let ano = hoje.getFullYear();

  if (diaHoje > (card.fechamento || 10)) {
    mes += 1;

    if (mes > 12) {
      mes = 1;
      ano += 1;
    }
  }

  return { mes, ano };
};
