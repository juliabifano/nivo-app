const months = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

const normalizeMonth = (m) => m?.toLowerCase().replace(".", "").trim();

const getMonthFromDate = (date) =>
  normalizeMonth(new Date(date).toLocaleString("pt-BR", { month: "short" }));

const getCategoryName = (categories, categoriaId) =>
  categories.find((c) => String(c.id) === String(categoriaId))?.nome ||
  "Sem categoria";

export function getDashboardSnapshot({
  transactions = [],
  cards = [],
  accounts = [],
  budgetItems = [],
  categories = [],
}) {
  const currentMonth = getMonthFromDate(new Date());

  const budgetExpanded = budgetItems
    .filter((item) => item.meses?.includes(currentMonth))
    .map((item) => ({
      ...item,
      valorFinal: Number(item.valorMensal || 0),
      categoriaNome: getCategoryName(categories, item.categoriaId),
      origem: "orcamento",
    }));

  const transactionItems = transactions
    .filter((t) => getMonthFromDate(t.data) === currentMonth)
    .map((t) => ({
      ...t,
      valorFinal: Number(t.valor || 0),
      categoriaNome: getCategoryName(categories, t.categoriaId),
      origem: "transacao",
    }));

  const realizedItems = transactionItems;

  const plannedItems = budgetExpanded.filter((budgetItem) => {
    const alreadyRealized = transactionItems.some((t) => {
      return (
        t.origem !== "pagamento_fatura" &&
        String(t.descricao).toLowerCase() ===
          String(budgetItem.descricao).toLowerCase() &&
        Number(t.valorFinal || 0) === Number(budgetItem.valorFinal || 0)
      );
    });

    return !alreadyRealized;
  });

  const dashboardItems = [...realizedItems, ...plannedItems];

  const receitas = dashboardItems
    .filter((i) => i.tipo === "receita")
    .reduce((acc, i) => acc + Number(i.valorFinal || 0), 0);

  const despesas = dashboardItems
    .filter((i) => i.tipo === "despesa")
    .reduce((acc, i) => acc + Number(i.valorFinal || 0), 0);

  const chartData = months.map((mes) => {
    const budgetMonth = budgetItems
      .filter((item) => item.meses?.includes(mes))
      .map((item) => ({
        ...item,
        valorFinal: Number(item.valorMensal || 0),
      }));

    const transactionMonth = transactions
      .filter((t) => getMonthFromDate(t.data) === mes)
      .map((t) => ({
        ...t,
        valorFinal: Number(t.valor || 0),
      }));

    const plannedMonth = budgetMonth.filter((budgetItem) => {
      const alreadyRealized = transactionMonth.some((t) => {
        return (
          t.origem !== "pagamento_fatura" &&
          String(t.descricao).toLowerCase() ===
            String(budgetItem.descricao).toLowerCase() &&
          Number(t.valorFinal || 0) === Number(budgetItem.valorFinal || 0)
        );
      });

      return !alreadyRealized;
    });

    const monthItems = [...transactionMonth, ...plannedMonth];

    const receita = monthItems
      .filter((i) => i.tipo === "receita")
      .reduce((acc, i) => acc + Number(i.valorFinal || 0), 0);

    const despesa = monthItems
      .filter((i) => i.tipo === "despesa")
      .reduce((acc, i) => acc + Number(i.valorFinal || 0), 0);

    return { mes, receita, despesa };
  });

  const lastTransactions = [...transactions]
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || a.data);
      const dateB = new Date(b.createdAt || b.data);

      return dateB - dateA;
    })
    .slice(0, 5);

  const topCategoriesMap = {};

  dashboardItems
    .filter((i) => i.tipo === "despesa")
    .forEach((i) => {
      topCategoriesMap[i.categoriaNome] =
        (topCategoriesMap[i.categoriaNome] || 0) + Number(i.valorFinal || 0);
    });

  const topCategories = Object.entries(topCategoriesMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const usedCardIds = [...transactions]
    .filter((t) => t.cartaoId)
    .sort((a, b) => new Date(b.data) - new Date(a.data))
    .map((t) => t.cartaoId);

  const recentCards = [...new Set(usedCardIds)]
    .map((id) => cards.find((c) => String(c.id) === String(id)))
    .filter(Boolean)
    .slice(0, 2);

  return {
    currentMonth,
    summary: {
      receitas,
      despesas,
      saldo: receitas - despesas,
    },
    chartData,
    lastTransactions,
    topCategories,
    recentCards,
    accounts,
  };
}
