import { useState } from "react";
import { useBudgetAnnual } from "../contexts/BudgetAnnualContext";
import { useTransactions } from "../contexts/TransactionContext";
import { useCards } from "../contexts/CardContext";
import { getPaymentSchedule } from "../core/selectors/paymentScheduleSelectors";
import { getScheduleSummary } from "../core/selectors/scheduleSummary";
import { createSchedulePaymentController } from "../core/transactions/schedulePayment";
import { useAccounts } from "../contexts/AccountContext";
import { mapAccountsWithBalance } from "../core/selectors/accountSelectors";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../theme/useTheme";
import SectionHeader from "../components/ui/SectionHeader";
import GlassTabs from "../components/ui/GlassTabs";
import Chart from "react-apexcharts";
import { getTransactionSaveError } from "../repositories/transactionUpdate.js";

export default function Schedule() {
  const { items = [] } = useBudgetAnnual();
  const { transactions = [], add, update, removePayment } = useTransactions();
  const { cards = [] } = useCards();
  const { accounts = [] } = useAccounts();
  const { theme, themeName } = useTheme();

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
  const [paymentController] = useState(createSchedulePaymentController);
  const [pendingIds, setPendingIds] = useState([]);
  const [paymentError, setPaymentError] = useState("");

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
    const isIncome = item.tipo === "receita";
    const isToday = item.status === "hoje";
    const isOverdue = item.status === "atrasado";

    const handleTogglePaid = async () => {
      if (paymentController.isPending(item.paymentId)) return;
      setPaymentError("");
      setPendingIds((prev) => [...prev, item.paymentId]);
      try {
        await paymentController.toggle({
          item,
          transactions,
          add,
          update,
          removePayment,
        });
      } catch (error) {
        setPaymentError(
          getTransactionSaveError(error, "Não foi possível alterar a realização. Tente novamente."),
        );
      } finally {
        setPendingIds((prev) => prev.filter((id) => id !== item.paymentId));
      }
    };

    return (
      <Motion.div
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
        relative overflow-hidden rounded-[24px] border p-4
        backdrop-blur-xl
        flex items-center justify-between gap-4
        ${
          isToday
            ? themeName === "light"
              ? "border-yellow-200 bg-yellow-50/70"
              : "border-yellow-400/20 bg-yellow-400/[0.07]"
            : isOverdue
              ? themeName === "light"
                ? "border-red-200 bg-red-50/70"
                : "border-red-400/20 bg-red-400/[0.07]"
              : themeName === "light"
                ? "border-slate-200/70 bg-white/70"
                : "border-white/[0.08] bg-white/[0.04]"
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
                isPaid ? `line-through ${theme.textMuted}` : theme.textPrimary
              }`}
            >
              {item.descricao}
            </p>
          </div>

          <p className={`text-xs ${theme.textSecondary} mt-1`}>
            <span className={isIncome ? theme.success : theme.danger}>
              {isIncome ? "Receita" : "Despesa"}
            </span>
            {" · "}
            {item.origem === "orcamento" ? "Orçamento" : "Fatura"}
          </p>

          <p
            className={`text-xs mt-2 ${
              item.saldoPrevisto < 0 ? theme.danger : theme.success
            }`}
          >
            Saldo acumulado: {formatCurrency(item.saldoPrevisto)}
          </p>
        </div>

        <div className="relative z-10 flex flex-col items-end gap-3 shrink-0">
          <p
            className={`font-semibold ${isIncome ? theme.success : theme.danger}`}
          >
            {isIncome ? "+" : "−"} {formatCurrency(item.valor)}
          </p>

          <button
            type="button"
            onClick={handleTogglePaid}
            role="switch"
            aria-checked={isPaid}
            aria-label={`${isIncome ? "Recebimento" : "Pagamento"} de ${item.descricao} realizado`}
            aria-busy={pendingIds.includes(item.paymentId)}
            disabled={pendingIds.includes(item.paymentId)}
            className={`
            relative
            w-12 h-7
            rounded-full
            border
            transition-all
            disabled:opacity-50 disabled:cursor-wait
            ${
              isPaid
                ? themeName === "light"
                  ? "bg-emerald-400 border-emerald-400"
                  : "bg-emerald-400 border-emerald-400"
                : themeName === "light"
                  ? "bg-slate-200 border-slate-300"
                  : "bg-white/10 border-white/15"
            }
          `}
          >
            <Motion.span
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
              ${
                isPaid
                  ? "bg-black text-emerald-300"
                  : themeName === "light"
                    ? "bg-white text-slate-500 shadow-sm"
                    : "bg-white/70 text-black"
              }
            `}
            >
              {isPaid ? "✓" : ""}
            </Motion.span>
          </button>
        </div>
      </Motion.div>
    );
  };

  const summary = getScheduleSummary(schedule);

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
      className={`
      h-full min-h-0 overflow-hidden
      px-3 pt-4 pb-0 lg:p-6
      flex justify-center no-scrollbar
      ${theme.textPrimary}
    `}
    >
      <div className="w-full max-w-4xl h-full min-h-0 flex flex-col gap-4 lg:gap-6 overflow-hidden">
        <div className="shrink-0 flex flex-col gap-4 lg:gap-6">
          <SectionHeader
            title="Agenda financeira"
            subtitle="Receitas, despesas e faturas do mês"
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

          {paymentError && (
            <p role="alert" className="text-sm text-red-500">
              {paymentError}
            </p>
          )}

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
            {[
              ["previsto", "Previsto"],
              ["realizado", "Realizado"],
              ["pendente", "Pendente"],
            ].map(([key, label]) => (
              <div
                key={key}
                className={`${theme.surface} border ${theme.border} rounded-2xl p-2.5 lg:p-3 backdrop-blur-xl min-w-0`}
              >
                <p className="text-xs font-semibold text-white text-center">
                  {label}
                </p>
                <div className="mt-4 grid grid-cols-2 text-xs text-center">
                  <div className="min-w-0 pr-2">
                    <p className={theme.textSecondary}>Receitas</p>
                    <p
                      className={`font-medium mt-0.5 break-words ${theme.success}`}
                    >
                      + {formatCurrency(summary[key].receita)}
                    </p>
                  </div>
                  <div className={`min-w-0 pl-2 border-l ${theme.border}`}>
                    <p className={theme.textSecondary}>Despesas</p>
                    <p
                      className={`font-medium mt-0.5 break-words ${theme.danger}`}
                    >
                      − {formatCurrency(summary[key].despesa)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div
              className={`
              ${theme.surface}
              border ${theme.border}
              rounded-2xl
              p-2.5 lg:p-3
              backdrop-blur-xl
            `}
            >
              <p className="text-xs font-semibold text-white text-center">
                Saldo acumulado
              </p>

              <p
                className={`font-medium mt-1 text-center ${
                  saldoProjetado < 0 ? theme.danger : theme.success
                }`}
              >
                {formatCurrency(saldoProjetado)}
              </p>
              <p
                className={`text-[11px] mt-2 text-center ${theme.textSecondary}`}
              >
                Saldo atual + receitas pendentes − despesas pendentes
              </p>
            </div>
          </div>

          <div
            className={`
            ${theme.surface}
            border ${theme.border}
            rounded-2xl
            px-3
            py-2.5
            backdrop-blur-xl
            overflow-visible
            shadow-lg
          `}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className={`text-xs ${theme.textMuted}`}>
                  Previsão do fim do mês
                </p>

                <p
                  className={`text-lg lg:text-2xl font-semibold mt-1 ${
                    saldoProjetado < 0 ? theme.danger : theme.success
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
                border
                ${
                  saldoProjetado < 0
                    ? themeName === "light"
                      ? "bg-red-50 border-red-100 text-red-500"
                      : "bg-red-400/10 border-red-400/10 text-red-300"
                    : themeName === "light"
                      ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                      : "bg-emerald-400/10 border-emerald-400/10 text-emerald-300"
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
          overflow-x-hidden
          no-scrollbar
          cursor-pointer
          pb-32 lg:pb-5
        "
        >
          {schedule.length === 0 ? (
            <p className="text-gray-400 text-sm">
              Nenhuma receita ou despesa prevista para este mês.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-6">
                {[
                  ["ATRASADO", groupedByStatus.atrasado, "text-red-400"],
                  ["HOJE", groupedByStatus.hoje, "text-yellow-300"],
                  ["PRÓXIMOS", groupedByStatus.pendente, "text-gray-400"],
                  ["REALIZADOS", groupedByStatus.pago, theme.success],
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
