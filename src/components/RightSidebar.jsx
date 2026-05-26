import CategoryPicker from "./CategoryPicker";
import { useAccounts } from "../contexts/AccountContext";
import { useCards } from "../contexts/CardContext";
import { useTheme } from "../theme/useTheme";

export default function RightSidebar({
  form,
  setForm,
  handleAdd,
  months,
  toggleMonth,
  editingId,
  formatCurrency,
  isMobile = false,
  setShowMobileForm,
}) {
  if (!form) return null;

  const { accounts } = useAccounts();
  const { cards } = useCards();
  const { theme, themeName } = useTheme();

  const valor = Number(form.valorMensal) || 0;
  const meses = form.meses?.length || 0;

  const inputClass = `
    w-full h-12 px-4 rounded-2xl outline-none border transition-all
    ${
      themeName === "light"
        ? "bg-white/80 border-slate-200/80 text-slate-900 placeholder:text-slate-400 focus:border-emerald-400/40"
        : "bg-[#111827] border-white/[0.06] text-white placeholder:text-gray-500 focus:border-emerald-400/40"
    }
  `;

  const desktopInputClass = `
    w-full p-2 rounded-lg outline-none border transition-all
    ${theme.surface}
    border ${theme.border}
    ${theme.textPrimary}
  `;

  const fieldClass = isMobile ? inputClass : desktopInputClass;

  const optionClass =
    themeName === "light"
      ? "bg-white text-slate-900"
      : "bg-[#111827] text-white";

  return (
    <div
      className={
        isMobile
          ? `
            w-full p-5 space-y-4 pb-32
            ${theme.textPrimary}
            ${themeName === "light" ? "bg-[#F4F7F6]" : "bg-[#07111F]"}
          `
          : `
            fixed right-4 top-5 h-[calc(100vh-40px)] w-[320px] z-40
            ${theme.surface}
            border ${theme.border}
            ${theme.textPrimary}
            p-5 space-y-3 rounded-2xl shadow-xl backdrop-blur-md
            overflow-y-auto no-scrollbar
          `
      }
    >
      <h2 className="text-lg font-semibold mb-4">
        {editingId ? "Editar" : "Adicionar"}
      </h2>

      <input
        className={fieldClass}
        placeholder="Descrição"
        value={form.descricao}
        onChange={(e) => setForm({ ...form, descricao: e.target.value })}
      />

      <CategoryPicker
        selected={form.categoriaId}
        onChange={(id) => setForm({ ...form, categoriaId: id })}
      />

      <input
        className={fieldClass}
        placeholder="Valor Mensal"
        type="number"
        value={form.valorMensal}
        onChange={(e) => setForm({ ...form, valorMensal: e.target.value })}
      />

      <div
        className={`
          flex gap-2 p-1 rounded-2xl border
          ${
            themeName === "light"
              ? "bg-white/50 border-slate-200/70"
              : "bg-[#111827] border-white/[0.06]"
          }
        `}
      >
        {["receita", "despesa"].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setForm({ ...form, tipo: t })}
            className={`
              flex-1 h-11 rounded-xl text-sm font-medium transition-all
              ${
                form.tipo === t
                  ? t === "receita"
                    ? "bg-emerald-400 text-black"
                    : "bg-red-400 text-white"
                  : themeName === "light"
                    ? "text-slate-500 hover:bg-white/60"
                    : "text-gray-300 hover:bg-white/[0.04]"
              }
            `}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <select
        className={fieldClass}
        value={form.formaPagamento || "pix"}
        onChange={(e) => {
          const formaPagamento = e.target.value;

          setForm({
            ...form,
            formaPagamento,
            accountId: ["pix", "debito_conta", "dinheiro"].includes(
              formaPagamento,
            )
              ? form.accountId
              : "",
            cartaoId: ["credito", "debito_cartao", "vale"].includes(
              formaPagamento,
            )
              ? form.cartaoId
              : "",
          });
        }}
      >
        <option className={optionClass} value="pix">Pix</option>
        <option className={optionClass} value="debito_conta">Débito em conta</option>
        <option className={optionClass} value="debito_cartao">Débito no cartão</option>
        <option className={optionClass} value="credito">Crédito</option>
        <option className={optionClass} value="dinheiro">Dinheiro</option>
        <option className={optionClass} value="vale">Vale</option>
      </select>

      {["pix", "debito_conta", "dinheiro"].includes(form.formaPagamento) && (
        <select
          className={fieldClass}
          value={form.accountId || ""}
          onChange={(e) => setForm({ ...form, accountId: e.target.value })}
        >
          <option className={optionClass} value="">Selecionar conta</option>

          {accounts.map((a) => (
            <option className={optionClass} key={a.id} value={a.id}>
              {a.nome}
            </option>
          ))}
        </select>
      )}

      {["credito", "debito_cartao", "vale"].includes(form.formaPagamento) && (
        <select
          className={fieldClass}
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
                form.formaPagamento === "debito_cartao" &&
                selectedCard?.accountId
                  ? selectedCard.accountId
                  : form.accountId,
            });
          }}
        >
          <option className={optionClass} value="">Selecionar cartão</option>

          {cards
            .filter((c) => {
              if (form.formaPagamento === "credito") {
                return c.tipo === "credito" || c.tipo === "multiplo";
              }

              if (form.formaPagamento === "debito_cartao") {
                return c.tipo === "debito" || c.tipo === "multiplo";
              }

              if (form.formaPagamento === "vale") {
                return c.tipo === "vale";
              }

              return false;
            })
            .map((c) => (
              <option className={optionClass}  key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
        </select>
      )}

      <input
        className={fieldClass}
        placeholder="Dia do vencimento"
        type="number"
        min="1"
        max="31"
        value={form.diaVencimento || ""}
        onChange={(e) => setForm({ ...form, diaVencimento: e.target.value })}
      />

      <div className="grid grid-cols-4 gap-2">
        {months.map((m) => {
          const active = (form.meses || []).includes(m);

          return (
            <button
              key={m}
              type="button"
              onClick={() => toggleMonth(m)}
              className={`
                h-10 rounded-xl text-xs font-medium transition-all cursor-pointer
                ${
                  active
                    ? "bg-emerald-400 text-black"
                    : themeName === "light"
                      ? "bg-white/70 border border-slate-200/70 text-slate-500"
                      : "bg-[#111827] border border-white/[0.06] text-gray-400"
                }
              `}
            >
              {m.toUpperCase()}
            </button>
          );
        })}
      </div>

      <p className="text-emerald-400 font-semibold">
        Total: {formatCurrency(valor * meses)}
      </p>

      <button
        type="button"
        onClick={handleAdd}
        className="
          w-full h-12 rounded-2xl
          bg-emerald-400 text-black
          font-medium
          shadow-[0_14px_40px_rgba(16,185,129,0.22)]
          active:scale-[0.98]
          transition-all
        "
      >
        {editingId ? "Atualizar" : "Adicionar"}
      </button>
    </div>
  );
}
