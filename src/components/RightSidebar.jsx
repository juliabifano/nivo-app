import CategoryPicker from "./CategoryPicker";

export default function RightSidebar({
  form,
  setForm,
  handleAdd,
  months,
  toggleMonth,
  editingId,
  categorias,
  setCategorias,
  formatCurrency,
}) {
  if (!form) return null;

  const valor = Number(form.valorMensal) || 0;
  const meses = form.meses?.length || 0;

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
    backdrop-blur-md"
    >
      <h2 className="text-lg font-semibold mb-4">
        {editingId ? "Editar" : "Adicionar"}
      </h2>

      {/* DESCRIÇÃO */}
      <input
        className="w-full mb-3 p-2 bg-[#111827] rounded-lg"
        placeholder="Descrição"
        value={form.descricao}
        onChange={(e) => setForm({ ...form, descricao: e.target.value })}
      />

      {/* CATEGORIA */}
      <CategoryPicker
        categorias={categorias}
        selected={form.categorias || []}
        setSelected={(cats) => setForm({ ...form, categorias: cats })}
        setCategorias={setCategorias}
      />

      {/* VALOR */}
      <input
        className="w-full mb-3 p-2 bg-[#111827] rounded-lg"
        placeholder="Valor Mensal"
        type="number"
        value={form.valorMensal}
        onChange={(e) => setForm({ ...form, valorMensal: e.target.value })}
      />

      {/* TIPO */}
      <div className="flex gap-2 mb-3">
        <button
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
          onClick={() => setForm({ ...form, tipo: "despesa" })}
          className={`flex-1 p-2 rounded cursor-pointer ${
            form.tipo === "despesa" ? "bg-red-400 text-black" : "bg-gray-800"
          }`}
        >
          Despesa
        </button>
      </div>

      {/* MESES */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {months.map((m) => (
          <button
            key={m}
            onClick={() => toggleMonth(m)}
            className={`p-2 text-xs rounded cursor-pointer ${
              (form.meses || []).includes(m)
                ? "bg-emerald-400 text-black"
                : "bg-[#111827]"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* PREVIEW TOTAL */}
      <p className="text-emerald-400 font-semibold">
        Total: {formatCurrency(valor * meses)}
      </p>

      {/* BOTÃO */}
      <button
        onClick={handleAdd}
        className="cursor-pointer w-full bg-emerald-400 text-black p-2 rounded-lg"
      >
        {editingId ? "Atualizar" : "Adicionar"}
      </button>
    </div>
  );
}
