export default function TransactionList({ transactions = [] }) {
  if (!transactions.length) {
    return (
      <div className="text-gray-400 text-sm mt-6">
        Nenhuma transação encontrada.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {transactions.map((t) => (
        <div
          key={t.id}
          className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center"
        >
          {/* infos principais */}
          <div className="flex flex-col">
            <p className="font-medium">
              {t.descricao?.charAt(0).toUpperCase() + t.descricao?.slice(1)}
            </p>

            <p className="text-xs text-gray-400">
              {t.categorias?.join(", ")} • {t.formaPagamento}
            </p>
          </div>

          {/* valor */}
          <p
            className={
              t.tipo === "receita" ? "text-emerald-400" : "text-red-400"
            }
          >
            {Number(t.valor).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </div>
      ))}
    </div>
  );
}
