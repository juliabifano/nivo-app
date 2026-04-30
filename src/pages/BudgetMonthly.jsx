import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import SaldoCard from "../components/SaldoCard";
import NubankBar from "../components/NubankBar";
import { useBudgetAnnual } from "../contexts/BudgetAnnualContext";
import { useTransactions } from "../contexts/TransactionContext";
import { useCategories } from "../contexts/CategoryContext";
import { getMonthlyBudgetSnapshot } from "../utils/getMonthlyBudgetSnapshot";

export default function BudgetMonthly() {
  const { items = [] } = useBudgetAnnual();
  const { transactions = [] } = useTransactions();
  const { categories = [] } = useCategories();

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
    <div className="flex-1 h-screen overflow-y-auto p-6 flex justify-center">
      <div className="w-full max-w-4xl flex flex-col gap-8 animate-fade-in">
        {/* HEADER MELHORADO */}
        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-lg">
          <p className="text-sm text-gray-400 mb-1">
            Saldo de{" "}
            <span className="font-semibold text-white">
              {monthNames[selectedMonth]}
            </span>
          </p>

          <SaldoCard receitas={receitas} despesas={despesas} />
          <NubankBar receitas={receitas} despesas={despesas} />
        </div>

        {/* MESES COM HOVER */}
        <div className="grid grid-cols-12 gap-2">
          {months.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMonth(m)}
              className={`py-1 rounded-full text-sm transition-all duration-200 cursor-pointer ${
                selectedMonth === m
                  ? "bg-gradient-to-r from-white to-gray-300 text-black font-semibold"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>

        {/* GRÁFICOS COM HOVER */}
        <div className="grid grid-cols-2 gap-6">
          {/* RECEITAS */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 pt-5 pb-15 rounded-2xl border border-white/5 h-72 hover:scale-[1.02] transition-transform">
            <p className="text-sm text-gray-400 mb-2">Receitas</p>

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={receitasData}
                  dataKey="value"
                  innerRadius="80%"
                  outerRadius="100%"
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
                  fontSize="18"
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
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 pt-5 pb-15 rounded-2xl border border-white/5 h-72 hover:scale-[1.02] transition-transform">
            <p className="text-sm text-gray-400 mb-2">Despesas</p>

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={despesasData}
                  dataKey="value"
                  innerRadius="80%"
                  outerRadius="100%"
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
                  fontSize="18"
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

        {/* LISTA MELHORADA */}
        <div>
          <h2 className="text-lg font-medium mb-2">Lançamentos</h2>

          <div className="relative">
            <div className="max-h-72 overflow-y-auto pr-2 no-scrollbar">
              {monthlyItems.map((item) => (
                <div
                  key={item.id + item.data}
                  className="bg-white/5 backdrop-blur-xl p-4 mt-3 rounded-xl flex justify-between items-center border border-white/10 hover:bg-white/10 transition"
                >
                  <div>
                    <p className="font-medium">
                      {item.descricao?.charAt(0).toUpperCase() +
                        item.descricao?.slice(1)}
                    </p>

                    <p className="text-gray-400 text-sm">
                      {item.categoriaNome}
                    </p>
                  </div>

                  <p
                    className={`font-semibold ${
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

            {/* fade no final da lista (fica mais bonito) */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#0B0F1A] to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}
