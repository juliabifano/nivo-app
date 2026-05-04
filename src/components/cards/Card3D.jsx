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

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateY = (x / rect.width - 0.5) * 20;
    const rotateX = (y / rect.height - 0.5) * -20;

    setStyle({
      transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`,
    });
  };

  const handleLeave = () => {
    setStyle({
      transform: "rotateX(0deg) rotateY(0deg) scale(1)",
    });
  };

  const getBarColor = () => {
    if (percent >= 80) return "bg-red-400";
    if (percent >= 50) return "bg-yellow-300";
    return "bg-emerald-300";
  };

  return (
    <div
      className="perspective-[1000px] w-[330px]"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div
        style={style}
        className="relative group w-[330px] h-[200px] rounded-2xl p-6 flex flex-col justify-between transition duration-300 ease-out"
      >
        {/* IMAGEM */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            backgroundImage: `url(/cards/${bank.key}.svg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/30 rounded-2xl" />

        {/* BRILHO MOUSE */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15), transparent 60%)",
            opacity: 0.6,
          }}
        />

        {/* BRILHO ANIMADO */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute -left-1/2 top-0 w-[50%] h-full bg-white/10 skew-x-[-20deg] opacity-0 group-hover:opacity-100 group-hover:animate-shine" />
        </div>

        {/* SOMBRA */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            boxShadow: `
            0 30px 80px rgba(0,0,0,0.7),
            0 10px 30px rgba(0,0,0,0.5)
          `,
          }}
        />

        {/* CONTEÚDO */}
        <div className="relative z-10 flex justify-between">
          <div>
            <p className="text-white/70 text-xs">{bank.nome}</p>
            <p className="text-white font-semibold mt-1">{featuredCard.nome}</p>

            <p className="text-white/50 text-xs mt-1 capitalize">
              {featuredCard.tipo === "multiplo"
                ? "Crédito + Débito"
                : featuredCard.tipo}
            </p>
          </div>

          <img
            src={bank.logo}
            alt={bank.nome}
            className="w-9 h-9 object-contain"
          />
        </div>

        <div className="relative z-10">
          <p className="text-white/60 text-xs">Usado</p>

          <p className="text-white text-[20px] font-bold">
            {formatCurrency(total)}
          </p>

          {showProgress && (
            <>
              <div className="w-full h-1 bg-white/20 rounded-full mt-3 overflow-hidden">
                <div
                  className={`h-1 rounded-full ${getBarColor()}`}
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
