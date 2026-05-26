import { motion, AnimatePresence } from "framer-motion";

export default function CardTransactions({
  selected,
  getTransacoes,
  formatCurrency,
  listItem,
}) {
  const transacoes = getTransacoes(selected.id);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="transacoes"
        variants={listItem}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.2 }}
        className="flex flex-col gap-4 mt-4"
      >
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.05] backdrop-blur-xl p-5">
          <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                Transações
              </p>

              <h3 className="text-2xl font-semibold text-white mt-2">
                {transacoes.length}
              </h3>

              <p className="text-sm text-white/55 mt-1">
                movimentações encontradas
              </p>
            </div>

            <div className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white/70 text-xs">
              Histórico
            </div>
          </div>
        </div>

        {transacoes.length === 0 ? (
          <div className="h-32 flex items-center justify-center rounded-[28px] border border-white/10 bg-white/[0.05]">
            <p className="text-white/45 text-sm">
              Nenhuma transação encontrada
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {transacoes.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="
                  flex items-center justify-between gap-3
                  rounded-[24px]
                  border border-white/10
                  bg-white/[0.055]
                  backdrop-blur-xl
                  px-4 py-4
                "
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {t.descricao
                      ? t.descricao.charAt(0).toUpperCase() +
                        t.descricao.slice(1)
                      : ""}
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-white/40">
                      {new Date(t.data).toLocaleDateString("pt-BR")}
                    </p>

                    {t.categoriaNome && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-white/20" />

                        <p className="text-xs text-white/40 truncate">
                          {t.categoriaNome}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <p className="text-sm font-semibold text-white/85 shrink-0">
                  {formatCurrency(t.valor)}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}