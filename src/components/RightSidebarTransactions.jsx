import { useState, useEffect } from "react";
import DatePicker from "../components/DatePicker";

export default function RightSidebarTransactions({
  form,
  setForm,
  handleAdd,
  editandoId,
  setEditandoId,
  cartoes,
  categorias,
  setCategorias,
}) {
  const [categoriaInput, setCategoriaInput] = useState("");
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);

  const getToday = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // 🔥 sincroniza quando entra em edição
  useEffect(() => {
    setCategoriaInput(form.categoria || "");
  }, [form.categoria]);

  const categoriasFiltradas = categorias.filter((cat) =>
    cat.toLowerCase().includes(categoriaInput.toLowerCase()),
  );

  return (
    <div className="fixed right-4 top-5 h-[calc(100vh-40px)] w-[320px] bg-[#0B0F1A]/70 p-5 rounded-2xl border border-gray-800 backdrop-blur-md overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">
        {editandoId ? "Editar lançamento" : "Novo lançamento"}
      </h2>

      {/* DESCRIÇÃO */}
      <input
        className="w-full p-2 bg-[#111827] rounded-lg"
        placeholder="Descrição"
        value={form.descricao}
        onChange={(e) => setForm({ ...form, descricao: e.target.value })}
      />

      {/* CATEGORIA */}
      <div className="relative flex flex-col gap-2 mt-2">
        <input
          placeholder="Categoria"
          value={categoriaInput}
          onChange={(e) => {
            const value = e.target.value;
            setCategoriaInput(value);
            setMostrarSugestoes(true);
            setForm({ ...form, categoria: value });
          }}
          onFocus={() => setMostrarSugestoes(true)}
          onBlur={() => setTimeout(() => setMostrarSugestoes(false), 150)}
          className="w-full p-2 bg-[#111827] rounded-lg"
        />

        {mostrarSugestoes && categoriaInput && (
          <div className="absolute top-full w-full bg-[#1f2937] border border-white/10 rounded-xl mt-1 max-h-40 overflow-y-auto z-50">
            {categoriasFiltradas.length > 0 ? (
              categoriasFiltradas.map((cat) => (
                <div
                  key={cat}
                  onClick={() => {
                    setForm({ ...form, categoria: cat });
                    setCategoriaInput(cat);
                    setMostrarSugestoes(false);
                  }}
                  className="p-2 hover:bg-white/10 cursor-pointer text-sm"
                >
                  {cat}
                </div>
              ))
            ) : (
              <div className="p-2 text-sm text-gray-400">
                Nenhuma encontrada
              </div>
            )}
          </div>
        )}

        {/* CRIAR NOVA */}
        {categoriaInput &&
          !categorias.some(
            (c) => c.toLowerCase() === categoriaInput.toLowerCase(),
          ) && (
            <button
              type="button"
              onClick={() => {
                const nova = categoriaInput.trim();
                if (!nova) return;

                setCategorias([...categorias, nova]);
                setForm({ ...form, categoria: nova });
                setMostrarSugestoes(false);
              }}
              className="text-xs text-emerald-400 text-left"
            >
              + Criar "{categoriaInput}"
            </button>
          )}
      </div>

      {/* VALOR */}
      <input
        className="w-full p-2 bg-[#111827] rounded-lg mt-2"
        type="number"
        placeholder="Valor"
        value={form.valor}
        onChange={(e) => setForm({ ...form, valor: e.target.value })}
      />

      {/* DATA */}
      <DatePicker
        value={form.data}
        onChange={(date) => setForm({ ...form, data: date })}
      />

      {/* TIPO */}
      <div className="flex gap-2 bg-[#111827] p-1 rounded-xl mt-2 ">
        {["receita", "despesa"].map((t) => (
          <button
            key={t}
            onClick={() => setForm({ ...form, tipo: t })}
            className={`flex-1 p-2 rounded-lg cursor-pointer ${
              form.tipo === t
                ? t === "receita"
                  ? "bg-emerald-400 text-black"
                  : "bg-red-400 text-white"
                : "text-gray-300"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* PAGAMENTO */}
      <select
        className="w-full p-2 bg-[#111827] rounded-lg mt-2 cursor-pointer"
        value={form.formaPagamento}
        onChange={(e) => {
          const tipo = e.target.value;

          setForm({
            ...form,
            formaPagamento: tipo,
            cartao:
              tipo === "credito" || tipo === "debito" || tipo === "vale"
                ? form.cartao
                : "",
            parcelas: tipo === "credito" ? form.parcelas : "",
          });
        }}
      >
        <option value="pix">Pix</option>
        <option value="debito">Débito</option>
        <option value="credito">Crédito</option>
        <option value="dinheiro">Dinheiro</option>
        <option value="vale">Vale</option>
      </select>

      {/* CARTÃO */}
      {["credito", "debito", "vale"].includes(form.formaPagamento) && (
        <select
          className="w-full p-2 bg-[#111827] rounded-lg mt-2 cursor-pointer"
          value={form.cartao}
          onChange={(e) => setForm({ ...form, cartao: e.target.value })}
        >
          <option value="">Selecionar cartão</option>

          {cartoes
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

      {/* PARCELAS */}
      {form.formaPagamento === "credito" && (
        <input
          className="w-full p-2 bg-[#111827] rounded-lg mt-2 "
          type="number"
          placeholder="Parcelas"
          value={form.parcelas}
          onChange={(e) => setForm({ ...form, parcelas: e.target.value })}
        />
      )}

      {/* BOTÃO */}
      <button
        onClick={handleAdd}
        className="w-full bg-emerald-400 text-black p-2 rounded-lg mt-3 hover:bg-emerald-300 cursor-pointer"
      >
        {editandoId ? "Salvar edição" : "Adicionar"}
      </button>

      {/* CANCELAR */}
      {editandoId && (
        <button
          onClick={() => {
            setEditandoId(null);
            setCategoriaInput("");
            setMostrarSugestoes(false);
            setForm({
              descricao: "",
              categoria: "",
              valor: "",
              tipo: "despesa",
              data: getToday(),
              formaPagamento: "pix",
              cartao: "",
              parcelas: "",
            });
          }}
          className="w-full bg-gray-700 text-white p-2 rounded-lg mt-2"
        >
          Cancelar
        </button>
      )}
    </div>
  );
}
