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

export default function BudgetMonthly() {
  const { items = [] } = useBudgetAnnual();
  const { transactions = [] } = useTransactions();
  const { categories = [] } = useCategories();
  const { cards = [] } = useCards();
  const { accounts = [] } = useAccounts();
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

  // =========================
  // SNAPSHOT ÚNICO
  // =========================
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

  return (
    <div className="relative h-full overflow-hidden px-4 pt-5 pb-28 lg:p-6 flex justify-center">
      <div className="flex flex-1 h-full items-start overflow-hidden min-h-0">
        <div className="flex-1 flex justify-center h-full overflow-hidden">
          <div className="w-full max-w-5xl mx-auto h-full flex flex-col gap-4 lg:gap-6 overflow-hidden">
            {/* TOPO FIXO */}
            <div className="shrink-0 flex flex-col gap-4">
              <SectionHeader
                title="Orçamento Mensal"
                subtitle="Planejamento mensal de receitas e despesas"
                icon={
                  <img
                    src="/logo-ni-branca.svg"
                    className="w-6 h-6 object-contain"
                  />
                }
              />

              {/* SALDO */}
              <div className="bg-white/5 backdrop-blur-xl p-4 lg:p-6 rounded-2xl border border-white/10 shadow-lg">
                <p className="text-sm text-gray-400 mb-1">
                  Saldo de{" "}
                  <span className="font-semibold text-white">
                    {monthNames[selectedMonth]}
                  </span>
                </p>

                <SaldoCard receitas={receitas} despesas={despesas} />
                <NubankBar receitas={receitas} despesas={despesas} />
              </div>

              {/* MESES */}
              <GlassTabs
                value={selectedMonth}
                onChange={setSelectedMonth}
                tabs={months.map((m) => ({
                  value: m,
                  label: m.toUpperCase(),
                }))}
              />

              {/* MOBILE TABS */}
              <div className="lg:hidden">
                <GlassTabs
                  value={chartTab}
                  onChange={setChartTab}
                  tabs={[
                    {
                      value: "receitas",
                      label: "Receitas",
                    },
                    {
                      value: "despesas",
                      label: "Despesas",
                    },
                  ]}
                />
              </div>

              {/* GRÁFICOS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                {/* RECEITAS */}
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
                  lg:h-72
                `}
                >
                  <p className="text-sm text-gray-400 mb-2">Receitas</p>

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
                          <Cell key={i} fill={["#3EF2C2", "#A0A7B1"][i % 2]} />
                        ))}
                      </Pie>

                      <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="16"
                        fontWeight="600"
                        fill="#3EF2C2"
                      >
                        {formatCurrency(receitas)}
                      </text>

                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(2,6,23,0.8)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "8px",
                        }}
                        formatter={(v) => formatCurrency(v)}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* DESPESAS */}
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
                  lg:h-72
                `}
                >
                  <p className="text-sm text-gray-400 mb-2">Despesas</p>

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
                          <Cell key={i} fill={["#FF7A6B", "#A0A7B1"][i % 2]} />
                        ))}
                      </Pie>

                      <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="16"
                        fontWeight="600"
                        fill="#FF7A6B"
                      >
                        {formatCurrency(despesas)}
                      </text>

                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(2,6,23,0.8)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "8px",
                        }}
                        formatter={(v) => formatCurrency(v)}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* LISTA */}
            <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
              <div className="shrink-0">
                <h2 className="text-xl lg:text-2xl font-semibold">
                  Lançamentos
                </h2>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto pr-1 lg:pr-2 flex flex-col gap-3 no-scrollbar mt-4 pb-4 lg:pb-5">
                {monthlyItems.map((item) => (
                  <div
                    key={item.id + item.data}
                    className="
                    bg-white/5
                    backdrop-blur-xl
                    p-4 lg:p-5
                    rounded-xl
                    flex
                    justify-between
                    items-center
                    border border-white/10
                    hover:bg-white/10
                    transition
                    gap-4
                  "
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={getPaymentVisual({ item, cards, accounts })}
                        className="w-8 h-8 object-contain shrink-0"
                      />

                      <div className="min-w-0">
                        <p className="font-medium truncate">{item.descricao}</p>

                        <p className="text-sm text-gray-400 truncate">
                          {item.categoriaNome || "Sem categoria"}
                        </p>
                      </div>
                    </div>

                    <p
                      className={`font-semibold shrink-0 ${
                        item.tipo === "receita"
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {formatCurrency(item.valorFinal ?? item.valor)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
