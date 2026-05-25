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

export default function BudgetAnnual() {
  const { items = [], add, update, remove } = useBudgetAnnual();
  const { categories } = useCategories();
  const { cards = [] } = useCards();
  const { accounts = [] } = useAccounts();

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
    <div className="relative h-full overflow-hidden px-4 pt-5 pb-28 lg:p-6 flex justify-center">
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
                    src="/logo-ni-branca.svg"
                    className="w-6 h-6 object-contain"
                  />
                }
              />

              <div className="bg-white/5 backdrop-blur-xl p-4 lg:p-6 rounded-2xl border border-white/10 shadow-lg">
                <p className="text-gray-400 text-sm">Saldo Anual</p>

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
                      bg-white/5
                      backdrop-blur-xl
                      p-4
                      pb-8
                      lg:p-6
                      lg:pb-15
                      rounded-2xl
                      border border-white/10
                      shadow-lg
                      h-[210px]
                      lg:h-68
                    `}
                  >
                    <p className="text-sm text-gray-400 mb-2">Receitas</p>

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
                      bg-white/5
                      backdrop-blur-xl
                      p-4
                      pb-8
                      lg:p-6
                      lg:pb-15
                      rounded-2xl
                      border border-white/10
                      shadow-lg
                      h-[210px]
                      lg:h-68
                    `}
                  >
                    <p className="text-sm text-gray-400 mb-2">Despesas</p>

                    {despesasData.length === 0 ? (
                      <p className="text-gray-500 text-center mt-12">
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
                  <h2 className="text-xl lg:text-2xl font-semibold">
                    Lançamentos
                  </h2>

                  <button
                    onClick={() => setShowFilters((prev) => !prev)}
                    className="px-3 py-1 rounded-lg bg-white/10 text-sm text-gray-300 hover:bg-white/20 cursor-pointer"
                  >
                    Filtros
                  </button>
                </div>

                {activeMonthFilter && (
                  <div className="flex gap-2 mt-3">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm">
                      <span>{activeMonthFilter}</span>

                      <button
                        onClick={() => {
                          setMonthFilter("todos");
                          setShowFilters(false);
                        }}
                        className="text-gray-400 hover:text-white cursor-pointer"
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
                      className={`cursor-pointer px-3 py-1 rounded-full text-xs ${
                        monthFilter === "todos"
                          ? "bg-emerald-400 text-black"
                          : "bg-white/10 text-gray-300"
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
                        className={`cursor-pointer px-3 py-1 rounded-full text-xs ${
                          monthFilter === m
                            ? "bg-emerald-400 text-black"
                            : "bg-white/10 text-gray-300"
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
                      className="
                        bg-white/5
                        backdrop-blur-xl
                        p-4 lg:p-5
                        rounded-xl
                        border border-white/10
                        flex
                        justify-between
                        items-center
                        gap-4
                        hover:bg-white/10
                        transition
                      "
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={getPaymentVisual({ item, cards, accounts })}
                          className="w-8 h-8 object-contain shrink-0"
                        />

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium truncate">
                              {item.descricao}
                            </p>

                            <p className="text-sm text-gray-400">
                              {categories.find((c) => c.id === item.categoriaId)
                                ?.nome || "Sem categoria"}
                            </p>
                          </div>

                          <div className="flex gap-1 flex-wrap mt-1">
                            {item.meses?.map((m) => (
                              <span
                                key={m}
                                className="text-[11px] px-2.5 py-1 rounded-full bg-white/10 text-gray-300"
                              >
                                {m.toUpperCase()}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
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
                          className="cursor-pointer"
                        >
                          <EditIcon className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="cursor-pointer"
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
