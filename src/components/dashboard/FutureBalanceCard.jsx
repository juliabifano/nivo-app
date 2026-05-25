import Chart from "react-apexcharts";
import Card from "../ui/Card";
import AnimatedCurrency from "../ui/AnimatedCurrency";

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
    <Card
      interactive
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();

        setFutureGlow({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }}
      hover="premium"
      className="relative p-4 sm:p-5 group h-full overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${futureGlow.x}% ${futureGlow.y}%, rgba(62, 242, 194, 0.06), transparent 42%)`,
        }}
      />

      <div className="absolute -top-20 -right-20 w-44 h-44 bg-emerald-400/10 rounded-full blur-3xl" />

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[15px] font-medium text-gray-300">
              Saldo Futuro
            </p>

            {futureBalance.length > 0 ? (
              <>
                <p
                  className={`text-[25px] sm:text-[28px] font-bold mt-1 ${
                    futureBalanceEndMonth >= 0
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  <AnimatedCurrency value={futureBalanceEndMonth} />
                </p>

                <p className="text-[11px] text-gray-400 mt-0.5">
                  previsão até o fim do mês
                </p>
              </>
            ) : (
              <p className="text-gray-500 text-sm mt-4">Sem dados futuros</p>
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
          <div className="-mt-3 -mb-3">
            <Chart
              options={futureChart.options}
              series={futureChart.series}
              type="area"
              height={window.innerWidth < 640 ? 150 : 115}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 mt-auto">
          <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-2">
            <p className="text-[10px] text-gray-500">Menor saldo</p>

            <p className="text-[13px] font-semibold text-white mt-1">
              {formatCurrency(lowestFutureBalance)}
            </p>

            <p className="text-[10px] text-gray-500 mt-1">
              dia {criticalDay || "--"}
            </p>
          </div>

          <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-2">
            <p className="text-[10px] text-gray-500">Tendência</p>

            <p
              className={`text-sm font-semibold mt-1 ${
                trend === "up"
                  ? "text-emerald-400"
                  : trend === "down"
                    ? "text-red-400"
                    : "text-gray-300"
              }`}
            >
              <span
                className={
                  trend === "up"
                    ? "text-emerald-400"
                    : trend === "down"
                      ? "text-red-400"
                      : "text-gray-400"
                }
              >
               {trend === "up" ? "▲" : trend === "down" ? "▼" : "•"}
              </span>{" "}
              {formatCurrency(Math.abs(balanceDifference))}
            </p>

            <p className="text-[10px] text-gray-500 mt-1">{trendLabel}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
