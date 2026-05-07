import { useDashboardData } from "../features/dashboard/hooks/useDashboardData";

import TopExpensesCard from "../components/dashboard/TopExpensesCard";
import RecentTransactionsCard from "../components/dashboard/RecentTransactionsCard";
import InsightsCard from "../components/dashboard/InsightsCard";
import FutureBalanceCard from "../components/dashboard/FutureBalanceCard";
import AnnualFlowChart from "../components/dashboard/AnnualFlowChart";
import HeroCardSection from "../components/dashboard/HeroCardSection";
import AgendaCard from "../components/dashboard/AgendaCard";

export default function Dashboard() {
  const {
    dashboard,
    chartData,
    topCategories,
    summary,
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
  } = useDashboardData();

   return (
    <div className="h-screen overflow-hidden px-6 py-4 text-white">
      <div className="h-full w-full max-w-[1600px] mx-auto flex flex-col gap-4">
        {/* TOPO */}
        <div className="flex items-end justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-gray-400 mt-1">
              Resumo de{" "}
              <span className="text-white font-semibold">
                {monthNames[dashboard.currentMonth]}
              </span>
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-400">Saldo atual</p>
            <p className="text-3xl font-bold">
              {formatCurrency(currentBalanceToday)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 grid-rows-[300px_340px_170px] gap-4 flex-1 min-h-0">
          {/* LINHA 1 - CARTÃO HERO */}
          <HeroCardSection
            featuredCard={featuredCard}
            featuredCardStats={featuredCardStats}
            transactions={transactions}
            formatCurrency={formatCurrency}
          />

          {/* LINHA 1 - AGENDA + SALDO FUTURO */}
          <div className="col-span-6 grid grid-cols-2 gap-4">
            {/* AGENDA */}
            <AgendaCard
              pendingSchedule={pendingSchedule}
              todayCount={todayCount}
              overdueCount={overdueCount}
              formatCurrency={formatCurrency}
            />

            {/* SALDO FUTURO */}
            <FutureBalanceCard
              futureGlow={futureGlow}
              setFutureGlow={setFutureGlow}
              futureBalance={futureBalance}
              futureBalanceEndMonth={futureBalanceEndMonth}
              futureStatus={futureStatus}
              futureChart={futureChart}
              formatCurrency={formatCurrency}
              lowestFutureBalance={lowestFutureBalance}
              criticalDay={criticalDay}
              trend={trend}
              balanceDifference={balanceDifference}
              trendLabel={trendLabel}
            />
          </div>

          {/* LINHA 2 - GRÁFICO + RESUMO */}
          <AnnualFlowChart
            chartData={chartData}
            currentMonthLabel={currentMonthLabel}
            summary={summary}
            formatCurrency={formatCurrency}
          />

          {/* LINHA 2 - INSIGHTS */}
          <InsightsCard
            futureStatus={futureStatus}
            futureInsight={futureInsight}
            topCategories={topCategories}
            summary={summary}
            lowestFutureBalance={lowestFutureBalance}
            criticalDay={criticalDay}
            trend={trend}
            formatCurrency={formatCurrency}
          />

          {/* LINHA 3 - TRANSAÇÕES RECENTES */}
          <RecentTransactionsCard
            transactions={transactionsWithCategory}
            cards={cards}
            accounts={accounts}
            formatCurrency={formatCurrency}
          />

          {/* LINHA 3 - TOP GASTOS */}
          <TopExpensesCard
            topCategories={topCategories}
            summary={summary}
            formatCurrency={formatCurrency}
          />
        </div>
      </div>
    </div>
  );
}
