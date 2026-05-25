import Chart from "react-apexcharts";
import Card from "../ui/Card";

export default function AnnualFlowChart({
  chartData,
  currentMonthLabel,
  summary,
  formatCurrency,
}) {

  const isMobile = window.innerWidth < 640;

  return (
    <Card hover="subtle" className="p-4 lg:p-5 min-w-0 h-full overflow-hidden">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-4 mb-1">
        <div>
          <p className="text-[15px] font-medium text-gray-300">
            Fluxo financeiro anual
          </p>

          <p className="text-[11px] text-gray-500/80 mt-1">
            Comparativo de receitas e despesas
          </p>

          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-xs text-gray-400">Receitas</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="text-xs text-gray-400">Despesas</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full lg:w-[520px]">
          <div className="bg-white/5 rounded-2xl p-3">
            <p className="text-xs text-gray-400">Receitas</p>

            <p className="text-emerald-400 font-semibold">
              {formatCurrency(summary.receitas)}
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl p-3">
            <p className="text-xs text-gray-400">Despesas</p>

            <p className="text-red-400 font-semibold">
              {formatCurrency(summary.despesas)}
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl p-3">
            <p className="text-xs text-gray-400">Saldo</p>

            <p
              className={`font-semibold ${
                summary.saldo >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {formatCurrency(summary.saldo)}
            </p>
          </div>
        </div>
      </div>

      <Chart
        type="area"
        height={isMobile ? 180 : 230}
        series={[
          {
            name: "Receitas",
            data: chartData.map((d) => Number(d.receita || 0)),
          },
          {
            name: "Despesas",
            data: chartData.map((d) => Number(d.despesa || 0)),
          },
        ]}
        options={{
          chart: {
            type: "area",
            toolbar: { show: false },
            background: "transparent",
            zoom: { enabled: false },

            dropShadow: {
              enabled: true,
              top: 0,
              left: 0,
              blur: 4,
              opacity: 0.1,
            },
          },

          annotations: {
            xaxis: [
              {
                x: currentMonthLabel,
                borderColor: "rgba(255,255,255,0.035)",
                strokeDashArray: 3,
              },
            ],
          },

          colors: ["#2EE6B8", "#FF6B87"],

          stroke: {
            show: true,
            curve: "monotoneCubic",
            width: [3, 3],
            lineCap: "round",
          },

          fill: {
            type: "gradient",

            gradient: {
              type: "vertical",
              shadeIntensity: 1,
              inverseColors: false,
              opacityFrom: 0.22,
              opacityTo: 0.01,
              stops: [0, 100],
            },
          },

          dataLabels: {
            enabled: false,
          },

          markers: {
            size: 0,
            hover: { size: 6 },
          },

          grid: {
            borderColor: "rgba(255,255,255,0.06)",

            strokeDashArray: 5,

            padding: {
              top: -8,
              left: 8,
              right: 8,
              bottom: 0,
            },
          },

          xaxis: {
            categories: chartData.map(
              (d) => d.mes.charAt(0).toUpperCase() + d.mes.slice(1),
            ),

            labels: {
              style: {
                colors: "#9ca3af",
                fontSize: "11px",
              },
            },

            axisBorder: { show: false },
            axisTicks: { show: false },

            tooltip: {
              enabled: false,
            },
          },

          yaxis: {
            min: 0,

            labels: {
              style: {
                colors: "#9ca3af",
                fontSize: "11px",
              },

              formatter: (val) => `R$ ${(val / 1000).toFixed(0)}k`,
            },

            forceNiceScale: true,
          },

          tooltip: {
            shared: true,
            intersect: false,

            custom: ({ series, dataPointIndex }) => {
              const meses = [
                "Janeiro",
                "Fevereiro",
                "Março",
                "Abril",
                "Maio",
                "Junho",
                "Julho",
                "Agosto",
                "Setembro",
                "Outubro",
                "Novembro",
                "Dezembro",
              ];

              const receitas = series[0][dataPointIndex];

              const despesas = series[1][dataPointIndex];

              return `
                <div class="nivo-tooltip">
                  <div class="nivo-tooltip-title">
                    ${meses[dataPointIndex] || ""}
                  </div>

                  <div class="nivo-tooltip-row">
                    <span class="nivo-tooltip-dot receita"></span>
                    <span class="nivo-tooltip-label">
                      Receitas
                    </span>

                    <strong>
                      ${formatCurrency(receitas)}
                    </strong>
                  </div>

                  <div class="nivo-tooltip-row">
                    <span class="nivo-tooltip-dot despesa"></span>
                    <span class="nivo-tooltip-label">
                      Despesas
                    </span>

                    <strong>
                      ${formatCurrency(despesas)}
                    </strong>
                  </div>
                </div>
              `;
            },
          },

          legend: {
            show: false,
          },
        }}
      />
    </Card>
  );
}
