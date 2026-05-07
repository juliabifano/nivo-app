import { useState } from "react";

export default function Card3D({
  bank,
  featuredCard,
  total,
  limit,
  percent,
  formatCurrency,
  showProgress,
}) {
  const [style, setStyle] = useState({});
  const [glow, setGlow] = useState({
    x: 50,
    y: 50,
  });

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const px = x / rect.width;
    const py = y / rect.height;

    const rotateY = (px - 0.5) * 18;
    const rotateX = (py - 0.5) * -18;

    setGlow({
      x: px * 100,
      y: py * 100,
    });

    setStyle({
      transform: `
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1.015)
    `,
      boxShadow: `
      ${-rotateY * 2}px ${rotateX * 2 + 30}px 80px rgba(0,0,0,0.7),
      0 10px 30px rgba(0,0,0,0.5)
    `,
    });
  };

  const handleLeave = () => {
    setStyle({
      transform: "rotateX(0deg) rotateY(0deg) scale(1)",
      boxShadow: `
    0 30px 80px rgba(0,0,0,0.6),
    0 10px 30px rgba(0,0,0,0.4)
  `,
    });

    setGlow({ x: 50, y: 50 });
  };

  const getBarColor = () => {
    if (percent >= 80) return "bg-red-400";
    if (percent >= 50) return "bg-yellow-300";
    return "bg-emerald-300";
  };

  const formatCardNumber = (num) => {
    if (!num) return "•••• •••• •••• 0000";

    const digits = String(num).replace(/\D/g, "");
    return `•••• •••• •••• ${digits.slice(-4) || "0000"}`;
  };

  const getTipoLabel = () => {
    if (featuredCard.tipo === "credito") return "Crédito";
    if (featuredCard.tipo === "debito") return "Débito";
    if (featuredCard.tipo === "multiplo") return "Crédito + Débito";
    if (featuredCard.tipo === "vale") return "Vale";
    return featuredCard.tipo || "Cartão";
  };

  return (
    <div
      className="perspective-[1000px] w-[330px]"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div
        style={style}
        className="relative group w-[350px] h-[220px] rounded-2xl p-6 flex flex-col justify-between transition duration-300 ease-out"
      >
        {/* IMAGEM */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            backgroundImage: `url(/cards/${bank.key}.svg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            imageRendering: "auto",
          }}
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/25 rounded-2xl" />
        <div className="absolute inset-0 rounded-2xl border border-white/15 pointer-events-none" />

        {/* BRILHO MOUSE */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `
      radial-gradient(
        circle at ${glow.x}% ${glow.y}%,
        rgba(255,255,255,0.16),
        transparent 42%
      )
    `,
            opacity: 0.45,
          }}
        />

        {/* CONTEÚDO */}
        <div className="relative z-20 flex justify-between">
          <div>
            <p className="text-white/70 text-xs">{bank.nome}</p>
            <p className="text-white/40 text-xs mt-3 font-mono tracking-[0.25em]">
              {formatCardNumber(featuredCard.numeroCartao)}
            </p>

             <div className="flex gap-0.5 opacity-80 mt-3">
              {[1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="block w-1 h-4 border-r border-white/70 rounded-full animate-pulse"
                  style={{
                    animationDelay: `${i * 120}ms`,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
           

            <img
              src={bank.logo}
              alt={bank.nome}
              className="w-9 h-9 object-contain"
            />
          </div>
        </div>

        <div className="relative z-20">
          <p className="text-white/60 text-xs">Usado</p>

          <p className="text-white text-[22px] font-bold tracking-tight">
            {formatCurrency(total)}
          </p>

          {showProgress && (
            <>
              <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden backdrop-blur-sm">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              <div className="flex justify-between text-xs text-white/60 mt-1">
                <span>{Math.round(percent)}%</span>
                <span>{formatCurrency(limit)}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
