import { getMonthlyBudgetSnapshot } from "../utils/getMonthlyBudgetSnapshot";
import { getAnnualBudgetSnapshot } from "../utils/getAnnualBudgetSnapshot";

export function createFinanceEngine(state) {
  const { transactions = [], items = [], accounts = [], cartoes = [] } = state;

  // -------------------------
  // MONTHLY SNAPSHOT
  // -------------------------
  const monthly = (month) =>
    getMonthlyBudgetSnapshot(items, transactions, month);

  // -------------------------
  // ANNUAL SNAPSHOT
  // -------------------------
  const annual = () => getAnnualBudgetSnapshot(items);

  // -------------------------
  // CARTÕES (USO REAL)
  // -------------------------
  const cards = {
    getMostUsed: () => {
      const map = new Map();

      for (const t of transactions) {
        const id = t.cartaoId || t.cartao;
        if (!id) continue;

        map.set(id, (map.get(id) || 0) + Number(t.valor || 0));
      }

      return [...map.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([id]) => cartoes.find((c) => c.id === id))
        .filter(Boolean);
    },

    getTotal: (id) =>
      transactions
        .filter((t) => (t.cartaoId || t.cartao) === id)
        .reduce((acc, t) => acc + Number(t.valor || 0), 0),
  };

  return {
    monthly,
    annual,
    cards,
  };
}
