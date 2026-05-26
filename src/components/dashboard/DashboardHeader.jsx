import AnimatedCurrency from "../ui/AnimatedCurrency";
import { useTheme } from "../../theme/useTheme";

export default function DashboardHeader({ currentMonth, currentBalanceToday }) {
  const { theme, themeName } = useTheme();

  return (
    <div className="flex items-start justify-between gap-4 shrink-0">
      <div className="min-w-0 flex items-center gap-3">
        <div
          className={`
            md:hidden w-10 h-10 rounded-2xl
            ${theme.surface}
            border ${theme.border}
            flex items-center justify-center shrink-0
          `}
        >
          <img
            src={
              themeName === "light"
                ? "/logo-ni-preta.svg"
                : "/logo-ni-branca.svg"
            }
            className="w-6 h-6 object-contain"
          />
        </div>

        <div className="min-w-0">
          <h1 className={`text-2xl font-bold ${theme.textPrimary}`}>
            Dashboard
          </h1>

          <p className={`text-sm mt-1 ${theme.textSecondary}`}>
            Resumo de{" "}
            <span className={`${theme.textPrimary} font-semibold`}>
              {currentMonth}
            </span>
          </p>
        </div>
      </div>

      <div className="text-right shrink-0 max-w-[150px] sm:max-w-none overflow-hidden">
        <p className={`text-[11px] ${theme.textSecondary}`}>Saldo atual</p>

        <p className={`text-xl sm:text-3xl font-bold leading-tight whitespace-nowrap ${theme.textPrimary}`}>
          <AnimatedCurrency value={currentBalanceToday} />
        </p>
      </div>
    </div>
  );
}