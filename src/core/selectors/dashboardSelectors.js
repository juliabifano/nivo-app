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

  const monthlyItems = [...budgetExpanded, ...transactionItems];

  const receitas = monthlyItems
    .filter((i) => i.tipo === "receita")
    .reduce((acc, i) => acc + Number(i.valorFinal || 0), 0);

  const despesas = monthlyItems
    .filter((i) => i.tipo === "despesa")
    .reduce((acc, i) => acc + Number(i.valorFinal || 0), 0);

  const chartData = months.map((mes) => {
    let receita = 0;
    let despesa = 0;

    budgetItems.forEach((item) => {
      if (!item.meses?.includes(mes)) return;

      if (item.tipo === "receita") receita += Number(item.valorMensal || 0);
      else despesa += Number(item.valorMensal || 0);
    });

    transactions.forEach((t) => {
      if (getMonthFromDate(t.data) !== mes) return;

      if (t.tipo === "receita") receita += Number(t.valor || 0);
      else despesa += Number(t.valor || 0);
    });

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

  monthlyItems
    .filter((i) => i.tipo === "despesa")
    .forEach((i) => {
      topCategoriesMap[i.categoriaNome] =
        (topCategoriesMap[i.categoriaNome] || 0) + Number(i.valorFinal || 0);
    });

  const topCategories = Object.entries(topCategoriesMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);

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
