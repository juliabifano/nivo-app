export function getFutureBalance({
  transactions = [],
  budgetItems = [],
  initialBalance = 0,
}) {
  const today = new Date();

  const year = today.getFullYear();
  const month = today.getMonth();

  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);

  let running = Number(initialBalance || 0);

  const eventsByDay = {};

  transactions.forEach((t) => {
    if (!t.data) return;

    const date = new Date(t.data);
    if (date.getFullYear() !== year || date.getMonth() !== month) return;

    const day = date.getDate();

    if (!eventsByDay[day]) eventsByDay[day] = 0;

    eventsByDay[day] +=
      t.tipo === "receita" ? Number(t.valor || 0) : -Number(t.valor || 0);
  });

  budgetItems.forEach((item) => {
    if (!item.diaVencimento) return;

    const day = Number(item.diaVencimento);
    if (day < 1 || day > endDate.getDate()) return;

    if (!eventsByDay[day]) eventsByDay[day] = 0;

    eventsByDay[day] +=
      item.tipo === "receita"
        ? Number(item.valorMensal || 0)
        : -Number(item.valorMensal || 0);
  });

  const timeline = [];

  for (let day = startDate.getDate(); day <= endDate.getDate(); day++) {
    running += eventsByDay[day] || 0;

    timeline.push({
      date: new Date(year, month, day),
      dia: day,
      saldo: running,
    });
  }

  return timeline;
}
