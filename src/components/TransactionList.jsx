import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { slideHorizontal } from "../animations";
import EditIcon from "../assets/icons/Edit.svg?react";
import DeleteIcon from "../assets/icons/Bin.svg?react";
import ConfirmModal from "./ConfirmModal";
import UndoToast from "./UndoToast";

export default function TransactionList({
  transactions = [],
  onEdit,
  onDelete,
  onRestore,
}) {
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [lastDeleted, setLastDeleted] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const [direction, setDirection] = useState(1);

  const prevIdsRef = useRef("");

  useEffect(() => {
    const currentIds = transactions.map((t) => t.id).join("");

    if (prevIdsRef.current !== "") {
      setDirection(currentIds.length >= prevIdsRef.current.length ? 1 : -1);
    }

    prevIdsRef.current = currentIds;
  }, [transactions]);

  const handleDeleteClick = (t) => {
    setSelectedId(t.id);
    setLastDeleted(t);
    setShowModal(true);
  };

  const confirmDelete = () => {
    onDelete(selectedId);

    setShowModal(false);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
      setLastDeleted(null);
    }, 4000);
  };

  const handleUndo = () => {
    if (lastDeleted) {
      onRestore(lastDeleted);
    }
    setShowToast(false);
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        {transactions.length === 0 ? (
          <div className="text-gray-400 text-sm mt-6">
            Nenhuma transação encontrada.
          </div>
        ) : (
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={JSON.stringify(transactions.map((t) => t.id))}
              custom={direction}
              variants={slideHorizontal}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-col gap-3"
            >
              {transactions.map((t) => (
                <div
                  key={t.id}
                  className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center hover:bg-white/10 transition"
                >
                  <div>
                    <p className="font-medium">
                      {t.descricao?.charAt(0).toUpperCase() +
                        t.descricao?.slice(1)}
                    </p>

                    <p className="text-xs text-gray-400">
                      {t.categorias?.join(", ")} • {t.formaPagamento}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <p
                      className={
                        t.tipo === "receita"
                          ? "text-emerald-400 font-medium"
                          : "text-red-400 font-medium"
                      }
                    >
                      {Number(t.valor).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>

                    <button
                      onClick={() => onEdit(t)}
                      className="p-1 rounded hover:bg-white/10 group"
                    >
                      <EditIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-400" />
                    </button>

                    <button
                      onClick={() => handleDeleteClick(t)}
                      className="p-1 rounded hover:bg-white/10 group"
                    >
                      <DeleteIcon className="w-4 h-4 text-gray-400 group-hover:text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* MODAL */}
      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmDelete}
        title="Excluir transação"
        description="Essa ação não pode ser desfeita."
      />

      {/* TOAST */}
      <UndoToast show={showToast} onUndo={handleUndo} />
    </>
  );
}
