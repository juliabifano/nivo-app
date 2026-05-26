import { getPaymentVisual } from "../../utils/getPaymentVisual";
import Card from "../ui/Card";
import { useTheme } from "../../theme/useTheme";

export default function RecentTransactionsCard({
  transactions,
  cards,
  accounts,
  formatCurrency,
}) {
  const { theme, themeName } = useTheme();

  return (
    <Card hover="subtle" className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className={`text-[15px] font-medium ${theme.textSecondary}`}>
            Transações recentes
          </p>

          <p className={`text-[11px] ${theme.textMuted} mt-1`}>
            Últimas movimentações
          </p>
        </div>

        <span
          className={`
            text-[10px] px-2 py-1 rounded-full
            ${
              themeName === "light"
                ? "bg-slate-200/70 text-slate-500"
                : "bg-white/10 text-gray-400"
            }
          `}
        >
          {transactions.length} lançamentos
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mt-2">
        {transactions.length === 0 ? (
          <div className="col-span-4 h-[92px] flex flex-col items-center justify-center text-center">
            <div
              className={`
                w-10 h-10 rounded-2xl
                ${theme.surface}
                border ${theme.border}
                flex items-center justify-center mb-2
              `}
            >
              <span className="text-base">💳</span>
            </div>

            <p className={`text-sm font-medium ${theme.textPrimary}`}>
              Nenhuma transação ainda
            </p>

            <p className={`text-xs ${theme.textMuted} mt-1`}>
              Seus lançamentos recentes aparecerão aqui.
            </p>
          </div>
        ) : (
          transactions.slice(0, 4).map((t) => (
            <div
              key={t.id}
              className={`
                min-h-[74px]
                rounded-2xl
                px-3 py-3
                transition-all
                min-w-0
                border
                ${
                  themeName === "light"
                    ? "bg-white/35 border-slate-200/60 hover:bg-white/55 hover:border-slate-300/70"
                    : "bg-gradient-to-br from-white/[0.05] to-transparent border-white/10 hover:border-white/20 hover:bg-white/[0.08]"
                }
              `}
            >
              <div className="flex items-center gap-3 h-full min-w-0">
                <div
                  className={`
                  w-9 h-9 rounded-xl
                  border flex items-center justify-center shrink-0
                  ${
                    themeName === "light"
                     ? "bg-white/80 border-slate-200/80 shadow-sm"
                     : "bg-white/5 border-white/10"
                  }
                `}
                >
                  <img
                    src={getPaymentVisual({ item: t, cards, accounts })}
                    className={`
                    w-6 h-6 object-contain
                    ${themeName === "light" ? "invert opacity-70" : ""}
                  `}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={`text-sm font-semibold truncate ${theme.textPrimary}`}
                    >
                      {t.descricao}
                    </p>

                    <p
                      className={`text-sm font-semibold shrink-0 ${
                        t.tipo === "receita" ? theme.success : theme.danger
                      }`}
                    >
                      {t.tipo === "receita" ? "+" : "-"}{" "}
                      {formatCurrency(t.valor)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-1 min-w-0">
                    <p className={`text-[11px] ${theme.textMuted} truncate`}>
                      {t.categoriaNome}
                    </p>

                    <span
                      className={`
                        w-1 h-1 rounded-full shrink-0
                        ${themeName === "light" ? "bg-slate-300" : "bg-gray-600"}
                      `}
                    />

                    <p className={`text-[11px] ${theme.textMuted} shrink-0`}>
                      {new Date(t.data).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
