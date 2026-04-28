import { useState } from "react";
import DatePicker from "../components/DatePicker";

export default function TransactionFilters({
  filtroPagamento,
  setFiltroPagamento,
  filtroCartao,
  setFiltroCartao,
  categorias,
  categoriaFiltro,
  setCategoriaFiltro,
  cartoes,
  filtroPeriodo,
  setFiltroPeriodo,
  dataSelecionada,
  setDataSelecionada,
}) {
  const [openAdvanced, setOpenAdvanced] = useState(false);

  return (
    <div className="flex flex-col gap-4 mb-4">
      {/* =========================
          🟢 FILTROS RÁPIDOS (mesma lógica)
      ========================= */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => {
            setFiltroPeriodo("dia");
            setDataSelecionada(null);
          }}
          className={`px-3 py-1 rounded-full text-xs whitespace-nowrap cursor-pointer ${
            filtroPeriodo === "dia"
              ? "bg-emerald-400 text-black"
              : "bg-[#111827] text-gray-300"
          }`}
        >
          Hoje
        </button>

        <button
          onClick={() => {
            setFiltroPeriodo("ontem");
            setDataSelecionada(null);
          }}
          className={`px-3 py-1 rounded-full text-xs whitespace-nowrap cursor-pointer ${
            filtroPeriodo === "ontem"
              ? "bg-emerald-400 text-black"
              : "bg-[#111827] text-gray-300"
          }`}
        >
          Ontem
        </button>

        <button
          onClick={() => {
            setFiltroPeriodo("ultimos7");
            setDataSelecionada(null);
          }}
          className={`px-3 py-1 rounded-full text-xs whitespace-nowrap cursor-pointer ${
            filtroPeriodo === "ultimos7"
              ? "bg-emerald-400 text-black"
              : "bg-[#111827] text-gray-300"
          }`}
        >
          7 dias
        </button>

        <button
          onClick={() => {
            setFiltroPeriodo("mes");
            setDataSelecionada(null);
          }}
          className={`px-3 py-1 rounded-full text-xs whitespace-nowrap cursor-pointer ${
            filtroPeriodo === "mes"
              ? "bg-emerald-400 text-black"
              : "bg-[#111827] text-gray-300"
          }`}
        >
          Esse mês
        </button>
      </div>

      {/* =========================
          🔵 BOTÃO FILTRO
      ========================= */}
      <div>
        <button
          onClick={() => setOpenAdvanced(!openAdvanced)}
          className="text-md text-gray-400 hover:text-white cursor-pointer"
        >
          Filtros Avançados
        </button>
      </div>

      {/* =========================
          ⚪ FILTRO AVANÇADO
      ========================= */}
      {openAdvanced && (
        <div className="flex flex-col gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
          {/* pagamento */}
          <select
            value={filtroPagamento}
            onChange={(e) => {
              setFiltroPagamento(e.target.value);
              setFiltroCartao("");
            }}
            className="bg-[#111827] border border-white/10 p-2 rounded-lg"
          >
            <option value="todos">Todos pagamentos</option>
            <option value="pix">Pix</option>
            <option value="debito">Débito</option>
            <option value="credito">Crédito</option>
            <option value="dinheiro">Dinheiro</option>
          </select>

          {/* cartão */}
          {(filtroPagamento === "credito" || filtroPagamento === "debito") && (
            <select
              value={filtroCartao}
              onChange={(e) => setFiltroCartao(e.target.value)}
              className="bg-[#111827] border border-white/10 p-2 rounded-lg"
            >
              <option value="">Todos cartões</option>
              {cartoes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          )}

          {/* categoria */}
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="bg-[#111827] border border-white/10 p-2 rounded-lg"
          >
            <option value="">Todas categorias</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* =========================
              📅 DATA PERSONALIZADA
          ========================= */}
          <div className="border-t border-white/10 pt-3">
            <p className="text-xs text-gray-400 mb-2">
              Ou escolha uma data específica:
            </p>

            <DatePicker
              value={dataSelecionada}
              onChange={(date) => {
                setDataSelecionada(date);
                setFiltroPeriodo("custom");
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
