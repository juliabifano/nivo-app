export function getAnnualBudgetSnapshot(items = [], categories = []) {
  const safe = (v) => Number(v || 0);

  const getCategoryName = (categoriaId) => {
    return (
      categories.find((c) => String(c.id) === String(categoriaId))?.nome ||
      "Sem categoria"
    );
  };

  let receitas = 0;
  let despesas = 0;

  const byCategory = {
    receita: {},
    despesa: {},
  };

  for (const item of items) {
    const valor = safe(item.valorMensal);
    const meses = Array.isArray(item.meses) ? item.meses.length : 0;
    const total = valor * meses;

    const categoriaNome = getCategoryName(item.categoriaId);

    if (item.tipo === "receita") {
      receitas += total;
      byCategory.receita[categoriaNome] =
        (byCategory.receita[categoriaNome] || 0) + total;
    } else {
      despesas += total;
      byCategory.despesa[categoriaNome] =
        (byCategory.despesa[categoriaNome] || 0) + total;
    }
  }

  const toArray = (obj) =>
    Object.entries(obj).map(([name, value]) => ({
      name,
      value,
    }));

  return {
    receitas,
    despesas,
    saldo: receitas - despesas,
    receitasData: toArray(byCategory.receita),
    despesasData: toArray(byCategory.despesa),
  };
}
