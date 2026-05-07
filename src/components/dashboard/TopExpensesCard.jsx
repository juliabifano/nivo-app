export default function TopExpensesCard({ topCategories, summary, formatCurrency }) {
  return (
    <div className="col-span-4 bg-white/5 border border-white/10 rounded-[28px] p-4 shadow-lg overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm text-gray-400">Top gastos</p>
          <p className="text-xs text-gray-500 mt-1">Categorias do mês</p>
        </div>

        <span className="text-[10px] px-2 py-1 rounded-full bg-red-400/10 text-red-300 border border-red-400/20">
          Top 3
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {topCategories.length === 0 ? (
          <p className="text-gray-500 text-sm col-span-3">Sem dados ainda.</p>
        ) : (
          topCategories.slice(0, 3).map((cat, index) => {
            const percent = summary.despesas
              ? Math.min((cat.value / summary.despesas) * 100, 100)
              : 0;

            return (
              <div
                key={cat.name}
                className="bg-white/[0.045] border border-white/[0.08] rounded-2xl px-3 py-2 min-w-0 hover:bg-white/[0.06] transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 min-w-0">
                    <span className="mt-0.5 w-5 h-5 rounded-md bg-red-400/10 text-red-300 border border-red-400/20 text-[10px] flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>

                    <div className="min-w-0">
                      <p className="text-sm text-white font-medium truncate leading-tight">
                        {cat.name || "Sem nome"}
                      </p>

                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {formatCurrency(cat.value)}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] text-red-300 bg-red-400/10 border border-red-400/15 px-1.5 py-0.5 rounded-full shrink-0">
                    {Math.round(percent)}%
                  </span>
                </div>

                <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-1 rounded-full bg-red-400"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}