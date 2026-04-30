import { motion, AnimatePresence } from "framer-motion";

export default function DeleteCardModal({
  confirmDelete,
  setConfirmDelete,
  onDelete,
}) {
  return (
    <AnimatePresence>
      {confirmDelete && (
        <motion.div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setConfirmDelete(null)}
        >
          <motion.div
            className="bg-[#111827]/70 p-6 rounded-2xl w-[460px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-white text-lg font-semibold mb-2">
              Excluir cartão
            </h2>

            <p className="text-gray-400 text-sm mb-6">
              Tem certeza que deseja excluir{" "}
              <span className="text-white font-medium">
                {confirmDelete.nome}
              </span>
              ?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded bg-white/10 text-white cursor-pointer"
              >
                Cancelar
              </button>

              <button
                onClick={() => {
                  onDelete(confirmDelete.id);
                  setConfirmDelete(null);
                }}
                className="px-4 py-2 rounded bg-red-500 text-white cursor-pointer"
              >
                Excluir
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
