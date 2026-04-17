import { useState, useEffect } from "react";
import { useBudget } from "../contexts/BudgetContext";

const coresCartao = {
  nubank: "#8A05BE",
  inter: "#FF7A00",
  itau: "#EC7000",
  santander: "#E30613",
  bradesco: "#CC092F",
  bb: "#F2C811",
  caixa: "#0047AB",
  sicoob: "#00A859",
  c6: "#000000",
  original: "#1F2937",
  alelo: "#10B981",
  default: "#111827",
};

const getCorCartao = (banco) => {
  if (!banco) return coresCartao.default;
  return coresCartao[banco.toLowerCase()] || coresCartao.default;
};

export default function RightSidebarCards({
  editandoCartao,
  setEditandoCartao,
}) {
  const { cartoes = [], setCartoes } = useBudget();

  const [form, setForm] = useState({
    nome: "",
    banco: "",
    limite: "",
    vencimento: "",
  });

  useEffect(() => {
    if (editandoCartao) {
      setForm(editandoCartao);
    }
  }, [editandoCartao]);

  const handleAdd = () => {
    if (!form.nome || !form.limite) return;

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
                limite: Number(form.limite),
                vencimento: Number(form.vencimento),
              }
            : c,
        ),
      );

      setEditandoCartao(null);
    } else {
      const novo = {
        ...form,
        id: crypto.randomUUID(),
        limite: Number(form.limite),
        numeroCartao: form.numeroCartao?.replace(/\s/g, ""),
        tipo: form.tipo || "credito",
      };

      setCartoes([novo, ...cartoes]);
    }

    setForm({
      nome: "",
      banco: "",
      limite: "",
      vencimento: "",
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
    <div
      className="
    fixed right-4 top-5
    h-[calc(100vh-40px)]
    w-[320px]
    z-40
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
        {editandoCartao ? "Editar cartão" : "Adicionar cartão"}
      </h2>

      {/* NOME */}
      <input
        className="w-full p-2 bg-[#111827] rounded-lg"
        placeholder="Nome do cartão"
        value={form.nome}
        onChange={(e) => setForm({ ...form, nome: e.target.value })}
      />

      {/* NÚMERO DO CARTÃO */}
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

      {/* BANCO */}
      <select
        className="w-full p-2 bg-[#111827] rounded-lg cursor-pointer"
        value={form.banco}
        onChange={(e) =>
          setForm({ ...form, banco: e.target.value.toLowerCase() })
        }
      >
        <option value="">Selecionar banco</option>
        <option value="nubank">Nubank</option>
        <option value="inter">Inter</option>
        <option value="itau">Itaú</option>
        <option value="santander">Santander</option>

        <option value="bradesco">Bradesco</option>
        <option value="bb">Banco do Brasil</option>
        <option value="caixa">Caixa</option>
        <option value="sicoob">Sicoob</option>
        <option value="c6">C6 Bank</option>
        <option value="original">Original</option>
        <option value="alelo">Alelo</option>
        <option value="default">Outro</option>
      </select>

      {/* TIPO DE CARTÃO */}
      <select
        className="w-full p-2 bg-[#111827] rounded-lg cursor-pointer"
        value={form.tipo || "credito"}
        onChange={(e) => setForm({ ...form, tipo: e.target.value })}
      >
        <option value="credito">Crédito</option>
        <option value="debito">Débito</option>
        <option value="multiplo">Múltiplo</option>
      </select>

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

      {/* PREVIEW DO CARTÃO */}
      {form.banco && (
        <div
          className="relative rounded-xl overflow-hidden mt-2 h-[140px]"
          style={{
            background: `linear-gradient(135deg, ${getCorCartao(form.banco)}, rgba(0,0,0,0.6))`,
          }}
        >
          <div className="absolute inset-0 bg-black/20" />

          <div className="relative z-10 p-4 text-white flex flex-col justify-between h-full">
            <div>
              <p className="text-sm opacity-80 capitalize">{form.banco}</p>
              <p className="font-semibold">{form.nome || "Nome do cartão"}</p>
            </div>

            <p className="text-xs">
              Limite:{" "}
              {form.limite
                ? Number(form.limite).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })
                : "R$ 0,00"}
            </p>
          </div>
        </div>
      )}

      {/* BOTÃO */}
      <button
        onClick={handleAdd}
        className="cursor-pointer w-full bg-emerald-400 text-black p-2 rounded-lg"
      >
        Adicionar
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
              vencimento: "",
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
