import { getPaymentVisual } from "../../utils/getPaymentVisual";

export default function RecentTransactionsCard({
  transactions,
  cards,
  accounts,
  formatCurrency,
}) {
  return (
    <div className="col-span-8 bg-white/5 border border-white/10 rounded-[28px] p-4 shadow-lg overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm text-gray-400">Transações recentes</p>

          <p className="text-xs text-gray-500 mt-1">
            Últimas movimentações
          </p>
        </div>

        <span className="text-[10px] px-2 py-1 rounded-full bg-white/10 text-gray-400">
          {transactions.length} lançamentos
        </span>
      </div>

      <div className="grid grid-cols-4 gap-3 mt-2">
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-sm col-span-4">
            Nenhuma transação ainda.
          </p>
        ) : (
          transactions.slice(0, 4).map((t) => (
            <div
              key={t.id}
              className="
                h-[74px]
                bg-gradient-to-br
                from-white/[0.07]
                to-white/[0.025]
                border border-white/10
                rounded-2xl
                px-3 py-3
                hover:border-white/20
                hover:bg-white/[0.08]
                transition-all
                min-w-0
              "
            >
              <div className="flex items-center gap-3 h-full">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <img
                    src={getPaymentVisual({
                      item: t,
                      cards,
                      accounts,
                    })}
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
    </div>
  );
}