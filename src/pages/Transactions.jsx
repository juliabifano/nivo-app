import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTransactions } from "../contexts/TransactionContext";
import TransactionList from "../components/TransactionList";
import RightSidebarTransactions from "../components/RightSidebarTransactions";
import { mapTransactionsWithCategory } from "../core/selectors/categorySelectors";
import { useCategories } from "../contexts/CategoryContext";
import { useBudgetAnnual } from "../contexts/BudgetAnnualContext";
import { useCards } from "../contexts/CardContext";
import { useAccounts } from "../contexts/AccountContext";
import DatePicker from "../components/DatePicker";
import {
  filterTransactions,
  parseLocalDate,
} from "../core/selectors/transactionSelectors";

export default function Transactions() {
  const { transactions, add, update, remove } = useTransactions();
  const { categories } = useCategories();
  const { items: budgetItems = [] } = useBudgetAnnual();
  const { cards = [] } = useCards();
  const { accounts = [] } = useAccounts();

  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    tipo: "todos",
    categoriaId: "",
    periodo: "todos",
    formaPagamento: "",
    cartaoId: "",
    accountId: "",
    dataInicio: "",
    dataFim: "",
  });

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

  const currentMonthIndex = new Date().getMonth();
  const currentMonth = months[currentMonthIndex];
  const currentYear = new Date().getFullYear();

  const paidScheduleIds = transactions
    .map((t) => t.schedulePaymentId)
    .filter(Boolean);

  const budgetAsTransactions = budgetItems
    .filter((item) => item.meses?.includes(currentMonth))
    .filter((item) => {
      const paymentId = `orcamento-${item.id}-${currentMonth}-${currentYear}`;
      return !paidScheduleIds.includes(paymentId);
    })
    .map((item) => ({
      id: `budget-${item.id}-${currentMonth}-${currentYear}`,
      descricao: item.descricao,
      valor: Number(item.valorMensal || 0),
      tipo: item.tipo,
      categoriaId: item.categoriaId,
      data: `${currentYear}-${String(currentMonthIndex + 1).padStart(2, "0")}-${String(
        item.diaVencimento || 1,
      ).padStart(2, "0")}`,
      formaPagamento: item.formaPagamento || "pix",
      accountId: item.accountId || "",
      cartaoId: item.cartaoId || "",
      origem: "orcamento",
      isPreview: true,
    }));

  const allTransactions = [...transactions, ...budgetAsTransactions];

  const filtradas = filterTransactions(allTransactions, filters);

  const ordenadas = [...filtradas].sort((a, b) => {
    const dateA = new Date(a.createdAt || `${a.data}T00:00:00`);
    const dateB = new Date(b.createdAt || `${b.data}T00:00:00`);

    return dateB - dateA;
  });

  const prontas = mapTransactionsWithCategory(ordenadas, categories);

  const formatFilterDate = (date) =>
    parseLocalDate(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });

  const activeFilters = [];

  if (filters.tipo && filters.tipo !== "todos") {
    activeFilters.push({
      label: filters.tipo === "receita" ? "Receitas" : "Despesas",
      key: "tipo",
    });
  }

  if (filters.periodo && filters.periodo !== "todos") {
    const labels = {
      hoje: "Hoje",
      ontem: "Ontem",
      "7dias": "7 dias",
    };

    activeFilters.push({
      label: labels[filters.periodo],
      key: "periodo",
    });
  }

  if (filters.categoriaId) {
    const cat = categories.find((c) => c.id === filters.categoriaId);
    if (cat) {
      activeFilters.push({ label: cat.nome, key: "categoriaId" });
    }
  }

  if (filters.formaPagamento) {
    activeFilters.push({
      label: filters.formaPagamento,
      key: "formaPagamento",
    });
  }

  if (filters.cartaoId) {
    const c = cards.find((c) => c.id === filters.cartaoId);
    if (c) {
      activeFilters.push({ label: c.nome, key: "cartaoId" });
    }
  }

  if (filters.accountId) {
    const a = accounts.find((a) => a.id === filters.accountId);
    if (a) {
      activeFilters.push({ label: a.nome, key: "accountId" });
    }
  }

  if (filters.dataInicio || filters.dataFim) {
    activeFilters.push({
      label: `${filters.dataInicio ? formatFilterDate(filters.dataInicio) : "início"} → ${
        filters.dataFim ? formatFilterDate(filters.dataFim) : "hoje"
      }`,
      key: "dataRange",
    });
  }

  const groupByDate = (list) => {
    const groups = {};

    list.forEach((t) => {
      const d = parseLocalDate(t.data);
      const key = d.toISOString().split("T")[0];

      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    });

    return groups;
  };

  const grouped = groupByDate(prontas);

  const getDateLabel = (date) => {
    const d = parseLocalDate(date);
    const today = new Date();

    const sameDay = (a, b) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();

    if (sameDay(d, today)) return "HOJE";

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (sameDay(d, yesterday)) return "ONTEM";

    return d
      .toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
      })
      .toUpperCase();
  };

  return (
    <div className="flex h-screen overflow-hidden text-white">
      {/* CENTRO */}
      <div className="flex-1 p-6 overflow-y-auto pr-[360px] flex justify-center mb-5">
        <div className="w-full max-w-3xl flex flex-col gap-6">
          <h1 className="text-2xl font-semibold">Lançamentos</h1>

          <div className="flex gap-2 flex-wrap">
            {[
              { label: "Todas", value: "todos" },
              { label: "Hoje", value: "hoje" },
              { label: "Ontem", value: "ontem" },
              { label: "Últimos 7 dias", value: "7dias" },
            ].map((p) => (
              <button
                key={p.value}
                onClick={() => setFilters({ ...filters, periodo: p.value })}
                className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                  filters.periodo === p.value
                    ? "bg-emerald-400 text-black"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowFilters((prev) => !prev)}
            className=" text-sm text-gray-400 hover:text-white w-fit cursor-pointer"
          >
            Filtros Avançados
          </button>

          {activeFilters.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {activeFilters.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm"
                >
                  <span>{f.label}</span>

                  <button
                    onClick={() => {
                      if (f.key === "dataRange") {
                        setFilters({
                          ...filters,
                          dataInicio: "",
                          dataFim: "",
                        });
                        return;
                      }

                      setFilters({
                        ...filters,
                        [f.key]:
                          f.key === "tipo" || f.key === "periodo"
                            ? "todos"
                            : "",
                      });
                    }}
                    className="text-gray-400 hover:text-white cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {/* limpar tudo */}
              <button
                onClick={() =>
                  setFilters({
                    tipo: "todos",
                    categoriaId: "",
                    periodo: "todos",
                    formaPagamento: "",
                    cartaoId: "",
                    accountId: "",
                    dataInicio: "",
                    dataFim: "",
                  })
                }
                className="text-xs text-red-400 ml-2 cursor-pointer"
              >
                Limpar tudo
              </button>
            </div>
          )}

          {showFilters && (
            <div className="bg-[#111827] border border-white/10 rounded-xl p-4 flex flex-col gap-3">
              {/* Tipo */}
              <div className="flex gap-2">
                {[
                  { label: "Todos", value: "todos" },
                  { label: "Receitas", value: "receita" },
                  { label: "Despesas", value: "despesa" },
                ].map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setFilters({ ...filters, tipo: t.value })}
                    className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                      filters.tipo === t.value
                        ? "bg-emerald-400 text-black"
                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Data */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-400">De</span>

                  <DatePicker
                    value={filters.dataInicio}
                    onChange={(date) => {
                      setFilters({
                        ...filters,
                        dataInicio: date,
                        periodo: "todos",
                      });
                      setShowFilters(false);
                    }}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-400">Até</span>

                  <DatePicker
                    value={filters.dataFim}
                    onChange={(date) => {
                      setFilters({
                        ...filters,
                        dataFim: date,
                        periodo: "todos",
                      });
                      setShowFilters(false);
                    }}
                  />
                </div>
              </div>

              {/* Categoria */}
              <select
                value={filters.categoriaId}
                onChange={(e) => {
                  setFilters({ ...filters, categoriaId: e.target.value });
                  setShowFilters(false);
                }}
                className="bg-[#1f2937] p-2 rounded-lg cursor-pointer"
              >
                <option value="">Todas categorias</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>

              {/* Forma */}
              <select
                value={filters.formaPagamento}
                onChange={(e) => {
                  setFilters({ ...filters, formaPagamento: e.target.value });
                  setShowFilters(false);
                }}
                className="bg-[#1f2937] p-2 rounded-lg cursor-pointer"
              >
                <option value="">Todas formas</option>
                <option value="pix">Pix</option>
                <option value="debito">Débito</option>
                <option value="credito">Crédito</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="vale">Vale</option>
              </select>

              {/* Cartão */}
              <select
                value={filters.cartaoId}
                onChange={(e) => {
                  setFilters({ ...filters, cartaoId: e.target.value });
                  setShowFilters(false);
                }}
                className="bg-[#1f2937] p-2 rounded-lg cursor-pointer"
              >
                <option value="">Todos cartões</option>
                {cards.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>

              {/* Conta */}
              <select
                value={filters.accountId}
                onChange={(e) => {
                  setFilters({ ...filters, accountId: e.target.value });
                  setShowFilters(false);
                }}
                className="bg-[#1f2937] p-2 rounded-lg cursor-pointer"
              >
                <option value="">Todas contas</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nome}
                  </option>
                ))}
              </select>

              {/* Reset */}
              <button
                onClick={() =>
                  setFilters({
                    tipo: "todos",
                    categoriaId: "",
                    periodo: "todos",
                    formaPagamento: "",
                    cartaoId: "",
                    accountId: "",
                    dataInicio: "",
                    dataFim: "",
                  })
                }
                className="bg-red-400 text-black px-3 py-1 rounded-lg cursor-pointer"
              >
                Limpar filtros
              </button>
            </div>
          )}

          {/* LISTA */}
          <AnimatePresence mode="popLayout">
            <div className="flex flex-col gap-6">
              {Object.entries(grouped)
                .sort((a, b) => new Date(a[0]) - new Date(b[0]))
                .map(([date, items]) => (
                  <motion.div
                    key={date}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-3"
                  >
                    <p className="text-xs text-gray-400 font-semibold uppercase">
                      {getDateLabel(date)}
                    </p>

                    <TransactionList
                      transactions={items}
                      onDelete={remove}
                      onEdit={setEditingTransaction}
                    />
                  </motion.div>
                ))}
            </div>
          </AnimatePresence>
        </div>
      </div>

      {/* SIDEBAR */}
      <RightSidebarTransactions
        onAdd={add}
        onUpdate={update}
        editingTransaction={editingTransaction}
        setEditingTransaction={setEditingTransaction}
      />
    </div>
  );
}
