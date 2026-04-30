import { useState } from "react";
import { useAccounts } from "../contexts/AccountContext";
import RightSidebarAccounts from "../components/RightSidebarAccounts";
import { getBank } from "../data/banks";
import { useTransactions } from "../contexts/TransactionContext";
import { mapAccountsWithBalance } from "../core/selectors/accountSelectors";
import AccountDetailsModal from "../components/accounts/AccountDetailsModal";

export default function Accounts() {
  const { accounts, remove } = useAccounts();
  const { transactions = [] } = useTransactions();

  const accountsWithBalance = mapAccountsWithBalance(accounts, transactions);

  const [editando, setEditando] = useState(null);
  const [selected, setSelected] = useState(null);

  const formatCurrency = (v) =>
    Number(v || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <div className="flex h-screen">
      {/* LISTA */}
      <div className="flex-1 p-6 overflow-y-auto pr-[360px]">
        <h1 className="text-2xl font-semibold mb-6">Contas</h1>

        <div className="flex flex-wrap gap-6">
          {accountsWithBalance.map((a) => {
            const bank = getBank(a.banco);

            return (
              <div
                key={a.id}
                onClick={() => setSelected(a)}
                className="w-[320px] p-5 rounded-2xl border border-white/10 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${bank.cor}, #0B0F1A)`,
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-white/70">{bank.nome}</p>
                    <p className="text-lg font-semibold mt-1">
                      {a.nome
                        ?.toLowerCase()
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </p>
                    <p className="text-xs text-white/60 mt-1">
                      {a.tipo.charAt(0).toUpperCase() + a.tipo.slice(1)}
                    </p>
                  </div>

                  <img
                    src={bank.logo}
                    alt={bank.nome}
                    className="w-9 h-9 object-contain"
                  />
                </div>

                <p className="text-emerald-300 font-semibold mt-6">
                  {formatCurrency(a.saldoAtual)}
                </p>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditando(a);
                    }}
                    className="text-xs bg-white/10 px-2 py-1 rounded"
                  >
                    Editar
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(a.id);
                    }}
                    className="text-xs bg-red-500/70 px-2 py-1 rounded"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AccountDetailsModal
        selected={selected}
        setSelected={setSelected}
        transactions={transactions}
        formatCurrency={formatCurrency}
      />

      {/* SIDEBAR */}
      <RightSidebarAccounts editing={editando} setEditing={setEditando} />
    </div>
  );
}
