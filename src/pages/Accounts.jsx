import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "../components/ui/SectionHeader";
import { useAccounts } from "../contexts/AccountContext";
import RightSidebarAccounts from "../components/RightSidebarAccounts";
import { getBank } from "../data/banks";
import { useTransactions } from "../contexts/TransactionContext";
import { mapAccountsWithBalance } from "../core/selectors/accountSelectors";
import AccountDetailsModal from "../components/accounts/AccountDetailsModal";
import AccountCard from "../components/accounts/AccountCard";
import BottomSheet from "../components/ui/BottomSheet";
import FloatingActionButton from "../components/ui/FloatingActionButton";

export default function Accounts() {
  const { accounts, remove } = useAccounts();
  const { transactions = [] } = useTransactions();

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
    <div className="relative flex flex-col lg:flex-row h-full overflow-hidden">
      {/* LISTA */}
      <div
        className="
    flex-1
    min-h-0
    overflow-y-auto
    px-4
    pt-5
    pb-36
    lg:p-6
    lg:pr-[360px]
    no-scrollbar
  "
      >
        <SectionHeader
          title="Contas"
          subtitle="Suas contas e saldos"
          className="mb-6"
          icon={
            <img src="/logo-ni-branca.svg" className="w-6 h-6 object-contain" />
          }
        />

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

      <AccountDetailsModal
        selected={selected}
        setSelected={setSelected}
        transactions={transactions}
        formatCurrency={formatCurrency}
      />

      {/* SIDEBAR */}
      <div className="hidden lg:block">
        <RightSidebarAccounts editing={editando} setEditing={setEditando} />
      </div>

      {/* FAB MOBILE */}
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
              className="w-full max-w-[340px] rounded-[28px] bg-[#0B0F1A] border border-white/10 p-5"
            >
              <h3 className="text-white text-lg font-semibold">
                Excluir conta?
              </h3>

              <p className="text-sm text-gray-400 mt-2">
                Essa ação não pode ser desfeita.
              </p>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 h-11 rounded-2xl bg-white/10 text-white"
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
