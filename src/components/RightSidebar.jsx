import CategoryPicker from "./CategoryPicker";
import { useAccounts } from "../contexts/AccountContext";
import { useCards } from "../contexts/CardContext";

export default function RightSidebar({
  form,
  setForm,
  handleAdd,
  months,
  toggleMonth,
  editingId,
  formatCurrency,
}) {
  if (!form) return null;

  const valor = Number(form.valorMensal) || 0;
  const meses = form.meses?.length || 0;

  const { accounts } = useAccounts();
  const { cards } = useCards();

  return (
    <div
      className="
        fixed right-4 top-5
        mb-5 mr-5
        h-[calc(100vh-40px)]
        w-[320px]
        bg-[#0B0F1A]/70
        p-5
        space-y-3
        rounded-2xl
        shadow-xl
        border border-gray-800
        backdrop-blur-md
      "
    >
      <h2 className="text-lg font-semibold mb-4">
        {editingId ? "Editar" : "Adicionar"}
      </h2>

      <input
        className="w-full mb-3 p-2 bg-[#111827] rounded-lg"
        placeholder="Descrição"
        value={form.descricao}
        onChange={(e) => setForm({ ...form, descricao: e.target.value })}
      />

      <CategoryPicker
        selected={form.categoriaId}
        onChange={(id) => setForm({ ...form, categoriaId: id })}
      />

      <input
        className="w-full mb-3 p-2 bg-[#111827] rounded-lg"
        placeholder="Valor Mensal"
        type="number"
        value={form.valorMensal}
        onChange={(e) => setForm({ ...form, valorMensal: e.target.value })}
      />

      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setForm({ ...form, tipo: "receita" })}
          className={`flex-1 p-2 rounded cursor-pointer ${
            form.tipo === "receita"
              ? "bg-emerald-400 text-black"
              : "bg-gray-800"
          }`}
        >
          Receita
        </button>

        <button
          type="button"
          onClick={() => setForm({ ...form, tipo: "despesa" })}
          className={`flex-1 p-2 rounded cursor-pointer ${
            form.tipo === "despesa" ? "bg-red-400 text-black" : "bg-gray-800"
          }`}
        >
          Despesa
        </button>
      </div>

      <select
        className="w-full mb-3 p-2 bg-[#111827] rounded-lg"
        value={form.formaPagamento || "pix"}
        onChange={(e) => {
          const formaPagamento = e.target.value;

          setForm({
            ...form,
            formaPagamento,
            accountId: ["pix", "debito", "dinheiro"].includes(formaPagamento)
              ? form.accountId
              : "",
            cartaoId: ["credito", "debito", "vale"].includes(formaPagamento)
              ? form.cartaoId
              : "",
          });
        }}
      >
        <option value="pix">Pix</option>
        <option value="debito">Débito</option>
        <option value="credito">Crédito</option>
        <option value="dinheiro">Dinheiro</option>
        <option value="vale">Vale</option>
      </select>

      {["pix", "debito", "dinheiro"].includes(form.formaPagamento) && (
        <select
          className="w-full mb-3 p-2 bg-[#111827] rounded-lg"
          value={form.accountId || ""}
          onChange={(e) => setForm({ ...form, accountId: e.target.value })}
        >
          <option value="">Selecionar conta</option>

          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nome}
            </option>
          ))}
        </select>
      )}

      {["credito", "debito", "vale"].includes(form.formaPagamento) && (
        <select
          className="w-full mb-3 p-2 bg-[#111827] rounded-lg"
          value={form.cartaoId || ""}
          onChange={(e) => {
            const cartaoId = e.target.value;
            const selectedCard = cards.find(
              (c) => String(c.id) === String(cartaoId),
            );

            setForm({
              ...form,
              cartaoId,
              accountId:
                form.formaPagamento === "debito" && selectedCard?.accountId
                  ? selectedCard.accountId
                  : form.accountId,
            });
          }}
        >
          <option value="">Selecionar cartão</option>

          {cards
            .filter((c) => {
              if (form.formaPagamento === "credito") {
                return c.tipo === "credito" || c.tipo === "multiplo";
              }

              if (form.formaPagamento === "debito") {
                return c.tipo === "debito" || c.tipo === "multiplo";
              }

              if (form.formaPagamento === "vale") {
                return c.tipo === "vale";
              }

              return false;
            })
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
        </select>
      )}

      <input
        className="w-full mb-3 p-2 bg-[#111827] rounded-lg"
        placeholder="Dia do vencimento"
        type="number"
        min="1"
        max="31"
        value={form.diaVencimento || ""}
        onChange={(e) => setForm({ ...form, diaVencimento: e.target.value })}
      />

      <div className="grid grid-cols-4 gap-2 mb-4">
        {months.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => toggleMonth(m)}
            className={`p-2 text-xs rounded cursor-pointer ${
              (form.meses || []).includes(m)
                ? "bg-emerald-400 text-black"
                : "bg-[#111827]"
            }`}
          >
            {m.toUpperCase()}
          </button>
        ))}
      </div>

      <p className="text-emerald-400 font-semibold">
        Total: {formatCurrency(valor * meses)}
      </p>

      <button
        type="button"
        onClick={handleAdd}
        className="cursor-pointer w-full bg-emerald-400 text-black p-2 rounded-lg"
      >
        {editingId ? "Atualizar" : "Adicionar"}
      </button>
    </div>
  );
}
