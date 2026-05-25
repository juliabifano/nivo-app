import { getPaymentVisual } from "../../utils/getPaymentVisual";
import Card from "../ui/Card";

export default function RecentTransactionsCard({
  transactions,
  cards,
  accounts,
  formatCurrency,
}) {
  return (
    <Card hover="subtle" className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[15px] font-medium text-gray-300">
            Transações recentes
          </p>

          <p className="text-[11px] text-gray-500/80 mt-1">
            Últimas movimentações
          </p>
        </div>

        <span className="text-[10px] px-2 py-1 rounded-full bg-white/10 text-gray-400">
          {transactions.length} lançamentos
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mt-2">
        {transactions.length === 0 ? (
          <div className="col-span-4 h-[92px] flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-2">
              <span className="text-base">💳</span>
            </div>

            <p className="text-sm text-white font-medium">
              Nenhuma transação ainda
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Seus lançamentos recentes aparecerão aqui.
            </p>
          </div>
        ) : (
          transactions.slice(0, 4).map((t) => (
            <div
              key={t.id}
              className="
          min-h-[74px]
          bg-gradient-to-br
          from-white/[0.05]
          to-transparent
          border border-white/10
          rounded-2xl
          px-3 py-3
          hover:border-white/20
          hover:bg-white/[0.08]
          transition-all
          min-w-0
        "
            >
             <div className="flex items-center gap-3 h-full min-w-0">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <img
                    src={getPaymentVisual({ item: t, cards, accounts })}
                    className="w-6 h-6 object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-white text-sm font-semibold truncate">
                      {t.descricao}
                    </p>

                    <p
                      className={`text-sm font-semibold shrink-0 ${
                        t.tipo === "receita"
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {t.tipo === "receita" ? "+" : "-"}{" "}
                      {formatCurrency(t.valor)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-1 min-w-0">
                    <p className="text-[11px] text-gray-500 truncate">
                      {t.categoriaNome}
                    </p>

                    <span className="w-1 h-1 rounded-full bg-gray-600 shrink-0" />

                    <p className="text-[11px] text-gray-500 shrink-0">
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
