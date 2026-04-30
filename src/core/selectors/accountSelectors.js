export function getAccountBalance(account, transactions = []) {
  const saldoInicial = Number(account.saldoInicial || 0);

  const movimentacoes = transactions.filter(
    (t) => String(t.accountId) === String(account.id),
  );

  return movimentacoes.reduce((saldo, t) => {
    const valor = Number(t.valor || 0);

    if (t.tipo === "receita") {
      return saldo + valor;
    }

    return saldo - valor;
  }, saldoInicial);
}

export function mapAccountsWithBalance(accounts = [], transactions = []) {
  return accounts.map((account) => ({
    ...account,
    saldoAtual: getAccountBalance(account, transactions),
  }));
}