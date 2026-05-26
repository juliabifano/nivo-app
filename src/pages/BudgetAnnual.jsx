import { useState } from "react";
import RightSidebar from "../components/RightSidebar";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import NubankBar from "../components/NubankBar";
import SaldoCard from "../components/SaldoCard";
import DeleteIcon from "../assets/icons/Bin.svg?react";
import EditIcon from "../assets/icons/Edit.svg?react";
import { useBudgetAnnual } from "../contexts/BudgetAnnualContext";
import { useCategories } from "../contexts/CategoryContext";
import { getAnnualBudgetSnapshot } from "../utils/getAnnualBudgetSnapshot";
import { getPaymentVisual } from "../utils/getPaymentVisual";
import { useCards } from "../contexts/CardContext";
import { useAccounts } from "../contexts/AccountContext";
import SectionHeader from "../components/ui/SectionHeader";
import BottomSheet from "../components/ui/BottomSheet";
import FloatingActionButton from "../components/ui/FloatingActionButton";
import GlassTabs from "../components/ui/GlassTabs";
import { useTheme } from "../theme/useTheme";

export default function BudgetAnnual() {
  const { items = [], add, update, remove } = useBudgetAnnual();
  const { categories } = useCategories();
  const { cards = [] } = useCards();
  const { accounts = [] } = useAccounts();
  const { theme, themeName } = useTheme();

  const [monthFilter, setMonthFilter] = useState("todos");
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileForm, setShowMobileForm] = useState(false);
  const [chartTab, setChartTab] = useState("receitas");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    descricao: "",
    categoriaId: "",
    valorMensal: "",
    tipo: "despesa",
    meses: [],
    diaVencimento: "",
    formaPagamento: "pix",
    accountId: "",
    cartaoId: "",
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

  const toggleMonth = (month) => {
    const exists = form.meses.includes(month);

    setForm({
      ...form,
      meses: exists
        ? form.meses.filter((m) => m !== month)
        : [...form.meses, month],
    });
  };

  const budget = getAnnualBudgetSnapshot(items, categories);
  const { receitas, despesas, receitasData, despesasData } = budget;

  const handleAdd = () => {
    if (!form.descricao || !form.valorMensal) return;

    if (editingId) {
      update(editingId, form);
      setEditingId(null);
    } else {
      add(form);
    }

    setForm({
      descricao: "",
      categoriaId: "",
      valorMensal: "",
      tipo: "despesa",
      meses: [],
      diaVencimento: "",
      formaPagamento: "pix",
      accountId: "",
      cartaoId: "",
    });

    setShowMobileForm(false);
  };

  const handleDelete = (id) => {
    remove(id);
  };

  const formatCurrency = (value) =>
    Number(value || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const renderCenterLabel = (total, color) => (
    <text
      x="50%"
      y="50%"
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize="15"
      fontWeight="600"
      fill={color}
    >
      {formatCurrency(total)}
    </text>
  );

  const filteredItems =
    monthFilter === "todos"
      ? items
      : items.filter((item) => item.meses?.includes(monthFilter));

  const activeMonthFilter =
    monthFilter !== "todos" ? monthFilter.toUpperCase() : null;

  return (
    <div
      className={`
      relative h-full overflow-hidden
      px-4 pt-5 pb-28 lg:p-6
      flex justify-center
      ${theme.textPrimary}
    `}
    >
      <div className="flex flex-1 h-full items-start overflow-hidden min-h-0">
        <div className="flex-1 lg:pr-[360px] flex justify-center h-full overflow-hidden">
          <div className="w-full max-w-5xl mx-auto h-full flex flex-col gap-4 lg:gap-6 overflow-hidden">
            {/* TOPO FIXO */}
            <div className="shrink-0 flex flex-col gap-4">
              <SectionHeader
                title="Orçamento Anual"
                subtitle="Planejamento anual de receitas e despesas"
                icon={
                  <img
                    src={
                      themeName === "light"
                        ? "/logo-ni-preta.svg"
                        : "/logo-ni-branca.svg"
                    }
                    className="w-6 h-6 object-contain"
                  />
                }
              />

              <div
                className={`
                ${theme.surface}
                border ${theme.border}
                backdrop-blur-xl
                p-4 lg:p-6
                rounded-2xl
                shadow-lg
              `}
              >
                <p className={`text-sm ${theme.textSecondary}`}>Saldo Anual</p>

                <SaldoCard receitas={receitas} despesas={despesas} />
                <NubankBar receitas={receitas} despesas={despesas} />
              </div>

              <div>
                <div className="lg:hidden mb-3">
                  <GlassTabs
                    value={chartTab}
                    onChange={setChartTab}
                    tabs={[
                      { value: "receitas", label: "Receitas" },
                      { value: "despesas", label: "Despesas" },
                    ]}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  <div
                    className={`
                    ${chartTab === "receitas" ? "block" : "hidden"}
                    lg:block
                    ${theme.surface}
                    border ${theme.border}
                    backdrop-blur-xl
                    p-4
                    pb-8
                    lg:p-6
                    lg:pb-15
                    rounded-2xl
                    shadow-lg
                    h-[210px]
                    lg:h-68
                  `}
                  >
                    <p className={`text-sm ${theme.textSecondary} mb-2`}>
                      Receitas
                    </p>

                    {receitasData.length === 0 ? (
                      <p className="text-gray-500 text-center mt-12">
                        Sem dados
                      </p>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          {renderCenterLabel(receitas, "#3EF2C2")}
                          <Pie
                            data={receitasData}
                            innerRadius="75%"
                            outerRadius="92%"
                            cornerRadius="50%"
                            paddingAngle={5}
                            dataKey="value"
                            nameKey="name"
                          >
                            {receitasData.map((_, i) => (
                              <Cell
                                key={i}
                                fill={
                                  ["#3EF2C2", "#A0A7B1", "#6B7280", "#FF7A6B"][
                                    i % 4
                                  ]
                                }
                              />
                            ))}
                          </Pie>
                          <Tooltip formatter={(v) => formatCurrency(v)} />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  <div
                    className={`
                  ${chartTab === "despesas" ? "block" : "hidden"}
                  lg:block
                  ${theme.surface}
                  border ${theme.border}
                  backdrop-blur-xl
                  p-4
                  pb-8
                  lg:p-6
                  lg:pb-15
                  rounded-2xl
                  shadow-lg
                  h-[210px]
                  lg:h-68
                `}
                  >
                    <p className={`text-sm ${theme.textSecondary} mb-2`}>
                      Despesas
                    </p>

                    {despesasData.length === 0 ? (
                      <p className={`text-center mt-12 ${theme.textMuted}`}>
                        Sem dados
                      </p>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          {renderCenterLabel(despesas, "#FF7A6B")}
                          <Pie
                            data={despesasData}
                            innerRadius="75%"
                            outerRadius="92%"
                            cornerRadius="50%"
                            paddingAngle={5}
                            dataKey="value"
                            nameKey="name"
                          >
                            {despesasData.map((_, i) => (
                              <Cell
                                key={i}
                                fill={
                                  ["#FF7A6B", "#A0A7B1", "#3EF2C2", "#6B7280"][
                                    i % 4
                                  ]
                                }
                              />
                            ))}
                          </Pie>
                          <Tooltip formatter={(v) => formatCurrency(v)} />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* LISTA COM SCROLL PRÓPRIO */}
            <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
              <div className="shrink-0">
                <div className="flex items-center justify-between">
                  <h2
                    className={`text-xl lg:text-2xl font-semibold ${theme.textPrimary}`}
                  >
                    Lançamentos
                  </h2>

                  <button
                    onClick={() => setShowFilters((prev) => !prev)}
                    className={`
                    px-3 py-1 rounded-lg text-sm cursor-pointer border transition
                    ${
                      themeName === "light"
                        ? "bg-white/60 border-slate-200/70 text-slate-600 hover:bg-white"
                        : "bg-white/10 border-white/[0.06] text-gray-300 hover:bg-white/20"
                    }
                  `}
                  >
                    Filtros
                  </button>
                </div>

                {activeMonthFilter && (
                  <div className="flex gap-2 mt-3">
                    <div
                      className={`
                      flex items-center gap-2 px-3 py-1 rounded-full text-sm border
                      ${
                        themeName === "light"
                          ? "bg-white/60 border-slate-200/70 text-slate-600"
                          : "bg-white/10 border-white/[0.06] text-gray-300"
                      }
                    `}
                    >
                      <span>{activeMonthFilter}</span>

                      <button
                        onClick={() => {
                          setMonthFilter("todos");
                          setShowFilters(false);
                        }}
                        className={`
                        cursor-pointer
                        ${themeName === "light" ? "text-slate-400 hover:text-slate-700" : "text-gray-400 hover:text-white"}
                      `}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}

                {showFilters && (
                  <div className="mt-3 p-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setMonthFilter("todos");
                        setShowFilters(false);
                      }}
                      className={`cursor-pointer px-3 py-1 rounded-full text-xs border transition ${
                        monthFilter === "todos"
                          ? "bg-emerald-400 text-black border-emerald-400"
                          : themeName === "light"
                            ? "bg-white/60 text-slate-600 border-slate-200/70 hover:bg-white"
                            : "bg-white/10 text-gray-300 border-white/[0.06] hover:bg-white/20"
                      }`}
                    >
                      Todos
                    </button>

                    {months.map((m) => (
                      <button
                        key={m}
                        onClick={() => {
                          setMonthFilter(m);
                          setShowFilters(false);
                        }}
                        className={`cursor-pointer px-3 py-1 rounded-full text-xs border transition ${
                          monthFilter === m
                            ? "bg-emerald-400 text-black border-emerald-400"
                            : themeName === "light"
                              ? "bg-white/60 text-slate-600 border-slate-200/70 hover:bg-white"
                              : "bg-white/10 text-gray-300 border-white/[0.06] hover:bg-white/20"
                        }`}
                      >
                        {m.toUpperCase()}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto pr-1 lg:pr-2 flex flex-col gap-3 no-scrollbar mt-4 pb-32 lg:pb-5">
                {filteredItems.length === 0 ? (
                  <p className="text-gray-400">Nenhum lançamento ainda</p>
                ) : (
                  filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className={`
                      flex items-center justify-between gap-4
                      p-4 lg:p-5
                      rounded-[24px]
                      border
                      backdrop-blur-xl
                      transition-all
                      ${
                        themeName === "light"
                          ? `
                            bg-white/70
                            border-slate-200/70
                            hover:bg-white
                          `
                          : `
                            bg-white/[0.04]
                            border-white/[0.08]
                            hover:bg-white/[0.07]
                          `
                      }
                    `}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`
                          w-11 h-11 rounded-2xl
                          flex items-center justify-center
                          shrink-0 border
                          ${
                            themeName === "light"
                              ? "bg-white/80 border-slate-200/80 shadow-sm"
                              : "bg-white/[0.04] border-white/[0.08]"
                          }
                        `}
                        >
                          <img
                            src={getPaymentVisual({ item, cards, accounts })}
                            className={`
                            w-6 h-6 object-contain
                            ${themeName === "light" ? "invert opacity-70" : ""}
                          `}
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p
                              className={`font-medium truncate ${theme.textPrimary}`}
                            >
                              {item.descricao}
                            </p>

                            <p className={`text-sm ${theme.textSecondary}`}>
                              {categories.find((c) => c.id === item.categoriaId)
                                ?.nome || "Sem categoria"}
                            </p>
                          </div>

                          <div className="flex gap-1 flex-wrap mt-1">
                            {item.meses?.map((m) => (
                              <span
                                key={m}
                                className={`
                                text-[10px]
                                px-2 py-0.5
                                rounded-full
                                ${
                                  themeName === "light"
                                    ? "bg-slate-100 text-slate-500"
                                    : "bg-white/[0.06] text-gray-300"
                                }
                              `}
                              >
                                {m.toUpperCase()}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <p
                          className={`font-medium text-sm lg:text-base ${
                            item.tipo === "receita"
                              ? "text-emerald-400"
                              : "text-red-400"
                          }`}
                        >
                          {formatCurrency(item.valorMensal)}
                          <span className="hidden lg:inline text-xs text-gray-400 ml-1">
                            /mês
                          </span>
                        </p>

                        <button
                          onClick={() => {
                            setForm({
                              descricao: item.descricao || "",
                              categoriaId: item.categoriaId || "",
                              valorMensal: item.valorMensal || "",
                              tipo: item.tipo || "despesa",
                              meses: item.meses || [],
                              diaVencimento: item.diaVencimento || "",
                              formaPagamento: item.formaPagamento || "pix",
                              accountId: item.accountId || "",
                              cartaoId: item.cartaoId || "",
                            });

                            setEditingId(item.id);

                            if (window.innerWidth < 1024) {
                              setShowMobileForm(true);
                            }
                          }}
                          className={`
                          w-9 h-9 rounded-xl
                          flex items-center justify-center
                          transition-all border
                          ${
                            themeName === "light"
                              ? "bg-white border-slate-200/70 hover:bg-slate-50"
                              : "bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.08]"
                          }
                        `}
                        >
                          <EditIcon className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          className={`
                          w-9 h-9 rounded-xl
                          flex items-center justify-center
                          transition-all border
                          ${
                            themeName === "light"
                              ? "bg-red-50 border-red-100 hover:bg-red-100"
                              : "bg-red-400/10 border-red-400/10 hover:bg-red-400/20"
                          }
                        `}
                        >
                          <DeleteIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block">
          <RightSidebar
            form={form}
            setForm={setForm}
            handleAdd={handleAdd}
            months={months}
            toggleMonth={toggleMonth}
            editingId={editingId}
            formatCurrency={formatCurrency}
          />
        </div>

        <FloatingActionButton
          open={showMobileForm}
          onClick={() => {
            if (showMobileForm) {
              setShowMobileForm(false);
              setEditingId(null);
              return;
            }

            setEditingId(null);
            setShowMobileForm(true);
          }}
        />

        <BottomSheet
          open={showMobileForm}
          onClose={() => {
            setShowMobileForm(false);
            setEditingId(null);
          }}
        >
          <RightSidebar
            form={form}
            setForm={setForm}
            handleAdd={handleAdd}
            months={months}
            toggleMonth={toggleMonth}
            editingId={editingId}
            formatCurrency={formatCurrency}
            isMobile
            setShowMobileForm={setShowMobileForm}
          />
        </BottomSheet>
      </div>
    </div>
  );
}
