import { useState } from "react";
import BottomSheet from "../ui/BottomSheet";
import { getBank } from "../../data/banks";
import GlassTabs from "../ui/GlassTabs";
import Chart from "react-apexcharts";

export default function AccountDetailsModal({
  selected,
  setSelected,
  transactions = [],
  formatCurrency,
}) {
  const [tab, setTab] = useState("resumo");
  if (!selected) return null;

  const bank = getBank(selected.banco);

  const accountTransactions = transactions.filter(
    (t) => String(t.accountId) === String(selected.id),
  );

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthTransactions = accountTransactions.filter((t) => {
    const d = new Date(t.data);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const receitas = monthTransactions
    .filter((t) => t.tipo === "receita")
    .reduce((acc, t) => acc + Number(t.valor || 0), 0);

  const despesas = monthTransactions
    .filter((t) => t.tipo === "despesa")
    .reduce((acc, t) => acc + Number(t.valor || 0), 0);

  const saldoAtual = Number(selected.saldoInicial || 0) + receitas - despesas;

  const fluxoChart = {
    series: [
      {
        name: "Fluxo",
        data: [receitas, despesas],
      },
    ],

    options: {
      chart: {
        type: "bar",

        toolbar: {
          show: false,
        },

        sparkline: {
          enabled: true,
        },

        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 600,
        },
      },

      fill: {
        type: "gradient",

        gradient: {
          shade: "light",
          type: "vertical",
          opacityFrom: 1,
          opacityTo: 0.85,
          stops: [0, 100],
        },
      },

      plotOptions: {
        bar: {
          borderRadius: 10,
          columnWidth: "38%",
          distributed: true,
        },
      },

      dataLabels: {
        enabled: false,
      },

      grid: {
        show: false,
      },

      xaxis: {
        categories: ["Entradas", "Saídas"],

        labels: {
          show: false,
        },

        axisBorder: {
          show: false,
        },

        axisTicks: {
          show: false,
        },
      },

      yaxis: {
        show: false,
      },

      tooltip: {
        theme: "dark",

        style: {
          fontSize: "12px",
        },

        y: {
          formatter: (value) => formatCurrency(value),
        },
      },

      colors: ["#34D399", "#FB7185"],
    },
  };
  return (
    <BottomSheet
      open={!!selected}
      onClose={() => setSelected(null)}
      className="p-4 sm:p-5"
      style={{
        background: `linear-gradient(135deg, ${bank.cor}, #0b0f1a)`,
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-white/60 text-sm">{bank.nome}</p>

          <h2 className="text-white text-xl font-semibold mt-1">
            {selected.nome}
          </h2>

          <p className="text-white/50 text-xs mt-1 capitalize">
            {selected.tipo}
          </p>
        </div>

        <img
          src={bank.logo}
          alt={bank.nome}
          className="w-10 h-10 object-contain"
        />
      </div>

      <div className="mt-6">
        <p className="text-xs text-white/60">Saldo atual</p>

        <p className="text-[2rem] leading-none font-bold text-emerald-300 mt-2 drop-shadow-[0_0_18px_rgba(52,211,153,0.25)]">
          {formatCurrency(saldoAtual)}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
        <div className="bg-white/[0.06] border border-white/[0.08] p-3 rounded-2xl">
          <p className="text-xs text-gray-300">Saldo inicial</p>
          <p className="text-white font-semibold mt-1">
            {formatCurrency(selected.saldoInicial)}
          </p>
        </div>

        <div className="bg-white/[0.06] border border-white/[0.08] p-3 rounded-2xl">
          <p className="text-xs text-gray-300">Entradas</p>
          <p className="text-emerald-300 font-semibold mt-1">
            {formatCurrency(receitas)}
          </p>
        </div>

        <div className="bg-white/[0.06] border border-white/[0.08] p-3 rounded-2xl">
          <p className="text-xs text-gray-300">Saídas</p>
          <p className="text-red-300 font-semibold mt-1">
            {formatCurrency(despesas)}
          </p>
        </div>
      </div>

      <GlassTabs
        value={tab}
        onChange={setTab}
        className="mt-6"
        tabs={[
          { value: "resumo", label: "Resumo" },
          { value: "transacoes", label: "Transações" },
          { value: "insights", label: "Insights" },
        ]}
      />

      {tab === "resumo" && (
        <div className="mt-5 flex flex-col gap-3 pb-28 lg:pb-0">
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4">
            <p className="text-xs text-white/50">Total de movimentações</p>

            <p className="text-white text-lg font-semibold mt-1">
              {accountTransactions.length}
            </p>
          </div>

          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-3">
            <p className="text-xs text-white/50">Fluxo do mês</p>

            <div className="flex items-center justify-between mt-3">
              <span className="text-emerald-300 text-sm">
                + {formatCurrency(receitas)}
              </span>

              <span className="text-red-300 text-sm">
                - {formatCurrency(despesas)}
              </span>
            </div>
          </div>
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/50">Comparativo</p>
                <p className="text-sm text-white mt-1">Entradas x saídas</p>
              </div>
            </div>

            <div className="mt-4">
              <Chart
                options={fluxoChart.options}
                series={fluxoChart.series}
                type="bar"
                height={90}
              />
            </div>
          </div>
        </div>
      )}

      {tab === "insights" && (
        <div className="mt-5 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 pb-28 lg:pb-4">
          <p className="text-white font-medium">Insights financeiros</p>

          <p className="text-sm text-white/50 mt-2">
            Em breve vamos mostrar tendências, previsões e comportamento
            financeiro da conta.
          </p>
        </div>
      )}

      {tab === "transacoes" && (
        <div className="mt-7">
          <div className="flex flex-col gap-2 mt-4 pb-32 lg:pb-10">
            <div>
              <h3 className="text-white font-medium">Transações da conta</h3>
              <p className="text-xs text-white/40 mt-1">
                Movimentações vinculadas
              </p>
            </div>

            <span className="text-[11px] px-2 py-1 rounded-full bg-white/10 text-white/60">
              {accountTransactions.length}
            </span>
          </div>

          <div className="flex flex-col gap-2 mt-4 pb-10">
            {accountTransactions.length === 0 ? (
              <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-4">
                <p className="text-white/50 text-sm">
                  Nenhuma transação nessa conta.
                </p>
              </div>
            ) : (
              accountTransactions.map((t) => (
                <div
                  key={t.id}
                  className="bg-white/[0.06] border border-white/[0.08] p-3 rounded-2xl flex justify-between items-center gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-white font-medium truncate">
                      {t.descricao}
                    </p>

                    <p className="text-white/50 text-xs mt-1">
                      {new Date(t.data).toLocaleDateString("pt-BR")}
                    </p>
                  </div>

                  <p
                    className={
                      t.tipo === "receita"
                        ? "text-emerald-300 font-semibold shrink-0"
                        : "text-red-300 font-semibold shrink-0"
                    }
                  >
                    {t.tipo === "receita" ? "+" : "-"} {formatCurrency(t.valor)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </BottomSheet>
  );
}
