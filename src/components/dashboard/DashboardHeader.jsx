import AnimatedCurrency from "../ui/AnimatedCurrency";

export default function DashboardHeader({ currentMonth, currentBalanceToday }) {
  return (
    <div className="flex items-start justify-between gap-4 shrink-0">
      <div className="min-w-0 flex items-center gap-3">
        <div className="md:hidden w-10 h-10 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
          <img
            src="/logo-ni-branca.svg"
            className="w-6 h-6 object-contain"
          />
        </div>

        <div className="min-w-0">
          <h1 className="text-2xl font-bold">Dashboard</h1>

          <p className="text-sm text-gray-400 mt-1">
            Resumo de{" "}
            <span className="text-white font-semibold">{currentMonth}</span>
          </p>
        </div>
      </div>

      <div className="text-right shrink-0 max-w-[150px] sm:max-w-none overflow-hidden">
        <p className="text-[11px] text-gray-400">Saldo atual</p>

        <p className="text-xl sm:text-3xl font-bold leading-tight whitespace-nowrap">
          <AnimatedCurrency value={currentBalanceToday} />
        </p>
      </div>
    </div>
  );
}