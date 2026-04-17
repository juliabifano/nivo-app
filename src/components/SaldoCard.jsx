import { useEffect, useState } from "react";

export default function SaldoCard({ receitas, despesas }) {
  const saldoFinal = receitas - despesas;

  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 800;
    const steps = 30;
    const increment = (saldoFinal - start) / steps;

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      start += increment;
      setDisplayValue(start);

      if (currentStep >= steps) {
        clearInterval(interval);
        setDisplayValue(saldoFinal);
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [saldoFinal]);

  const formatCurrency = (value) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const isPositive = saldoFinal >= 0;

  return (
    <div className="pt-2">
      <h2
        className={`text-4xl font-semibold tracking-tight transition-colors duration-300
        ${isPositive ? "text-emerald-400" : "text-red-400"}`}
      >
        {formatCurrency(displayValue)}
      </h2>
    </div>
  );
}