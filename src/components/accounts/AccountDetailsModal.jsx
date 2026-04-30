import { motion, AnimatePresence } from "framer-motion";
import { getBank } from "../../data/banks";

export default function AccountDetailsModal({
  selected,
  setSelected,
  transactions = [],
  formatCurrency,
}) {
  if (!selected) return null;

  const bank = getBank(selected.banco);

  const accountTransactions = transactions.filter(
    (t) => String(t.accountId) === String(selected.id),
  );

  const receitas = accountTransactions
    .filter((t) => t.tipo === "receita")
    .reduce((acc, t) => acc + Number(t.valor || 0), 0);

  const despesas = accountTransactions
    .filter((t) => t.tipo === "despesa")
    .reduce((acc, t) => acc + Number(t.valor || 0), 0);

  const saldoAtual =
    Number(selected.saldoInicial || 0) + receitas - despesas;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        onClick={() => setSelected(null)}
      >
        <motion.div
          className="w-[600px] max-h-[80vh] rounded-2xl p-6 overflow-y-auto"
          style={{
            background: `linear-gradient(135deg, ${bank.cor}, #0b0f1a)`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">{bank.nome}</p>
              <h2 className="text-white text-xl font-semibold">
                {selected.nome}
              </h2>
            </div>

            <img
              src={bank.logo}
              alt={bank.nome}
              className="w-10 h-10 object-contain"
            />
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="bg-white/10 p-3 rounded-lg">
              <p className="text-xs text-gray-300">Saldo inicial</p>
              <p className="text-white font-semibold">
                {formatCurrency(selected.saldoInicial)}
              </p>
            </div>

            <div className="bg-white/10 p-3 rounded-lg">
              <p className="text-xs text-gray-300">Entradas</p>
              <p className="text-emerald-300 font-semibold">
                {formatCurrency(receitas)}
              </p>
            </div>

            <div className="bg-white/10 p-3 rounded-lg">
              <p className="text-xs text-gray-300">Saldo atual</p>
              <p className="text-emerald-300 font-semibold">
                {formatCurrency(saldoAtual)}
              </p>
            </div>
          </div>

          <h3 className="text-white font-medium mt-6 mb-3">
            Transações da conta
          </h3>

          <div className="flex flex-col gap-2">
            {accountTransactions.length === 0 ? (
              <p className="text-white/50 text-sm">
                Nenhuma transação nessa conta.
              </p>
            ) : (
              accountTransactions.map((t) => (
                <div
                  key={t.id}
                  className="bg-white/10 p-3 rounded-xl flex justify-between items-center"
                >
                  <div>
                    <p className="text-white font-medium">{t.descricao}</p>
                    <p className="text-white/50 text-xs">
                      {new Date(t.data).toLocaleDateString("pt-BR")}
                    </p>
                  </div>

                  <p
                    className={
                      t.tipo === "receita"
                        ? "text-emerald-300 font-semibold"
                        : "text-red-300 font-semibold"
                    }
                  >
                    {formatCurrency(t.valor)}
                  </p>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}