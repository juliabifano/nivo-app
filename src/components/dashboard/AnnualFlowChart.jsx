import Chart from "react-apexcharts";
import Card from "../ui/Card";
import { useTheme } from "../../theme/useTheme";

export default function AnnualFlowChart({
  chartData,
  currentMonthLabel,
  summary,
  formatCurrency,
}) {
  const { theme, themeName } = useTheme();

  const isMobile = window.innerWidth < 640;

  return (
    <Card hover="subtle" className="p-4 lg:p-5 min-w-0 h-full overflow-hidden">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-4 mb-1">
        <div>
          <p className={`text-[15px] font-medium ${theme.textSecondary}`}>
            Fluxo financeiro anual
          </p>

          <p className={`text-[11px] ${theme.textMuted} mt-1`}>
            Comparativo de receitas e despesas
          </p>

          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: theme.chartIncome }}
              />
              <span className={`text-xs ${theme.textMuted}`}>Receitas</span>
            </div>

            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: theme.chartExpense }}
              />
              <span className={`text-xs ${theme.textMuted}`}>Despesas</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full lg:w-[520px]">
          <div
            className={`${theme.surface} border ${theme.border} rounded-2xl p-3`}
          >
            <p className={`text-xs ${theme.textMuted}`}>Receitas</p>
            <p className={`${theme.success} font-semibold`}>
              {formatCurrency(summary.receitas)}
            </p>
          </div>

          <div
            className={`${theme.surface} border ${theme.border} rounded-2xl p-3`}
          >
            <p className={`text-xs ${theme.textMuted}`}>Despesas</p>
            <p className={`${theme.danger} font-semibold`}>
              {formatCurrency(summary.despesas)}
            </p>
          </div>

          <div
            className={`${theme.surface} border ${theme.border} rounded-2xl p-3`}
          >
            <p className={`text-xs ${theme.textMuted}`}>Saldo</p>
            <p
              className={`font-semibold ${
                summary.saldo >= 0 ? theme.success : theme.danger
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
              opacity: themeName === "light" ? 0.06 : 0.1,
            },
          },

          annotations: {
            xaxis: [
              {
                x: currentMonthLabel,
                borderColor:
                  themeName === "light"
                    ? "rgba(15,23,42,0.08)"
                    : "rgba(255,255,255,0.035)",
                strokeDashArray: 3,
              },
            ],
          },

          colors: [theme.chartIncome, theme.chartExpense],

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
              opacityFrom: themeName === "light" ? 0.16 : 0.22,
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
            borderColor: theme.grid,
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
                colors: theme.axis,
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
                colors: theme.axis,
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
                  <span class="nivo-tooltip-label">Receitas</span>
                  <strong>${formatCurrency(receitas)}</strong>
                </div>

                <div class="nivo-tooltip-row">
                  <span class="nivo-tooltip-dot despesa"></span>
                  <span class="nivo-tooltip-label">Despesas</span>
                  <strong>${formatCurrency(despesas)}</strong>
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
