import { motion, AnimatePresence } from "framer-motion";

export default function CardInvoice({
  selected,
  transactions,
  budgetItems = [],
  formatCurrency,
  getInvoicePeriod,
  getCurrentInvoiceDate,
  generateInvoice,
  groupByDate,
  formatDateLabel,
  invoiceDate,
  setInvoiceDate,
  direction,
  setDirection,
  slideHorizontal,
  groupFade,
  staggerContainer,
}) {
  const { mes, ano } = invoiceDate || getCurrentInvoiceDate(selected);

  const fatura = generateInvoice({
    transactions,
    budgetItems,
    card: selected,
    month: mes,
    year: ano,
  });

  const { start, end } = getInvoicePeriod(mes, ano, selected.fechamento);

  return (
    <div className="mt-4 text-white overflow-x-hidden">
      <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.06] backdrop-blur-xl p-4">
        <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-red-400/10 blur-3xl" />

        <div className="relative z-10 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              setDirection(-1);

              setInvoiceDate((prev) => {
                const base = prev || getCurrentInvoiceDate(selected);

                let mes = base.mes - 1;
                let ano = base.ano;

                if (mes < 1) {
                  mes = 12;
                  ano -= 1;
                }

                return { mes, ano };
              });
            }}
            className="w-10 h-10 rounded-2xl bg-white/10 border border-white/10 text-white/70 hover:text-white hover:bg-white/15 transition cursor-pointer"
          >
            ←
          </button>

          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.18em] text-white/45">
              Fatura
            </p>

            <p className="text-lg font-semibold capitalize mt-1">
              {new Date(ano, mes - 1).toLocaleDateString("pt-BR", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <button
            onClick={() => {
              setDirection(1);

              setInvoiceDate((prev) => {
                const base = prev || getCurrentInvoiceDate(selected);

                let mes = base.mes + 1;
                let ano = base.ano;

                if (mes > 12) {
                  mes = 1;
                  ano += 1;
                }

                return { mes, ano };
              });
            }}
            className="w-10 h-10 rounded-2xl bg-white/10 border border-white/10 text-white/70 hover:text-white hover:bg-white/15 transition cursor-pointer"
          >
            →
          </button>
        </div>

        <div className="relative z-10 mt-4">
          <p className="text-xs text-white/45">Total da fatura</p>

          <p className="text-2xl font-semibold mt-1">
            {formatCurrency(fatura.total)}
          </p>

          <p className="text-xs text-white/45 mt-2">
            {start.toLocaleDateString("pt-BR")} →{" "}
            {end.toLocaleDateString("pt-BR")}
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={`${mes}-${ano}`}
          custom={direction}
          variants={slideHorizontal}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25 }}
          className="mt-4"
        >
          {fatura.transactions.length === 0 ? (
            <div className="h-32 flex items-center justify-center rounded-[24px] border border-white/10 bg-white/[0.05]">
              <p className="text-white/45 text-sm">
                Nenhuma compra nesta fatura
              </p>
            </div>
          ) : (
            <motion.div
              variants={groupFade}
              className="
          relative
          overflow-hidden
          rounded-[24px]
          border
          border-white/10
          bg-white/[0.05]
          backdrop-blur-xl
          p-4
        "
            >
              <div className="flex flex-col">
                {Object.entries(
                  groupByDate(
                    [...fatura.transactions].sort(
                      (a, b) => new Date(a.data) - new Date(b.data),
                    ),
                  ),
                ).map(([date, items], groupIndex, groups) => (
                  <div key={date}>
                    

                    <div className="flex flex-col">
                      {items.map((t, index) => {
                        const isLast =
                          groupIndex === groups.length - 1 &&
                          index === items.length - 1;

                        return (
                          <motion.div
                            key={t.id}
                            variants={staggerContainer}
                            className={`
                        flex
                        items-center
                        justify-between
                        gap-3
                        py-3
                        ${!isLast ? "border-b border-white/[0.07]" : ""}
                      `}
                          >
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">
                                {t.descricao}
                              </p>

                              <p className="text-xs text-white/40 mt-1">
                                {formatDateLabel(
                                  `${new Date(t.data).getFullYear()}-${String(
                                    new Date(t.data).getMonth() + 1,
                                  ).padStart(
                                    2,
                                    "0",
                                  )}-${String(new Date(t.data).getDate()).padStart(2, "0")}`,
                                )}
                              </p>
                            </div>

                            <p className="text-sm font-semibold text-white/85 shrink-0">
                              {formatCurrency(t.valor)}
                            </p>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
