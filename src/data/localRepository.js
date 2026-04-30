export const localRepository = {
  getTransactions: () =>
    JSON.parse(localStorage.getItem("nivo-transactions") || "[]"),

  saveTransactions: (data) =>
    localStorage.setItem("nivo-transactions", JSON.stringify(data)),

  getItems: () =>
    JSON.parse(localStorage.getItem("nivo-items") || "[]"),

  saveItems: (data) =>
    localStorage.setItem("nivo-items", JSON.stringify(data)),
};