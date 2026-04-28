import { motion, AnimatePresence } from "framer-motion";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar ação",
  description = "Tem certeza?",
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-xl">
              <h2 className="text-lg font-semibold mb-2">{title}</h2>
              <p className="text-sm text-gray-400 mb-6">{description}</p>

              <div className="flex justify-end gap-2">
                <button
                  onClick={onClose}
                  className="px-3 py-1 text-sm rounded bg-white/10 hover:bg-white/20"
                >
                  Cancelar
                </button>

                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="px-3 py-1 text-sm rounded bg-red-500 hover:bg-red-600"
                >
                  Excluir
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}