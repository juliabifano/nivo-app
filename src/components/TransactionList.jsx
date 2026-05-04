import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { slideHorizontal } from "../animations";
import EditIcon from "../assets/icons/Edit.svg?react";
import DeleteIcon from "../assets/icons/Bin.svg?react";
import ConfirmModal from "./ConfirmModal";
import UndoToast from "./UndoToast";
import { useCategories } from "../contexts/CategoryContext";
import { mapTransactionsWithCategory } from "../core/selectors/categorySelectors";
import { useCards } from "../contexts/CardContext";
import { parseLocalDate } from "../core/selectors/transactionSelectors";
import { getPaymentVisual } from "../utils/getPaymentVisual";
import { useAccounts } from "../contexts/AccountContext";

export default function TransactionList({
  transactions = [],
  onDelete,
  onEdit,
}) {
  const { categories } = useCategories();
  const { cards = [] } = useCards();
  const { accounts = [] } = useAccounts();

  function getCardName(id) {
    return cards.find((c) => String(c.id) === String(id))?.nome || "";
  }

  const transactionsComCategoria = mapTransactionsWithCategory(
    transactions,
    categories,
  );

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
              key={transactions.map((t) => t.id).join("")}
              custom={direction}
              variants={slideHorizontal}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-col gap-3"
            >
              {transactionsComCategoria.map((t) => {
                const parcelaLabel =
                  t.formaPagamento === "credito" && t.parcelas > 1
                    ? ` • ${t.parcelas}x`
                    : "";

                return (
                  <div
                    key={t.id}
                    className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center hover:bg-white/10 transition"
                  >
                    {/* ESQUERDA */}
                    <div className="flex items-center gap-3">
                      <img
                        src={getPaymentVisual({ item: t, cards, accounts })}
                        className="w-8 h-8 object-contain"
                      />

                      <div>
                        <p className="font-medium">{t.descricao}</p>

                        <p className="text-xs text-gray-400">
                          {t.categoriaNome}
                          {t.cartaoId && getCardName(t.cartaoId)
                            ? ` • ${getCardName(t.cartaoId)}`
                            : ""}
                          {parcelaLabel}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {parseLocalDate(t.data).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    {/* DIREITA */}
                    <div className="flex items-center gap-4">
                      <p
                        className={
                          t.tipo === "receita"
                            ? "text-emerald-400 font-medium whitespace-nowrap"
                            : "text-red-400 font-medium whitespace-nowrap"
                        }
                      >
                        {Number(t.valor).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </p>

                      <button
                        onClick={() => onEdit(t)}
                        className="p-1 rounded hover:bg-white/10"
                      >
                        <EditIcon className="w-4 h-4 text-blue-400" />
                      </button>

                      <button
                        onClick={() => handleDeleteClick(t)}
                        className="p-1 rounded hover:bg-white/10 group"
                      >
                        <DeleteIcon className="w-4 h-4 text-gray-400 group-hover:text-red-400" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmDelete}
        title="Excluir transação"
        description="Essa ação não pode ser desfeita."
      />

      <UndoToast show={showToast} />
    </>
  );
}
