let categories = [
  "Moradia",
  "Alimentação",
  "Transporte",
  "Saúde",
  "Lazer",
  "Educação",
  "Renda",
  "Outros",
];

let items = [];

export const budgetService = {
  getCategories: () => categories,

  addCategory: (name) => {
    if (!categories.includes(name)) {
      categories.push(name);
    }
  },

  getItems: () => items,

  addItem: (item) => {
    const newItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    items.push(newItem);
    return newItem;
  },
};