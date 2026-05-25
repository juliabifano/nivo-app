import { useState } from "react";
import { useBudgetAnnual } from "../contexts/BudgetAnnualContext";
import { useTransactions } from "../contexts/TransactionContext";
import { useCards } from "../contexts/CardContext";
import { getPaymentSchedule } from "../core/selectors/paymentScheduleSelectors";
import { usePaymentSchedule } from "../contexts/PaymentScheduleContext";
import { useAccounts } from "../contexts/AccountContext";
import { mapAccountsWithBalance } from "../core/selectors/accountSelectors";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "../components/ui/SectionHeader";
import GlassTabs from "../components/ui/GlassTabs";
import Chart from "react-apexcharts";

export default function Schedule() {
  const { items = [] } = useBudgetAnnual();
  const { transactions = [], add } = useTransactions();
  const { cards = [] } = useCards();
  const { paidIds, markAsPaid, unmarkAsPaid } = usePaymentSchedule();
  const { accounts = [] } = useAccounts();

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

  const currentMonth = months[new Date().getMonth()];
  const currentYear = new Date().getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const accountsWithBalance = mapAccountsWithBalance(accounts, transactions);

  const totalAccountsBalance = accountsWithBalance.reduce(
    (acc, a) => acc + Number(a.saldoAtual || 0),
    0,
  );

  const schedule = getPaymentSchedule({
    items,
    transactions,
    cards,
    month: selectedMonth,
    year: currentYear,
    paidIds,
    initialBalance: totalAccountsBalance,
  });

  const groupedByStatus = {
    atrasado: [],
    hoje: [],
    pendente: [],
    pago: [],
  };

  schedule.forEach((item) => {
    if (item.status === "pago") {
      groupedByStatus.pago.push(item);
    } else if (item.status === "atrasado") {
      groupedByStatus.atrasado.push(item);
    } else if (item.status === "hoje") {
      groupedByStatus.hoje.push(item);
    } else {
      groupedByStatus.pendente.push(item);
    }
  });

  const getLocalDateKey = (date) => {
    const d = new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${y}-${m}-${day}`;
  };

  const formatCurrency = (v) =>
    Number(v || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });

  const groupByDate = (list) => {
    return list.reduce((acc, item) => {
      const key = getLocalDateKey(item.data);

      if (!acc[key]) acc[key] = [];

      acc[key].push(item);
      return acc;
    }, {});
  };

  const renderItem = (item) => {
    const isPaid = item.status === "pago";
    const isToday = item.status === "hoje";
    const isOverdue = item.status === "atrasado";

    const handleTogglePaid = () => {
      if (!isPaid) {
        markAsPaid(item.paymentId);

        add({
          descricao: item.descricao,
          valor: item.valor,
          tipo: item.tipo,
          data: new Date(item.data).toISOString().split("T")[0],
          categoriaId: item.categoriaId || "",
          formaPagamento: item.formaPagamento || "pix",
          accountId: item.accountId || "",
          cartaoId: item.cartaoId || "",
          schedulePaymentId: item.paymentId,
        });
      } else {
        unmarkAsPaid(item.paymentId);
      }
    };

    return (
      <motion.div
        key={item.paymentId}
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{
          opacity: isPaid ? 0.58 : 1,
          y: 0,
          scale: 1,
        }}
        exit={{ opacity: 0, x: 40, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        className={`
        relative
        overflow-hidden
        rounded-[24px]
        border
        p-4
        bg-white/[0.04]
        backdrop-blur-xl
        flex items-center justify-between gap-4
        ${
          isToday
            ? "border-yellow-400/20 bg-yellow-400/[0.07]"
            : isOverdue
              ? "border-red-400/20 bg-red-400/[0.07]"
              : "border-white/[0.08]"
        }
      `}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />

        <div className="relative z-10 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`
              w-2 h-2 rounded-full shrink-0
              ${
                isPaid
                  ? "bg-emerald-400"
                  : isToday
                    ? "bg-yellow-300"
                    : isOverdue
                      ? "bg-red-400"
                      : "bg-white/30"
              }
            `}
            />

            <p
              className={`font-medium truncate ${
                isPaid ? "line-through text-gray-400" : "text-white"
              }`}
            >
              {item.descricao}
            </p>
          </div>

          <p className="text-xs text-gray-400 mt-1">
            {item.origem === "orcamento" ? "Orçamento" : "Fatura"}
          </p>

          <p
            className={`text-xs mt-2 ${
              item.saldoPrevisto < 0 ? "text-red-300" : "text-emerald-300"
            }`}
          >
            Saldo previsto: {formatCurrency(item.saldoPrevisto)}
          </p>
        </div>

        <div className="relative z-10 flex flex-col items-end gap-3 shrink-0">
          <p className="text-white font-semibold">
            {formatCurrency(item.valor)}
          </p>

          <button
            type="button"
            onClick={handleTogglePaid}
            className={`
            relative
            w-12 h-7
            rounded-full
            border
            transition-all
            ${
              isPaid
                ? "bg-emerald-400 border-emerald-400"
                : "bg-white/10 border-white/15"
            }
          `}
          >
            <motion.span
              animate={{
                x: isPaid ? 20 : 2,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 28,
              }}
              className={`
              absolute
              top-1
              left-1
              w-5 h-5
              rounded-full
              flex items-center justify-center
              text-[10px]
              font-bold
              ${isPaid ? "bg-black text-emerald-300" : "bg-white/70 text-black"}
            `}
            >
              {isPaid ? "✓" : ""}
            </motion.span>
          </button>
        </div>
      </motion.div>
    );
  };

  const totalPrevisto = schedule.reduce(
    (acc, item) => acc + Number(item.valor || 0),
    0,
  );

  const totalPago = schedule
    .filter((item) => item.status === "pago")
    .reduce((acc, item) => acc + Number(item.valor || 0), 0);

  const totalPendente = totalPrevisto - totalPago;

  const saldoProjetado =
    schedule.length > 0
      ? schedule[schedule.length - 1]?.saldoPrevisto
      : totalAccountsBalance;

  const saldoChart = {
    series: [
      {
        name: "Saldo",
        data: [
          totalAccountsBalance,
          ...schedule.map((item) => item.saldoPrevisto),
        ],
      },
    ],

    options: {
      chart: {
        type: "area",
        toolbar: {
          show: false,
        },

        sparkline: {
          enabled: true,
        },

        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 500,
        },
      },

      stroke: {
        curve: "smooth",
        width: 3,
      },

      fill: {
        type: "gradient",

        gradient: {
          shade: "dark",
          type: "vertical",
          opacityFrom: 0.35,
          opacityTo: 0.02,
          stops: [0, 100],
        },
      },

      grid: {
        show: false,
      },

      tooltip: {
        theme: "dark",

        y: {
          formatter: (value) => formatCurrency(value),
        },
      },

      xaxis: {
        categories: [
          "Hoje",
          ...schedule.map((item) => new Date(item.data).getDate()),
        ],

        labels: {
          show: false,
        },

        axisBorder: {
          show: false,
        },

        axisTicks: {
          show: false,
        },
      },

      yaxis: {
        show: false,
      },

      colors: [saldoProjetado < 0 ? "#FB7185" : "#34D399"],
    },
  };

  return (
    <div
      className="
    h-full
    overflow-hidden
    px-3
    pt-4
    pb-36
    lg:p-6
    flex
    justify-center
    text-white
    no-scrollbar
  "
    >
      <div className="w-full max-w-4xl h-full flex flex-col gap-4 lg:gap-6">
        <div className="shrink-0 flex flex-col gap-4 lg:gap-6">
          <SectionHeader
            title="Agenda de pagamentos"
            subtitle="Previsão de contas, faturas e pagamentos do mês"
            icon={
              <img
                src="/logo-ni-branca.svg"
                className="w-6 h-6 object-contain"
              />
            }
          />

          <GlassTabs
            className="w-full justify-between"
            value={selectedMonth}
            onChange={setSelectedMonth}
            tabs={months.map((m) => ({
              value: m,
              label: m.toUpperCase(),
            }))}
          />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-2.5 lg:p-3">
              <p className="text-xs text-gray-400">Previsto</p>
              <p className="text-white font-medium mt-1">
                {formatCurrency(totalPrevisto)}
              </p>
            </div>

            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-2.5 lg:p-3">
              <p className="text-xs text-gray-400">Pago</p>
              <p className="text-emerald-300 font-medium mt-1">
                {formatCurrency(totalPago)}
              </p>
            </div>

            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-2.5 lg:p-3">
              <p className="text-xs text-gray-400">Pendente</p>
              <p className="text-red-300 font-medium mt-1">
                {formatCurrency(totalPendente)}
              </p>
            </div>

            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-2.5 lg:p-3">
              <p className="text-xs text-gray-400">Saldo projetado</p>
              <p
                className={`font-medium mt-1 ${
                  saldoProjetado < 0 ? "text-red-300" : "text-emerald-300"
                }`}
              >
                {formatCurrency(saldoProjetado)}
              </p>
            </div>
          </div>

          <div
            className="
    bg-white/[0.04]
    border border-white/[0.08]
    rounded-2xl
    px-3
    py-2.5
    backdrop-blur-xl
    overflow-visible
  "
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-white/50">Previsão do fim do mês</p>

                <p
                  className={`text-lg lg:text-2xl font-semibold mt-1 ${
                    saldoProjetado < 0 ? "text-red-300" : "text-emerald-300"
                  }`}
                >
                  {formatCurrency(saldoProjetado)}
                </p>
              </div>

              <div
                className={`
        shrink-0
        px-3 py-1
        rounded-full
        text-[11px]
        ${
          saldoProjetado < 0
            ? "bg-red-400/10 text-red-300"
            : "bg-emerald-400/10 text-emerald-300"
        }
      `}
              >
                {saldoProjetado < 0 ? "Negativo" : "Saudável"}
              </div>
            </div>

            <div className="hidden lg:block h-[130px] -mx-2 mt-2">
              <Chart
                options={saldoChart.options}
                series={saldoChart.series}
                type="area"
                height="120"
              />
            </div>
          </div>
        </div>

        <div
  className="
    min-h-0
    flex-1
    overflow-y-auto
    no-scrollbar
    cursor-pointer
    pb-28 lg:pb-5
  "
>
          {schedule.length === 0 ? (
            <p className="text-gray-400 text-sm">
              Nenhum pagamento previsto para este mês.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-6">
                {[
                  ["ATRASADO", groupedByStatus.atrasado, "text-red-400"],
                  ["HOJE", groupedByStatus.hoje, "text-yellow-300"],
                  ["PRÓXIMOS", groupedByStatus.pendente, "text-gray-400"],
                  ["PAGOS", groupedByStatus.pago, "text-emerald-300"],
                ].map(([title, list, color]) => {
                  if (list.length === 0) return null;

                  return (
                    <div key={title} className="flex flex-col gap-3">
                      <p className={`text-xs font-semibold ${color}`}>
                        {title}
                      </p>

                      {Object.entries(groupByDate(list)).map(
                        ([date, items]) => {
                          const [y, m, d] = date.split("-");
                          const localDate = new Date(
                            Number(y),
                            Number(m) - 1,
                            Number(d),
                          );

                          return (
                            <div key={date} className="flex flex-col gap-2">
                              <p className="text-xs text-gray-500 font-semibold">
                                {localDate
                                  .toLocaleDateString("pt-BR", {
                                    day: "2-digit",
                                    month: "short",
                                  })
                                  .toUpperCase()}
                              </p>
                              <AnimatePresence mode="popLayout">
                                {items.map((item) => renderItem(item))}
                              </AnimatePresence>
                            </div>
                          );
                        },
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
