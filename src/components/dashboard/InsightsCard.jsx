export default function InsightsCard({
  futureStatus,
  futureInsight,
  topCategories,
  summary,
  lowestFutureBalance,
  criticalDay,
  trend,
  formatCurrency,
}) {
  return (
    <div className="col-span-4 bg-white/5 border border-white/10 rounded-[28px] p-4 shadow-lg overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-400">Insights</p>

          <p className="text-xs text-gray-500 mt-1">
            Análises automáticas do mês
          </p>
        </div>

        <span
          className={`text-[10px] px-2 py-1 rounded-full border ${futureStatus.text} ${futureStatus.bg} ${futureStatus.border}`}
        >
          {futureStatus.label}
        </span>
      </div>

      <div className="space-y-3 h-[calc(100%-52px)] overflow-y-auto pr-1 no-scrollbar">
        <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-3">
          <p className="text-xs text-gray-500">
            Previsão financeira
          </p>

          <p className="text-sm text-white mt-2 leading-relaxed">
            {futureInsight}
          </p>
        </div>

        {topCategories.length > 0 && (
          <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-3">
            <p className="text-xs text-gray-500">
              Categoria mais impactante
            </p>

            <p className="text-sm text-white mt-2">
              Seu maior gasto foi{" "}
              <span className="text-red-400 font-semibold">
                {topCategories[0].name || "Sem nome"}
              </span>
            </p>

            <p className="text-xs text-gray-400 mt-2">
              Representa{" "}
              {summary.despesas
                ? Math.round(
                    (topCategories[0].value / summary.despesas) * 100,
                  )
                : 0}
              % das despesas do mês.
            </p>
          </div>
        )}

        <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-3">
          <p className="text-xs text-gray-500">
            Menor saldo previsto
          </p>

          <div className="flex items-end justify-between mt-2">
            <div>
              <p className="text-lg font-semibold text-white">
                {formatCurrency(lowestFutureBalance)}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                previsto para o dia {criticalDay}
              </p>
            </div>

            <span
              className={`text-xs ${
                trend === "up"
                  ? "text-emerald-400"
                  : trend === "down"
                    ? "text-red-400"
                    : "text-gray-400"
              }`}
            >
              {trend === "up"
                ? "↗"
                : trend === "down"
                  ? "↘"
                  : "→"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}