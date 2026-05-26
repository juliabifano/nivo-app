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
import { useTheme } from "../theme/useTheme";

export default function TransactionList({
  transactions = [],
  onDelete,
  onEdit,
}) {
  const { categories } = useCategories();
  const { cards = [] } = useCards();
  const { accounts = [] } = useAccounts();
  const { theme, themeName } = useTheme();

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
                    className={`
                    p-4 rounded-2xl flex justify-between items-center transition border
                    ${
                      themeName === "light"
                        ? "bg-white/45 border-slate-200/70 hover:bg-white/70 hover:border-slate-300/80"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }
                  `}
                  >
                    {/* ESQUERDA */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`
                        w-10 h-10 rounded-2xl
                        flex items-center justify-center shrink-0 border
                        ${
                          themeName === "light"
                            ? "bg-white/80 border-slate-200/80 shadow-sm"
                            : "bg-white/5 border-white/10"
                        }
                      `}
                      >
                        <img
                          src={getPaymentVisual({ item: t, cards, accounts })}
                          className={`
                          w-5 h-5 object-contain
                          ${themeName === "light" ? "invert opacity-70" : ""}
                        `}
                        />
                      </div>

                      <div>
                        <p className={`font-medium ${theme.textPrimary}`}>
                          {t.descricao}
                        </p>

                        <p className={`text-xs ${theme.textSecondary}`}>
                          {t.categoriaNome}
                          {t.cartaoId && getCardName(t.cartaoId)
                            ? ` • ${getCardName(t.cartaoId)}`
                            : ""}
                          {parcelaLabel}
                        </p>

                        <p className={`text-xs mt-1 ${theme.textMuted}`}>
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
                            ? `${theme.success} font-medium whitespace-nowrap`
                            : `${theme.danger} font-medium whitespace-nowrap`
                        }
                      >
                        {Number(t.valor).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </p>

                      <button
                        onClick={() => onEdit(t)}
                        className={`
                        p-1 rounded-lg transition cursor-pointer
                        ${themeName === "light" ? "hover:bg-slate-200/70" : "hover:bg-white/10"}
                      `}
                      >
                        <EditIcon
                          className={`w-4 h-4 ${
                            themeName === "light"
                              ? "text-sky-600"
                              : "text-blue-400"
                          }`}
                        />
                      </button>

                      <button
                        onClick={() => handleDeleteClick(t)}
                        className={`
                        p-1 rounded-lg group transition cursor-pointer
                        ${themeName === "light" ? "hover:bg-slate-200/70" : "hover:bg-white/10"}
                      `}
                      >
                        <DeleteIcon
                          className={`
                          w-4 h-4 transition
                          ${
                            themeName === "light"
                              ? "text-slate-400 group-hover:text-red-500"
                              : "text-gray-400 group-hover:text-red-400"
                          }
                        `}
                        />
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
