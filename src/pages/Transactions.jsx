import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTransactions } from "../contexts/TransactionContext";
import TransactionList from "../components/TransactionList";
import RightSidebarTransactions from "../components/RightSidebarTransactions";
import BottomSheet from "../components/ui/BottomSheet";
import FloatingActionButton from "../components/ui/FloatingActionButton";
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
  const [showMobileForm, setShowMobileForm] = useState(false);

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

  const handleEditMobile = (transaction) => {
    setEditingTransaction(transaction);
    setShowMobileForm(true);
  };

  return (
    <div className="relative flex flex-col lg:flex-row h-full overflow-hidden text-white">
      {/* CENTRO */}
      <div
        className="
    flex-1
    min-h-0
    overflow-y-auto
    px-4
    pt-5
    pb-32
    lg:p-6
    lg:pr-[360px]
    flex
    justify-center
    no-scrollbar
    mb-5
  "
      >
        <div className="w-full max-w-3xl flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="md:hidden w-10 h-10 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
                <img
                  src="/logo-ni-branca.svg"
                  className="w-6 h-6 object-contain"
                />
              </div>

              <div>
                <h1 className="text-2xl font-semibold">Transações</h1>

                <p className="text-sm text-gray-400 mt-1">
                  Seus lançamentos do mês
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1 shrink-0">
            {[
              { label: "Todas", value: "todos" },
              { label: "Hoje", value: "hoje" },
              { label: "Ontem", value: "ontem" },
              { label: "Últimos 7 dias", value: "7dias" },
            ].map((p) => (
              <button
                key={p.value}
                onClick={() => setFilters({ ...filters, periodo: p.value })}
                className={`shrink-0 px-3 py-1.5 rounded-full text-sm cursor-pointer ${
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
            className="
    flex items-center gap-2
    text-sm
    text-gray-400
    hover:text-white
    transition-colors
    w-fit
    cursor-pointer
  "
          >
            <span>Filtros avançados</span>

            <motion.span
              animate={{ rotate: showFilters ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-xs"
            >
              ▼
            </motion.span>
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
            <div
              className="
    relative
    bg-white/[0.04]
    border border-white/[0.08]
    rounded-[28px]
    p-4
    flex flex-col gap-3
    backdrop-blur-xl
  "
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(62,242,194,0.08),transparent_55%)] pointer-events-none" />
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-emerald-400/10 blur-3xl rounded-full pointer-events-none" />

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
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-emerald-400/10 blur-3xl rounded-full pointer-events-none" />

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
                      onEdit={
                        window.innerWidth < 1024
                          ? handleEditMobile
                          : setEditingTransaction
                      }
                    />
                  </motion.div>
                ))}
            </div>
          </AnimatePresence>
          <div className="h-36 lg:hidden shrink-0" />
        </div>
      </div>

      {/* SIDEBAR */}
      <div className="hidden lg:block">
        <RightSidebarTransactions
          onAdd={add}
          onUpdate={update}
          editingTransaction={editingTransaction}
          setEditingTransaction={setEditingTransaction}
        />
      </div>

      {/* FAB MOBILE */}
      <FloatingActionButton
        open={showMobileForm}
        onClick={() => {
          if (showMobileForm) {
            setShowMobileForm(false);
            setEditingTransaction(null);
            return;
          }

          setEditingTransaction(null);
          setShowMobileForm(true);
        }}
      />

      {/* DRAWER MOBILE */}
      <BottomSheet
        open={showMobileForm}
        onClose={() => {
          setShowMobileForm(false);
          setEditingTransaction(null);
        }}
      >
        <RightSidebarTransactions
          onAdd={add}
          onUpdate={update}
          editingTransaction={editingTransaction}
          setEditingTransaction={setEditingTransaction}
          isMobile
          setShowMobileForm={setShowMobileForm}
        />
      </BottomSheet>
    </div>
  );
}
