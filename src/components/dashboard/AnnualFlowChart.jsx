import Chart from "react-apexcharts";

export default function AnnualFlowChart({
  chartData,
  currentMonthLabel,
  summary,
  formatCurrency,
}) {
  return (
    <div className="col-span-8 bg-white/5 border border-white/10 rounded-[28px] p-5 shadow-lg min-w-0 overflow-hidden">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-400">
            Fluxo financeiro anual
          </p>

          <p className="text-xs text-gray-500 mt-1">
            Comparativo de receitas e despesas
          </p>

          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-xs text-gray-400">
                Receitas
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="text-xs text-gray-400">
                Despesas
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 w-[520px]">
          <div className="bg-white/5 rounded-2xl p-3">
            <p className="text-xs text-gray-400">
              Receitas
            </p>

            <p className="text-emerald-400 font-semibold">
              {formatCurrency(summary.receitas)}
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl p-3">
            <p className="text-xs text-gray-400">
              Despesas
            </p>

            <p className="text-red-400 font-semibold">
              {formatCurrency(summary.despesas)}
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl p-3">
            <p className="text-xs text-gray-400">
              Saldo
            </p>

            <p
              className={`font-semibold ${
                summary.saldo >= 0
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              {formatCurrency(summary.saldo)}
            </p>
          </div>
        </div>
      </div>

      <Chart
        type="area"
        height={220}
        series={[
          {
            name: "Receitas",
            data: chartData.map((d) =>
              Number(d.receita || 0),
            ),
          },
          {
            name: "Despesas",
            data: chartData.map((d) =>
              Number(d.despesa || 0),
            ),
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
              blur: 6,
              opacity: 0.18,
            },
          },

          annotations: {
            xaxis: [
              {
                x: currentMonthLabel,
                borderColor:
                  "rgba(255,255,255,0.16)",
                strokeDashArray: 5,
              },
            ],
          },

          colors: ["#00F5B0", "#FF5C7A"],

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
              opacityFrom: 0.25,
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
            borderColor:
              "rgba(255,255,255,0.06)",

            strokeDashArray: 5,

            padding: {
              top: 10,
              left: 8,
              right: 8,
              bottom: 0,
            },
          },

          xaxis: {
            categories: chartData.map(
              (d) =>
                d.mes.charAt(0).toUpperCase() +
                d.mes.slice(1),
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

              formatter: (val) =>
                `R$ ${(val / 1000).toFixed(0)}k`,
            },

            forceNiceScale: true,
          },

          tooltip: {
            shared: true,
            intersect: false,

            custom: ({
              series,
              dataPointIndex,
            }) => {
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

              const receitas =
                series[0][dataPointIndex];

              const despesas =
                series[1][dataPointIndex];

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
    </div>
  );
}