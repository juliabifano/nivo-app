import { useState, useEffect } from "react";
import { useBudget } from "../contexts/BudgetContext";
import { BANKS, getBank } from "../data/banks";

export default function RightSidebarCards({
  editandoCartao,
  setEditandoCartao,
}) {
  const { cartoes = [], setCartoes } = useBudget();

  const [form, setForm] = useState({
    nome: "",
    banco: "",
    limite: "",
    saldoInicial: "",
    vencimento: "",
    fechamento: "",
    tipo: "credito",
    diaReset: "",
  });

  useEffect(() => {
    if (editandoCartao) {
      setForm((prev) => ({
        ...prev,
        ...editandoCartao,
      }));
    }
  }, [editandoCartao]);

  const handleAdd = () => {
    if (!form.nome) return;

    if (form.tipo === "vale" && !form.saldoInicial) return;
    if (form.tipo !== "vale" && !form.limite) return;

    const numeroLimpo = form.numeroCartao?.replace(/\s/g, "");

    if (numeroLimpo && !validarCartao(numeroLimpo)) {
      alert("Número de cartão inválido");
      return;
    }

    if (editandoCartao) {
      setCartoes(
        cartoes.map((c) =>
          c.id === editandoCartao.id
            ? {
                ...form,
                limite: form.tipo === "vale" ? undefined : Number(form.limite),
                saldoInicial:
                  form.tipo === "vale" ? Number(form.saldoInicial) : undefined,
                vencimento: Number(form.vencimento),
                fechamento: Number(form.fechamento), // 👈 AQUI
                diaReset: Number(form.diaReset),
              }
            : c,
        ),
      );

      setEditandoCartao(null);
    } else {
      const novo = {
        ...form,
        id: crypto.randomUUID(),
        limite: Number(form.limite || 0),
        saldoInicial: Number(form.saldoInicial || 0),
        fechamento: Number(form.fechamento), // 👈 AQUI
        diaReset: Number(form.diaReset),
        numeroCartao: form.numeroCartao?.replace(/\s/g, ""),
        tipo: form.tipo || "credito",
      };

      setCartoes([novo, ...cartoes]);
    }

    setForm({
      nome: "",
      banco: "",
      limite: "",
      saldoInicial: "",
      vencimento: "",
      fechamento: "",
      tipo: "credito",
      diaReset: "",
    });
  };

  const validarCartao = (num) => {
    if (!num) return false;

    const digits = String(num).replace(/\D/g, "");

    if (digits.length < 13 || digits.length > 19) return false;

    let sum = 0;
    let shouldDouble = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  };

  const gerarCartaoFake = () => {
    let num = "";

    for (let i = 0; i < 16; i++) {
      num += Math.floor(Math.random() * 10);
    }

    return num.replace(/(.{4})/g, "$1 ").trim();
  };

  return (
    <div className="fixed right-4 top-5 h-[calc(100vh-40px)] w-[320px] z-40 bg-[#0B0F1A]/70 p-5 space-y-3 rounded-2xl shadow-xl border border-gray-800 backdrop-blur-md">
      <h2 className="text-lg font-semibold mb-4">
        {editandoCartao ? "Editar cartão" : "Adicionar cartão"}
      </h2>

      {/* NOME */}
      <input
        className="w-full p-2 bg-[#111827] rounded-lg"
        placeholder="Nome do cartão"
        value={form.nome}
        onChange={(e) => setForm({ ...form, nome: e.target.value })}
      />

      {/* NÚMERO */}
      <input
        className="w-full p-2 bg-[#111827] rounded-lg"
        placeholder="Número do cartão (opcional)"
        value={form.numeroCartao || ""}
        maxLength={19}
        onChange={(e) => {
          let value = e.target.value.replace(/\D/g, "");
          value = value.replace(/(.{4})/g, "$1 ").trim();
          setForm({ ...form, numeroCartao: value });
        }}
      />

      {/* BANCO (DINÂMICO 🔥) */}
      <select
        className="w-full p-2 bg-[#111827] rounded-lg cursor-pointer"
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

      {/* TIPO */}
      <select
        className="w-full p-2 bg-[#111827] rounded-lg cursor-pointer"
        value={form.tipo}
        onChange={(e) => {
          const tipo = e.target.value;

          setForm({
            ...form,
            tipo,
            limite: tipo === "vale" ? "" : form.limite,
            saldoInicial: tipo === "vale" ? form.saldoInicial : "",
            diaReset: tipo === "vale" ? form.diaReset : "",
            vencimento: tipo === "vale" ? "" : form.vencimento,
          });
        }}
      >
        <option value="credito">Crédito</option>
        <option value="debito">Débito</option>
        <option value="multiplo">Múltiplo</option>
        <option value="vale">Vale</option>
      </select>

      {/* CAMPOS DINÂMICOS */}
      {form.tipo === "vale" && (
        <>
          {/* SALDO */}
          <input
            className="w-full p-2 bg-[#111827] rounded-lg"
            type="number"
            placeholder="Saldo inicial"
            value={form.saldoInicial || ""}
            onChange={(e) => setForm({ ...form, saldoInicial: e.target.value })}
          />

          {/* RESET */}
          <input
            className="w-full p-2 bg-[#111827] rounded-lg"
            type="number"
            placeholder="Dia do reset"
            value={form.diaReset || ""}
            onChange={(e) => setForm({ ...form, diaReset: e.target.value })}
          />
        </>
      )}

      {["credito", "multiplo"].includes(form.tipo) && (
        <>
          {/* LIMITE */}
          <input
            className="w-full p-2 bg-[#111827] rounded-lg"
            type="number"
            placeholder="Limite"
            value={form.limite}
            onChange={(e) => setForm({ ...form, limite: e.target.value })}
          />

          {/* VENCIMENTO */}
          <input
            className="w-full p-2 bg-[#111827] rounded-lg"
            type="number"
            placeholder="Dia do vencimento"
            value={form.vencimento}
            onChange={(e) => setForm({ ...form, vencimento: e.target.value })}
          />

          {/* FECHAMENTO 🔥 */}
          <input
            className="w-full p-2 bg-[#111827] rounded-lg"
            type="number"
            placeholder="Dia do fechamento"
            value={form.fechamento || ""}
            onChange={(e) => setForm({ ...form, fechamento: e.target.value })}
          />
        </>
      )}

      
      {/* PREVIEW 🔥 */}
      {form.banco && (
        <div
          className="relative rounded-xl overflow-hidden mt-2 h-[140px]"
          style={{
            background: `linear-gradient(135deg, ${
              getBank(form.banco).cor
            }, rgba(0,0,0,0.6))`,
          }}
        >
          {/* overlay */}
          <div className="absolute inset-0 bg-black/20" />

          {/* LOGO 🔥 */}
          <img
            src={getBank(form.banco).logo}
            alt={getBank(form.banco).nome}
            className="absolute top-3 right-3 w-10 h-10 object-contain opacity-90"
          />

          {/* conteúdo */}
          <div className="relative z-10 p-4 text-white flex flex-col justify-between h-full">
            <div>
              <p className="text-sm opacity-80">{getBank(form.banco).nome}</p>
              <p className="font-semibold">{form.nome || "Nome do cartão"}</p>
            </div>

            <p className="text-xs">
              {form.tipo === "vale" ? "Saldo" : "Limite"}:{" "}
              {form.tipo === "vale"
                ? Number(form.saldoInicial || 0).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })
                : Number(form.limite || 0).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
            </p>
          </div>
        </div>
      )}

      {/* BOTÃO */}
      <button
        onClick={handleAdd}
        className="cursor-pointer w-full bg-emerald-400 text-black p-2 rounded-lg"
      >
        {editandoCartao ? "Salvar alterações" : "Adicionar"}
      </button>

      <button
        type="button"
        onClick={() => setForm({ ...form, numeroCartao: gerarCartaoFake() })}
        className="text-xs text-blue-400 mt-1 cursor-pointer"
      >
        Gerar cartão fake
      </button>

      {editandoCartao && (
        <button
          onClick={() => {
            setEditandoCartao(null);
            setForm({
              nome: "",
              banco: "",
              limite: "",
              saldoInicial: "",
              vencimento: "",
              tipo: "credito",
              diaReset: "",
            });
          }}
          className="cursor-pointer w-full bg-gray-700 text-white p-2 rounded-lg"
        >
          Cancelar edição
        </button>
      )}
    </div>
  );
}
