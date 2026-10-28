export function getScheduleSummary(schedule = []) {
  const totals = {
    previsto: { receita: 0, despesa: 0 },
    realizado: { receita: 0, despesa: 0 },
    pendente: { receita: 0, despesa: 0 },
  };

  for (const item of schedule) {
    const tipo = item.tipo === "receita" ? "receita" : "despesa";
    const valor = Math.round(Number(item.valor || 0) * 100);
    totals.previsto[tipo] += valor;
    totals[item.status === "pago" ? "realizado" : "pendente"][tipo] += valor;
  }

  return Object.fromEntries(
    Object.entries(totals).map(([status, values]) => [
      status,
      { receita: values.receita / 100, despesa: values.despesa / 100 },
    ]),
  );
}
