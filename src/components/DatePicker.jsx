import { useState, useEffect, useRef } from "react";

export default function DatePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);

  const today = new Date();

  const parseDate = (val) => {
    if (!val) return new Date();
    const [year, month, day] = val.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const [currentMonth, setCurrentMonth] = useState(parseDate(value));

  const ref = useRef();

  // 🔥 fecha ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔥 sincroniza quando muda valor (edição)
  useEffect(() => {
    if (value) {
      setCurrentMonth(parseDate(value));
    }
  }, [value]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formatDisplay = (date) => {
    if (!date) return "Selecionar data";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  const startOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1,
  );

  const endOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
  );

  const daysInMonth = endOfMonth.getDate();
  const startDay = startOfMonth.getDay();

  const days = [];

  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
  }

  return (
    <div className="relative" ref={ref}>
      {/* INPUT */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-[#111827] p-2 rounded-lg w-full text-left hover:bg-white/10 transition mt-2 cursor-pointer"
      >
        {formatDisplay(value)}
      </button>

      {/* CALENDÁRIO */}
      {open && (
        <div className="absolute z-50 mt-2 bg-[#111827] border border-white/10 rounded-xl p-4 w-72 shadow-xl">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-3">
            <button
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() - 1,
                  ),
                )
              }
            >
              ‹
            </button>

            <span className="text-sm font-medium capitalize">
              {currentMonth.toLocaleString("pt-BR", {
                month: "long",
                year: "numeric",
              })}
            </span>

            <button
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() + 1,
                  ),
                )
              }
            >
              ›
            </button>
          </div>

          {/* DIAS */}
          <div className="grid grid-cols-7 text-xs text-gray-400 mb-1">
            {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
              <div key={i} className="text-center">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => {
              const isSelected = day && value && formatDate(day) === value;
              const isToday = day && formatDate(day) === formatDate(today);

              return (
                <div
                  key={i}
                  onClick={() => {
                    if (!day) return;
                    onChange(formatDate(day));
                    setOpen(false);
                  }}
                  className={`text-center p-2 rounded cursor-pointer text-sm transition
                    ${
                      !day
                        ? ""
                        : isSelected
                          ? "bg-emerald-400 text-black"
                          : isToday
                            ? "border border-emerald-400 text-emerald-400"
                            : "hover:bg-white/10"
                    }
                  `}
                >
                  {day ? day.getDate() : ""}
                </div>
              );
            })}
          </div>

          {/* HOJE */}
          <button
            onClick={() => {
              onChange(formatDate(today));
              setOpen(false);
            }}
            className="mt-3 text-xs text-emerald-400 hover:underline"
          >
            Hoje
          </button>
        </div>
      )}
    </div>
  );
}
