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

export default function BudgetAnnual() {
  const { items = [], add, update, remove } = useBudgetAnnual();
  const { categories } = useCategories();

  const [form, setForm] = useState({
    descricao: "",
    categoriaId: "",
    valorMensal: "",
    tipo: "despesa",
    meses: [],
  });

  const [editingId, setEditingId] = useState(null);

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

  // =========================
  // SNAPSHOT (ÚNICA FONTE DE VERDADE)
  // =========================
  const budget = getAnnualBudgetSnapshot(items, categories);

  const { receitas, despesas, saldo, receitasData, despesasData } = budget;

  // =========================
  // CRUD
  // =========================
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
    });
  };

  const handleDelete = (id) => {
    remove(id);
  };

  const formatCurrency = (value) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const renderCenterLabel = (total, color) => (
    <text
      x="50%"
      y="50%"
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize="18"
      fontWeight="600"
      fill={color}
    >
      {formatCurrency(total)}
    </text>
  );

  return (
    <div className="flex-1 h-screen overflow-y-auto p-6 flex justify-center">
      <div className="flex flex-1 items-start">
        {/* CONTEÚDO CENTRAL */}
        <div className="flex-1 pr-[360px] flex justify-center">
          <div className="w-full max-w-5xl flex flex-col gap-8">
            {/* HEADER */}
            <div>
              <h1 className="text-2xl font-semibold mb-4">Orçamento Anual</h1>

              <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-lg">
                <p className="text-gray-400 text-sm">Saldo Anual</p>

                <SaldoCard receitas={receitas} despesas={despesas} />
                <NubankBar receitas={receitas} despesas={despesas} />
              </div>
            </div>

            {/* GRÁFICOS */}
            <div>
              <div className="grid grid-cols-2 gap-6">
                {/* RECEITAS */}
                <div className="bg-white/5 backdrop-blur-xl p-6 pt-5 pb-15 rounded-2xl border border-white/10 shadow-lg h-72">
                  <p className="text-sm text-gray-400 mb-2">Receitas</p>

                  {receitasData.length === 0 ? (
                    <p className="text-gray-500 text-center mt-16">Sem dados</p>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        {renderCenterLabel(receitas, "#3EF2C2")}
                        <Pie
                          data={receitasData}
                          innerRadius="80%"
                          outerRadius="100%"
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

                {/* DESPESAS */}
                <div className="bg-white/5 backdrop-blur-xl p-6 pt-5 pb-15 rounded-2xl border border-white/10 shadow-lg h-72">
                  <p className="text-sm text-gray-400 mb-2">Despesas</p>

                  {despesasData.length === 0 ? (
                    <p className="text-gray-500 text-center mt-16">Sem dados</p>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        {renderCenterLabel(despesas, "#FF7A6B")}
                        <Pie
                          data={despesasData}
                          innerRadius="80%"
                          outerRadius="100%"
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

            {/* LISTA */}
            <div>
              <h2 className="text-lg font-medium mb-4">Lançamentos</h2>

              <div className="flex flex-col gap-3 mb-5">
                {items.length === 0 ? (
                  <p className="text-gray-400">Nenhum lançamento ainda</p>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white/5 backdrop-blur-xl p-4 rounded-xl border border-white/10 flex justify-between items-center hover:bg-white/10 transition"
                    >
                      <div>
                        <p className="font-medium">{item.descricao}</p>

                        <p className="text-sm text-gray-400">
                          {categories.find((c) => c.id === item.categoriaId)
                            ?.nome || "Sem categoria"}
                        </p>

                        <div className="flex gap-1 flex-wrap mt-1">
                          {item.meses?.map((m) => (
                            <span
                              key={m}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-gray-300"
                            >
                              {m.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <p
                          className={`font-medium ${
                            item.tipo === "receita"
                              ? "text-emerald-400"
                              : "text-red-400"
                          }`}
                        >
                          {formatCurrency(item.valorMensal)}
                          <span className="text-xs text-gray-400 ml-1">
                            /mês
                          </span>
                        </p>

                        <button
                          onClick={() => {
                            setForm({
                              ...item,
                              meses: item.meses || [],
                            });
                            setEditingId(item.id);
                          }}
                        >
                          <EditIcon className="w-5 h-5" />
                        </button>

                        <button onClick={() => handleDelete(item.id)}>
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

        {/* SIDEBAR */}
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
    </div>
  );
}
