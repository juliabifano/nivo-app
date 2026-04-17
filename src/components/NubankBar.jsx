import { useEffect, useState } from "react";

export default function NubankBar({ receitas, despesas }) {
  const total = receitas + despesas;

  const receitasPct = total > 0 ? (receitas / total) * 100 : 0;
  const despesasPct = total > 0 ? (despesas / total) * 100 : 0;

  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(false);
    const timeout = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timeout);
  }, [receitas, despesas]);

  return (
    <div className="mt-4">
      {/* background */}
      <div className="h-3 bg-white/5 rounded-full overflow-hidden flex ">
        
        {/* RECEITAS */}
        <div
          className="h-full bg-emerald-400 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(62,242,194,0.4)]"
          style={{
            width: animated ? `${receitasPct}%` : "0%",
          }}
        />

        {/* DESPESAS */}
        <div
          className="h-full bg-red-400 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(62,242,194,0.4)]"
          style={{
            width: animated ? `${despesasPct}%` : "0%",
          }}
        />
      </div>

      {/* labels */}
      <div className="flex justify-between mt-2 text-xs text-gray-400">
        <span>Receitas</span>
        <span>Despesas</span>
      </div>
    </div>
  );
}