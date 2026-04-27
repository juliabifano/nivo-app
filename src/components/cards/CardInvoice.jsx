import { motion, AnimatePresence } from "framer-motion";

export default function CardInvoice({
  selected,
  transactions,
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
  const { mes, ano } =
    invoiceDate || getCurrentInvoiceDate(selected);

  const fatura = generateInvoice({
    transactions,
    card: selected,
    month: mes,
    year: ano,
  });

  const { start, end } = getInvoicePeriod(
    mes,
    ano,
    selected.fechamento,
  );

  return (
    <div className="mt-3 text-white overflow-x-hidden">
      {/* header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => {
            setDirection(-1);

            setInvoiceDate((prev) => {
              const base =
                prev || getCurrentInvoiceDate(selected);

              let mes = base.mes - 1;
              let ano = base.ano;

              if (mes < 1) {
                mes = 12;
                ano -= 1;
              }

              return { mes, ano };
            });
          }}
          className="text-white/60 hover:text-white text-sm cursor-pointer"
        >
          ←
        </button>

        <p className="text-white font-semibold">
          {new Date(ano, mes - 1).toLocaleDateString("pt-BR", {
            month: "long",
            year: "numeric",
          })}
        </p>

        <button
          onClick={() => {
            setDirection(1);

            setInvoiceDate((prev) => {
              const base =
                prev || getCurrentInvoiceDate(selected);

              let mes = base.mes + 1;
              let ano = base.ano;

              if (mes > 12) {
                mes = 1;
                ano += 1;
              }

              return { mes, ano };
            });
          }}
          className="text-white/60 hover:text-white text-sm cursor-pointer"
        >
          →
        </button>
      </div>

      <p className="text-sm text-white/60 mb-2">
        {start.toLocaleDateString("pt-BR")} →{" "}
        {end.toLocaleDateString("pt-BR")}
      </p>

      <p className="mb-4 text-white/70">
        Total: {formatCurrency(fatura.total)}
      </p>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={`${mes}-${ano}`}
          custom={direction}
          variants={slideHorizontal}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25 }}
          className="flex flex-col gap-4"
        >
          {fatura.transactions.length === 0 ? (
            <p className="text-white/50 text-sm text-center mt-4">
              Nenhuma compra nesta fatura
            </p>
          ) : (
            Object.entries(
              groupByDate(
                [...fatura.transactions].sort(
                  (a, b) => new Date(a.data) - new Date(b.data),
                ),
              ),
            ).map(([date, items]) => (
              <motion.div key={date} variants={groupFade}>
                <div className="text-xs text-white/40 font-semibold">
                  {formatDateLabel(date)}
                </div>

                {items.map((t) => (
                  <motion.div
                    key={t.id}
                    variants={staggerContainer}
                    className="flex justify-between py-2"
                  >
                    <span>{t.descricao}</span>
                    <span>{formatCurrency(t.valor)}</span>
                  </motion.div>
                ))}
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}