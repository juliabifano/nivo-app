import Chart from "react-apexcharts";

export default function FutureBalanceCard({
  futureGlow,
  setFutureGlow,
  futureBalance,
  futureBalanceEndMonth,
  futureStatus,
  futureChart,
  formatCurrency,
  lowestFutureBalance,
  criticalDay,
  trend,
  balanceDifference,
  trendLabel,
}) {
  return (
    <div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();

        setFutureGlow({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }}
      className="
        relative
        bg-white/5
        border
        border-white/10
        rounded-[28px]
        p-5
        shadow-lg
        overflow-hidden
        group
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-emerald-400/20
        hover:shadow-[0_20px_60px_rgba(16,185,129,0.12)]
      "
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${futureGlow.x}% ${futureGlow.y}%, rgba(62, 242, 194, 0.06), transparent 42%)`,
        }}
      />

      <div className="absolute -top-20 -right-20 w-44 h-44 bg-emerald-400/10 rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-gray-400">
              Saldo Futuro
            </p>

            {futureBalance.length > 0 ? (
              <>
                <p
                  className={`text-3xl font-bold mt-2 ${
                    futureBalanceEndMonth >= 0
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {formatCurrency(futureBalanceEndMonth)}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  previsão até o fim do mês
                </p>
              </>
            ) : (
              <p className="text-gray-500 text-sm mt-4">
                Sem dados futuros
              </p>
            )}
          </div>

          {futureBalance.length > 0 && (
            <span
              className={`text-[11px] px-3 py-1 rounded-full border ${futureStatus.text} ${futureStatus.bg} ${futureStatus.border}`}
            >
              {futureStatus.label}
            </span>
          )}
        </div>

        {futureBalance.length > 0 && (
          <div className="mt-1">
            <Chart
              options={futureChart.options}
              series={futureChart.series}
              type="area"
              height={180}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-3">
            <p className="text-[10px] text-gray-500">
              Menor saldo
            </p>

            <p className="text-sm font-semibold text-white mt-1">
              {formatCurrency(lowestFutureBalance)}
            </p>

            <p className="text-[10px] text-gray-500 mt-1">
              dia {criticalDay || "--"}
            </p>
          </div>

          <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-3">
            <p className="text-[10px] text-gray-500">
              Tendência
            </p>

            <p
              className={`text-sm font-semibold mt-1 ${
                trend === "up"
                  ? "text-emerald-400"
                  : trend === "down"
                    ? "text-red-400"
                    : "text-gray-300"
              }`}
            >
              {trend === "up"
                ? "↗"
                : trend === "down"
                  ? "↘"
                  : "→"}{" "}
              {formatCurrency(Math.abs(balanceDifference))}
            </p>

            <p className="text-[10px] text-gray-500 mt-1">
              {trendLabel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}