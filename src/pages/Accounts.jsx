import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "../components/ui/SectionHeader";
import { useAccounts } from "../contexts/AccountContext";
import RightSidebarAccounts from "../components/RightSidebarAccounts";
import { useTransactions } from "../contexts/TransactionContext";
import { mapAccountsWithBalance } from "../core/selectors/accountSelectors";
import AccountDetailsModal from "../components/accounts/AccountDetailsModal";
import AccountCard from "../components/accounts/AccountCard";
import BottomSheet from "../components/ui/BottomSheet";
import FloatingActionButton from "../components/ui/FloatingActionButton";
import { useTheme } from "../theme/useTheme";

export default function Accounts() {
  const { accounts, remove } = useAccounts();
  const { transactions = [] } = useTransactions();
  const { theme, themeName } = useTheme();

  const accountsWithBalance = mapAccountsWithBalance(accounts, transactions);

  const [editando, setEditando] = useState(null);
  const [selected, setSelected] = useState(null);
  const [showMobileForm, setShowMobileForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const formatCurrency = (v) =>
    Number(v || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const handleEdit = (account) => {
    setEditando(account);

    if (window.innerWidth < 1024) {
      setShowMobileForm(true);
    }
  };

  return (
    <div
      className={`relative flex flex-col lg:flex-row h-full overflow-hidden ${theme.textPrimary}`}
    >
      <div
        className="
          flex-1
          min-h-0
          h-full
          overflow-hidden
          px-4
          pt-5
          pb-0
          lg:p-6
          lg:pr-[360px]
          no-scrollbar
        "
      >
        <div className="w-full h-full min-h-0 flex flex-col overflow-hidden">
          <div className="shrink-0">
            <SectionHeader
              title="Contas"
              subtitle="Suas contas e saldos"
              className="mb-6"
              icon={
                <img
                  src={
                    themeName === "light"
                      ? "/logo-ni-preta.svg"
                      : "/logo-ni-branca.svg"
                  }
                  className="w-6 h-6 object-contain"
                />
              }
            />
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar pb-32 lg:pb-5">
            <div className="flex flex-wrap gap-6">
              {accountsWithBalance.map((a) => (
                <AccountCard
                  key={a.id}
                  account={a}
                  transactions={transactions}
                  formatCurrency={formatCurrency}
                  onSelect={setSelected}
                  onEdit={handleEdit}
                  onDelete={setConfirmDelete}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <AccountDetailsModal
        selected={selected}
        setSelected={setSelected}
        transactions={transactions}
        formatCurrency={formatCurrency}
      />

      <div className="hidden lg:block">
        <RightSidebarAccounts editing={editando} setEditing={setEditando} />
      </div>

      <FloatingActionButton
        open={showMobileForm}
        onClick={() => {
          if (showMobileForm) {
            setShowMobileForm(false);
            setEditando(null);
            return;
          }

          setEditando(null);
          setShowMobileForm(true);
        }}
      />

      <BottomSheet
        open={showMobileForm}
        onClose={() => {
          setShowMobileForm(false);
          setEditando(null);
        }}
      >
        <RightSidebarAccounts
          editing={editando}
          setEditing={setEditando}
          isMobile
          setShowMobileForm={setShowMobileForm}
        />
      </BottomSheet>

      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-md flex items-center justify-center px-4"
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()}
              className={`
                w-full max-w-[340px] rounded-[28px]
                ${theme.surface}
                border ${theme.border}
                ${theme.textPrimary}
                p-5
              `}
            >
              <h3 className={`text-lg font-semibold ${theme.textPrimary}`}>
                Excluir conta?
              </h3>

              <p className={`text-sm mt-2 ${theme.textSecondary}`}>
                Essa ação não pode ser desfeita.
              </p>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className={`
                    flex-1 h-11 rounded-2xl border
                    ${
                      themeName === "light"
                        ? "bg-slate-200/70 border-slate-200 text-slate-700"
                        : "bg-white/10 border-white/[0.06] text-white"
                    }
                  `}
                >
                  Cancelar
                </button>

                <button
                  onClick={() => {
                    remove(confirmDelete.id);
                    setConfirmDelete(null);
                  }}
                  className="flex-1 h-11 rounded-2xl bg-red-400 text-black font-medium"
                >
                  Excluir
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
