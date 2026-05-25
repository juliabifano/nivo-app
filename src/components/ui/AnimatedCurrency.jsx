import { useEffect, useState } from "react";

export default function AnimatedCurrency({
  value = 0,
  className = "",
  duration = 900,
}) {
  const [displayValue, setDisplayValue] = useState(Number(value || 0));

  useEffect(() => {
    const startValue = displayValue;
    const endValue = Number(value || 0);
    const startTime = performance.now();

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (endValue - startValue) * eased;

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span className={className}>
      {displayValue.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}
    </span>
  );
}