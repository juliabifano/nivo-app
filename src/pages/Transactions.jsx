import { useBudget } from "../contexts/BudgetContext";
import { useTransactions } from "../hooks/useTransactions";

import TransactionFilters from "../components/TransactionFilters";
import TransactionList from "../components/TransactionList";
import RightSidebarTransactions from "../components/RightSidebarTransactions";

export default function Transactions() {
  const { transactions = [], categorias = [], cartoes = [] } = useBudget();

  const {
    filteredTransactions,

    filtroPagamento,
    setFiltroPagamento,

    filtroCartao,
    setFiltroCartao,

    categoriaFiltro,
    setCategoriaFiltro,

    filtroPeriodo,
    setFiltroPeriodo,

    dataSelecionada,
    setDataSelecionada,

    setFilterRange,

    form,
    setForm,
    handleAdd,
    editandoId,
    setEditandoId,
  } = useTransactions(transactions);

  return (
    <div className="flex h-screen overflow-hidden text-white">
      {/* CENTRO */}
      <div className="flex-1 p-6 overflow-y-auto pr-[360px] flex justify-center mb-5">
        <div className="w-full max-w-3xl flex flex-col gap-6">
          <h1 className="text-2xl font-semibold">Lançamentos</h1>

          {/* FILTROS */}
          <TransactionFilters
            categorias={categorias}
            cartoes={cartoes}
            filtroPagamento={filtroPagamento}
            setFiltroPagamento={setFiltroPagamento}
            filtroCartao={filtroCartao}
            setFiltroCartao={setFiltroCartao}
            categoriaFiltro={categoriaFiltro}
            setCategoriaFiltro={setCategoriaFiltro}
            filtroPeriodo={filtroPeriodo}
            setFiltroPeriodo={setFiltroPeriodo}
            dataSelecionada={dataSelecionada}
            setDataSelecionada={setDataSelecionada}
            setFilterRange={setFilterRange}
          />

          {/* LISTA */}
          <TransactionList transactions={filteredTransactions} />
        </div>
      </div>

      {/* SIDEBAR */}
      <RightSidebarTransactions
        form={form}
        setForm={setForm}
        handleAdd={handleAdd}
        editandoId={editandoId}
        setEditandoId={setEditandoId}
        cartoes={cartoes}
      />
    </div>
  );
}
