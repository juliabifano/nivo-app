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

  const [items, setItems] = useState(() => load("nivo-items", []));

  const [faturas, setFaturas] = useState(() => load("nivo-faturas", []));

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

  useEffect(() => {
    localStorage.setItem("nivo-items", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("nivo-faturas", JSON.stringify(faturas));
  }, [faturas]);

  // =========================
  // TRANSAÇÕES CRUD
  // =========================
  function addTransaction(tx) {
    const normalized = {
      id: tx.id,
      descricao: tx.descricao,
      valor: Number(tx.valor),
      data: tx.data,
      cartaoId: tx.cartao,
      formaPagamento: tx.formaPagamento || "debito",
      tipo: tx.tipo || "despesa",

      // 🔥 preparado para novo sistema
      categorias: tx.categorias || (tx.categoria ? [tx.categoria] : []),
    };

    setTransactions((prev) => [...prev, normalized]);
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

  function getFatura(cardId, tipo) {
    return transactions
      .filter((t) => {
        if (!t.cartaoId) return false;

        const pertenceCartao = String(t.cartaoId) === String(cardId);
        if (!pertenceCartao) return false;

        if (tipo === "credito") return true;

        if (tipo === "multiplo") {
          return t.tipo === "despesa";
        }

        return false;
      })
      .reduce((acc, t) => acc + Number(t.valor || 0), 0);
  }

  function getSaldoConta(accountId) {
    return accounts.find((a) => a.id === accountId)?.saldo || 0;
  }

  function getCardSummary(card) {
    const transacoes = getTransacoesDoCartao(card.id);

    if (card.tipo === "credito" || card.tipo === "multiplo") {
      const fatura = getFatura(card.id, card.tipo);
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

  // =========================
  // CATEGORIAS
  // =========================
  function deleteCategoria(nome) {
    setCategorias((prev) =>
      prev.filter((cat) =>
        typeof cat === "string"
          ? cat.toLowerCase() !== nome.toLowerCase()
          : cat.nome.toLowerCase() !== nome.toLowerCase(),
      ),
    );
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
        items,
        setItems,
        faturas,
        setFaturas,

        // CRUD
        addTransaction,
        updateTransaction,
        deleteTransaction,
        deleteCategoria,

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
