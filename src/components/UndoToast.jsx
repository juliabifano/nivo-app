import { motion, AnimatePresence } from "framer-motion";

export default function UndoToast({ show, onUndo }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#111827] border border-white/10 px-4 py-3 rounded-xl flex items-center gap-4 shadow-lg z-50"
        >
          <span className="text-sm text-gray-300">
            Transação excluída
          </span>

          <button
            onClick={onUndo}
            className="text-emerald-400 text-sm hover:underline"
          >
            Desfazer
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}