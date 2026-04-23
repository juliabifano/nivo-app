import { createContext, useContext, useEffect, useState } from "react";

const BudgetContext = createContext();

const load = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

export function BudgetProvider({ children }) {
  const [transactions, setTransactions] = useState(() =>
    load("nivo-transactions", []),
  );

  const [cartoes, setCartoes] = useState(() => load("nivo-cartoes", []));

  const [accounts, setAccounts] = useState(() => load("accounts", []));

  const [categorias, setCategorias] = useState(() =>
    load("nivo-categorias", []),
  );

  // ✅ NOVO: items (orçamento anual)
  const [items, setItems] = useState(() => load("nivo-items", []));

  // =========================
  // PERSISTÊNCIA
  // =========================
  useEffect(() => {
    localStorage.setItem("nivo-transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("nivo-cartoes", JSON.stringify(cartoes));
  }, [cartoes]);

  useEffect(() => {
    localStorage.setItem("accounts", JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem("nivo-categorias", JSON.stringify(categorias));
  }, [categorias]);

  // ✅ NOVO: persistência dos items
  useEffect(() => {
    localStorage.setItem("nivo-items", JSON.stringify(items));
  }, [items]);

  // =========================
  // TRANSAÇÕES CRUD
  // =========================
  function addTransaction(tx) {
    setTransactions((prev) => [...prev, tx]);
  }

  function updateTransaction(id, data) {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t)),
    );
  }

  function deleteTransaction(id) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  // =========================
  // HELPERS CARTÃO
  // =========================
  const getTransacoesDoCartao = (cardId) =>
    transactions.filter((t) => String(t.cartaoId) === String(cardId));

  function getFatura(cardId) {
    return getTransacoesDoCartao(cardId)
      .filter((t) => t.formaPagamento === "credito")
      .reduce((acc, t) => acc + Number(t.valor || 0), 0);
  }

  function getSaldoConta(accountId) {
    return accounts.find((a) => a.id === accountId)?.saldo || 0;
  }

  function getCardSummary(card) {
    const transacoes = getTransacoesDoCartao(card.id);

    if (card.tipo === "credito" || card.tipo === "multiplo") {
      const fatura = getFatura(card.id);
      const limite = Number(card.limite || 0);

      return {
        fatura,
        limite,
        disponivel: limite - fatura,
        percent: limite > 0 ? (fatura / limite) * 100 : 0,
      };
    }

    if (card.tipo === "debito") {
      return {
        saldo: getSaldoConta(card.accountId),
      };
    }

    if (card.tipo === "vale") {
      const saldoInicial = Number(card.saldoInicial || 0);

      const getLastResetDate = (diaReset) => {
        if (!diaReset) return null;

        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = hoje.getMonth();

        const dataResetMesAtual = new Date(ano, mes, diaReset);

        if (hoje < dataResetMesAtual) {
          return new Date(ano, mes - 1, diaReset);
        }

        return dataResetMesAtual;
      };

      const lastReset = getLastResetDate(card.diaReset);

      const gastoPeriodo = transacoes
        .filter((t) => {
          const data = new Date(t.data);
          return lastReset ? data >= lastReset : true;
        })
        .reduce((acc, t) => acc + Number(t.valor || 0), 0);

      return {
        saldoInicial,
        gasto: gastoPeriodo,
        disponivel: saldoInicial - gastoPeriodo,
        percent: saldoInicial > 0 ? (gastoPeriodo / saldoInicial) * 100 : 0,
      };
    }

    return {};
  }

  return (
    <BudgetContext.Provider
      value={{
        // state
        transactions,
        setTransactions,
        cartoes,
        setCartoes,
        accounts,
        setAccounts,
        categorias,
        setCategorias,

        // ✅ NOVO: items
        items,
        setItems,

        // CRUD
        addTransaction,
        updateTransaction,
        deleteTransaction,

        // helpers
        getTransacoesDoCartao,
        getFatura,
        getSaldoConta,
        getCardSummary,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  return useContext(BudgetContext);
}
