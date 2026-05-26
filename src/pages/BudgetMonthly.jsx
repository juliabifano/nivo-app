import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import SaldoCard from "../components/SaldoCard";
import NubankBar from "../components/NubankBar";
import { useBudgetAnnual } from "../contexts/BudgetAnnualContext";
import { useTransactions } from "../contexts/TransactionContext";
import { useCategories } from "../contexts/CategoryContext";
import { getMonthlyBudgetSnapshot } from "../utils/getMonthlyBudgetSnapshot";
import { getPaymentVisual } from "../utils/getPaymentVisual";
import { useCards } from "../contexts/CardContext";
import { useAccounts } from "../contexts/AccountContext";
import SectionHeader from "../components/ui/SectionHeader";
import GlassTabs from "../components/ui/GlassTabs";
import { useTheme } from "../theme/useTheme";

export default function BudgetMonthly() {
  const { items = [] } = useBudgetAnnual();
  const { transactions = [] } = useTransactions();
  const { categories = [] } = useCategories();
  const { cards = [] } = useCards();
  const { accounts = [] } = useAccounts();
  const { theme, themeName } = useTheme();

  const [chartTab, setChartTab] = useState("receitas");

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

  const getCurrentMonth = () => months[new Date().getMonth()];
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  const formatCurrency = (value) => {
    const number = Number(value);
    if (!Number.isFinite(number)) return "R$ 0,00";

    return number.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const budget = getMonthlyBudgetSnapshot(
    items,
    transactions,
    selectedMonth,
    categories,
  );

  const { monthlyItems, receitas, despesas, receitasData, despesasData } =
    budget;

  const monthNames = {
    jan: "JANEIRO",
    fev: "FEVEREIRO",
    mar: "MARÇO",
    abr: "ABRIL",
    mai: "MAIO",
    jun: "JUNHO",
    jul: "JULHO",
    ago: "AGOSTO",
    set: "SETEMBRO",
    out: "OUTUBRO",
    nov: "NOVEMBRO",
    dez: "DEZEMBRO",
  };

  const tooltipStyle =
    themeName === "light"
      ? {
          backgroundColor: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(148,163,184,0.35)",
          borderRadius: "12px",
          color: "#0f172a",
        }
      : {
          backgroundColor: "rgba(2,6,23,0.8)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "12px",
          color: "#fff",
        };

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
        <div className="flex-1 flex justify-center h-full overflow-hidden">
          <div className="w-full max-w-5xl mx-auto h-full flex flex-col gap-4 lg:gap-6 overflow-hidden">
            <div className="shrink-0 flex flex-col gap-4">
              <SectionHeader
                title="Orçamento Mensal"
                subtitle="Planejamento mensal de receitas e despesas"
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
                <p className={`text-sm mb-1 ${theme.textSecondary}`}>
                  Saldo de{" "}
                  <span className={`font-semibold ${theme.textPrimary}`}>
                    {monthNames[selectedMonth]}
                  </span>
                </p>

                <SaldoCard receitas={receitas} despesas={despesas} />
                <NubankBar receitas={receitas} despesas={despesas} />
              </div>

              <GlassTabs
                value={selectedMonth}
                onChange={setSelectedMonth}
                tabs={months.map((m) => ({
                  value: m,
                  label: m.toUpperCase(),
                }))}
              />

              <div className="lg:hidden">
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
                    lg:h-72
                  `}
                >
                  <p className={`text-sm ${theme.textSecondary} mb-2`}>
                    Receitas
                  </p>

                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={receitasData}
                        dataKey="value"
                        innerRadius="77%"
                        outerRadius="92%"
                        cornerRadius="50%"
                        paddingAngle={5}
                      >
                        {receitasData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={[theme.chartIncome, "#A0A7B1"][i % 2]}
                          />
                        ))}
                      </Pie>

                      <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="16"
                        fontWeight="600"
                        fill={theme.chartIncome}
                      >
                        {formatCurrency(receitas)}
                      </text>

                      <Tooltip
                        contentStyle={tooltipStyle}
                        formatter={(v) => formatCurrency(v)}
                      />
                    </PieChart>
                  </ResponsiveContainer>
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
                    lg:h-72
                  `}
                >
                  <p className={`text-sm ${theme.textSecondary} mb-2`}>
                    Despesas
                  </p>

                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={despesasData}
                        dataKey="value"
                        innerRadius="77%"
                        outerRadius="92%"
                        cornerRadius="50%"
                        paddingAngle={5}
                      >
                        {despesasData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={[theme.chartExpense, "#A0A7B1"][i % 2]}
                          />
                        ))}
                      </Pie>

                      <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="16"
                        fontWeight="600"
                        fill={theme.chartExpense}
                      >
                        {formatCurrency(despesas)}
                      </text>

                      <Tooltip
                        contentStyle={tooltipStyle}
                        formatter={(v) => formatCurrency(v)}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
              <div className="shrink-0">
                <h2
                  className={`text-xl lg:text-2xl font-semibold ${theme.textPrimary}`}
                >
                  Lançamentos
                </h2>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto pr-1 lg:pr-2 flex flex-col gap-3 no-scrollbar mt-4 pb-4 lg:pb-5">
                {monthlyItems.length === 0 ? (
                  <p className={theme.textMuted}>Nenhum lançamento ainda</p>
                ) : (
                  monthlyItems.map((item) => (
                    <div
                      key={item.id + item.data}
                      className={`
                        flex items-center justify-between gap-4
                        p-4 lg:p-5
                        rounded-[24px]
                        border
                        backdrop-blur-xl
                        transition-all
                        ${
                          themeName === "light"
                            ? "bg-white/70 border-slate-200/70 hover:bg-white"
                            : "bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.07]"
                        }
                      `}
                    >
                      <div className="flex items-center gap-4 min-w-0">
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
                          <p
                            className={`font-medium truncate ${theme.textPrimary}`}
                          >
                            {item.descricao}
                          </p>

                          <p
                            className={`text-sm truncate ${theme.textSecondary}`}
                          >
                            {item.categoriaNome || "Sem categoria"}
                          </p>
                        </div>
                      </div>

                      <p
                        className={`font-semibold shrink-0 ${
                          item.tipo === "receita" ? theme.success : theme.danger
                        }`}
                      >
                        {formatCurrency(item.valorFinal ?? item.valor)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
