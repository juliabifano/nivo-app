import { useState } from "react";
import { useBudget } from "../contexts/BudgetContext";
import { motion } from "framer-motion";
import { BANKS, getBank } from "../data/banks";

export default function Accounts() {
  const { accounts = [], setAccounts, transactions = [] } = useBudget();

  const [form, setForm] = useState({
    nome: "",
    banco: "",
    saldo: "",
  });

  const formatCurrency = (v) =>
    Number(v || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  // ✅ SALDO CORRETO (IGNORA CRÉDITO)
  const getSaldoAtual = (account) => {
    const movimentacoes = transactions.filter(
      (t) =>
        t.accountId === account.id &&
        t.formaPagamento !== "credito" // 🔥 ESSENCIAL
    );

    const saldoTransacoes = movimentacoes.reduce((acc, t) => {
      const valor = Number(t.valor);

      if (t.tipo === "receita") return acc + valor;
      return acc - valor;
    }, 0);

    return Number(account.saldo || 0) + saldoTransacoes;
  };

  const handleAdd = () => {
    if (!form.nome || !form.banco) return;

    const nova = {
      id: crypto.randomUUID(),
      nome: form.nome,
      banco: form.banco,
      saldo: Number(form.saldo || 0),
    };

    setAccounts([nova, ...accounts]);

    setForm({
      nome: "",
      banco: "",
      saldo: "",
    });
  };

  const handleDelete = (id) => {
    setAccounts(accounts.filter((a) => a.id !== id));
  };

  return (
    <div className="flex h-screen">
      {/* CONTEÚDO */}
      <div className="flex-1 p-6 overflow-y-auto pr-[360px]">
        <h1 className="text-2xl font-semibold mb-6">Contas</h1>

        <div className="flex flex-wrap gap-6">
          {accounts.map((acc) => {
            const bank = getBank(acc.banco);
            const saldo = getSaldoAtual(acc);

            return (
              <motion.div
                key={acc.id}
                className="w-[320px] h-[160px] rounded-2xl p-4 text-white relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${bank.cor}, #0b0f1a)`,
                  boxShadow: `0 10px 30px ${bank.cor}40`,
                }}
                whileHover={{ scale: 1.03 }}
              >
                <img src={bank.logo} className="w-8 absolute top-3 right-3" />

                <p className="text-xs opacity-70">{bank.nome}</p>
                <p className="font-semibold text-lg">{acc.nome}</p>

                <div className="mt-6">
                  <p className="text-xs opacity-70">Saldo atual</p>
                  <p className="text-xl font-semibold">
                    {formatCurrency(saldo)}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(acc.id)}
                  className="absolute bottom-3 right-3 text-xs bg-red-500/70 px-2 py-1 rounded"
                >
                  Excluir
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* SIDEBAR */}
      <div className="fixed right-4 top-5 w-[320px] bg-[#0B0F1A]/70 p-5 rounded-2xl border border-gray-800 backdrop-blur-md">
        <h2 className="text-lg font-semibold mb-4">Adicionar conta</h2>

        <input
          className="w-full p-2 bg-[#111827] rounded-lg mb-2"
          placeholder="Nome da conta"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
        />

        <select
          className="w-full p-2 bg-[#111827] rounded-lg mb-2"
          value={form.banco}
          onChange={(e) => setForm({ ...form, banco: e.target.value })}
        >
          <option value="">Selecionar banco</option>
          {Object.entries(BANKS).map(([key, bank]) => (
            <option key={key} value={key}>
              {bank.nome}
            </option>
          ))}
        </select>

        <input
          className="w-full p-2 bg-[#111827] rounded-lg mb-3"
          type="number"
          placeholder="Saldo inicial"
          value={form.saldo}
          onChange={(e) => setForm({ ...form, saldo: e.target.value })}
        />

        <button
          onClick={handleAdd}
          className="w-full bg-emerald-400 text-black p-2 rounded-lg"
        >
          Adicionar conta
        </button>
      </div>
    </div>
  );
}