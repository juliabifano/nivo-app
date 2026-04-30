import { getInvoicePeriod, getCurrentInvoiceDate } from "./cardHelpers";

export function getCardFinance({
  cartao,
  transactions,
  getGasto,
  getSaldoConta,
}) {
  const tipo = cartao.tipo;

  const limite = Number(cartao.limite || 0);
  const saldoInicial = Number(cartao.saldoInicial || 0);

  // 🔵 CRÉDITO / MÚLTIPLO
  if (tipo === "credito" || tipo === "multiplo") {
    const { mes, ano } = getCurrentInvoiceDate(cartao);
    const { start, end } = getInvoicePeriod(mes, ano, cartao.fechamento);

    const fatura = transactions
      .filter((t) => {
        if (String(t.cartaoId) !== String(cartao.id)) return false;

        const data = new Date(t.data);

        return data >= start && data <= end;
      })
      .reduce((acc, t) => acc + Number(t.valor || 0), 0);

    return {
      tipo,
      limite,
      fatura,
      disponivel: limite - fatura,
    };
  }

  // 🟡 DÉBITO
  if (tipo === "debito") {
    const saldo = getSaldoConta?.(cartao.accountId) ?? 0;

    const gastos = getGasto(transactions, cartao.id);

    return {
      tipo,
      saldo,
      gastos,
      restante: saldo - gastos,
    };
  }

  // 🟢 VALE
  if (tipo === "vale") {
    const lastReset = getLastResetDate(cartao.diaReset);

    const transacoes = transactions.filter((t) => {
      if (t.cartaoId !== cartao.id) return false;

      const data = new Date(t.data);
      return lastReset ? data >= lastReset : true;
    });

    const gastos = transacoes.reduce((acc, t) => acc + Number(t.valor || 0), 0);

    return {
      tipo,
      saldoInicial,
      gastos,
      disponivel: saldoInicial - gastos,
    };
  }

  return {};
}
