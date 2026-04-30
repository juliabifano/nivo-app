export function getCategoryNameById(categories, id) {
  return categories.find((c) => c.id === id)?.nome || "Sem categoria";
}

export function mapTransactionsWithCategory(transactions, categories) {
  return transactions.map((t) => ({
    ...t,
    categoriaNome:
      categories.find((c) => c.id === t.categoriaId)?.nome ||
      "Sem categoria",
  }));
}