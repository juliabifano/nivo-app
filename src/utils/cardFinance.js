export function getCardFinance(cartao, getTransacoes, getFatura, getGastoDebito, getSaldoConta) {
  const limite = Number(cartao.limite || 0);

  // CRÉDITO
  if (cartao.tipo === "credito" || cartao.tipo === "multiplo") {
    const fatura = getFatura(cartao.id);
    return {
      limite,
      fatura,
      disponivel: limite - fatura,
    };
  }

  // DÉBITO
  if (cartao.tipo === "debito") {
    return {
      saldo: getSaldoConta(cartao.accountId),
    };
  }

  // VALE
  if (cartao.tipo === "vale") {
    const transacoes = getTransacoes(cartao.id).filter(
      (t) => t.formaPagamento === "debito"
    );

    const gastos = transacoes.reduce((acc, t) => acc + Number(t.valor || 0), 0);

    const saldoInicial = Number(cartao.saldoInicial || 0);

    return {
      saldoInicial,
      gastos,
      disponivel: saldoInicial - gastos,
    };
  }

  return {};
}