import Card from "../ui/Card";
import { useTheme } from "../../theme/useTheme";

export default function TopExpensesCard({
  topCategories,
  summary,
  formatCurrency,
}) {
  const { theme, themeName } = useTheme();

  return (
    <Card hover="subtle" className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className={`text-[15px] font-medium ${theme.textSecondary}`}>
            Top gastos
          </p>

          <p className={`text-[11px] ${theme.textMuted} mt-1`}>
            Categorias do mês
          </p>
        </div>

        <span
          className={`
            text-[10px] px-2 py-1 rounded-full border
            ${theme.dangerSoft}
            ${theme.danger}
            border-red-400/20
          `}
        >
          Top 3
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {topCategories.length === 0 ? (
          <p className={`text-sm col-span-3 ${theme.textMuted}`}>
            Sem dados ainda.
          </p>
        ) : (
          topCategories.slice(0, 3).map((cat, index) => {
            const percent = summary.despesas
              ? Math.min((cat.value / summary.despesas) * 100, 100)
              : 0;

            return (
              <div
                key={cat.name}
                className={`
                  rounded-2xl px-3 py-3 sm:py-2 min-w-0 transition border
                  ${
                    themeName === "light"
                      ? "bg-white/35 border-slate-200/60 hover:bg-white/55 hover:border-slate-300/70"
                      : "bg-white/[0.045] border-white/[0.08] hover:bg-white/[0.06]"
                  }
                `}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 min-w-0">
                    <span
                      className={`
                        mt-0.5 w-5 h-5 rounded-md text-[10px]
                        flex items-center justify-center shrink-0 border
                        ${theme.dangerSoft}
                        ${theme.danger}
                        border-red-400/20
                      `}
                    >
                      {index + 1}
                    </span>

                    <div className="min-w-0">
                      <p
                        className={`text-sm font-medium truncate leading-tight ${theme.textPrimary}`}
                      >
                        {cat.name || "Sem nome"}
                      </p>

                      <p
                        className={`text-[11px] mt-0.5 ${theme.textSecondary}`}
                      >
                        {formatCurrency(cat.value)}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`
                      text-[10px] px-1.5 py-0.5 rounded-full shrink-0 border
                      ${theme.dangerSoft}
                      ${theme.danger}
                      border-red-400/15
                    `}
                  >
                    {Math.round(percent)}%
                  </span>
                </div>

                <div
                  className={`
                    w-full h-1 rounded-full mt-2 overflow-hidden
                    ${
                      themeName === "light"
                        ? "bg-slate-200/70"
                        : "bg-white/[0.05]"
                    }
                  `}
                >
                  <div
                    className="h-1 rounded-full"
                    style={{
                      width: `${percent}%`,
                      background: `linear-gradient(to right, ${theme.chartExpense}, #fb7185)`,
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
