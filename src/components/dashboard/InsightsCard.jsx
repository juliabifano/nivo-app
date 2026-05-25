import Card from "../ui/Card";

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
      card: "bg-emerald-400/[0.055] border-emerald-400/[0.12]",
      iconStyle: "bg-emerald-400/15 text-emerald-300 border-emerald-400/20",
      text: "text-emerald-300",
    },
    warning: {
      title: "Acompanhe de perto",
      icon: "!",
      card: "bg-yellow-400/[0.055] border-yellow-400/[0.12]",
      iconStyle: "bg-yellow-400/15 text-yellow-300 border-yellow-400/20",
      text: "text-yellow-300",
    },
    danger: {
      title: "Risco no mês",
      icon: "!",
      card: "bg-red-400/[0.055] border-red-400/[0.12]",
      iconStyle: "bg-red-400/15 text-red-300 border-red-400/20",
      text: "text-red-300",
    },
  }[statusTone];

  const topCategoryPercent = summary.despesas
    ? Math.round((topCategories[0]?.value / summary.despesas) * 100)
    : 0;

  return (
    <Card hover="subtle" className="p-4 h-full min-h-0">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[15px] font-medium text-gray-300">Insights</p>
          <p className="text-[11px] text-gray-500/80 mt-1">
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

              <p className="text-sm text-white mt-1 leading-relaxed">
                {futureInsight}
              </p>
            </div>
          </div>
        </div>

        {topCategories.length > 0 && (
          <div className="bg-white/[0.04] border border-white/[0.04] rounded-2xl p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-gray-500">
                  Categoria mais impactante
                </p>

                <p className="text-sm text-white mt-2">
                  Seu maior gasto foi{" "}
                  <span className="text-red-400 font-semibold">
                    {topCategories[0].name || "Sem nome"}
                  </span>
                </p>
              </div>

              <span className="text-[10px] px-2 py-1 rounded-full bg-red-400/10 text-red-300 border border-red-400/20 shrink-0">
                {topCategoryPercent}%
              </span>
            </div>

            <div className="w-full h-1 bg-white/[0.06] rounded-full mt-3 overflow-hidden">
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
              success:
                "text-emerald-300 bg-emerald-400/10 border-emerald-400/20",
              warning: "text-yellow-300 bg-yellow-400/10 border-yellow-400/20",
              danger: "text-red-300 bg-red-400/10 border-red-400/20",
              info: "text-sky-300 bg-sky-400/10 border-sky-400/20",
            }[insight.type || "info"];

            return (
              <div
                key={insight.title}
                className="bg-white/[0.04] border border-white/[0.04] rounded-2xl p-3"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`w-7 h-7 rounded-xl border flex items-center justify-center text-xs font-bold shrink-0 ${tone}`}
                  >
                    ✦
                  </span>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      {insight.title}
                    </p>

                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      {insight.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

        <div className="bg-white/[0.04] border border-white/[0.04] rounded-2xl p-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500">Menor saldo previsto</p>

              <p className="text-lg font-semibold text-white mt-2">
                {formatCurrency(lowestFutureBalance)}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                previsto para o dia {criticalDay || "--"}
              </p>
            </div>

            <span
              className={`w-7 h-7 rounded-xl flex items-center justify-center border ${
                trend === "up"
                  ? "text-emerald-300 bg-emerald-400/10 border-emerald-400/20"
                  : trend === "down"
                    ? "text-red-300 bg-red-400/10 border-red-400/20"
                    : "text-gray-300 bg-white/10 border-white/10"
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
