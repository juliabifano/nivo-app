import { useState } from "react";

import { useTransactions } from "../../../contexts/TransactionContext";
import { useCards } from "../../../contexts/CardContext";
import { useAccounts } from "../../../contexts/AccountContext";
import { useBudgetAnnual } from "../../../contexts/BudgetAnnualContext";
import { useCategories } from "../../../contexts/CategoryContext";
import { usePaymentSchedule } from "../../../contexts/PaymentScheduleContext";

import { getDashboardSnapshot } from "../../../core/selectors/dashboardSelectors";
import { getPaymentSchedule } from "../../../core/selectors/paymentScheduleSelectors";
import { mapAccountsWithBalance } from "../../../core/selectors/accountSelectors";
import { mapTransactionsWithCategory } from "../../../core/selectors/categorySelectors";

import { getFutureBalance } from "../../../utils/getFutureBalance";

export function useDashboardData() {
  const { transactions = [] } = useTransactions();
  const { cards = [] } = useCards();
  const { accounts = [] } = useAccounts();
  const { items: budgetItems = [] } = useBudgetAnnual();
  const { categories = [] } = useCategories();
  const { paidIds = [] } = usePaymentSchedule();

  const [futureGlow, setFutureGlow] = useState({
    x: 50,
    y: 50,
  });

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

  const pendingSchedule = schedule.filter((item) => item.status !== "pago");

  const overdueCount = schedule.filter(
    (item) => item.status === "atrasado",
  ).length;

  const todayCount = schedule.filter((item) => item.status === "hoje").length;

  const today = new Date();

  const currentBalanceToday = schedule
    .filter((item) => new Date(item.data) <= today)
    .reduce((acc, item) => {
      return item.tipo === "receita"
        ? acc + Number(item.valor || 0)
        : acc - Number(item.valor || 0);
    }, totalAccountsBalance);

  const futureBalance = getFutureBalance({
    transactions,
    budgetItems,
    initialBalance: totalAccountsBalance,
  });

  const futureBalanceEndMonth =
    futureBalance[futureBalance.length - 1]?.saldo || 0;

  const lowestFuturePoint = futureBalance.reduce((lowest, item) => {
    if (!lowest) return item;

    return item.saldo < lowest.saldo ? item : lowest;
  }, null);

  const lowestFutureBalance = lowestFuturePoint?.saldo || 0;

  const criticalDay = lowestFuturePoint?.dia || null;

  const balanceDifference = futureBalanceEndMonth - currentBalanceToday;

  const trend =
    balanceDifference > 0 ? "up" : balanceDifference < 0 ? "down" : "stable";

  const riskLevel =
    lowestFutureBalance < 0
      ? "risk"
      : lowestFutureBalance < currentBalanceToday * 0.25
        ? "attention"
        : "safe";

  const futureStatus = {
    safe: {
      label: "Positivo",
      color: "#00E6A8",
      text: "text-emerald-300",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/20",
    },

    attention: {
      label: "Atenção",
      color: "#FBBF24",
      text: "text-yellow-300",
      bg: "bg-yellow-400/10",
      border: "border-yellow-400/20",
    },

    risk: {
      label: "Risco",
      color: "#FB7185",
      text: "text-red-300",
      bg: "bg-red-400/10",
      border: "border-red-400/20",
    },
  }[riskLevel];

  const trendLabel =
    trend === "up"
      ? "saldo deve subir"
      : trend === "down"
        ? "saldo deve cair"
        : "saldo estável";

  const futureInsight =
    riskLevel === "risk"
      ? `Atenção: seu saldo pode ficar negativo no dia ${criticalDay}.`
      : riskLevel === "attention"
        ? `Seu menor saldo previsto será no dia ${criticalDay}. Vale acompanhar.`
        : trend === "down"
          ? "Seu saldo deve cair até o fim do mês, mas continua positivo."
          : "Sua previsão para o fim do mês está saudável.";

  const todayDay = new Date().getDate();

  const lastDayOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0,
  ).getDate();

  const futureChart = {
    series: [
      {
        name: "Saldo previsto",

        data: futureBalance.map((i) => ({
          x: Number(i.dia),
          y: Number(i.saldo.toFixed(2)),
        })),
      },
    ],

    options: {
      chart: {
        type: "area",
        height: 160,
        toolbar: { show: false },
        zoom: { enabled: false },
        background: "transparent",

        dropShadow: {
          enabled: true,
          top: 0,
          left: 0,
          blur: 8,
          color: futureStatus.color,
          opacity: 0.2,
        },
      },

      annotations: {
        xaxis: [
          {
            x: todayDay,
            borderColor: "rgba(255,255,255,0.25)",
            strokeDashArray: 5,
          },
        ],
      },

      colors: [futureStatus.color],

      dataLabels: {
        enabled: false,
      },

      stroke: {
        curve: "smooth",
        width: 3,
        lineCap: "round",
      },

      fill: {
        type: "gradient",

        gradient: {
          opacityFrom: 0.28,
          opacityTo: 0,
          stops: [0, 90, 100],
        },
      },

      grid: {
        show: true,
        borderColor: "rgba(255,255,255,0.03)",

        padding: {
          left: 0,
          right: 0,
          top: 10,
          bottom: 0,
        },
      },

      xaxis: {
        type: "numeric",
        min: 1,
        max: lastDayOfMonth,

        labels: {
          show: false,
        },

        axisBorder: {
          show: false,
        },

        axisTicks: {
          show: false,
        },

        tooltip: {
          enabled: false,
        },
      },

      yaxis: {
        labels: {
          show: false,
        },
      },

      tooltip: {
        shared: false,
        intersect: false,

        custom: ({ series, dataPointIndex }) => {
          const item = futureBalance[dataPointIndex];

          return `
      <div class="nivo-tooltip">
        <div class="nivo-tooltip-title">
          ${Number(item?.dia) === todayDay ? "Hoje" : `Dia ${item?.dia}`}
        </div>

        <div class="nivo-tooltip-row">
          <span class="nivo-tooltip-dot receita"></span>
          <span class="nivo-tooltip-label">
            Saldo previsto
          </span>

          <strong>
            ${formatCurrency(series[0][dataPointIndex])}
          </strong>
        </div>
      </div>
    `;
        },
      },

      legend: {
        show: false,
      },
    },
  };

  const featuredCardStats = featuredCard
    ? (() => {
        const transactionsCard = transactions.filter(
          (t) => String(t.cartaoId) === String(featuredCard.id),
        );

        const total = transactionsCard.reduce(
          (acc, t) => acc + Number(t.valor || 0),
          0,
        );

        const limit =
          featuredCard.tipo === "vale"
            ? Number(featuredCard.saldo || featuredCard.saldoInicial || 0)
            : Number(featuredCard.limite || 0);

        const available = limit - total;

        const lastUse = transactionsCard.sort(
          (a, b) =>
            new Date(b.createdAt || b.data) - new Date(a.createdAt || a.data),
        )[0];

        return {
          total,
          limit,
          available,
          lastUse,
        };
      })()
    : null;

  const transactionsWithCategory = mapTransactionsWithCategory(
    transactions,
    categories,
  );

  const currentMonthLabel =
    currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);

  return {
    dashboard,
    summary,
    chartData,
    lastTransactions,
    topCategories,

    cards,
    accounts,
    transactions,

    futureGlow,
    setFutureGlow,

    futureBalance,
    futureBalanceEndMonth,
    futureStatus,
    futureChart,

    lowestFutureBalance,
    criticalDay,

    trend,
    balanceDifference,
    trendLabel,

    futureInsight,

    featuredCard,
    featuredCardStats,

    pendingSchedule,
    todayCount,
    overdueCount,

    currentBalanceToday,
    currentMonthLabel,

    transactionsWithCategory,

    formatCurrency,
    monthNames,
  };
}
