import { useDashboardData } from "../features/dashboard/hooks/useDashboardData";
import { getInsights } from "../features/dashboard/utils/getInsights";
import { motion } from "framer-motion";
import { useTheme } from "../theme/useTheme";

import TopExpensesCard from "../components/dashboard/TopExpensesCard";
import RecentTransactionsCard from "../components/dashboard/RecentTransactionsCard";
import InsightsCard from "../components/dashboard/InsightsCard";
import FutureBalanceCard from "../components/dashboard/FutureBalanceCard";
import AnnualFlowChart from "../components/dashboard/AnnualFlowChart";
import HeroCardSection from "../components/dashboard/HeroCardSection";
import AgendaCard from "../components/dashboard/AgendaCard";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardSkeleton from "../components/dashboard/skeletons/DashboardSkeleton";

export default function Dashboard() {
  const { theme } = useTheme();

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

  const itemAnimation = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  };

  const loading = false;

  const smartInsights = getInsights({
    transactions,
    topCategories,
    summary,
    cards,
  });

  return (
    <div
      className={`
    h-full w-full max-w-full
    overflow-x-hidden overflow-y-auto
    xl:overflow-hidden
    px-4 md:px-6 py-4 pb-28 xl:pb-4
    no-scrollbar
    ${theme.textPrimary}
  `}
    >
      <div className="min-h-full xl:h-full w-full max-w-[1600px] mx-auto flex flex-col gap-4 overflow-x-hidden">
        <DashboardHeader
          currentMonth={monthNames[dashboard.currentMonth]}
          currentBalanceToday={currentBalanceToday}
        />

        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.06,
              },
            },
          }}
          className="
          grid
          grid-cols-1
          xl:grid-cols-12
          xl:grid-rows-[300px_minmax(0,340px)_170px]
          gap-4
          flex-1
          min-h-0
          min-w-0
          overflow-visible
          xl:overflow-hidden
        "
        >
          {loading ? (
            <DashboardSkeleton />
          ) : (
            <>
              <motion.div
                className="xl:col-span-6 min-w-0"
                variants={itemAnimation}
              >
                <HeroCardSection
                  featuredCard={featuredCard}
                  featuredCardStats={featuredCardStats}
                  transactions={transactions}
                  formatCurrency={formatCurrency}
                />
              </motion.div>

              <motion.div
                className="xl:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0"
                variants={itemAnimation}
              >
                <AgendaCard
                  pendingSchedule={pendingSchedule}
                  todayCount={todayCount}
                  overdueCount={overdueCount}
                  formatCurrency={formatCurrency}
                />

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
              </motion.div>

              <motion.div
                className="xl:col-span-8 min-w-0 h-full min-h-0"
                variants={itemAnimation}
              >
                <AnnualFlowChart
                  chartData={chartData}
                  currentMonthLabel={currentMonthLabel}
                  summary={summary}
                  formatCurrency={formatCurrency}
                />
              </motion.div>

              <motion.div
                className="xl:col-span-4 min-w-0"
                variants={itemAnimation}
              >
                <InsightsCard
                  futureStatus={futureStatus}
                  futureInsight={futureInsight}
                  topCategories={topCategories}
                  summary={summary}
                  lowestFutureBalance={lowestFutureBalance}
                  criticalDay={criticalDay}
                  trend={trend}
                  formatCurrency={formatCurrency}
                  smartInsights={smartInsights}
                />
              </motion.div>

              <motion.div
                className="xl:col-span-8 min-w-0 h-full min-h-0"
                variants={itemAnimation}
              >
                <RecentTransactionsCard
                  transactions={transactionsWithCategory}
                  cards={cards}
                  accounts={accounts}
                  formatCurrency={formatCurrency}
                />
              </motion.div>

              <motion.div
                className="xl:col-span-4 min-w-0"
                variants={itemAnimation}
              >
                <TopExpensesCard
                  topCategories={topCategories}
                  summary={summary}
                  formatCurrency={formatCurrency}
                />
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
