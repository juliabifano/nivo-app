import { useState, useEffect, useRef } from "react";
import { useTheme } from "../theme/useTheme";

export default function DatePicker({ value, onChange }) {
  const { theme, themeName } = useTheme();
  const [open, setOpen] = useState(false);

  const today = new Date();

  const parseDate = (val) => {
    if (!val) return new Date();
    const [year, month, day] = val.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const [currentMonth, setCurrentMonth] = useState(parseDate(value));
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) setCurrentMonth(parseDate(value));
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

  const days = [];

  for (let i = 0; i < startOfMonth.getDay(); i++) {
    days.push(null);
  }

  for (let i = 1; i <= endOfMonth.getDate(); i++) {
    days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`
          w-full h-12 px-4 rounded-2xl text-left transition cursor-pointer border
          ${
            themeName === "light"
              ? "bg-white/80 border-slate-200/80 text-slate-900 hover:bg-white"
              : "bg-[#111827] border-white/[0.06] text-white hover:bg-white/10"
          }
        `}
      >
        {formatDisplay(value)}
      </button>

      {open && (
        <div
          className={`
            absolute z-50 mt-2 rounded-2xl p-4 w-72 shadow-xl border
            ${
              themeName === "light"
                ? "bg-white/95 border-slate-200 text-slate-900"
                : "bg-[#111827] border-white/10 text-white"
            }
          `}
        >
          <div className="flex justify-between items-center mb-3">
            <button
              className={`w-8 h-8 rounded-xl ${
                themeName === "light" ? "hover:bg-slate-100" : "hover:bg-white/10"
              }`}
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
              className={`w-8 h-8 rounded-xl ${
                themeName === "light" ? "hover:bg-slate-100" : "hover:bg-white/10"
              }`}
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

          <div className={`grid grid-cols-7 text-xs mb-1 ${theme.textMuted}`}>
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
                  className={`
                    text-center p-2 rounded-xl cursor-pointer text-sm transition
                    ${
                      !day
                        ? ""
                        : isSelected
                          ? "bg-emerald-400 text-black"
                          : isToday
                            ? "border border-emerald-400 text-emerald-500"
                            : themeName === "light"
                              ? "hover:bg-slate-100"
                              : "hover:bg-white/10"
                    }
                  `}
                >
                  {day ? day.getDate() : ""}
                </div>
              );
            })}
          </div>

          <button
            onClick={() => {
              onChange(formatDate(today));
              setOpen(false);
            }}
            className={`mt-3 text-xs ${theme.accentText} hover:underline`}
          >
            Hoje
          </button>
        </div>
      )}
    </div>
  );
}