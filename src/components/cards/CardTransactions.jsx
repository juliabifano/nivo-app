import { motion, AnimatePresence } from "framer-motion";

export default function CardTransactions({
  selected,
  getTransacoes,
  formatCurrency,
  listItem,
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="transacoes"
        variants={listItem}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.2 }}
        className="flex flex-col gap-3 mt-3"
      >
        {getTransacoes(selected.id).map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex justify-between bg-white/10 p-3 rounded-lg"
          >
            <span className="text-white text-sm">
              {t.descricao
                ? t.descricao.charAt(0).toUpperCase() +
                  t.descricao.slice(1)
                : ""}
            </span>

            <span className="text-white/70 text-sm">
              {formatCurrency(t.valor)}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}