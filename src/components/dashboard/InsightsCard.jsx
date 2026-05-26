import Card from "../ui/Card";
import { useTheme } from "../../theme/useTheme";

export default function InsightsCard({
  futureStatus,
  futureInsight,
  topCategories,
  summary,
  lowestFutureBalance,
  criticalDay,
  trend,
  formatCurrency,
  smartInsights = [],
}) {
  const { theme, themeName } = useTheme();

  const statusTone =
    futureStatus.label === "Risco"
      ? "danger"
      : futureStatus.label === "Atenção"
        ? "warning"
        : "safe";

  const statusConfig = {
    safe: {
      title: "Previsão saudável",
      icon: "✓",
      card: `${theme.successSoft} border-emerald-400/20`,
      iconStyle: `${theme.successSoft} ${theme.success} border-emerald-400/20`,
      text: theme.success,
    },
    warning: {
      title: "Acompanhe de perto",
      icon: "!",
      card: `${theme.warningSoft} border-yellow-400/20`,
      iconStyle: `${theme.warningSoft} ${theme.warning} border-yellow-400/20`,
      text: theme.warning,
    },
    danger: {
      title: "Risco no mês",
      icon: "!",
      card: `${theme.dangerSoft} border-red-400/20`,
      iconStyle: `${theme.dangerSoft} ${theme.danger} border-red-400/20`,
      text: theme.danger,
    },
  }[statusTone];

  const topCategoryPercent = summary.despesas
    ? Math.round((topCategories[0]?.value / summary.despesas) * 100)
    : 0;

  return (
    <Card hover="subtle" className="p-4 h-full min-h-0">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className={`text-[15px] font-medium ${theme.textSecondary}`}>
            Insights
          </p>

          <p className={`text-[11px] ${theme.textMuted} mt-1`}>
            Análises automáticas do mês
          </p>
        </div>

        <span
          className={`text-[10px] px-2 py-1 rounded-full border ${futureStatus.text} ${futureStatus.bg} ${futureStatus.border}`}
        >
          {futureStatus.label}
        </span>
      </div>

      <div className="space-y-3 xl:h-[calc(100%-52px)] overflow-y-auto pr-1 no-scrollbar">
        <div className={`border rounded-2xl p-3 ${statusConfig.card}`}>
          <div className="flex items-start gap-3">
            <span
              className={`w-7 h-7 rounded-xl border flex items-center justify-center text-xs font-bold shrink-0 ${statusConfig.iconStyle}`}
            >
              {statusConfig.icon}
            </span>

            <div className="min-w-0">
              <p className={`text-sm font-semibold ${statusConfig.text}`}>
                {statusConfig.title}
              </p>

              <p
                className={`text-sm ${theme.textPrimary} mt-1 leading-relaxed`}
              >
                {futureInsight}
              </p>
            </div>
          </div>
        </div>

        {topCategories.length > 0 && (
          <div
            className={`${theme.surface} border ${theme.border} rounded-2xl p-3`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className={`text-xs ${theme.textMuted}`}>
                  Categoria mais impactante
                </p>

                <p className={`text-sm ${theme.textPrimary} mt-2`}>
                  Seu maior gasto foi{" "}
                  <span className={`${theme.danger} font-semibold`}>
                    {topCategories[0].name || "Sem nome"}
                  </span>
                </p>
              </div>

              <span
                className={`text-[10px] px-2 py-1 rounded-full ${theme.dangerSoft} ${theme.danger} border border-red-400/20 shrink-0`}
              >
                {topCategoryPercent}%
              </span>
            </div>

            <div
              className={`w-full h-1 rounded-full mt-3 overflow-hidden ${
                themeName === "light" ? "bg-slate-200/70" : "bg-white/[0.06]"
              }`}
            >
              <div
                className="h-1 rounded-full bg-gradient-to-r from-red-400 to-rose-500"
                style={{ width: `${topCategoryPercent}%` }}
              />
            </div>
          </div>
        )}

        {smartInsights.length > 0 &&
          smartInsights.map((insight) => {
            const tone = {
              success: `${theme.success} ${theme.successSoft} border-emerald-400/20`,
              warning: `${theme.warning} ${theme.warningSoft} border-yellow-400/20`,
              danger: `${theme.danger} ${theme.dangerSoft} border-red-400/20`,
              info:
                themeName === "light"
                  ? "text-sky-600 bg-sky-500/10 border-sky-400/20"
                  : "text-sky-300 bg-sky-400/10 border-sky-400/20",
            }[insight.type || "info"];

            return (
              <div
                key={insight.title}
                className={`${theme.surface} border ${theme.border} rounded-2xl p-3`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`w-7 h-7 rounded-xl border flex items-center justify-center text-xs font-bold shrink-0 ${tone}`}
                  >
                    ✦
                  </span>

                  <div>
                    <p className={`text-sm font-semibold ${theme.textPrimary}`}>
                      {insight.title}
                    </p>

                    <p
                      className={`text-xs ${theme.textSecondary} mt-1 leading-relaxed`}
                    >
                      {insight.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

        <div
          className={`${theme.surface} border ${theme.border} rounded-2xl p-3`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className={`text-xs ${theme.textMuted}`}>
                Menor saldo previsto
              </p>

              <p className={`text-lg font-semibold ${theme.textPrimary} mt-2`}>
                {formatCurrency(lowestFutureBalance)}
              </p>

              <p className={`text-xs ${theme.textMuted} mt-1`}>
                previsto para o dia {criticalDay || "--"}
              </p>
            </div>

            <span
              className={`w-7 h-7 rounded-xl flex items-center justify-center border ${
                trend === "up"
                  ? `${theme.success} ${theme.successSoft} border-emerald-400/20`
                  : trend === "down"
                    ? `${theme.danger} ${theme.dangerSoft} border-red-400/20`
                    : `${theme.textMuted} ${
                        themeName === "light"
                          ? "bg-slate-200/70 border-slate-200"
                          : "bg-white/10 border-white/10"
                      }`
              }`}
            >
              {trend === "up" ? "↗" : trend === "down" ? "↘" : "→"}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
