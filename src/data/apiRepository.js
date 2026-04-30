export const apiRepository = {
  getTransactions: async () => {
    const res = await fetch("/api/transactions");
    return res.json();
  },

  saveTransactions: async (data) => {
    return fetch("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },

  getItems: async () => {
    const res = await fetch("/api/items");
    return res.json();
  },

  saveItems: async (data) => {
    return fetch("/api/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },
};