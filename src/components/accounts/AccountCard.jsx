import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getBank } from "../../data/banks";
import ActionMenu from "../ui/ActionMenu";

export default function AccountCard({
  account,
  transactions = [],
  formatCurrency,
  onSelect,
  onEdit,
  onDelete,
}) {
  const bank = getBank(account.banco);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const accountTransactions = transactions.filter(
    (t) => String(t.accountId) === String(account.id),
  );

  const monthTransactions = accountTransactions.filter((t) => {
    const d = new Date(t.data);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const entradas = monthTransactions
    .filter((t) => t.tipo === "receita")
    .reduce((acc, t) => acc + Number(t.valor || 0), 0);

  const saidas = monthTransactions
    .filter((t) => t.tipo === "despesa")
    .reduce((acc, t) => acc + Number(t.valor || 0), 0);

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect?.(account)}
      className="
        relative
        w-full
        min-h-[240px]
        max-w-[340px]
        mx-auto

        lg:w-[320px]
        lg:min-h-[220px]
        lg:max-w-none
        lg:mx-0

        rounded-[30px]
        overflow-hidden
        cursor-pointer
        "
      style={{
        background: `linear-gradient(135deg, ${bank.cor}, #0B0F1A)`,
        boxShadow: `0 14px 40px ${bank.cor}30`,
      }}
    >
      <div className="absolute inset-0 bg-black/25" />

      {/* HEADER */}
      <div className="relative z-10 p-5">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-white/70">{bank.nome}</p>

            <p className="text-xl font-semibold mt-1 text-white">
              {account.nome
                ?.toLowerCase()
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </p>

            <p className="text-xs text-white/60 mt-1 capitalize">
              {account.tipo}
            </p>
          </div>

          <div className="flex items-start gap-3">
            <img src={bank.logo} className="w-10 h-10 object-contain" />

            <ActionMenu
              actions={[
                {
                  label: "Editar",
                  onClick: () => onEdit?.(account),
                },
                {
                  label: "Excluir",
                  danger: true,
                  onClick: () => onDelete?.(account),
                },
              ]}
            />
          </div>
        </div>

        {/* SALDO */}
        <div className="mt-10">
          <p className="text-xs text-white/60">Saldo disponível</p>

          <p
            className="text-[2rem] leading-none font-bold text-emerald-300 mt-2 tracking-tight
            drop-shadow-[0_0_18px_rgba(52,211,153,0.25)]"
          >
            {formatCurrency(account.saldoAtual)}
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-3">
            <p className="text-[10px] text-white/50">Entradas</p>

            <p className="text-sm text-white font-medium mt-1">
              {formatCurrency(entradas)}
            </p>
          </div>

          <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-3">
            <p className="text-[10px] text-white/50">Saídas</p>

            <p className="text-sm text-white font-medium mt-1">
              {formatCurrency(saidas)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
