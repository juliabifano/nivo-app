import { useRef, useState } from "react";
import Chart from "react-apexcharts";
import { getBank } from "../data/banks";
import { useTransactions } from "../contexts/TransactionContext";
import { useCards } from "../contexts/CardContext";
import { useAccounts } from "../contexts/AccountContext";
import { useBudgetAnnual } from "../contexts/BudgetAnnualContext";
import { useCategories } from "../contexts/CategoryContext";
import { getDashboardSnapshot } from "../core/selectors/dashboardSelectors";
import Card3D from "../components/cards/Card3D";
import { usePaymentSchedule } from "../contexts/PaymentScheduleContext";
import { getPaymentSchedule } from "../core/selectors/paymentScheduleSelectors";
import { mapAccountsWithBalance } from "../core/selectors/accountSelectors";
import { getPaymentVisual } from "../utils/getPaymentVisual";

export default function Dashboard() {
  const { transactions = [] } = useTransactions();
  const { cards = [] } = useCards();
  const { accounts = [] } = useAccounts();
  const { items: budgetItems = [] } = useBudgetAnnual();
  const { categories = [] } = useCategories();
  const { paidIds = [] } = usePaymentSchedule();

  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleWheel = (e) => {
    if (!scrollRef.current) return;

    e.preventDefault();
    scrollRef.current.scrollLeft += e.deltaY * 1.3;
  };

  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;

    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !scrollRef.current) return;

    e.preventDefault();

    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.4;

    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const dashboard = getDashboardSnapshot({
    transactions,
    cards,
    accounts,
    budgetItems,
    categories,
  });

  const { summary, chartData, lastTransactions, topCategories } = dashboard;

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

  const formatCurrency = (value) =>
    Number(value || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const getTransactionIcon = (t) => {
    const card = cards.find((c) => String(c.id) === String(t.cartaoId));

    if (card?.banco) {
      return getBank(card.banco).logo;
    }

    const account = accounts.find(
      (a) =>
        String(a.id) === String(t.accountId) ||
        String(a.id) === String(t.contaId),
    );

    if (account?.banco) {
      return getBank(account.banco).logo;
    }

    if (t.formaPagamento === "pix") return "/icons/pix.svg";
    if (t.formaPagamento === "dinheiro") return "/icons/cash.svg";

    return "/icons/default.svg";
  };

  const lastTransactionWithCard = [...transactions]
    .filter((t) => t.cartaoId)
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || a.data);
      const dateB = new Date(b.createdAt || b.data);

      return dateB - dateA;
    })[0];

  const featuredCard = lastTransactionWithCard
    ? cards.find(
        (c) => String(c.id) === String(lastTransactionWithCard.cartaoId),
      )
    : null;

  const currentMonthIndex = new Date().getMonth();
  const currentMonth = months[currentMonthIndex];
  const currentYear = new Date().getFullYear();

  const accountsWithBalance = mapAccountsWithBalance(accounts, transactions);

  const totalAccountsBalance = accountsWithBalance.reduce(
    (acc, a) => acc + Number(a.saldoAtual || 0),
    0,
  );

  const schedule = getPaymentSchedule({
    items: budgetItems,
    transactions,
    cards,
    month: currentMonth,
    year: currentYear,
    paidIds,
    initialBalance: totalAccountsBalance,
  });

  const pendingSchedule = schedule
    .filter((item) => item.status !== "pago")
    .slice(0, 4);

  const overdueCount = schedule.filter(
    (item) => item.status === "atrasado",
  ).length;
  const todayCount = schedule.filter((item) => item.status === "hoje").length;

  return (
    <div className="h-screen px-6 py-4 flex justify-center">
      <div className="w-full max-w-6xl flex flex-col gap-4">
        {/* TOPO */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-sm text-gray-400 mt-1">
              Resumo de{" "}
              <span className="text-white font-semibold">
                {monthNames[dashboard.currentMonth]}
              </span>
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-400">Saldo do mês</p>
            <p className="text-3xl font-bold text-white">
              {formatCurrency(summary.saldo)}
            </p>
          </div>
        </div>

        {/* LINHA 1 */}
        {/* LINHA 1 */}
        <div className="grid grid-cols-3 gap-4">
          {/* CARTÃO PRINCIPAL */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col h-full">
            <p className="text-sm text-gray-400 mb-4">Cartão principal</p>

            {!featuredCard ? (
              <p className="text-gray-500 text-sm">Nenhum cartão usado.</p>
            ) : (
              (() => {
                const bank = getBank(featuredCard.banco);

                const total = transactions
                  .filter((t) => String(t.cartaoId) === String(featuredCard.id))
                  .reduce((acc, t) => acc + Number(t.valor || 0), 0);

                const limit =
                  featuredCard.tipo === "vale"
                    ? Number(
                        featuredCard.saldo || featuredCard.saldoInicial || 0,
                      )
                    : Number(featuredCard.limite || 0);

                const showProgress =
                  ["credito", "multiplo", "vale"].includes(featuredCard.tipo) &&
                  limit > 0;

                const percent = showProgress
                  ? Math.min((total / limit) * 100, 100)
                  : 0;

                return (
                  <div className="flex-1 flex items-center justify-center">
                    <Card3D
                      bank={bank}
                      featuredCard={featuredCard}
                      total={total}
                      limit={limit}
                      percent={percent}
                      showProgress={showProgress}
                      formatCurrency={formatCurrency}
                    />
                  </div>
                );
              })()
            )}
          </div>

          {/* RECEITAS + DESPESAS */}
          <div className="flex flex-col gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-lg flex-1">
              <p className="text-sm text-gray-400">Receitas</p>

              <p className="text-3xl font-bold text-white mt-5">
                {formatCurrency(summary.receitas)}
              </p>

              <p className="text-xs text-emerald-400 mt-3">Entradas do mês</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-lg flex-1">
              <p className="text-sm text-gray-400">Despesas</p>

              <p className="text-3xl font-bold text-white mt-5">
                {formatCurrency(summary.despesas)}
              </p>

              <p className="text-xs text-red-400 mt-3">Saídas do mês</p>
            </div>
          </div>

          {/* AGENDA */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-400">Agenda</p>
                <p className="text-xs text-gray-500 mt-1">
                  Próximos pagamentos
                </p>
              </div>

              {(overdueCount > 0 || todayCount > 0) && (
                <div className="text-right text-xs">
                  {overdueCount > 0 && (
                    <p className="text-red-400">{overdueCount} atrasado(s)</p>
                  )}
                  {todayCount > 0 && (
                    <p className="text-yellow-300">{todayCount} hoje</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {pendingSchedule.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  Nenhum pagamento pendente.
                </p>
              ) : (
                pendingSchedule.map((item) => (
                  <div
                    key={item.paymentId}
                    className="flex justify-between items-center border-b border-white/10 pb-3"
                  >
                    <div>
                      <p className="text-white text-sm font-medium">
                        {item.descricao}
                      </p>

                      <p className="text-xs text-gray-400">
                        {new Date(item.data).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                        })}
                        {" • "}
                        {item.status}
                      </p>
                    </div>

                    <p
                      className={`text-sm font-semibold ${
                        item.tipo === "receita"
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {item.tipo === "receita" ? "+" : "-"}{" "}
                      {formatCurrency(item.valor)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* LINHA 2 */}
        <div className="grid grid-cols-3 gap-4">
          {/* GRÁFICO */}
          <div className="col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
            <p className="text-sm text-gray-400 mb-4">Fluxo financeiro anual</p>

            <Chart
              type="bar"
              height={260}
              series={[
                {
                  name: "Receitas",
                  data: chartData.map((d) => d.receita),
                },
                {
                  name: " ",
                  data: chartData.map(() => 0),
                },
                {
                  name: "Despesas",
                  data: chartData.map((d) => d.despesa),
                },
              ]}
              options={{
                chart: {
                  type: "bar",
                  stacked: false,
                  toolbar: { show: false },
                  background: "transparent",
                },

                colors: ["#34D399", "transparent", "#F87171"],

                plotOptions: {
                  bar: {
                    horizontal: false,
                    columnWidth: "35%",
                    borderRadius: 2,
                    borderRadiusApplication: "end",
                  },
                },

                dataLabels: {
                  enabled: false,
                },

                stroke: {
                  show: false,
                },

                fill: {
                  opacity: 1,
                },

                grid: {
                  borderColor: "#1f2937",
                  strokeDashArray: 3,
                },

                legend: {
                  show: true,
                  position: "top",
                  horizontalAlign: "right",

                  customLegendItems: ["Receitas", "Despesas"],

                  labels: {
                    colors: "#9ca3af",
                  },

                  markers: {
                    shape: "circle",
                    radius: 6,
                    fillColors: ["#34D399", "#F87171"],
                  },
                },

                xaxis: {
                  categories: chartData.map(
                    (d) => d.mes.charAt(0).toUpperCase() + d.mes.slice(1),
                  ),
                  labels: {
                    style: { colors: "#9ca3af" },
                  },
                },

                yaxis: {
                  labels: {
                    style: { colors: "#9ca3af" },
                    formatter: (val) => formatCurrency(val),
                  },
                },

                tooltip: {
                  theme: "dark",
                },
              }}
            />
          </div>

          {/* TRANSAÇÕES RECENTES */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
            <p className="text-sm text-gray-400 mb-4">Transações recentes</p>

            <div className="flex flex-col gap-3 max-h-[260px] overflow-y-auto no-scrollbar">
              {lastTransactions.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  Nenhuma transação ainda.
                </p>
              ) : (
                lastTransactions.map((t) => (
                  <div
                    key={t.id}
                    className="flex justify-between items-center border-b border-white/10 pb-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={getPaymentVisual({ item: t, cards, accounts })}
                        className="w-8 h-8 object-contain"
                      />

                      <div>
                        <p className="text-white text-sm font-medium">
                          {t.descricao}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {t.categoriaNome}
                        </p>
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
                ))
              )}
            </div>
          </div>
        </div>

        {/* LINHA 3 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-lg pb-2">
          <p className="text-sm text-gray-400 mb-2">Top gastos</p>

          <div
            ref={scrollRef}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`flex gap-3 overflow-x-auto overflow-y-hidden pb-2 scroll-smooth no-scrollbar select-none ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            {topCategories.length === 0 ? (
              <p className="text-gray-500 text-sm">Sem dados ainda.</p>
            ) : (
              topCategories.map((cat) => (
                <div
                  key={cat.name}
                  className="min-w-[220px] flex-shrink-0  p-3"
                >
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>{cat.name}</span>
                    <span>{formatCurrency(cat.value)}</span>
                  </div>

                  <div className="w-full h-1.5 bg-white/10 rounded-full mt-2">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-red-400 to-red-600"
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
