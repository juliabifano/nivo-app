import { useBudget } from "../contexts/BudgetContext";
import Chart from "react-apexcharts";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { transactions = [], cartoes = [], items = [] } = useBudget();

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

  const normalizeMonth = (m) => m?.toLowerCase().replace(".", "").trim();

  const currentMonth = normalizeMonth(
    new Date().toLocaleString("pt-BR", { month: "short" }),
  );

  const normalize = (item) => ({
    ...item,
    valorFinal: Number(item.valor ?? item.valorMensal ?? 0),
  });

  const allItems = [
    ...items.map((i) => normalize({ ...i, origem: "orcamento" })),
    ...transactions.map((t) => normalize({ ...t, origem: "transacao" })),
  ];

  const getMonthFromDate = (date) => {
    if (!date) return null;
    return normalizeMonth(
      new Date(date).toLocaleString("pt-BR", { month: "short" }),
    );
  };

  const monthlyItems = allItems.filter((item) => {
    if (item.origem === "orcamento") {
      return item.meses?.includes(currentMonth);
    }
    return getMonthFromDate(item.data) === currentMonth;
  });

  const receitas = monthlyItems.filter((i) => i.tipo === "receita");
  const despesas = monthlyItems.filter((i) => i.tipo === "despesa");

  const summary = {
    receitas: receitas.reduce((a, b) => a + b.valorFinal, 0),
    despesas: despesas.reduce((a, b) => a + b.valorFinal, 0),
  };

  summary.saldo = summary.receitas - summary.despesas;

  const formatCurrency = (value) =>
    Number(value || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  // -------------------------
  // CORES E LOGOS
  // -------------------------
  const coresBanco = {
    nubank: "#8A05BE",
    inter: "#FF7A00",
    itau: "#EC7000",
    santander: "#E30613",
    bradesco: "#CC092F",
    bb: "#F2C811",
    caixa: "#0047AB",
    sicoob: "#00A859",
    c6: "#000000",
    original: "#1F2937",
    alelo: "#10B981",
    default: "#111827",
  };

  const logosBanco = {
    nubank: "/banks/nubank.svg",
    inter: "/banks/inter.svg",
    itau: "/banks/itau.svg",
    santander: "/banks/santander.svg",
    bradesco: "/banks/bradesco.svg",
    bb: "/banks/bb.svg",
    caixa: "/banks/caixa.svg",
    sicoob: "/banks/sicoob.svg",
    c6: "/banks/c6.svg",
    original: "/banks/original.svg",
    alelo: "/banks/alelo.svg",
    default: "/banks/default.svg",
  };

  const imagensCartao = {
    nubank: "/cards/nubank.svg",
    inter: "/cards/inter.svg",
    itau: "/cards/itau.svg",
    santander: "/cards/santander.svg",
    bradesco: "/cards/bradesco.svg",
    bb: "/cards/bb.svg",
    caixa: "/cards/caixa.svg",
    sicoob: "/cards/sicoob.svg",
    c6: "/cards/c6.svg",
    original: "/cards/original.svg",
    alelo: "/cards/alelo.svg",
    default: "/cards/default.svg",
  };

  const normalizeBankName = (name = "") => {
    const n = name.toLowerCase().trim();

    if (n.includes("nubank")) return "nubank";
    if (n.includes("inter")) return "inter";
    if (n.includes("itaú") || n.includes("itau")) return "itau";
    if (n.includes("santander")) return "santander";
    if (n.includes("bradesco")) return "bradesco";
    if (n.includes("banco do brasil") || n === "bb") return "bb";
    if (n.includes("caixa")) return "caixa";
    if (n.includes("sicoob")) return "sicoob";
    if (n.includes("c6")) return "c6";
    if (n.includes("original")) return "original";
    if (n.includes("alelo")) return "alelo";

    return "default";
  };

  const normalizeCard = (c) => {
    const key = normalizeBankName(c.banco);

    return {
      ...c,
      cor: coresBanco[key] || coresBanco.default,
      logo: logosBanco[key] || logosBanco.default,
      imagem: imagensCartao[key] || imagensCartao.default,
    };
  };

  const getCardTotal = (id) =>
    transactions
      .filter((t) => t.cartao === id)
      .reduce((acc, t) => acc + Number(t.valor || 0), 0);

  // -------------------------
  // GRÁFICO
  // -------------------------
  const agruparPorMes = (items) => {
    const resultado = months.map((mes) => ({
      mes,
      receita: 0,
      despesa: 0,
    }));

    items.forEach((item) => {
      if (item.origem === "orcamento") {
        item.meses?.forEach((m) => {
          const mesIndex = months.indexOf(normalizeMonth(m));
          if (mesIndex === -1) return;

          if (item.tipo === "receita") {
            resultado[mesIndex].receita += item.valorFinal;
          } else {
            resultado[mesIndex].despesa += item.valorFinal;
          }
        });
        return;
      }

      const mesIndex = new Date(item.data).getMonth();

      if (item.tipo === "receita") {
        resultado[mesIndex].receita += item.valorFinal;
      } else {
        resultado[mesIndex].despesa += item.valorFinal;
      }
    });

    return resultado;
  };

  const chartData = agruparPorMes(allItems);

  // -------------------------
  // ÚLTIMOS GASTOS
  // -------------------------
  const lastTransactions = [...transactions]
    .sort((a, b) => new Date(b.data) - new Date(a.data))
    .slice(0, 5);

  const getTransactionIcon = (t) => {
    const tipo = String(t.tipoPagamento || t.formaPagamento || "")
      .toLowerCase()
      .trim();

    const cartaoObj = cartoes.find((c) => c.id === t.cartao);

    if (tipo.includes("pix")) return "/icons/pix.svg";
    if (tipo.includes("dinheiro")) return "/icons/cash.svg";

    if (cartaoObj?.banco) {
      const banco = cartaoObj.banco.toLowerCase();
      return logosBanco[banco] || logosBanco.default;
    }

    return "/icons/default.svg";
  };

  // -------------------------
  // TOP GASTOS
  // -------------------------
  const buildCategory = (list) => {
    const data = {};
    list.forEach((item) => {
      const cat = item.categoria || "Sem categoria";
      data[cat] = (data[cat] || 0) + item.valorFinal;
    });
    return Object.entries(data).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const despesasData = buildCategory(despesas);

  // -------------------------
  // CARTÕES
  // -------------------------
  const getLastUsedCards = () => {
    if (!transactions.length || !cartoes.length) return [];

    const used = [...transactions]
      .filter((t) => t.cartao && t.data)
      .sort((a, b) => new Date(b.data) - new Date(a.data));

    const unique = [];
    used.forEach((t) => {
      if (!unique.includes(t.cartao)) unique.push(t.cartao);
    });

    return unique
      .map((id) => cartoes.find((c) => c.id === id))
      .filter(Boolean)
      .slice(0, 2);
  };

  const lastUsedCards = getLastUsedCards();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // tempo fake (pode ajustar)

    return () => clearTimeout(timer);
  }, []);

  const getGradient = (color) => {
    return `linear-gradient(135deg, ${color} 0%, ${color}CC 40%, #0B0F1A 100%)`;
  };

  return (
    <div className="h-screen overflow-hidden p-6 flex justify-center">
      <div className="w-full max-w-6xl flex flex-col gap-5">
        {/* HEADER */}
        <div className="relative bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-lg hover:bg-white/10 transition-all">
          {/* overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none rounded-2xl" />

          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">
                Saldo de{" "}
                <span className="text-white font-semibold">
                  {monthNames[currentMonth]}
                </span>
              </p>

              <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
                {formatCurrency(summary.saldo)}
              </h1>
            </div>

            <div className="flex gap-6 text-sm">
              <div className="text-right">
                <p className="text-emerald-400 font-semibold">
                  + {formatCurrency(summary.receitas)}
                </p>
                <p className="text-xs text-gray-400">Receitas</p>
              </div>

              <div className="text-right">
                <p className="text-red-400 font-semibold">
                  - {formatCurrency(summary.despesas)}
                </p>
                <p className="text-xs text-gray-400">Despesas</p>
              </div>
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 h-full">
          {/* ESQUERDA */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* GRÁFICO */}
            <div className="relative bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-lg hover:bg-white/10 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none rounded-2xl" />

              <div className="relative z-10">
                <p className="text-sm text-gray-400 mb-4">
                  {" "}
                  Receitas x Despesas / ano{" "}
                </p>{" "}
                <Chart
                  type="line"
                  height={300}
                  series={[
                    { name: "Receitas", data: chartData.map((d) => d.receita) },
                    { name: "Despesas", data: chartData.map((d) => d.despesa) },
                  ]}
                  options={{
                    chart: {
                      toolbar: { show: false },
                      zoom: { enabled: false },
                      background: "transparent",
                    },
                    legend: {
                      show: true,
                      position: "top",
                      horizontalAlign: "right",
                      fontSize: "12px",
                      markers: { width: 9, height: 9, offsetX: -3 },
                      itemMargin: { horizontal: 16 },
                      labels: { colors: "#9ca3af" },
                    },
                    stroke: { curve: "smooth", width: 2 },
                    colors: ["#3EF2C2", "#FF7A6B"],
                    grid: { borderColor: "#1f2937", strokeDashArray: 3 },
                    markers: { size: 0 },
                    xaxis: {
                      categories: chartData.map(
                        (d) => d.mes.charAt(0).toUpperCase() + d.mes.slice(1),
                      ),
                      labels: { style: { colors: "#9ca3af" } },
                    },
                    yaxis: {
                      labels: {
                        style: { colors: "#9ca3af" },
                        formatter: (val) => formatCurrency(val),
                      },
                    },
                    tooltip: { theme: "dark" },
                  }}
                />
              </div>
            </div>

            {/* ÚLTIMOS GASTOS */}
            <div className="relative bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-lg hover:bg-white/10 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none rounded-2xl" />

              <div className="relative z-10">
                <p className="text-sm text-gray-400 mb-4">Últimos gastos</p>

                <div className="flex flex-col gap-3 max-h-[260px] overflow-y-auto pr-2 no-scrollbar">
                  {lastTransactions.map((t) => (
                    <div
                      key={t.id}
                      className="flex justify-between items-center bg-white/5 hover:bg-white/10 transition p-3 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <img src={getTransactionIcon(t)} className="w-8 h-8" />

                        <div>
                          <p className="text-white text-sm font-medium">
                            {t.descricao?.charAt(0).toUpperCase() +
                              t.descricao?.slice(1)}
                          </p>
                          <p className="text-gray-400 text-xs">{t.categoria}</p>
                        </div>
                      </div>

                      <p
                        className={`text-sm font-semibold ${
                          t.tipo === "receita"
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {t.tipo === "receita" ? "+" : "-"}{" "}
                        {formatCurrency(t.valor)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* DIREITA */}
          <div className="flex flex-col gap-5">
            {/* CARTÕES */}
            <div className="relative bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-lg hover:bg-white/10 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none rounded-2xl" />

              <div className="relative z-10">
                <p className="text-sm text-gray-400 mb-4">Cartões</p>

                <div className="flex flex-col gap-3">
                  {lastUsedCards.map((c, index) => {
                    const card = normalizeCard(c);
                    const total = getCardTotal(c.id);
                    const percent = c.limite ? (total / c.limite) * 100 : 0;
                    const disponivel = c.limite ? c.limite - total : 0;

                    const getBarColor = () => {
                      if (percent > 80) return "bg-red-400";
                      if (percent > 50) return "bg-yellow-400";
                      return "bg-emerald-400";
                    };

                    return (
                      <motion.div
                        key={c.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group p-4 rounded-xl relative overflow-hidden border border-white/10 hover:border-white/20 transition"
                        style={{
                          backgroundImage: `url(${card.imagem})`,
                          backgroundSize: "cover",
                          boxShadow: `0 10px 40px ${card.cor}40`,
                        }}
                      >
                        {/* overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-black/10" />

                        <div className="relative z-10 text-white flex flex-col gap-3">
                          <div className="flex justify-between items-center">
                            <p className="text-xs opacity-80">{c.nome}</p>
                            <img src={card.logo} className="h-5" />
                          </div>

                          <p className="text-lg font-bold">
                            {formatCurrency(total)}
                          </p>

                          {c.limite && (
                            <>
                              <div className="flex justify-between text-xs opacity-80">
                                <span>Uso</span>
                                <span>{Math.round(percent)}%</span>
                              </div>

                              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                                <div
                                  className={`h-1.5 rounded-full ${getBarColor()}`}
                                  style={{ width: `${percent}%` }}
                                />
                              </div>

                              <div className="flex justify-between text-xs opacity-80">
                                <span>
                                  {formatCurrency(total)} /{" "}
                                  {formatCurrency(c.limite)}
                                </span>
                                <span>Disp: {formatCurrency(disponivel)}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* TOP GASTOS */}
            <div className="relative bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-lg flex-1 hover:bg-white/10 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none rounded-2xl" />

              <div className="relative z-10">
                <p className="text-sm text-gray-400 mb-4">Top gastos</p>

                {despesasData
                  .sort((a, b) => b.value - a.value)
                  .slice(0, 4)
                  .map((cat) => (
                    <div key={cat.name} className="mb-4">
                      <div className="flex justify-between text-sm text-gray-300">
                        <span>{cat.name}</span>
                        <span>{formatCurrency(cat.value)}</span>
                      </div>

                      <div className="w-full h-1.5 bg-white/10 rounded-full mt-2">
                        <div
                          className="h-1.5 bg-red-400 rounded-full"
                          style={{
                            width: `${
                              summary.despesas
                                ? (cat.value / summary.despesas) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
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
